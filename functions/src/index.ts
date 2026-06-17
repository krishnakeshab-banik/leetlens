import { defineSecret } from 'firebase-functions/params';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Resend } from 'resend';

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

function getYesterdayKey(timezone: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(yesterday);
}

function formatDateLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function buildEmailHtml(
  user: UserDoc,
  stats: Record<string, unknown>,
  plan: Record<string, unknown> | null,
  yesterday: { solved: number; minutes: number; problems: string[] }
) {
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
        return `<li style="margin:6px 0;"><strong>${g.title || 'Weekly Goal'}</strong> — ${done}/${target} completed</li>`;
      }).join('')
    : legacyTarget
      ? `<li style="margin:6px 0;"><strong>Weekly Goal</strong> — ${legacyDone}/${legacyTarget} completed</li>`
      : '<li style="margin:6px 0;color:#888;">No weekly goals set yet</li>';

  const yesterdayProblems = yesterday.problems.length
    ? yesterday.problems.map(p => `<li style="margin:4px 0;">✓ ${p}</li>`).join('')
    : '<li style="margin:4px 0;color:#888;">No problems solved yesterday</li>';

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0b0c;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#ffa116;color:#000;font-weight:800;font-size:14px;padding:8px 20px;border-radius:8px;letter-spacing:0.05em;">⏱ LEETLENS</div>
      <p style="color:#8b949e;font-size:12px;margin-top:8px;">Your LeetCode Productivity Companion</p>
    </div>

    <div style="background:#141416;border:1px solid rgba(255,161,22,0.2);border-radius:16px;padding:28px;color:#e5e1e4;">
      <h1 style="color:#ffa116;font-size:22px;margin:0 0 8px;">Good morning, ${user.displayName || 'Coder'}! ☀️</h1>
      <p style="color:#8b949e;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Time to keep your streak alive! Solve at least one LeetCode problem today to maintain your momentum.
      </p>

      <div style="background:rgba(255,161,22,0.08);border-radius:12px;padding:18px;margin-bottom:20px;">
        <h2 style="color:#ffa116;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">📊 Yesterday's Report</h2>
        <p style="margin:4px 0;font-size:14px;">Problems solved: <strong style="color:#00a572;">${yesterday.solved}</strong></p>
        <p style="margin:4px 0;font-size:14px;">Time practiced: <strong>${yesterday.minutes} min</strong></p>
        <ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:#c9c4c8;">${yesterdayProblems}</ul>
      </div>

      <div style="background:rgba(32,31,34,0.8);border-radius:12px;padding:18px;margin-bottom:20px;">
        <h2 style="color:#e5e1e4;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">🔥 Your Stats</h2>
        <p style="margin:4px 0;font-size:14px;">Streak: <strong style="color:#ffa116;">${streak} days</strong></p>
        <p style="margin:4px 0;font-size:14px;">Total Solved: <strong>${totalSolved}</strong> (Easy ${easy} · Medium ${medium} · Hard ${hard})</p>
        ${user.leetcodeUsername ? `<p style="margin:4px 0;font-size:13px;color:#8b949e;">LeetCode: @${user.leetcodeUsername}</p>` : ''}
      </div>

      <div style="background:rgba(32,31,34,0.8);border-radius:12px;padding:18px;margin-bottom:24px;">
        <h2 style="color:#e5e1e4;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">🎯 Weekly Goals</h2>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#c9c4c8;">${goalsHtml}</ul>
      </div>

      <p style="font-size:14px;color:#e5e1e4;margin:0 0 8px;">Open LeetLens and tackle today's challenge. Even one problem counts!</p>
      <p style="font-size:12px;color:#8b949e;margin:0;">— Team LeetLens</p>
    </div>

    <p style="text-align:center;color:#555;font-size:11px;margin-top:20px;">
      You're receiving this because email reminders are enabled in LeetLens.<br/>
      Sent daily at 10:00 AM IST · Disable in Profile settings
    </p>
  </div>
</body>
</html>`;
}

async function getYesterdayReport(
  db: FirebaseFirestore.Firestore,
  uid: string,
  timezone: string
): Promise<{ solved: number; minutes: number; problems: string[] }> {
  const yesterdayKey = getYesterdayKey(timezone);
  const snapRef = db.collection('users').doc(uid).collection('dailySnapshots').doc(yesterdayKey);
  const snap = await snapRef.get();
  const snapData = snap.data() || {};

  const activitySnap = await db.collection('users').doc(uid).collection('activity')
    .where('endedAt', '>=', Timestamp.fromDate(new Date(yesterdayKey + 'T00:00:00')))
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
    .where('solvedAt', '>=', new Date(yesterdayKey + 'T00:00:00').getTime())
    .limit(20)
    .get();

  solvedSnap.docs.forEach(doc => {
    const d = doc.data();
    const title = d.title || d.problemId;
    if (title && !problems.includes(title)) problems.push(String(title));
  });

  return {
    solved: (snapData.solvedToday as number) || problems.length || 0,
    minutes,
    problems: problems.slice(0, 8)
  };
}

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

    for (const doc of usersSnap.docs) {
      const user = doc.data() as UserDoc;
      if (!user.email) continue;

      const timezone = user.timezone || 'Asia/Kolkata';
      const reminderTime = user.reminderTime || '10:00';
      const currentTime = getCurrentTimeInTimezone(timezone);

      if (currentTime !== reminderTime) continue;

      const todayKey = getTodayKey(timezone);
      const snapshotRef = db.collection('users').doc(user.uid).collection('dailySnapshots').doc(todayKey);
      const snapshot = await snapshotRef.get();

      if (snapshot.exists) {
        const data = snapshot.data() || {};
        if ((data.solvedToday as number) > 0) continue;
      }

      const activitySnap = await db.collection('users').doc(user.uid).collection('activity')
        .where('endedAt', '>=', Timestamp.fromDate(new Date(todayKey + 'T00:00:00')))
        .limit(1)
        .get();

      if (!activitySnap.empty) continue;

      const statsSnap = await db.collection('users').doc(user.uid).collection('stats').doc('current').get();
      const stats = (statsSnap.data() || {}) as Record<string, unknown>;

      const weekId = getWeekId(new Date(), timezone);
      const planSnap = await db.collection('users').doc(user.uid).collection('weeklyPlans').doc(weekId).get();
      const plan = planSnap.exists ? (planSnap.data() as Record<string, unknown>) : null;

      const yesterday = await getYesterdayReport(db, user.uid, timezone);

      await resend.emails.send({
        from: from.includes('LeetLens') ? from : `LeetLens <${from}>`,
        to: user.email,
        subject: `☀️ LeetLens Daily — ${formatDateLabel(todayKey)} | Keep your streak!`,
        html: buildEmailHtml(user, stats, plan, yesterday)
      });
    }
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
