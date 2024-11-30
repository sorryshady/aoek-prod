import {  User } from "@prisma/client";
import { JWTPayload } from "jose";

export type SessionUser = Omit<User, "password" | "createdAt" | "updatedAt">

export type SessionPayload = {
  user: SessionUser;
  expiresAt: Date;
};

export interface ExtendedJWTPayload extends JWTPayload {
  user: SessionUser;
}

export enum AuthStage {
  INITIAL_LOGIN,
  FIRST_LOGIN_PASSWORD_SETUP,
  PASSWORD_ENTRY,
  AUTHENTICATED,
}
