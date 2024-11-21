import { auth } from "@/lib/auth";

export default async function News() {
  const { user } = await auth();
  if (!user) return;
  return <div>News {user.name}</div>;
}
