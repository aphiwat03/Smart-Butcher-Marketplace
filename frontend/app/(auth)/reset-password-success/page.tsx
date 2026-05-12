import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <CircleCheck
          size={64}
          color="#00fa4b"
          strokeWidth={3}
          className="mb-4"
        />
        <h2 className="text-3xl font-bold text-gray-900">
          Your Password Successfully Changed
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account with your new password
        </p>
      </div>

      <form className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-[#4E0707] hover:bg-[#4E0707]/90 shadow-lg shadow-red-200 py-6"
        >
          <Link href="/login">Sign in</Link>
        </Button>
      </form>
    </div>
  );
}
