"use server";

import { Address } from "@/chaincode/Models";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { AddressWithPrivateKey, fromAnyToAddressObject } from "./Models";
import { getAllData, releaseAddress, removeAddress } from "@/gateway/Transactions";
import { getContract } from "@/gateway/Gateway";
import { combinePublicPrivateList } from "./Utils";

export async function add(addr: Address) {
  await releaseAddress(await getContract(), fromAnyToAddressObject(addr));
}

export async function remove(hashId: string) {
  await removeAddress(await getContract(), hashId);
}

export type AddressQueryingResult = (Address | AddressWithPrivateKey) & { isPublic: boolean };

export async function list(): Promise<AddressQueryingResult[]> {
  const publicList = await getAllData(await getContract(), "ad");
  const internalList = await InternalAddressCollection.list();
  return combinePublicPrivateList(publicList, internalList);
}

export async function search(search: string) {
  if (search === "") {
    return list();
  } else {
    return (await list()).filter(
      address =>
        address.hashId.includes(search) ||
        address.line1.includes(search) ||
        address.line2.includes(search) ||
        address.recipient.includes(search)
    );
  }
}
