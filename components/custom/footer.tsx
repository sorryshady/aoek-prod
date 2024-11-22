import React from "react";
import Wrapper from "./wrapper";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <Wrapper>
        <div className="container mx-auto px-6">
          {/* Footer Main Section */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-start">
              <img src="/logo.png" alt="AOEK Logo" className="w-12 h-12 mb-3" />
              <h3 className="text-lg font-bold">AOEK</h3>
            </div>
            {/* About Section */}
            <div>
              <Link href="/about" className="hover:underline">
                <h3 className="text-lg font-semibold mb-3">About</h3>
              </Link>
            </div>

            {/* Parent Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Parent Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Kerala PWD
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Kerala LSGD
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Kerala Irrigation Dept.
                  </a>
                </li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Tenders Kerala
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Spark
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Price
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Kerala Highway Research Institute
                  </a>
                </li>
              </ul>
            </div>
            {/*Socails*/}
            <div>
              <h1>Socials</h1>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <div className="mt-10 border-t border-gray-700 pt-6 text-center">
            <p className="text-sm">
              AOEK©2024 - Powered by{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Ervinor
              </a>
            </p>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}
