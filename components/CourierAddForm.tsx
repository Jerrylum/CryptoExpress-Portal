"use client";

import { TextInput, Button } from "flowbite-react";
import React from "react";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { Semaphore } from "./SemaphoreHook";
import classNames from "classnames";

export function CourierAddForm(props: { semaphore: Semaphore }) {
  const ref1 = React.useRef<HTMLFormElement>(null);
  const ref2 = React.useRef<HTMLFormElement>(null);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(true);

  function onAddCourier(formData: FormData) {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const telephone = formData.get("telephone") as string;
    InternalCourierCollection.generate(name, company, telephone);

    ref1.current?.reset();
    props.semaphore[1]();
  }

  async function onInsertAddress(formData: FormData) {
    const secret = formData.get("secret") as string;
    try {
      await InternalCourierCollection.importUnsafe(secret);
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
        action={onAddCourier}
        className={classNames("max-w-[400px]", "w-full", "flex", "flex-col", "gap-2", { hidden: !isAddFormOpen })}>
        <TextInput name="name" type="text" placeholder="Name" required className="flex-1" />
        <TextInput name="company" type="text" placeholder="Company" required className="flex-1" />
        <TextInput name="telephone" type="text" placeholder="Telephone" required className="flex-1" />
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
        className={classNames("max-w-[400px]", "w-full", "flex", "flex-col", "gap-2", { hidden: isAddFormOpen })}>
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
