import Image from "next/image";
import Link from "next/link";
import React from "react";
import OpenAILogo from "@/assets/icons/Openai.svg"

const Header = () => {
  return (
    <header className="w-full border-b-2 border-gray-200 py-4 bg-white">
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 w-full">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link href="/" className="flex items-center">
          <Image
            src={OpenAILogo}
            className="mr-3 h-6 sm:h-9"
            height={48}
            width={48}
            alt="AI Notes Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            AI Notes
          </span>
        </Link>
      </div>
    </nav>
  </header>
  
  );
};

export default Header;
