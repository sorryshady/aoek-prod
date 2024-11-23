"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const districts = [
  { name: "Thiruvananthapuram", url: "/district/thiruvananthapuram" },
  { name: "Kollam", url: "/district/kollam" },
  { name: "Pathanamthitta", url: "/district/pathanamthitta" },
  { name: "Alappuzha", url: "/district/alappuzha" },
  { name: "Kottayam", url: "/district/kottayam" },
  { name: "Idukki", url: "/district/idukki" },
  { name: "Ernakulam", url: "/district/ernakulam" },
  { name: "Thrissur", url: "/district/thrissur" },
  { name: "Palakkad", url: "/district/palakkad" },
  { name: "Malappuram", url: "/district/malappuram" },
  { name: "Kozhikode", url: "/district/kozhikode" },
  { name: "Wayanad", url: "/district/wayanad" },
  { name: "Kannur", url: "/district/kannur" },
  { name: "Kasaragod", url: "/district/kasaragod" },
];

const committeeMembers = {
  Thiruvananthapuram: [
    {
      name: "Member 1 TVM",
      role: "District Secretary",
      designation: "Assistant Engineer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Member 2 TVM",
      role: "District President",
      designation: "Assistant Executive Engineer",
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  Kollam: [
    {
      name: "Member 1 Kollam",
      role: "District Secretary",
      designation: "Assistant Engineer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Member 2 Kollam",
      role: "District President",
      designation: "Assistant Executive Engineer",
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  // Add more districts and their respective committee members here
};

export default function DistrictCommittee() {
  const [selectedDistrict, setSelectedDistrict] =
    useState("Thiruvananthapuram");

  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  return (
    <div className="w-full  mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg">
          <CardTitle className="text-center text-2xl text-white mb-6">
            District Committee
          </CardTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {districts.map((district) => (
              <button
                key={district.name}
                onClick={() => handleDistrictClick(district.name)}
                className={`px-2 py-1 text-sm sm:text-base text-white hover:text-gray-300 transition-colors ${
                  district.name === selectedDistrict
                    ? "text-yellow-300 hover:text-yellow-200"
                    : ""
                }`}
              >
                {district.name}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="bg-sky-100/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {committeeMembers[
              selectedDistrict as keyof typeof committeeMembers
            ]?.map((member, index) => (
              <Card
                key={index}
                className="w-full max-w-[250px] border-0 shadow text-center"
              >
                <CardContent className="p-4">
                  <div className="aspect-square w-48 mx-auto mb-4 overflow-hidden rounded-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.designation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
