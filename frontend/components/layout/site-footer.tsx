import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/facebook-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";

export function SiteFooter() {
  return (
    <footer id="footer" className="bg-[#4E0707] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Logo */}
        <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/svg/logo.svg"
            alt="Smart Butcher Logo"
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>

        {/* Right Column: Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-[#B4915B]" />
            <span>+66 (0) 2-XXX-XXXX</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-[#B4915B]" />
            <span>info@smartbutcher.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#B4915B]">Follow Us:</span>
            <a href="#" className="hover:text-[#B4915B] transition-colors">
              <FacebookIcon className="w-6 h-6 text-blue-600" />
            </a>
            <a href="#" className="hover:text-[#B4915B] transition-colors">
              <InstagramIcon className="w-6 h-6 text-pink-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="border-t border-[#B4915B] border-opacity-30 py-6">
        <p className="text-center text-white">
          © 2026 Smart Butcher Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
