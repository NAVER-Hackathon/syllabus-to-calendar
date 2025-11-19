import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-here-change-in-production"
);

const isDev = process.env.NODE_ENV !== "production";
const MOCK_USER = {
  userId: "demo-user",
  email: "demo@example.com",
} as const;

export interface SessionUser {
  userId: string;
  email: string;
  isMock?: boolean;
}

/**
 * Get current user from session
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return isDev ? { ...MOCK_USER, isMock: true } : null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      isMock: false,
    };
  } catch (error) {
    return isDev ? { ...MOCK_USER, isMock: true } : null;
  }
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

