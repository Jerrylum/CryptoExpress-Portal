"use client";

import React from "react";
import { AddressDataGrid } from "./AddressDataGrid";
import { useSemaphore } from "./SemaphoreHook";

export function AddressBookPage() {
  const [search, setSearch] = React.useState("");
  const dataSemaphore = useSemaphore();

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Address Book</h2>

      {/* <div className="w-full mb-12">
        <GoodAddForm semaphore={dataSemaphore} />
      </div>

      <div className="w-full mb-4">
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
      </div> */}

      <div className="w-full mb-4">
        <AddressDataGrid search={search} semaphore={dataSemaphore} />
      </div>
    </div>
  );
}

