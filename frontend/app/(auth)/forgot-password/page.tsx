import Link from "next/link";
import { Mail, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter you email to reset password
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="email"
              placeholder="example@mail.com"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#4E0707] focus:outline-none focus:ring-1 focus:ring-[#4E0707] text-gray-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
        >
          <Link href="/reset-password">Submit</Link>
        </Button>
      </form>
    </div>
  );
}
