import { useState } from "react";
import {
  PaperAirplaneIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/img/logo.png";
import button from "../assets/img/button.png";
import { Link } from "react-router-dom";
function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="app ">
      <nav className="fixed font-poppins top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex mx-auto justify-between items-center px-4 w-full">
            {/* Primary menu and logo */}
            <div className="flex items-center gap-40 my-0">
              {/* logo */}
              <div>
                <a href="/" className="flex items-center gap-2 mb-2">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-18 w-auto object-contain"
                  />
                </a>
              </div>
              {/* primary */}
              <div>
                <Link to="/chat">
                  <button className="flex items-center gap-2 bg-gray text-xs px-2 py-1 md:text-sm md:px-3 md:py-2 lg:text-base lg:px-4 lg:py-2 hover:bg-secondary-blue hover:text-gray-100 transition ">
                    <img
                      src={button}
                      alt="Icon"
                      className="h-4 w-auto md:h-5 lg:h-6 object-contain"
                    />
                    LEVEL UP WITH CHATBOT
                  </button>
                </Link>
              </div>
              <div className="hidden lg:flex font-jersey text-xl gap-8">
                <Link to="/">MAIN</Link>
                <Link to="/about">ABOUT</Link>
                <Link to="/chat">CHAT</Link>
              </div>
            </div>
            {/* secondary */}
            <div className="flex gap-6">
              {/* Mobile navigation toggle */}
              <div className="lg:hidden flex items-center">
                <button onClick={() => setToggleMenu(!toggleMenu)}>
                  <Bars3Icon className="h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* mobile navigation */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-primary-orange z-40 transform transition-transform duration-300 ease-in-out ${
            toggleMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col p-6 gap-6 font-bold tracking-wider mt-12">
            <button
              onClick={() => setToggleMenu(false)}
              className="self-end text-black"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <Link to="/" onClick={() => setToggleMenu(false)}>
              MAIN
            </Link>
            <Link to="/about" onClick={() => setToggleMenu(false)}>
              ABOUT
            </Link>
            <Link to="/chat" onClick={() => setToggleMenu(false)}>
              CHAT
            </Link>
          </div>
        </div>
      </nav>
      {/* Overlay to close menu */}
      {toggleMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setToggleMenu(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
