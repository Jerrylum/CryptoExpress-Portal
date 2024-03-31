"use client";

import React from "react";
import { GoodAddForm } from "./GoodAddForm";
import { GoodDataGrid } from "./GoodDataGrid";
import { TextInput } from "flowbite-react";
import { useSemaphore } from "./SemaphoreHook";

export function GoodLibraryPage() {
  const [search, setSearch] = React.useState("");
  const dataSemaphore = useSemaphore();

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Good Library</h2>

      <div className="w-full mb-12">
        <GoodAddForm semaphore={dataSemaphore} />
      </div>

      <div className="w-full mb-4">
        <TextInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" />
      </div>

      <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
        <div className="w-[768px] md:w-full">
          <GoodDataGrid search={search} semaphore={dataSemaphore} />
        </div>
      </div>
    </div>
  );
}
