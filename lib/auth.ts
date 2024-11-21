"use server";

import { SessionUser } from '@/types'
import { cookies } from 'next/headers'

export async function auth() {
  const token = (await cookies()).get("session")?.value;
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/user`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const { user } = data;

  return user as SessionUser;
}
