"use client";

import { TextInput, Button } from "flowbite-react";
import React from "react";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { Semaphore } from "./SemaphoreHook";

export function AddressAddForm(props: { semaphore: Semaphore }) {
  const ref = React.useRef<HTMLFormElement>(null);

  function onAddAddress(formData: FormData) {
    const line1 = formData.get("line1") as string;
    const line2 = formData.get("line2") as string;
    const recipient = formData.get("recipient") as string;
    InternalAddressCollection.generate(line1, line2, recipient);

    ref.current?.reset();
    props.semaphore[1]();
  }

  return (
    <form ref={ref} action={onAddAddress} className="w-full flex flex-wrap gap-2">
      <TextInput name="line1" type="text" placeholder="line1" required className="flex-2" />
      <TextInput name="line2" type="text" placeholder="line2" required className="flex-2" />
      <TextInput name="recipient" type="text" placeholder="recipient" required className="flex-2" />
      <Button color="gray" type="submit" className="flex-none">
        Add
      </Button>
    </form>
  );
}
