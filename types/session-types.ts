import { User } from "@prisma/client";
import { JWTPayload } from "jose";

export type SessionUser = Omit<User, "password" | "createdAt" | "updatedAt">;

export type SessionPayload = {
  user: SessionUser;
  expiresAt: Date;
};

export interface ExtendedJWTPayload extends JWTPayload {
  user: SessionUser;
}
