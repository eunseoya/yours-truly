"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidEmail } from "@/lib/utils";

export default function AddFriendsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (email) {
      if (!isValidEmail(email)) {
        setSearchedEmail("");
        setUserExists(false);
        setUserProfile(null);
        setErrorMessage("Please enter a valid email.");
        return;
      }

      setSearchedEmail(email);
      setErrorMessage(""); // Clear any previous error message
      // Simulate checking if the user exists in the database
      const mockDatabaseCheck = email === "existinguser@example.com";
      setUserExists(mockDatabaseCheck);

      if (mockDatabaseCheck) {
        setUserProfile({
          name: "example user",
          profilePicture: "/logo.png",
        });
      } else {
        setUserExists(false);
        setUserProfile({
          name: "potential friend",
          profilePicture: "/logo.png",
        });
      }
    } else {
      setSearchedEmail("");
      setUserExists(false);
      setUserProfile(null);
      setErrorMessage("Please enter a valid email address.");
    }
  };

  const handleAction = () => {
    if (userExists) {
      alert(`Friend request sent to ${searchedEmail}`);
    } else {
      alert("Invitation sent!");
    }
    setEmail("");
    setSearchedEmail("");
    setUserExists(false);
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <Link
            href="/home"
            className="font-serif italic text-xl text-gray-800 translate-x-4"
          >
            <Image src="/title.svg" alt="title" width={100} height={50} />
          </Link>
          <div className="w-5" />
        </div>
      </div>

      {/* Add friends form */}
      <div className="flex-1 container max-w-md mx-auto px-4 py-8">
        <h2 className="text-lg font-light uppercase mb-4">
          Add friends by Email
        </h2>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="email"
            placeholder="yourfriend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="uppercase">
            Search
          </Button>
        </div>
        {errorMessage && (
          <div className="mb-4 p-2 bg-white text-red-500 rounded text-sm">
            {errorMessage}
          </div>
        )}
        {searchedEmail && userProfile && (
          <div className="border p-4 rounded-lg flex items-center space-x-4">
            <Image
              src={userProfile.profilePicture}
              alt="Profile Picture"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{userProfile.name}</h3>
              <p className="text-sm text-gray-500">{searchedEmail}</p>
            </div>
            {userExists && <Button onClick={handleAction}>Add User</Button>}
            {!userExists && (
              <Button onClick={handleAction} variant="secondary">
                Invite User
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
