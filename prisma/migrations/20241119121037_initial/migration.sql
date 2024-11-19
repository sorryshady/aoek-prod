-- CreateEnum
CREATE TYPE "District" AS ENUM ('KASARAGOD', 'KANNUR', 'WAYANAD', 'KOZHIKODE', 'MALAPPURAM', 'PALAKKAD', 'THRISSUR', 'ERNAKULAM', 'IDUKKI', 'KOTTAYAM', 'ALAPPUZHA', 'PATHANAMTHITTA', 'KOLLAM', 'THIRUVANANTHAPURAM');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('WORKING', 'RETIRED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('LSGD', 'PWD', 'IRRIGATION');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('ASSISTANT_ENGINEER', 'ASSISTANT_EXECUTIVE_ENGINEER', 'EXECUTIVE_ENGINEER', 'SUPERINTENDING_ENGINEER', 'CHIEF_ENGINEER');

-- CreateEnum
CREATE TYPE "CommitteeType" AS ENUM ('NONE', 'STATE', 'DISTRICT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REGULAR');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatePositionTitle" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'JOINT_SECRETARY', 'TREASURER', 'EDITOR', 'EXECUTIVE_COMMITTEE_MEMBER', 'IMMEDIATE_PAST_PRESIDENT', 'IMMEDIATE_PAST_SECRETARY');

-- CreateEnum
CREATE TYPE "DistrictPositionTitle" AS ENUM ('DISTRICT_PRESIDENT', 'DISTRICT_SECRETARY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "userStatus" "UserStatus" NOT NULL DEFAULT 'WORKING',
    "department" "Department",
    "designation" "Designation",
    "officeAddress" TEXT,
    "workDistrict" "District",
    "personalAddress" TEXT NOT NULL,
    "homeDistrict" "District" NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "photoUrl" TEXT,
    "committeeType" "CommitteeType" NOT NULL DEFAULT 'NONE',
    "userRole" "UserRole" NOT NULL DEFAULT 'REGULAR',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayId" TEXT,
    "password" TEXT,
    "membershipId" INTEGER,
    "positionState" "StatePositionTitle",
    "positionDistrict" "DistrictPositionTitle",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_razorpayId_key" ON "User"("razorpayId");
