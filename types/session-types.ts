import { UserRole } from "@prisma/client";
import { JWTPayload } from "jose";
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

export interface ExtendedJWTPayload extends JWTPayload {
  user: SessionUser;
}
