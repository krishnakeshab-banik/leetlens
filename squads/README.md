# LeetLens Squads

Privacy-first coding competitions using delta-based LeetCode scoring.

## Firestore collections

| Collection | Document | Purpose |
|------------|----------|---------|
| `squads/{squadId}` | Squad metadata, schedule, goals, rules | Core squad doc |
| `squads/{squadId}/members/{uid}` | Member display name, nickname, role | Membership |
| `squads/{squadId}/baselines/{uid}` | Pre-competition stats snapshot | Delta scoring (server-only reads for others) |
| `squads/{squadId}/leaderboard/{uid}` | Public deltas, points, rank | Sanitized leaderboard entries |
| `squads/{squadId}/results/summary` | Final results after competition ends | Frozen results |
| `squadCodes/{code}` | `{ squadId }` | Code → squad lookup |
| `userSquads/{uid}/entries/{squadId}` | Cached list for active/history | User's squad index |

**Never stored on leaderboard docs:** `leetcodeUsername`, `githubUsername`.

## API routes (Vercel)

All routes require `Authorization: Bearer <Firebase ID token>` unless noted.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/squads/create` | Create squad |
| POST | `/api/squads/join` | Join by code |
| GET | `/api/squads/lookup?code=` | Preview squad (auth optional) |
| GET | `/api/squads/active` | User's active squads |
| GET | `/api/squads/history` | Past squads + stats |
| GET | `/api/squads/[id]` | Squad details (sanitized) |
| GET | `/api/squads/[id]/leaderboard` | Leaderboard |
| POST | `/api/squads/[id]/sync` | Manual sync (15 min cooldown) |
| GET | `/api/squads/[id]/results` | Final results |

## Environment

Set on Vercel:

- `FIREBASE_SERVICE_ACCOUNT` — JSON service account for Admin SDK
- Existing `VITE_FIREBASE_PROJECT_ID` used as fallback project id

## Sync strategy

1. Scheduled: Firebase Function every 6 hours for active squad members
2. Manual: POST sync, max once per 15 minutes per user per squad
3. Smart: On squad page load if last sync > 30 minutes (client triggers sync API)
