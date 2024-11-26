import {
  CommitteeType,
  DistrictPositionTitle,
  StatePositionTitle,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { z } from "zod";

export const adminUpdateSchema = z
  .object({
    userStatus: z.nativeEnum(UserStatus),
    committeeType: z.nativeEnum(CommitteeType),
    userRole: z.nativeEnum(UserRole),
    positionState: z.nativeEnum(StatePositionTitle).optional(),
    positionDistrict: z.nativeEnum(DistrictPositionTitle).optional(),
  })

export type AdminUpdateSchema = z.infer<typeof adminUpdateSchema>;
