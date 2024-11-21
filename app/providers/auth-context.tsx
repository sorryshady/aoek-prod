/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/types";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { AuthStage } from "@/types/session-types";

// Authentication Context Interface
interface AuthContextType {
  user: SessionUser | null;
  authStage: AuthStage;
  isLoading: boolean;
  success: string | null;
  error: string | null;
  login: (identifier: string, isEmail?: boolean) => Promise<void>;
  setupFirstLogin: (
    password: string,
    securityQuestion: string,
    securityAnswer: string,
    redirectUrl: string,
  ) => Promise<void>;
  enterPassword: (password: string, redirectUrl: string) => Promise<void>;
  logout: () => void;
  updatePhoto: (
    photoUrl: string | null,
    photoId: string | null,
    file: File,
  ) => Promise<string>;
}

// Create Authentication Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  authStage: AuthStage.INITIAL_LOGIN,
  isLoading: true,
  success: null,
  error: null,
  login: async () => {},
  setupFirstLogin: async () => {},
  enterPassword: async () => {},
  logout: () => {},
  updatePhoto: async () => "",
});

// Authentication Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { startUpload } = useUploadThing("imageUploader");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authStage, setAuthStage] = useState<AuthStage>(
    AuthStage.INITIAL_LOGIN,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Persistent Authentication Check
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/auth/user`,
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAuthStage(AuthStage.AUTHENTICATED);
        }
      } catch (err) {
        setUser(null);
        setAuthStage(AuthStage.INITIAL_LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Login Handler
  const login = async (identifier: string, isEmail: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const queryParam = isEmail
        ? `email=${identifier}`
        : `membershipId=${identifier}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/login?${queryParam}`,
      );
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Determine next auth stage based on first login
        setAuthStage(
          data.firstLogin
            ? AuthStage.FIRST_LOGIN_PASSWORD_SETUP
            : AuthStage.PASSWORD_ENTRY,
        );
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // First Login Setup (Password + Security Question)
  const setupFirstLogin = async (
    password: string,
    securityQuestion: string,
    securityAnswer: string,
    redirectUrl: string,
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!user?.membershipId) {
      setError("No user context for first login");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/login?firstLogin=true`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            membershipId: user.membershipId,
            password,
            question: securityQuestion,
            answer: securityAnswer,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.sessionUser);
        setSuccess("Password set successfully.Logging you in...");
        setTimeout(() => {
          setAuthStage(AuthStage.AUTHENTICATED);
          console.log("Redirect to: ", redirectUrl);
          router.push(redirectUrl);
        }, 1000);
      } else {
        setError(data.error || "Password Setup failed");
      }
    } catch (err) {
      setError("An error occurred during first login setup");
    } finally {
      setIsLoading(false);
    }
  };

  // Password Entry for Existing Users
  const enterPassword = async (password: string, redirectUrl: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!user?.membershipId) {
      setError("No user context for password entry");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/login?firstLogin=false`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            membershipId: user.membershipId,
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.sessionUser);
        setSuccess("Password verified. Logging you in...");
        setTimeout(() => {
          setAuthStage(AuthStage.AUTHENTICATED);
          console.log("Redirect to: ", redirectUrl);
          router.push(redirectUrl);
        }, 1000);
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("An error occurred during password verification");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/logout`,
      );
      const data = await response.json();
      toast.success(data.success);
    } catch (err) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setAuthStage(AuthStage.INITIAL_LOGIN);
      router.push("/login");
    }
  };

  const updatePhoto = async (
    photoUrl: string | null,
    photoId: string | null,
    file: File,
  ) => {
    try {
      setIsLoading(true);
      if (photoUrl && photoId) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/auth/user/photo?fileId=${photoId}`,
          {
            method: "DELETE",
          },
        );
        const data = await res.json();
        if (res.ok) {
          toast.success("Photo deleted!", {
            description:
              "Previous photo deleted successfully. Uploading new photo...",
          });
        } else {
          throw new Error(data.error);
        }
      }
      const res = await startUpload([file], {});

      if (res) {
        const uploadedPhoto = res[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/auth/user/photo`,
          {
            method: "POST",
            body: JSON.stringify({
              membershipId: user!.membershipId,
              photoUrl: uploadedPhoto.url,
              photoId: uploadedPhoto.key,
            }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setUser(data.safeUser);
        toast.success("Photo uploaded!", {
          description: "Photo uploaded successfully",
        });
        return data.photoUrl;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        success,
        user,
        authStage,
        isLoading,
        error,
        login,
        setupFirstLogin,
        enterPassword,
        logout,
        updatePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
