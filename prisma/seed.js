import {
  PrismaClient,
  Gender,
  BloodGroup,
  UserStatus,
  Department,
  Designation,
  CommitteeType,
  UserRole,
  VerificationStatus,
  StatePositionTitle,
  DistrictPositionTitle,
  District,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import fs from "fs";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const testUsers = [];

async function main() {
  for (let i = 0; i < 1; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generating random data for new fields using Prisma types
    const dob = faker.date.birthdate({
      min: 20,
      max: 60,
      mode: "age",
    }); // Random date of birth within the past 30 years
    const gender = faker.helpers.arrayElement([
      Gender.MALE,
      Gender.FEMALE,
      Gender.OTHER,
    ]);
    const bloodGroup = faker.helpers.arrayElement([
      BloodGroup.A_POS,
      BloodGroup.A_NEG,
      BloodGroup.B_POS,
      BloodGroup.B_NEG,
      BloodGroup.AB_POS,
      BloodGroup.AB_NEG,
      BloodGroup.O_POS,
      BloodGroup.O_NEG,
    ]);
    const userStatus = faker.helpers.arrayElement([
      UserStatus.WORKING,
      UserStatus.RETIRED,
      UserStatus.EXPIRED,
    ]);
    const department =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement([
            Department.LSGD,
            Department.PWD,
            Department.IRRIGATION,
          ])
        : null;
    const designation =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement([
            Designation.ASSISTANT_ENGINEER,
            Designation.ASSISTANT_EXECUTIVE_ENGINEER,
            Designation.EXECUTIVE_ENGINEER,
            Designation.SUPERINTENDING_ENGINEER,
            Designation.CHIEF_ENGINEER,
          ])
        : null;
    const officeAddress =
      userStatus === UserStatus.WORKING ? faker.location.streetAddress() : null;
    const workDistrict =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement([
            District.KASARAGOD,
            District.KANNUR,
            District.WAYANAD,
            District.KOZHIKODE,
            District.MALAPPURAM,
            District.PALAKKAD,
            District.THRISSUR,
            District.ERNAKULAM,
            District.IDUKKI,
            District.KOTTAYAM,
            District.ALAPPUZHA,
            District.PATHANAMTHITTA,
            District.KOLLAM,
            District.THIRUVANANTHAPURAM,
          ])
        : null;

    const homeDistrict = faker.helpers.arrayElement([
      District.KASARAGOD,
      District.KANNUR,
      District.WAYANAD,
      District.KOZHIKODE,
      District.MALAPPURAM,
      District.PALAKKAD,
      District.THRISSUR,
      District.ERNAKULAM,
      District.IDUKKI,
      District.KOTTAYAM,
      District.ALAPPUZHA,
      District.PATHANAMTHITTA,
      District.KOLLAM,
      District.THIRUVANANTHAPURAM,
    ]);

    const committeeType = faker.helpers.arrayElement([
      CommitteeType.NONE,
      CommitteeType.STATE,
      CommitteeType.DISTRICT,
    ]);
    const userRole = faker.helpers.arrayElement([
      UserRole.ADMIN,
      UserRole.REGULAR,
    ]);
    const verificationStatus = faker.helpers.arrayElement([
      VerificationStatus.VERIFIED,
      VerificationStatus.PENDING,
      VerificationStatus.REJECTED,
    ]);

    // Optional fields based on committeeType
    const positionState =
      committeeType === CommitteeType.STATE
        ? faker.helpers.arrayElement([
            StatePositionTitle.PRESIDENT,
            StatePositionTitle.VICE_PRESIDENT,
            StatePositionTitle.GENERAL_SECRETARY,
            StatePositionTitle.JOINT_SECRETARY,
            StatePositionTitle.TREASURER,
            StatePositionTitle.EDITOR,
            StatePositionTitle.EXECUTIVE_COMMITTEE_MEMBER,
            StatePositionTitle.IMMEDIATE_PAST_PRESIDENT,
            StatePositionTitle.IMMEDIATE_PAST_SECRETARY,
          ])
        : null;
    const positionDistrict =
      committeeType === CommitteeType.DISTRICT
        ? faker.helpers.arrayElement([
            DistrictPositionTitle.DISTRICT_PRESIDENT,
            DistrictPositionTitle.DISTRICT_SECRETARY,
          ])
        : null;

    // Check if user is VERIFIED and assign membershipId
    let membershipId = null;
    if (verificationStatus === VerificationStatus.VERIFIED) {
      const verifiedCount = await prisma.user.count({
        where: {
          verificationStatus: VerificationStatus.VERIFIED,
        },
      });
      membershipId = verifiedCount + 1; // Set membershipId to number of verified users + 1
    }
    const data = {
      name: faker.person.fullName(),
      dob: dob,
      gender: gender,
      bloodGroup: bloodGroup,
      userStatus: userStatus,
      department: department,
      designation: designation,
      officeAddress: officeAddress,
      workDistrict: workDistrict,
      personalAddress: faker.location.streetAddress(),
      homeDistrict: homeDistrict,
      email: email,
      phoneNumber: faker.phone.number("##########"),
      mobileNumber: faker.phone.number("##########"),
      photoUrl: faker.image.avatar(),
      committeeType: verificationStatus === "VERIFIED" ? committeeType : "NONE",
      userRole: verificationStatus === "VERIFIED" ? userRole : "REGULAR",
      verificationStatus: verificationStatus,
      password: verificationStatus === "VERIFIED" ? hashedPassword : null,
      membershipId: membershipId, // Only set for verified users
      positionState: verificationStatus === "VERIFIED" ? positionState : null,
      positionDistrict:
        verificationStatus === "VERIFIED" ? positionDistrict : null,
      photoUrl: faker.image.avatar(),
    };

    testUsers.push({
      email,
      password: verificationStatus === "VERIFIED" ? password : null,
    });

    // Create user record in the database
    await prisma.user.create({
      data,
    });
  }
  // Save the test users (emails and passwords) to a JSON file for reference
  fs.writeFileSync("testUsers.json", JSON.stringify(testUsers, null, 2));
}

main()
  .then(() => {
    console.log("Users added");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
