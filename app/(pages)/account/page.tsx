"use client";
import { useAuth } from "@/app/providers/auth-context";
import Wrapper from "@/components/custom/wrapper";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import fallBack from "/public/fall-back.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { photoSchema } from "@/schemas";
import SubmitButton from "@/components/custom/submit-button";

export default function Account() {
  const { user, updatePhoto, isLoading } = useAuth();
  const [photo, setPhoto] = useState(user?.photoUrl);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Validate file using Zod
    const validation = photoSchema.safeParse(file);

    if (!validation.success) {
      toast.error("Invalid file", {
        description: validation.error.issues[0].message,
      });
      return;
    }

    try {
      const res = await updatePhoto(user!.photoUrl, user!.photoId, file);
      setPhoto(res);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Upload failed", {
        description: "Error uploading photo",
      });
    }
  };

  return (
    <Wrapper className="flex flex-col">
      <h1 className="text-3xl font-bold mt-10">Account Details</h1>
      {!user ? (
        <div className="flex flex-col justify-center items-center">
          <Loader2 className="animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex w-full gap-20">
          <div className="flex flex-col gap-10 flex-[1.5]">
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <div className="grid grid-cols-2 capitalize gap-3">
                <div>Name</div>
                <div>{user.name}</div>
                <div>Date of Birth</div>
                <div>
                  {new Date(user.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div>Gender</div>
                <div>{user.gender.toLowerCase().split("_").join(" ")}</div>
                <div>Blood Group</div>
                <div>{user.bloodGroup.toLowerCase().split("_").join(" ")}</div>
                <div>User Role</div>
                <div>{user.userRole.toLowerCase()}</div>
                <div>Membership ID</div>
                <div>{user.membershipId}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Employment Information</h2>
              <div className="grid grid-cols-2 capitalize gap-3">
                <div>Employment Status</div>
                <div>{user.userStatus.toLowerCase()}</div>
                <div>Department</div>
                <div>
                  {user.department
                    ? user.department.toLowerCase().split("_").join(" ")
                    : "NA"}
                </div>
                <div>Designation</div>
                <div>
                  {user.designation
                    ? user.designation.toLowerCase().split("_").join(" ")
                    : "NA"}
                </div>
                <div>Office Address</div>
                <div>{user.officeAddress ? user.officeAddress : "NA"}</div>
                <div>Work District</div>
                <div>
                  {user.workDistrict ? user.workDistrict.toLowerCase() : "NA"}
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Permanent Address</h2>
              <div className="grid grid-cols-2 capitalize gap-3">
                <div>Permanent Address</div>
                <div>{user.personalAddress ? user.personalAddress : "NA"}</div>
                <div>Home District</div>
                <div>
                  {user.homeDistrict ? user.homeDistrict.toLowerCase() : "NA"}
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Contact Info</h2>
              <div className="grid grid-cols-2 capitalize gap-3">
                <div>Email</div>
                <div className="lowercase">{user.email}</div>
                <div>Phone Number</div>
                <div>{user.phoneNumber ? user.phoneNumber : "NA"}</div>
                <div>Mobile Number</div>
                <div>{user.mobileNumber}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Other Information</h2>
              <div className="grid grid-cols-2 capitalize gap-3">
                <div>Committee Member</div>
                <div>{user.committeeType.toLowerCase()}</div>
                <div>Committee Position</div>
                <div>{user.positionState || user.positionDistrict || "NA"}</div>
              </div>
            </div>
          </div>
          <div className="flex-[0.5] h-fit flex flex-col">
            <div className="overflow-hidden rounded-lg w-full max-h-72">
              <Image
                src={photo || fallBack}
                alt={user.name}
                width={500}
                height={500}
                className={`${isLoading ? "animate-pulse" : ""} object-cover object-top`}
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <SubmitButton
              className="mt-5"
              title="Upload"
              isSubmitting={isLoading}
              onClick={() => document.getElementById("photo-upload")!.click()}
            />
          </div>
        </div>
      )}
    </Wrapper>
  );
}
