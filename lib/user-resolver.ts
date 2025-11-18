import { queryOne } from "@/lib/db";
import { SessionUser } from "@/lib/session";

export async function resolveUserId(session: SessionUser): Promise<string> {
  if (!session.isMock) {
    return session.userId;
  }

  const fallbackUser = await queryOne<{ id: string }>(
    "SELECT id FROM users ORDER BY created_at ASC LIMIT 1"
  );

  if (!fallbackUser) {
    throw new Error(
      "No users exist yet. Please register through the app once to seed a user for development."
    );
  }

  return fallbackUser.id;
}

