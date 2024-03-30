"use client";

import { TextInput, Button } from "flowbite-react";
import React from "react";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { Semaphore } from "./SemaphoreHook";
import classNames from "classnames";

export function AddressAddForm(props: { semaphore: Semaphore }) {
  const ref1 = React.useRef<HTMLFormElement>(null);
  const ref2 = React.useRef<HTMLFormElement>(null);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(true);

  function onAddAddress(formData: FormData) {
    const line1 = formData.get("line1") as string;
    const line2 = formData.get("line2") as string;
    const recipient = formData.get("recipient") as string;
    InternalAddressCollection.generate(line1, line2, recipient);

    ref1.current?.reset();
    props.semaphore[1]();
  }

  async function onInsertAddress(formData: FormData) {
    const secret = formData.get("secret") as string;
    try {
      await InternalAddressCollection.importUnsafe(secret);
      ref2.current?.reset();
      props.semaphore[1]();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <form
        ref={ref1}
        action={onAddAddress}
        className={classNames("max-w-[400px]", "w-full", "flex", "flex-col", "gap-2", {"hidden": !isAddFormOpen})}>
        <TextInput name="recipient" type="text" placeholder="Recipient" required className="flex-1" />
        <TextInput name="line1" type="text" placeholder="Line 1" required className="flex-1" />
        <TextInput name="line2" type="text" placeholder="Line 2" required className="flex-1" />
        <div className="flex-1 flex items-center">
          <Button color="gray" type="submit" className="w-20">
            Add
          </Button>
          <span>
            &nbsp;or&nbsp;
            <span onClick={() => setIsAddFormOpen(false)} className="text-blue-600 cursor-pointer">
              {"<Import>"}
            </span>
          </span>
        </div>
      </form>
      <form
        ref={ref2}
        action={onInsertAddress}
        className={classNames("max-w-[400px]", "w-full", "flex", "flex-col", "gap-2", {"hidden": isAddFormOpen})}>
        <TextInput name="secret" type="text" placeholder="Secret" required className="flex-1" />
        <div className="flex-1 flex items-center">
          <Button color="gray" type="submit" className="w-20">
            Import
          </Button>
          <span>
            &nbsp;or&nbsp;
            <span onClick={() => setIsAddFormOpen(true)} className="text-blue-600 cursor-pointer">
              {"<Add>"}
            </span>
          </span>
        </div>
      </form>
    </>
  );
}
