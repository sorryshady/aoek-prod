import Wrapper from "@/components/custom/wrapper";
import { Separator } from "@/components/ui/separator";
import UserProfilePhoto from "@/components/custom/user-profile-photo";
import { auth } from "@/lib/auth";

export default async function Account() {
  const { user } = await auth();
  if (!user) return null;

  return (
    <Wrapper className="flex flex-col">
      <h1 className="text-3xl font-bold mt-10">Account Details</h1>
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
        <UserProfilePhoto name={user.name} photoUrl={user.photoUrl || ""} />
      </div>
    </Wrapper>
  );
}
