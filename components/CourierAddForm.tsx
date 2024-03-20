"use client";

import { TextInput, Button } from "flowbite-react";
import React from "react";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { Semaphore } from "./SemaphoreHook";

export function CourierAddForm(props: { semaphore: Semaphore }) {
  const ref = React.useRef<HTMLFormElement>(null);

  function onAddAddress(formData: FormData) {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const telephone = formData.get("telephone") as string;
    InternalCourierCollection.generate(name, company, telephone);

    ref.current?.reset();
    props.semaphore[1]();
  }

  return (
    <form ref={ref} action={onAddAddress} className="w-full flex flex-wrap gap-2">
      <TextInput name="name" type="text" placeholder="Name" required className="flex-2" />
      <TextInput name="company" type="text" placeholder="Company" required className="flex-2" />
      <TextInput name="telephone" type="text" placeholder="Telephone" required className="flex-2" maxLength={8} />
      <Button color="gray" type="submit" className="flex-none">
        Add
      </Button>
    </form>
  );
}
