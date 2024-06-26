"use client";

import { Navbar } from "flowbite-react";
import Link from "next/link";

function RootAppBar() {
  return (
    <Navbar fluid rounded className="bg-gray-50 max-sm:fixed left-0 right-0 z-10">
      <Navbar.Toggle />
      <Navbar.Collapse className="md:mx-auto md:max-w-3xl md:w-full">
        <Navbar.Link as={Link} href="/">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="/goods">
          Goods
        </Navbar.Link>
        <Navbar.Link as={Link} href="/routes/list">
          Routes
        </Navbar.Link>
        <Navbar.Link as={Link} href="/addresses">
          Addresses
        </Navbar.Link>
        <Navbar.Link as={Link} href="/couriers">
          Couriers
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default RootAppBar;
