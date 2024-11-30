"use server";

import { ExtendedJWTPayload, SessionPayload, SessionUser } from "@/types";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export const createSession = async (user: SessionUser) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  try {
    const session = await encrypt({ user, expiresAt });

    (await cookies()).set("session", session, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: expiresAt,
    });
    return session;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

export const deleteSession = async () => {
  (await cookies()).delete("session");
  redirect("/login");
};

export const encrypt = async (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

export const decrypt = async (session: string) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as ExtendedJWTPayload;
  } catch (error) {
    console.error("Error: ", error);
    return { error };
  }
};

export const getToken = async (request: NextRequest) => {
  const token =
    await getBearerToken(request) || (await cookies()).get("session")?.value;
  return token;
};

export async function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7); // Remove "Bearer " prefix
  }
  return undefined;
}
