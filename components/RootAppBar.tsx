"use client";

import { Navbar } from "flowbite-react";
import Link from "next/link";
import * as React from "react";

function RootAppBar() {
  return (
    <Navbar fluid rounded className="bg-gray-50">
      <Navbar.Toggle />
      <Navbar.Collapse className="md:mx-auto md:max-w-3xl md:w-full">
        <Navbar.Link as={Link} href="#">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          Library
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          Routes
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          Addresses
        </Navbar.Link>
        <Navbar.Link as={Link} href="#">
          Couriers
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default RootAppBar;
