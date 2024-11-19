"use server";

import { SessionPayload, SessionUser } from "@/types";
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
      secure: true,
      expires: expiresAt,
    });
    return session;
  } catch (error) {
    console.log("Error: ", error);
    return { error };
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
    return payload;
  } catch (error) {
    console.log("Error: ", error);
    return { error };
  }
};

export const getBearerToken = (req: NextRequest): string | undefined => {
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7); // Remove "Bearer " prefix
  }
  return undefined;
};
