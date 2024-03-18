"use client";

import React from "react";
import { useSemaphore } from "./SemaphoreHook";
import { CourierDataGrid } from "./CourierDataGrid";

export function CourierBookPage() {
  const [search, setSearch] = React.useState("");
  const dataSemaphore = useSemaphore();

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Courier Book</h2>

      {/* <div className="w-full mb-12">
        <GoodAddForm semaphore={dataSemaphore} />
      </div>

      <div className="w-full mb-4">
        <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
      </div> */}

      <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
        <div className="w-[768px] md:w-full">
          <CourierDataGrid search={search} semaphore={dataSemaphore} />
        </div>
      </div>
    </div>
  );
}
