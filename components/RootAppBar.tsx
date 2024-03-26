"use client";

import { Navbar } from "flowbite-react";
import Link from "next/link";
import * as React from "react";

function RootAppBar() {
  return (
    <Navbar fluid rounded className="bg-gray-50 max-sm:fixed left-0 right-0 z-10">
      <Navbar.Toggle />
      <Navbar.Collapse className="md:mx-auto md:max-w-3xl md:w-full">
        <Navbar.Link as={Link} href="/">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="/goods">
          Library
        </Navbar.Link>
        <Navbar.Link as={Link} href="/routes">
          Routes
        </Navbar.Link>
        <Navbar.Link as={Link} href="/addresses">
          Addresses
        </Navbar.Link>
        <Navbar.Link as={Link} href="/couriers">
          Couriers
        </Navbar.Link>
        <Navbar.Link as={Link} href="/QRScanner">
          QRScanner
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default RootAppBar;
