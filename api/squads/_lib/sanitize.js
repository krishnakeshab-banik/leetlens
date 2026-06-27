'use strict';

function publicDisplayName(member) {
  return member.squadNickname || member.displayName || 'Anonymous';
}

function sanitizeMember(member) {
  if (!member) return null;
  return {
    userId: member.userId,
    displayName: member.displayName,
    squadNickname: member.squadNickname || null,
    displayLabel: publicDisplayName(member),
    role: member.role || 'member',
    joinedAt: member.joinedAt || null
  };
}

function sanitizeLeaderboardEntry(entry, currentUserId) {
  return {
    rank: entry.rank,
    userId: entry.userId,
    displayName: entry.displayName,
    squadNickname: entry.squadNickname || null,
    displayLabel: publicDisplayName(entry),
    easyDelta: entry.easyDelta || 0,
    mediumDelta: entry.mediumDelta || 0,
    hardDelta: entry.hardDelta || 0,
    totalDelta: entry.totalDelta || 0,
    points: entry.points || 0,
    githubDelta: entry.githubDelta || 0,
    lastUpdatedAt: entry.lastUpdatedAt || null,
    isYou: currentUserId ? entry.userId === currentUserId : false
  };
}

function sanitizeSquad(squad, extras = {}) {
  return {
    id: squad.id,
    name: squad.name,
    description: squad.description || '',
    code: squad.code,
    creatorDisplayName: squad.creatorDisplayName,
    creatorId: squad.creatorId || extras.creatorId || null,
    visibility: squad.visibility,
    maxMembers: squad.maxMembers,
    memberCount: extras.memberCount ?? squad.memberCount ?? 0,
    startTime: squad.startTime,
    endTime: squad.endTime,
    status: extras.status || squad.status,
    competitionType: squad.competitionType,
    scoringMode: squad.scoringMode || 'weighted',
    goals: squad.goals || [],
    rules: squad.rules || {},
    invitePath: `/squads/join/${squad.code}`,
    ...extras
  };
}

module.exports = {
  publicDisplayName,
  sanitizeMember,
  sanitizeLeaderboardEntry,
  sanitizeSquad
};
