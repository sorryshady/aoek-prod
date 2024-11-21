/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { SessionUser } from "@/types";
import { AuthStage } from '@/types/session-types'
import { cookies } from "next/headers";

export async function auth() {
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
  } catch (error) {
    return { user: null, authStage: AuthStage.INITIAL_LOGIN };
  }
}
