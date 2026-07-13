const crypto = require('crypto');

const algorithm = 'aes-256-gcm';

function getKey() {
  const secret = process.env.APP_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error('APP_SECRET must be at least 16 characters long');
  }

  return crypto.scryptSync(secret, 'ai-study-assistant', 32);
}

function encryptSecret(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((item) => item.toString('base64')).join('.');
}

function decryptSecret(value) {
  const [ivText, tagText, encryptedText] = value.split('.');

  if (!ivText || !tagText || !encryptedText) {
    throw new Error('Invalid encrypted value');
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(),
    Buffer.from(ivText, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tagText, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

module.exports = {
  decryptSecret,
  encryptSecret,
};
