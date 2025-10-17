import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

export interface ExtensionTokenPayload {
  userId: string;
  email: string;
  name: string;
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  quotaUsed: number;
  quotaLimit: number;
  iat?: number;
  exp?: number;
}

export function signExtensionToken(payload: Omit<ExtensionTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 days
    issuer: 'promptly-app',
    audience: 'promptly-extension'
  });
}

export function verifyExtensionToken(token: string): ExtensionTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'promptly-app',
      audience: 'promptly-extension'
    }) as ExtensionTokenPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as ExtensionTokenPayload;
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
