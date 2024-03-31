"use client";

import { Address } from "@/chaincode/Models";
import classNames from "classnames";

export function AddressCard(props: { address: Address; className?: string }) {
  const addr = props.address;
  return (
    <div
      className={classNames(
        "bg-white border border-gray-200 rounded-lg shadow p-3 inline-block min-w-[50%]",
        props.className
      )}>
      <b>{addr.recipient}</b>
      <br />
      {addr.line1}
      <br />
      {addr.line2}
    </div>
  );
}
