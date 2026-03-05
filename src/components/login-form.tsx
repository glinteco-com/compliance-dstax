"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm p-8 bg-white shadow-lg mx-auto flex flex-col items-center">
      {/* Logo Placeholder */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex w-[60px] h-[60px] bg-[#2d3a56] text-white font-bold text-xs">
          <div className="flex-1 flex flex-col relative w-full h-full">
            <div className="flex w-full h-full text-[10px] leading-[10px]">
              <div className="flex-1 flex flex-col justify-around items-center border-r border-[#6b7b9b]">
                <span>D</span>
                <span></span>
                <span></span>
              </div>
              <div className="flex-1 flex flex-col justify-around items-center border-r border-[#6b7b9b]">
                <span>S</span>
                <div className="w-1/2 h-[70%] bg-gray-400"></div>
              </div>
              <div className="flex-1 flex flex-col justify-around items-center">
                <span>T</span>
                <span>a</span>
                <span>x</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-[10px] mt-1 text-[#6b7b9b]">Consulting</span>
      </div>

      <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="name@mail.com"
              className="pr-10 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pr-10 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#f96c00] hover:bg-[#e06200] text-white rounded-none h-10 mt-6"
        >
          Login
        </Button>

        <div className="text-center mt-4">
          <a href="#" className="text-[11px] text-gray-500 hover:text-gray-700">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
}
