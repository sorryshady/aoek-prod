import { Department, Designation, District } from "@prisma/client";

type User = {
  name: string;
  photoUrl: string;
  department: Department;
};
export type Promotions = {
  oldPosition: Designation;
  newPosition: Designation;
  user: User;
};
export type Transfers = {
  oldWorkDistrict: District;
  newWorkDistrict: District;
  oldPosition: Designation;
  user: User;
};
export type Retirements = {
  retirementDate: Date;
  oldPosition: Designation;
  user: User;
};
export type Obituaries = {
  dateOfDeath: Date;
  additionalNote: string;
  user: User & {
    designation: Designation;
  };
};
