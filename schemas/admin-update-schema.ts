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
//   .refine((data) => console.log(data))
//   .refine(
//     (data) => {
//       if (data.committeeType === "NONE") {
//         data.positionState = undefined;
//         data.positionDistrict = undefined;
//       }
//     },
//     {
//       message:
//         "If no committe, positionState and positionDistrict must be empty.",
//       path: ["committeeType"], // Highlighted field causing the error
//     },
//   )
//   .refine(
//     (data) => {
//       if (data.committeeType === "STATE" && !!data.positionState) {
//         data.positionDistrict = undefined;
//         return true;
//       } else if (data.committeeType === "DISTRICT" && !!data.positionDistrict) {
//         data.positionState = undefined;
//         return true;
//       }
//       return;
//     },
//     {
//       message: "If user is in committee, position must be given.",
//       path: ["positionState", "positionDistrict"],
//     },
//   );
//   .refine(
//     (data) =>
//       data.committeeType === "DISTRICT"
//         ? !!data.positionDistrict && !data.positionState
//         : true,
//     {
//       message: "If user is in District committee, position must be given.",
//       path: ["positionDistrict"],
//     },
//   );

export type AdminUpdateSchema = z.infer<typeof adminUpdateSchema>;
