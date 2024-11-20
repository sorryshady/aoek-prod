import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export type LoginResponseUser = {
  name: string;
  email: string;
  membershipId: number;
};
