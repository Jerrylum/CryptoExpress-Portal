"use client";

import { TextInput, Button } from "flowbite-react";
import React from "react";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";
import { Good } from "@/chaincode/Models";
import { randomUUID } from "@/internal/Utils";
import { Semaphore } from "./SemaphoreHook";

export function GoodAddForm(props: { semaphore: Semaphore }) {
  const ref = React.useRef<HTMLFormElement>(null);

  function onAddGood(formData: FormData) {
    const good: Good = {
      uuid: randomUUID(),
      name: formData.get("name") as string,
      barcode: formData.get("barcode") as string
    };

    InternalGoodCollection.set(good);

    ref.current?.reset();
    props.semaphore[1]();
  }

  return (
    <form ref={ref} action={onAddGood} className="w-full flex gap-2">
      <TextInput name="name" type="text" placeholder="Name" required className="flex-1" />
      <TextInput name="barcode" type="text" placeholder="Barcode" required className="flex-2" />
      <Button color="gray" type="submit" className="flex-none">
        Add
      </Button>
    </form>
  );
}
