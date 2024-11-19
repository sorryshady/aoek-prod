import { UserRole } from "@prisma/client";

export type SessionUser = {
  name: string;
  email: string;
  userRole: UserRole;
  membershipId: number;
};
export type SessionPayload = {
  user: SessionUser;
  expiresAt: Date;
};
