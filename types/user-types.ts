import {
  CommitteeType,
  Department,
  Designation,
  District,
  User,
  UserRole,
} from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export type TableData = {
  membershipId: number;
  name: string;
  email: string;
  designation: Designation;
  department: Department;
  workDistrict: District;
  userRole: UserRole;
  committeeType: CommitteeType;
};
