import Wrapper from "@/components/custom/wrapper";
import DataTable from "@/components/data-table/data-table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        {/* <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cms">Content Management</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card className="p-4 pt-8">
              <DataTable />
            </Card>
          </TabsContent>
          <TabsContent value="pending">
            <Card className="p-4 pt-8">
              <DataTable />
            </Card>
          </TabsContent>
          <TabsContent value="cms">
            <Card className="p-4 pt-8">UPDATE UNDERWAY</Card>
          </TabsContent>
        </Tabs> */}
        <AdminTabs />
      </div>
      <Card className="flex lg:hidden items-center justify-center text-xl p-4 h-[80vh]">
        Admin Dashboard is only available on bigger screens.
      </Card>
    </Wrapper>
  );
}
