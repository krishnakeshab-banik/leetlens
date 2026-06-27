'use strict';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateSquadCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

module.exports = { generateSquadCode };
