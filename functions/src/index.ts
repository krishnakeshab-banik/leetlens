import { defineSecret } from 'firebase-functions/params';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import * as logger from 'firebase-functions/logger';

initializeApp();

const resendApiKey = defineSecret('RESEND_API_KEY');
const emailFrom = defineSecret('EMAIL_FROM');

interface UserDoc {
  uid: string;
  email?: string;
  displayName?: string;
  emailRemindersEnabled?: boolean;
  reminderTime?: string;
  timezone?: string;
  leetcodeUsername?: string;
  createdAt?: FirebaseFirestore.Timestamp;
  welcomeEmailSent?: boolean;
  lastReminderSentDate?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatFromAddress(from: string): string {
  return from.includes('LeetLens') ? from : `LeetLens <${from}>`;
}

function getCurrentTimeInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}

function getTodayKey(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return date.toISOString().slice(0, 10);
}

function getYesterdayKey(timezone: string): string {
  return shiftDateKey(getTodayKey(timezone), -1);
}

function formatDateLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function emailShell(bodyHtml: string, footerHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0b0c;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#ffa116;color:#000;font-weight:800;font-size:14px;padding:8px 20px;border-radius:8px;letter-spacing:0.05em;">⏱ LEETLENS</div>
      <p style="color:#8b949e;font-size:12px;margin-top:8px;">Your LeetCode Productivity Companion</p>
    </div>
    ${bodyHtml}
    <p style="text-align:center;color:#555;font-size:11px;margin-top:20px;">${footerHtml}</p>
  </div>
</body>
</html>`;
}

function buildWelcomeEmailHtml(user: UserDoc): string {
  const name = escapeHtml(user.displayName || 'Coder');
  const body = `
    <div style="background:#141416;border:1px solid rgba(255,161,22,0.2);border-radius:16px;padding:28px;color:#e5e1e4;">
      <h1 style="color:#ffa116;font-size:24px;margin:0 0 12px;">Welcome to LeetLens, ${name}! 🎉</h1>
      <p style="color:#8b949e;font-size:15px;line-height:1.7;margin:0 0 24px;">
        We're glad you're here. LeetLens helps you track practice time, stay consistent with your streak,
        and sync progress from your LeetCode account — all in one place.
      </p>

      <div style="background:rgba(255,161,22,0.08);border-radius:12px;padding:20px;margin-bottom:20px;">
        <h2 style="color:#ffa116;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 14px;">🚀 Get started in 3 steps</h2>
        <ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#c9c4c8;">
          <li><strong style="color:#e5e1e4;">Link your LeetCode account</strong> — sync your solved count, streak, and heatmap.</li>
          <li><strong style="color:#e5e1e4;">Open a problem on LeetCode</strong> — LeetLens tracks your session time automatically.</li>
          <li><strong style="color:#e5e1e4;">Set a weekly goal</strong> — pick a target and stay accountable throughout the week.</li>
        </ol>
      </div>

      <div style="background:rgba(32,31,34,0.8);border-radius:12px;padding:20px;margin-bottom:24px;">
        <h2 style="color:#e5e1e4;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">☀️ Daily streak reminders</h2>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#c9c4c8;">
          We've enabled morning reminders for you at <strong style="color:#ffa116;">10:00 AM (Asia/Kolkata)</strong>.
          Each day you'll get a short nudge with your streak, yesterday's progress, and weekly goals —
          but only if you haven't practiced yet that day.
        </p>
        <p style="margin:12px 0 0;font-size:13px;color:#8b949e;">
          You can change the time or turn reminders off anytime in your Profile settings.
        </p>
      </div>

      <p style="font-size:15px;color:#e5e1e4;margin:0 0 8px;">Ready to build your streak? Open LeetLens and solve your first problem today.</p>
      <p style="font-size:12px;color:#8b949e;margin:0;">— Team LeetLens</p>
    </div>`;

  return emailShell(
    body,
    `You're receiving this because you just created a LeetLens account.<br/>Questions? Reply to this email — we'd love to hear from you.`
  );
}

function buildDailyReminderEmailHtml(
  user: UserDoc,
  stats: Record<string, unknown>,
  plan: Record<string, unknown> | null,
  yesterday: { solved: number; minutes: number; problems: string[] },
  reminderTime: string,
  timezone: string
) {
  const name = escapeHtml(user.displayName || 'Coder');
  const streak = (stats.streak as number) || 0;
  const totalSolved = (stats.totalSolved as number) || 0;
  const easy = (stats.easySolved as number) || 0;
  const medium = (stats.mediumSolved as number) || 0;
  const hard = (stats.hardSolved as number) || 0;
  const goals = (plan?.goals as Array<Record<string, unknown>>) || [];
  const legacyTarget = (plan?.targetProblems as number) || 0;
  const legacyDone = ((plan?.completedProblems as string[]) || []).length;

  const goalsHtml = goals.length
    ? goals.map(g => {
        const done = ((g.completedSlugs as string[]) || []).length;
        const target = (g.targetCount as number) || ((g.targetSlugs as string[]) || []).length || 0;
        return `<li style="margin:6px 0;"><strong>${escapeHtml(String(g.title || 'Weekly Goal'))}</strong> — ${done}/${target} completed</li>`;
      }).join('')
    : legacyTarget
      ? `<li style="margin:6px 0;"><strong>Weekly Goal</strong> — ${legacyDone}/${legacyTarget} completed</li>`
      : '<li style="margin:6px 0;color:#888;">No weekly goals set yet — add one in your dashboard to stay on track</li>';

  const yesterdayProblems = yesterday.problems.length
    ? yesterday.problems.map(p => `<li style="margin:4px 0;">✓ ${escapeHtml(p)}</li>`).join('')
    : '<li style="margin:4px 0;color:#888;">No problems solved yesterday</li>';

  const lcUsername = user.leetcodeUsername ? escapeHtml(user.leetcodeUsername) : '';

  const streakMessage = streak > 0
    ? `You're on a <strong style="color:#ffa116;">${streak}-day streak</strong>. Solve at least one problem today to keep it going.`
    : `Start fresh today — solving just one problem begins your streak.`;

  const body = `
    <div style="background:#141416;border:1px solid rgba(255,161,22,0.2);border-radius:16px;padding:28px;color:#e5e1e4;">
      <h1 style="color:#ffa116;font-size:22px;margin:0 0 8px;">Good morning, ${name}! ☀️</h1>
      <p style="color:#8b949e;font-size:14px;line-height:1.6;margin:0 0 24px;">${streakMessage}</p>

      <div style="background:rgba(255,161,22,0.08);border-radius:12px;padding:18px;margin-bottom:20px;">
        <h2 style="color:#ffa116;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">📊 Yesterday's Report</h2>
        <p style="margin:4px 0;font-size:14px;">Problems solved: <strong style="color:#00a572;">${yesterday.solved}</strong></p>
        <p style="margin:4px 0;font-size:14px;">Time practiced: <strong>${yesterday.minutes} min</strong></p>
        <ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:#c9c4c8;">${yesterdayProblems}</ul>
      </div>

      <div style="background:rgba(32,31,34,0.8);border-radius:12px;padding:18px;margin-bottom:20px;">
        <h2 style="color:#e5e1e4;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">🔥 Your Stats</h2>
        <p style="margin:4px 0;font-size:14px;">Current streak: <strong style="color:#ffa116;">${streak} day${streak === 1 ? '' : 's'}</strong></p>
        <p style="margin:4px 0;font-size:14px;">Total solved on LeetCode: <strong>${totalSolved}</strong> (Easy ${easy} · Medium ${medium} · Hard ${hard})</p>
        ${lcUsername ? `<p style="margin:4px 0;font-size:13px;color:#8b949e;">LeetCode: @${lcUsername}</p>` : '<p style="margin:4px 0;font-size:13px;color:#8b949e;">Tip: Link your LeetCode account in Profile to see live stats here.</p>'}
      </div>

      <div style="background:rgba(32,31,34,0.8);border-radius:12px;padding:18px;margin-bottom:24px;">
        <h2 style="color:#e5e1e4;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">🎯 Weekly Goals</h2>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#c9c4c8;">${goalsHtml}</ul>
      </div>

      <p style="font-size:14px;color:#e5e1e4;margin:0 0 8px;">Open LeetCode, pick a problem, and put in 20 minutes. Even one solve counts toward your streak.</p>
      <p style="font-size:12px;color:#8b949e;margin:0;">— Team LeetLens</p>
    </div>`;

  return emailShell(
    body,
    `You're receiving this because email reminders are enabled in LeetLens.<br/>Sent daily at ${reminderTime} (${timezone}) · Disable in Profile settings`
  );
}

async function sendViaResend(
  resend: Resend,
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: formatFromAddress(from),
    to,
    subject,
    html
  });

  if (error) {
    throw new Error(error.message || 'Resend API error');
  }

  logger.info('Email sent', { to, subject, id: data?.id });
}

async function deliverWelcomeEmail(
  db: FirebaseFirestore.Firestore,
  resend: Resend,
  from: string,
  uid: string
): Promise<'sent' | 'skipped'> {
  const ref = db.collection('users').doc(uid);

  const user = await db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const data = snap.data() as UserDoc | undefined;
    if (!data?.email || data.welcomeEmailSent) return null;
    t.update(ref, {
      welcomeEmailSent: true,
      welcomeEmailSentAt: FieldValue.serverTimestamp()
    });
    return data;
  });

  if (!user) return 'skipped';

  const name = user.displayName?.split(' ')[0] || 'Coder';

  try {
    await sendViaResend(
      resend,
      from,
      user.email!,
      `🎉 Welcome to LeetLens, ${name}! Let's build your streak`,
      buildWelcomeEmailHtml(user)
    );
    logger.info('[welcome] Delivered', { uid, email: user.email });
    return 'sent';
  } catch (err) {
    await ref.update({
      welcomeEmailSent: false,
      welcomeEmailSentAt: FieldValue.delete()
    });
    logger.error('[welcome] Failed', { uid, email: user.email, error: err });
    throw err;
  }
}

async function getYesterdayReport(
  db: FirebaseFirestore.Firestore,
  uid: string,
  timezone: string
): Promise<{ solved: number; minutes: number; problems: string[] }> {
  const yesterdayKey = getYesterdayKey(timezone);
  const todayKey = getTodayKey(timezone);
  const dayStart = new Date(yesterdayKey + 'T00:00:00');
  const dayEnd = new Date(todayKey + 'T00:00:00');

  const snapRef = db.collection('users').doc(uid).collection('dailySnapshots').doc(yesterdayKey);
  const snap = await snapRef.get();
  const snapData = snap.data() || {};

  const activitySnap = await db.collection('users').doc(uid).collection('activity')
    .where('endedAt', '>=', Timestamp.fromDate(dayStart))
    .where('endedAt', '<', Timestamp.fromDate(dayEnd))
    .limit(20)
    .get();

  const problems: string[] = [];
  let minutes = 0;

  activitySnap.docs.forEach(doc => {
    const d = doc.data();
    if (d.problemId) problems.push(String(d.problemId));
    minutes += Number(d.timeSpentMinutes) || 0;
  });

  const solvedSnap = await db.collection('users').doc(uid).collection('solvedProblems')
    .where('solvedAt', '>=', dayStart.getTime())
    .where('solvedAt', '<', dayEnd.getTime())
    .limit(20)
    .get();

  solvedSnap.docs.forEach(doc => {
    const d = doc.data();
    const title = d.title || d.problemId;
    if (title && !problems.includes(String(title))) problems.push(String(title));
  });

  return {
    solved: (snapData.solvedToday as number) || problems.length || 0,
    minutes,
    problems: problems.slice(0, 8)
  };
}

export const sendWelcomeEmail = onDocumentCreated(
  {
    document: 'users/{uid}',
    secrets: [resendApiKey, emailFrom]
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const uid = event.params.uid;
    const user = snap.data() as UserDoc;

    if (!user.createdAt) {
      logger.info('[welcome] Skipped — no createdAt (not a new signup)', { uid });
      return;
    }

    const db = getFirestore();
    const resend = new Resend(resendApiKey.value());
    const from = emailFrom.value();

    await deliverWelcomeEmail(db, resend, from, uid);
  }
);

/** One-time catch-up for users who signed up before welcome emails existed. */
export const backfillWelcomeEmails = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: 'Asia/Kolkata',
    secrets: [resendApiKey, emailFrom]
  },
  async () => {
    const db = getFirestore();
    const resend = new Resend(resendApiKey.value());
    const from = emailFrom.value();

    const usersSnap = await db.collection('users')
      .where('welcomeEmailSent', '!=', true)
      .limit(50)
      .get();

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const doc of usersSnap.docs) {
      const user = doc.data() as UserDoc;
      const uid = user.uid || doc.id;

      if (!user.email) {
        skipped++;
        continue;
      }

      try {
        const result = await deliverWelcomeEmail(db, resend, from, uid);
        if (result === 'sent') sent++;
        else skipped++;
      } catch {
        failed++;
      }
    }

    logger.info('[welcome-backfill] Run complete', {
      sent,
      skipped,
      failed,
      queued: usersSnap.size
    });
  }
);

export const sendDailyReminders = onSchedule(
  {
    schedule: 'every 15 minutes',
    timeZone: 'Asia/Kolkata',
    secrets: [resendApiKey, emailFrom]
  },
  async () => {
    const db = getFirestore();
    const resend = new Resend(resendApiKey.value());
    const from = emailFrom.value();

    const usersSnap = await db.collection('users')
      .where('emailRemindersEnabled', '==', true)
      .get();

    let sent = 0;
    let skipped = 0;

    for (const doc of usersSnap.docs) {
      const user = doc.data() as UserDoc;
      const uid = user.uid || doc.id;

      if (!user.email) {
        skipped++;
        continue;
      }

      const timezone = user.timezone || 'Asia/Kolkata';
      const reminderTime = user.reminderTime || '10:00';
      const currentTime = getCurrentTimeInTimezone(timezone);

      if (currentTime !== reminderTime) {
        skipped++;
        continue;
      }

      const todayKey = getTodayKey(timezone);

      if (user.lastReminderSentDate === todayKey) {
        skipped++;
        continue;
      }

      try {
        const snapshotRef = db.collection('users').doc(uid).collection('dailySnapshots').doc(todayKey);
        const snapshot = await snapshotRef.get();

        if (snapshot.exists) {
          const data = snapshot.data() || {};
          if ((data.solvedToday as number) > 0) {
            skipped++;
            continue;
          }
        }

        const dayStart = new Date(todayKey + 'T00:00:00');
        const activitySnap = await db.collection('users').doc(uid).collection('activity')
          .where('endedAt', '>=', Timestamp.fromDate(dayStart))
          .limit(1)
          .get();

        if (!activitySnap.empty) {
          skipped++;
          continue;
        }

        const statsSnap = await db.collection('users').doc(uid).collection('stats').doc('current').get();
        const stats = (statsSnap.data() || {}) as Record<string, unknown>;

        const weekId = getWeekId(new Date(), timezone);
        const planSnap = await db.collection('users').doc(uid).collection('weeklyPlans').doc(weekId).get();
        const plan = planSnap.exists ? (planSnap.data() as Record<string, unknown>) : null;

        const yesterday = await getYesterdayReport(db, uid, timezone);

        await sendViaResend(
          resend,
          from,
          user.email,
          `☀️ LeetLens Daily — ${formatDateLabel(todayKey)} | Keep your streak!`,
          buildDailyReminderEmailHtml(user, stats, plan, yesterday, reminderTime, timezone)
        );

        await doc.ref.update({ lastReminderSentDate: todayKey });
        sent++;
      } catch (err) {
        logger.error('[reminder] Failed for user', { uid, email: user.email, error: err });
      }
    }

    logger.info('[reminder] Run complete', { sent, skipped, total: usersSnap.size });
  }
);

function getWeekId(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = formatter.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value || '2026';
  const m = parts.find(p => p.type === 'month')?.value || '01';
  const d = parts.find(p => p.type === 'day')?.value || '01';
  const local = new Date(`${y}-${m}-${d}T12:00:00`);
  const day = local.getDay();
  const diff = local.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(local.setDate(diff));
  return monday.toISOString().slice(0, 10);
}
