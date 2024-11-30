/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { SessionUser } from "@/types";
import { AuthStage } from "@/types/session-types";
import { cookies } from "next/headers";
// import { getBearerToken } from './session'

const verifyToken = async () => {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return { user: null, authStage: AuthStage.INITIAL_LOGIN };
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    const { user }: { user: SessionUser | null } = data;
    if (!user) {
      return { user: null, authStage: AuthStage.INITIAL_LOGIN };
    }
    return { user, authStage: AuthStage.AUTHENTICATED };
  } catch (err) {
    return { user: null, authStage: AuthStage.INITIAL_LOGIN };
  }
};
export async function auth() {
  const response = await verifyToken();
  return response;
}

// Logout function to delete the session cookie
export async function logout() {
  const response = await verifyToken();
  if (response.user) {
    (await cookies()).delete("session");
  }
}
