// import icons
import { ReactComponent as Logo } from "../assets/svg/logo.svg";
import { ReactComponent as WalletIcon } from "../assets/svg/wallet.svg";
import { ReactComponent as BNBIcon } from "../assets/svg/eth.svg";
import { ReactComponent as DownArrowIcon } from "../assets/svg/down-arrow.svg";
import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import config from "../config";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";

const navigationLinks = [
  {
    name: "Ecosystem",
    href: "#ecosystem",
  },
  {
    name: "Roadmap",
    href: "#roadmap",
  },
  {
    name: "Tokenomics",
    href: "#tokenomics",
  },
  {
    name: "Team",
    href: "#team",
  },
];

const Navbar = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  return (
    <div className="container px-2 md:px-0">
      <div className="flex items-center justify-between py-6">
        {/* <Logo className="h-12 lg:h-16 " /> */}

       <a href="/">
       <div className="flex justify-start items-center ">
           <img className="h-[75px] w-[75px]" src="img/logo.png" alt="logo"/>
           <span className="game font-black text-xl md:text-3xl"><span className="text-green-400">Dobi</span>Fy.io</span>
        </div>

       </a>

        <div className="flex  md:z-10 items-center gap-6">
          <nav className="hidden lg:block">
            <ul className="flex gap-6">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-lg font-medium transition-opacity duration-200 hover:opacity-75"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
              <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm    ">
          Airdrop
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <a
                  href="page1"
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block px-4 py-2 text-sm`}
                >
                  Page 1
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <a
                  href="page2"
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block px-4 py-2 text-sm`}
                >
                  Page 2
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <a
                  href="/page3"
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block px-4 py-2 text-sm`}
                >
                  Page 3
                </a>
              )}
            </Menu.Item>     <Menu.Item>
              {({ active }: { active: boolean }) => (
                <a
                  href="page4"
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } block px-4 py-2 text-sm`}
                >
                  Page 4
                </a>
              )}
            </Menu.Item>
            
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open({ route: "SelectNetwork" })}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-transparent py-4 px-4 font-semibold lg:flex"
            >
              <BNBIcon className="h-6 w-6" />
              <span>{chain?.name || config.chains[0].name}</span>
              <DownArrowIcon className="h-3 w-3" />
            </button>

            <button
              onClick={() => open()}
              className="flex items-center gap-2 rounded-full bg-primary py-2 px-4 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-75 lg:py-4 lg:text-base"
            >
              {isConnected ? (
                <span className="flex items-center justify-center gap-2">
                  <span>
                    {address?.slice(0, 6)}...
                    <span className="hidden lg:inline">
                      {address?.slice(address.length - 6, address.length)}
                    </span>
                  </span>
                </span>
              ) : (
                <>
                  <WalletIcon className="h-6 w-6" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-white/0 to-white/20" />
    </div>
  );
};

export default Navbar;
