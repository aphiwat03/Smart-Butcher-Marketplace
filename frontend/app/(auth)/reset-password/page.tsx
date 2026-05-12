import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password to complete the reset process
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-1">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Enter you password"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Enter you password"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
        >
          <Link href="/reset-password-success"> Save New Password</Link>
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Remember old password?{" "}
        <Link
          href="/login"
          className="font-medium text-[#4E0707] hover:text-[#4E0707]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
