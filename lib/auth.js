import bcrypt from "bcrypt";
import { createMySQLConnection } from "./db";
import { Lucia } from "lucia";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import { cookies } from "next/headers";

async function initializeLucia() {
  const conn = await createMySQLConnection();

  const adapter = new Mysql2Adapter(conn, {
    user: "trs_users",
    session: "trs_sessions",
  });

  const lucia = new Lucia(adapter, {
    getUserAttributes: (databaseUser) => {
      return {
        roleId: databaseUser.role_id,
      };
    },
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  return lucia;
}

const lucia = await initializeLucia();

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  try {
    const browserCookies = await cookies();
    browserCookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch {}
}

export async function verifyLogin(user, password) {
  const conn = await createMySQLConnection();
  const query = "SELECT id, hashed_password FROM trs_users WHERE username = ?";
  const params = [user];
  const [results, fields] = await conn.query(query, params);

  if (results.length !== 1) {
    throw Error("Invalid credentials provided.");
  }

  const storedPassword = results[0]["hashed_password"];
  const passwordMatched = await bcrypt.compare(password, storedPassword);

  if (!passwordMatched) {
    throw Error("Invalid credentials provided.");
  }

  const userId = results[0].id;
  return userId;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function verifyAuthSession() {
  const browserCookies = await cookies();
  const sessionCookie = browserCookies.get(lucia.sessionCookieName);
  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }
  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      const browserCookies = await cookies();
      browserCookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return result;
}

export async function destroyAuthSession() {
  const { session } = await verifyAuthSession();

  if (!session) {
    throw Error("Unauthorized Access!");
  }
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  const browserCookies = await cookies();
  browserCookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
