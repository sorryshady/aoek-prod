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
  SecurityQuestionType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import fs from "fs";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const testUsers = [];

async function main() {
  for (let i = 0; i < 100; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generating random data for new fields using Prisma types
    const dob = faker.date.birthdate({
      min: 20,
      max: 60,
      mode: "age",
    });
    const gender = faker.helpers.arrayElement(Object.values(Gender));
    const bloodGroup = faker.helpers.arrayElement(Object.values(BloodGroup));
    const userStatus = faker.helpers.arrayElement(Object.values(UserStatus));
    const department =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement(Object.values(Department))
        : null;
    const designation =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement(Object.values(Designation))
        : null;
    const officeAddress =
      userStatus === UserStatus.WORKING ? faker.location.streetAddress() : null;
    const workDistrict =
      userStatus === UserStatus.WORKING
        ? faker.helpers.arrayElement(Object.values(District))
        : null;

    const homeDistrict = faker.helpers.arrayElement(Object.values(District));

    const committeeType = faker.helpers.arrayElement(
      Object.values(CommitteeType),
    );
    const userRole = faker.helpers.arrayElement(Object.values(UserRole));
    const verificationStatus = faker.helpers.arrayElement([
      "VERIFIED",
      "PENDING",
    ]);

    // Optional fields based on committeeType
    const positionState =
      committeeType === CommitteeType.STATE
        ? faker.helpers.arrayElement(Object.values(StatePositionTitle))
        : null;
    const positionDistrict =
      committeeType === CommitteeType.DISTRICT
        ? faker.helpers.arrayElement(Object.values(DistrictPositionTitle))
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

    // Create user data
    const userData = {
      name: faker.person.fullName(),
      dob,
      gender,
      bloodGroup,
      userStatus,
      department,
      designation,
      officeAddress,
      workDistrict,
      personalAddress: faker.location.streetAddress(),
      homeDistrict,
      email,
      phoneNumber: faker.phone.number("##########"),
      mobileNumber: faker.phone.number("##########"),
      photoUrl: faker.image.avatar(),
      committeeType:
        verificationStatus === VerificationStatus.VERIFIED
          ? committeeType
          : "NONE",
      userRole:
        verificationStatus === VerificationStatus.VERIFIED
          ? userRole
          : "REGULAR",
      verificationStatus,
      password: verificationStatus === "VERIFIED" ? hashedPassword : null,
      membershipId,
      positionState: verificationStatus === "VERIFIED" ? positionState : null,
      positionDistrict:
        verificationStatus === "VERIFIED" ? positionDistrict : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create user in the database
    const user = await prisma.user.create({
      data: userData,
    });

    // Add security question
    const securityQuestionType = faker.helpers.arrayElement(
      Object.values(SecurityQuestionType),
    );
    const securityAnswer = faker.person.firstName(); // Random answer
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);
    if (verificationStatus === "VERIFIED") {
      await prisma.securityQuestion.create({
        data: {
          question: securityQuestionType,
          answer: hashedAnswer,
          membershipId: user.membershipId, // Associate with the created user
        },
      });
    }

    // Save user credentials and security answer for reference
    testUsers.push({
      email,
      password: verificationStatus === "VERIFIED" ? password : null,
      securityQuestion:
        verificationStatus === "VERIFIED" ? securityQuestionType : null,
      securityAnswer: verificationStatus === "VERIFIED" ? securityAnswer : null,
    });
  }

  // Save test users to a JSON file
  fs.writeFileSync("testUsers.json", JSON.stringify(testUsers, null, 2));
}

main()
  .then(() => {
    console.log("Users and security questions added");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
