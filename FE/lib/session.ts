import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-here-change-in-production"
);

export interface SessionUser {
  userId: string;
  email: string;
}

/**
 * Get current user from session
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    return null;
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

