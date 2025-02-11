import { Buffer } from 'buffer';

export function decodeToken(token: string | null) {
  if (!token) {
    return '';
  }
  const base64TokenRegex =
    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  let isValidToken = base64TokenRegex.test(token);
  if (!isValidToken) {
    return '';
  }

  const buffer = Buffer.from(token, 'base64');
  const cookies = buffer.toString('utf8');

  return cookies;
}

export function encodeToBase64Token(key: string) {
  const buffer = Buffer.from(key);
  const token = buffer.toString('base64');

  return token;
}
