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

function buildEmailHtml(user: UserDoc, stats: Record<string, unknown>, plan: Record<string, unknown> | null) {
  const streak = (stats.streak as number) || 0;
  const totalSolved = (stats.totalSolved as number) || 0;
  const target = (plan?.targetProblems as number) || 0;
  const completed = ((plan?.completedProblems as string[]) || []).length;
  const remaining = Math.max(0, target - completed);

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
      <h1 style="color:#ffa116;">Keep Your LeetCode Streak Alive 🔥</h1>
      <p>Hi ${user.displayName || 'Coder'},</p>
      <p>You haven't solved a LeetCode problem today. Don't break your momentum!</p>
      <div style="background:#f5f5f5;border-radius:12px;padding:16px;margin:20px 0;">
        <p>🔥 <strong>Current Streak:</strong> ${streak} days</p>
        <p>📚 <strong>Total Solved:</strong> ${totalSolved}</p>
        <p>🎯 <strong>Weekly Goal:</strong> ${completed} / ${target} completed</p>
        <p>📋 <strong>Remaining Problems:</strong> ${remaining}</p>
      </div>
      <p>Open LeetLens and solve at least one problem before the day ends.</p>
      <p style="color:#666;font-size:12px;">You're receiving this because email reminders are enabled in LeetLens.</p>
    </div>`;
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
      const reminderTime = user.reminderTime || '19:00';
      const currentTime = getCurrentTimeInTimezone(timezone);

      if (currentTime !== reminderTime) continue;

      const todayKey = getTodayKey(timezone);
      const snapshotRef = db.collection('users').doc(user.uid).collection('dailySnapshots').doc(todayKey);
      const snapshot = await snapshotRef.get();

      if (snapshot.exists) {
        const data = snapshot.data() || {};
        if ((data.solvedToday as number) > 0 || (data.totalSolved as number) > 0) continue;
      }

      const activitySnap = await db.collection('users').doc(user.uid).collection('activity')
        .where('endedAt', '>=', Timestamp.fromDate(new Date(todayKey)))
        .limit(1)
        .get();

      if (!activitySnap.empty) continue;

      const statsSnap = await db.collection('users').doc(user.uid).collection('stats').doc('current').get();
      const stats = (statsSnap.data() || {}) as Record<string, unknown>;

      const weekId = getWeekId(new Date(), timezone);
      const planSnap = await db.collection('users').doc(user.uid).collection('weeklyPlans').doc(weekId).get();
      const plan = planSnap.exists
        ? (planSnap.data() as Record<string, unknown>)
        : null;

      await resend.emails.send({
        from,
        to: user.email,
        subject: 'Keep Your LeetCode Streak Alive 🔥',
        html: buildEmailHtml(user, stats, plan)
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
