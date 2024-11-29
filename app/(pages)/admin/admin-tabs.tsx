"use client";
import Obituaries from "@/components/custom/obituaries";
import UserRequests from "@/components/custom/user-requests";
import DataTable from "@/components/data-table/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const AdminTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "general";
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="requests">
          Transfer/Promotion/Retirement
        </TabsTrigger>
        <TabsTrigger value="obituaries">Obituaries</TabsTrigger>
        <TabsTrigger value="cms">Content Management</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card className="p-4 pt-8">
          <DataTable tab="general" />
        </Card>
      </TabsContent>
      <TabsContent value="pending">
        <Card className="p-4 pt-8">
          <DataTable tab="pending" />
        </Card>
      </TabsContent>
      <TabsContent value="requests">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[200px]">
                  Membership ID
                </TableHead>
                <TableHead className="text-center w-[200px]">Name</TableHead>
                <TableHead className="text-center w-[200px]">
                  Request Type
                </TableHead>
                <TableHead className="text-center">Details</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <UserRequests />
          </Table>
        </Card>
      </TabsContent>
      <TabsContent value="obituaries">
        <Card className="p-2">
          <CardHeader className="text-2xl font-bold p-2">Obituaries</CardHeader>
          <Separator />
          <CardContent>
            <Obituaries />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cms">
        <Card className="p-4 pt-8">UPDATE UNDERWAY</Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
