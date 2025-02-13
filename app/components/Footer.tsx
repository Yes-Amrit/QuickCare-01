import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section - Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">QuickCare</h2>
          <p className="mt-2 text-gray-400">Your trusted healthcare companion</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "About Us", "Our Services", "Book Appointment", "Start Consultation", "Contact Us"].map((link) => (
              <li key={link}>
                <Link href={`/${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-gray-300 hover:text-blue-400 transition">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Contact</h3>
          <p className="flex items-center gap-2 text-gray-400">
            <MapPin size={18} className="text-blue-400" /> 123 Health Street, Medical City
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <Phone size={18} className="text-blue-400" /> (123) 456-7890
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <Mail size={18} className="text-blue-400" /> info@QuickCare.com
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-4">
            <Link href="#" className="text-gray-300 hover:text-blue-400 transition">
              <Facebook size={24} />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-blue-400 transition">
              <Twitter size={24} />
            </Link>
            <Link href="#" className="text-gray-300 hover:text-blue-400 transition">
              <Instagram size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © 2025 QuickCare. All rights reserved.
      </div>
    </footer>
  );
}
