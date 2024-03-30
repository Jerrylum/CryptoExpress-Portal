"use server";

import { Address } from "@/chaincode/Models";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { AddressWithPrivateKey, fromAnyToAddressObject } from "./Models";
import { getAllData, releaseAddress, removeAddress } from "@/gateway/transactions";
import { getContract } from "@/gateway/gateway";

export async function add(addr: Address) {
  await releaseAddress(await getContract(), fromAnyToAddressObject(addr));
}

export async function remove(hashId: string) {
  await removeAddress(await getContract(), hashId);
}

export type AddressQueryingResult = (Address | AddressWithPrivateKey) & { isPublic: boolean };

export async function list(): Promise<AddressQueryingResult[]> {
  const publicList: Address[] = await getAllData(await getContract(), "ad");
  const publicHashIdList = publicList.map(addr => addr.hashId);
  const internalList = await InternalAddressCollection.list();
  return [
    ...publicList
      .map(addr => ({ ...addr, isPublic: true }))
      .filter(addr => internalList.find(a => a.hashId === addr.hashId) === undefined),
    ...internalList.map(addr => ({ ...addr, isPublic: publicHashIdList.includes(addr.hashId) }))
  ];
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
