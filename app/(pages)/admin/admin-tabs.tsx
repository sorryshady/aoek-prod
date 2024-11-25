"use client";
import DataTable from "@/components/data-table/data-table";
import { Card } from "@/components/ui/card";
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
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
      <TabsContent value="cms">
        <Card className="p-4 pt-8">UPDATE UNDERWAY</Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
