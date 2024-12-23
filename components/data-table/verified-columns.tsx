import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, Trash, UserPen } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { TableData } from "@/types/user-types";
export const verifiedColumns: ColumnDef<TableData>[] = [
  {
    accessorKey: "membershipId",
    header: "Membership ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      const designation: string = row.getValue("designation");
      return (
        <div className="capitalize">
          {designation ? designation.toLowerCase().split("_").join(" ") : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department: string = row.getValue("department");
      return <div className="">{department ? department : "-"}</div>;
    },
  },
  {
    accessorKey: "workDistrict",
    header: "Work District",
    cell: ({ row }) => {
      const workDistrict: string = row.getValue("workDistrict");
      return (
        <div className="capitalize">
          {workDistrict ? workDistrict.toLowerCase() : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "userRole",
    header: "Role",
    cell: ({ row }) => {
      const role: string = row.getValue("userRole");
      return (
        <div className="capitalize">{role ? role.toLowerCase() : "-"}</div>
      );
    },
  },
  {
    accessorKey: "committeeType",
    header: "Committee",
    cell: ({ row }) => {
      const committee: string = row.getValue("committeeType");
      return (
        <div className="capitalize">
          {committee ? committee.toLowerCase() : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/${email}?status=verified`}>
                <UserPen className="mr-2" /> View/Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="mr-2" /> Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user and remove their data from the server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant={"destructive"} asChild>
                      <AlertDialogAction
                        onClick={() => console.log(row.getValue("email"))}
                      >
                        Delete
                      </AlertDialogAction>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
