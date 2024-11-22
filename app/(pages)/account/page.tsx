import Wrapper from "@/components/custom/wrapper";
import { Separator } from "@/components/ui/separator";
import UserProfilePhoto from "@/components/custom/user-profile-photo";
import { auth } from "@/lib/auth";
import { AccountUpdate } from "@/components/forms/account-update";

export default async function Account() {
  const { user } = await auth();
  if (!user) return null;

  return (
    <Wrapper className="flex flex-col my-[5rem] justify-center items-center">
      <h1 className="text-3xl font-bold mt-5 lg:mt-10">Account Details</h1>
      <div className="flex w-full gap-14 md:max-w-[90%] lg:flex-row flex-col-reverse">
        <div className="flex flex-col gap-10 flex-[1.5]">
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 capitalize gap-5">
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
          <AccountUpdate user={user} />
        </div>
        <UserProfilePhoto name={user.name} photoUrl={user.photoUrl || ""} />
      </div>
    </Wrapper>
  );
}
