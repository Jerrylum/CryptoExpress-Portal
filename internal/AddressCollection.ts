"use server";

import { Address } from "@/chaincode/Models";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { AddressWithPrivateKey } from "./Models";
import { releaseAddress, removeAddress } from "@/gateway/transactions";
import { getContract } from "@/gateway/gateway";

export async function add(arg0: Address) {
  await releaseAddress(await getContract(), arg0);
}

export async function remove(arg0: string) {
  await removeAddress(await getContract(), arg0);
}

export type AddressQueryingResult = (Address | AddressWithPrivateKey) & { isPublic: boolean };

export async function list(): Promise<AddressQueryingResult[]> {
  const publicList: Address[] = [];
  const publicHashIdList = publicList.map(addr => addr.hashId);
  const internalList = await InternalAddressCollection.list();
  return [
    ...publicList.map(addr => ({ ...addr, isPublic: true })),
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
