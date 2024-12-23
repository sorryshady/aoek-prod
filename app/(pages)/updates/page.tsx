import Wrapper from "@/components/custom/wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changeTypeToText } from "@/lib/utils";
import { Obituaries, Promotions, Retirements, Transfers } from "@/types";
import Image from "next/image";


async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/general/requests`,
  );
  const data = await response.json();
  const {
    promotions,
    transfers,
    retirements,
    obituaries,
  }: {
    promotions: Promotions[];
    transfers: Transfers[];
    retirements: Retirements[];
    obituaries: Obituaries[];
  } = data;
  return { promotions, transfers, retirements, obituaries };
}
export default async function Updates() {
  const { promotions, transfers, retirements, obituaries } = await getData();
  return (
    <div className="py-[5rem] relative min-h-[70vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-full" />
      <div className="absolute inset-0 bg-cover bg-hero_img opacity-30 bg-top z-0 h-full" />
      <Wrapper className="relative z-20">
        <h1 className="text-center text-4xl text-white font-bold my-[3rem]">
          Updates
        </h1>
        <Tabs defaultValue="transfers">
          <TabsList className="grid grid-cols-4 w-full bg-transparent">
            <TabsTrigger
              value="transfers"
              className="text-white font-bold text-xl data-[state=active]:bg-transparent data-[state=active]:text-[#FACE30] data-[state=active]:shadow-none"
            >
              Transfers
            </TabsTrigger>
            <TabsTrigger
              value="promotions"
              className="text-white font-bold text-xl data-[state=active]:bg-transparent data-[state=active]:text-[#FACE30] data-[state=active]:shadow-none"
            >
              Promotions
            </TabsTrigger>
            <TabsTrigger
              value="retirements"
              className="text-white font-bold text-xl data-[state=active]:bg-transparent data-[state=active]:text-[#FACE30] data-[state=active]:shadow-none"
            >
              Retirements
            </TabsTrigger>
            <TabsTrigger
              value="obituaries"
              className="text-white font-bold text-xl data-[state=active]:bg-transparent data-[state=active]:text-[#FACE30] data-[state=active]:shadow-none"
            >
              Obituaries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transfers">
            <div className="p-4 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {transfers.length === 0 ? (
                <div className="flex flex-col justify-center items-center w-full h-64 col-span-4">
                  <p className="text-lg font-semibold text-white">
                    No Transfers
                  </p>
                </div>
              ) : (
                transfers.map((transfer) => {
                  return (
                    <div
                      key={transfer.user.name}
                      className="rounded-md overflow-hidden flex flex-col gap-3 justify-center items-center"
                    >
                      <div className="h-64 overflow-hidden rounded-md">
                        <Image
                          src={transfer.user.photoUrl || "/fall-back.webp"}
                          alt={transfer.user.name}
                          width={300}
                          height={400}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg text-white font-bold">
                          {transfer.user.name}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {transfer.user.department}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {changeTypeToText(transfer.oldPosition)}
                        </p>
                        <p className="text-white">
                          {changeTypeToText(transfer.oldWorkDistrict)} &rarr;{" "}
                          {changeTypeToText(transfer.newWorkDistrict)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="promotions">
            <div className="p-4 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {promotions.length === 0 ? (
                <div className="flex flex-col justify-center items-center w-full h-64 col-span-4">
                  <p className="text-lg font-semibold text-white">
                    No Promotions
                  </p>
                </div>
              ) : (
                promotions.map((promotion) => {
                  return (
                    <div
                      key={promotion.user.name}
                      className="rounded-md overflow-hidden flex flex-col gap-3 justify-center items-center"
                    >
                      <div className="h-64 overflow-hidden rounded-md">
                        <Image
                          src={promotion.user.photoUrl || "/fall-back.webp"}
                          alt={promotion.user.name}
                          width={300}
                          height={400}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg text-white font-bold">
                          {promotion.user.name}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {promotion.user.department}
                        </p>
                        <p className="text-white capitalize">
                          {changeTypeToText(promotion.oldPosition)} &rarr;{" "}
                          {changeTypeToText(promotion.newPosition)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="retirements">
            <div className="p-4 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {retirements.length === 0 ? (
                <div className="flex flex-col justify-center items-center w-full h-64 col-span-4">
                  <p className="text-lg font-semibold text-white">
                    No Retirements
                  </p>
                </div>
              ) : (
                retirements.map((retirement) => {
                  return (
                    <div
                      key={retirement.user.name}
                      className="rounded-md overflow-hidden flex flex-col gap-3 justify-center items-center"
                    >
                      <div className="h-64 overflow-hidden rounded-md">
                        <Image
                          src={retirement.user.photoUrl || "/fall-back.webp"}
                          alt={retirement.user.name}
                          width={300}
                          height={400}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg text-white font-bold">
                          {retirement.user.name}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {retirement.user.department}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {changeTypeToText(retirement.oldPosition)}
                        </p>
                        <p className="text-white capitalize">
                          Retired on:{" "}
                          {new Date(
                            retirement.retirementDate,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="obituaries">
            <div className="p-4 pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {obituaries.length === 0 ? (
                <div className="flex flex-col justify-center items-center w-full h-64 col-span-4">
                  <p className="text-lg font-semibold text-white">
                    No Obituaries
                  </p>
                </div>
              ) : (
                obituaries.map((obituary) => {
                  return (
                    <div
                      key={obituary.user.name}
                      className="rounded-md overflow-hidden flex flex-col gap-3 justify-center items-center"
                    >
                      <div className="h-64 overflow-hidden rounded-md">
                        <Image
                          src={obituary.user.photoUrl || "/fall-back.webp"}
                          alt={obituary.user.name}
                          width={300}
                          height={400}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg text-white font-bold">
                          {obituary.user.name}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {obituary.user.department}
                        </p>
                        <p className="text-white text-base font-semibold capitalize">
                          {changeTypeToText(obituary.user.designation || "")}
                        </p>
                        <p className="text-white capitalize">
                          Died on:{" "}
                          {new Date(obituary.dateOfDeath).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Wrapper>
    </div>
  );
}
