import Wrapper from "@/components/custom/wrapper";
import { Separator } from "@/components/ui/separator";
import UserProfilePhoto from "@/components/custom/user-profile-photo";
import { auth } from "@/lib/auth";
import { AccountUpdate } from "@/components/forms/account-update";
import { Button } from "@/components/ui/button";
import Requests from "@/components/custom/requests";
import { PromotionTransferRequest } from "@prisma/client";
import { FormError } from "@/components/custom/form-error";
import { changeTypeToText } from "@/lib/utils";
import { FormSuccess } from "@/components/custom/form-success";

async function getData() {
  const { user } = await auth();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/user/requests?membershipId=${user?.membershipId}`,
  );
  console.log(response);
  const data = await response.json();
  const lastRequest = data[0] as PromotionTransferRequest;
  if (!lastRequest) {
    return {
      user,
      requestStatus: null,
      requestType: null,
      adminComments: null,
      visible: false,
      requestId: null,
    };
  }
  return {
    user,
    requestStatus: lastRequest.status,
    requestType: lastRequest.requestType,
    adminComments: lastRequest.adminComments,
    visible: lastRequest.showAgain,
    requestId: lastRequest.id,
  };
}
export default async function Account() {
  const {
    user,
    requestStatus,
    requestType,
    adminComments,
    visible,
    requestId,
  } = await getData();
  if (!user) return null;

  return (
    <Wrapper className="flex flex-col my-[5rem] justify-center items-center">
      <h1 className="text-3xl font-bold my-5 lg:my-10">Account Details</h1>
      {requestStatus === "REJECTED" && visible && (
        <FormError
          message={`${changeTypeToText(requestType)} request rejected. ${adminComments}`}
          visible={visible}
          requestId={requestId}
        />
      )}
      {requestStatus === "VERIFIED" && visible && (
        <FormSuccess
          message={`${changeTypeToText(requestType)} request approved. ${adminComments}`}
          visible={visible}
          requestId={requestId}
        />
      )}
      <div className="flex w-full gap-14 md:max-w-[90%] lg:flex-row flex-col-reverse mt-5 lg:mt-10">
        <div className="flex flex-col gap-10 flex-[1.5]">
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 capitalize gap-5">
              <div>Name</div>
              <div>{user.name}</div>
              <div>Date of Birth</div>
              <div>
                {new Date(user.dob).toLocaleDateString("en-IN", {
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
            <div className="grid grid-cols-2 capitalize gap-5">
              <div>Employment Status</div>
              <div>{user.userStatus.toLowerCase()}</div>
              {user.userStatus === "WORKING" && (
                <>
                  <div>Department</div>
                  <div>{user.department!.toLowerCase()}</div>
                  <div>Designation</div>
                  <div>{changeTypeToText(user.designation!)}</div>
                  <div>Office Address</div>
                  <div>{user.officeAddress!}</div>
                  <div>Work District</div>
                  <div>{changeTypeToText(user.workDistrict!)}</div>
                </>
              )}
            </div>
          </div>
          <Separator />
          <AccountUpdate user={user} />
        </div>
        <div className="flex-[0.5] flex flex-col gap-5">
          <UserProfilePhoto name={user.name} photoUrl={user.photoUrl || ""} />
          <Separator />
          {user.userStatus === "WORKING" && (
            <>
              <Requests requestStatus={requestStatus || "VERIFIED"} />
              <Separator />
            </>
          )}
          <Button variant={"outline"}>Change Password</Button>
        </div>
      </div>
    </Wrapper>
  );
}
