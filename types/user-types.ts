import {
    BloodGroup,
  CommitteeType,
  Department,
  Designation,
  District,
  Gender,
  User,
  UserRole,
  UserStatus,
  VerificationStatus,
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

type VerifiedUserFields = {
  photoUrl: string;
  name: string;
  email: string;
  dob: Date;
  gender: Gender;
  bloodGroup: BloodGroup;
  userStatus: UserStatus;
  userRole: UserRole;
  department?: Department;
  designation?: Designation;
  officeAddress?: string;
  workDistrict?: District;
  personalAddress: string;
  homeDistrict: District;
  phoneNumber?: string;
  mobileNumber: string;
  verificationStatus: VerificationStatus;
  
}

type PendingUserFields = Omit<VerifiedUserFields,
  'userRole' |
  'department' |
  'designation' |
  'officeAddress' |
  'workDistrict'
> & {
  userRole?: never;
  department?: never;
  designation?: never;
  officeAddress?: never;
  workDistrict?: never;
}

type ProfileUser = VerifiedUserFields | PendingUserFields;

export type { ProfileUser };
