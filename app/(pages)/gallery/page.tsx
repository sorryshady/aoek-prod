import { auth } from "@/lib/auth";

export default async function Gallery() {
  const { user } = await auth();
  if (!user) return;
  return <div>Gallery {user.name}</div>;
}
