"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "../ui/input";
import SubmitButton from "./submit-button";
import { toast } from "sonner";
import { photoSchema } from "@/schemas";
import { useAuth } from "@/app/providers/auth-context";
import fallBack from "/public/fall-back.webp";

interface UserProfilePhotoProps {
  photoUrl?: string;
  name: string;
}
const UserProfilePhoto = ({ photoUrl, name }: UserProfilePhotoProps) => {
  const { user, updatePhoto, isSubmitting } = useAuth();
  const [photo, setPhoto] = useState(photoUrl);
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
    <div className="flex-[0.5] h-fit flex flex-col">
      <div className="overflow-hidden rounded-lg w-full max-h-72">
        <Image
          src={photo || fallBack}
          alt={name}
          width={500}
          height={500}
          className={`${isSubmitting ? "animate-pulse" : ""} object-cover object-top`}
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
        isSubmitting={isSubmitting}
        onClick={() => document.getElementById("photo-upload")!.click()}
      />
    </div>
  );
};

export default UserProfilePhoto;
