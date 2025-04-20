"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeypadClick = async (value: string) => {
    if (value === "clear") {
      setPassword("");
    } else if (value === "delete") {
      setPassword((prev) => prev.slice(0, -1));
    } else if (password.length < 4) {
      const newPassword = password + value;
      setPassword(newPassword);

      if (newPassword.length === 4) {
        setError("");
        // add two zeroes to the password
        const editedPassword = newPassword.padEnd(6, "0");
        const success = await login(formData.email, editedPassword);
        // const success = await login(formData.email, newPassword);
        if (success) {
          router.push("/home");
        } else {
          setError("Invalid email or passcode");
          setPassword("");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-lightpink flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/logo.svg?height=96&width=96"
              alt="Yours Truly Logo"
              width={96}
              height={96}
              className="opacity-70"
            />
          </div>
          <h1 className="font-serif italic text-3xl text-gray-800">
            Yours Truly
          </h1>
        </div>

        <div className="p-6 rounded-lg">
          <form className="space-y-4">
            <div>
              <div className="mb-8 px-8">
                {error && (
                  <div className="mb-8 p-2 bg-white text-red-500 rounded text-center text-sm">
                    {error}
                  </div>
                )}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex justify-center mb-10">
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < password.length
                          ? "bg-gray-800"
                          : "border border-black"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2 justify-items-center">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].map(
                  (key, index) =>
                    key ? (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleKeypadClick(key)}
                        className="p-4 w-16 h-16 border items-center border-black bg-white rounded-full text-gray-800 text-2xl font-light hover:bg-gray-300"
                      >
                        {key}
                      </button>
                    ) : (
                      <div key={index} className="w-16 h-16"></div>
                    ),
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
