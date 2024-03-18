"use server";

import { Address } from "@/chaincode/Models";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";

export async function add(arg0: Address) {
  // TODO
}

export async function remove(arg0: string) {
  // TODO
}

export async function list() {
  // TODO: return a list of public addresses

  return [...(await InternalAddressCollection.list())];
}

export async function search(search: string) {
  if (search === "") {
    return list();
  } else {
    return (await list()).filter(
      address => address.line1.includes(search) || address.line2.includes(search) || address.recipient.includes(search)
    );
  }
}
