import Wrapper from "@/components/custom/wrapper";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminTabs from "./admin-tabs";

export default async function Admin() {
  const { user } = await auth();

  if (!user || user.userRole !== "ADMIN") {
    redirect("/account");
  }
  return (
    <Wrapper className="flex flex-col my-[5rem] gap-5 min-h-[70vh]">
      <h1 className="text-4xl font-bold mt-5 lg:mt-10">
        Welcome Admin, {user.name.split(" ")[0]}
      </h1>
      <div className="hidden lg:flex flex-col gap-5">
        <h2 className="text-lg font-semibold">
          Manage members and content here.
        </h2>
        <AdminTabs />
      </div>
      <Card className="flex lg:hidden items-center justify-center text-xl p-4 h-[80vh]">
        Admin Dashboard is only available on bigger screens.
      </Card>
    </Wrapper>
  );
}
