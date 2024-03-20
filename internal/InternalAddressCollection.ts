"use server";

import { AddressWithPrivateKey, generateAddressWithPrivateKey, importAddressWithPrivateKey } from "./Models";
import * as AddressCollection from "./AddressCollection";

let _data: Map<string, AddressWithPrivateKey>;

async function data() {
  if (_data === undefined) {
    _data = new Map<string, AddressWithPrivateKey>();

    console.log("Initializing InternalAddressCollection database");

    const records = (await import("@/db/addresses.json")) as AddressWithPrivateKey[];
    for (let i = 0; i < records.length; i++) {
      // Must use traditional for
      await add(records[i]);
    }
  }

  return _data;
}

export async function generate(line1: string, line2: string, recipient: string): Promise<AddressWithPrivateKey> {
  const addrWithPK = generateAddressWithPrivateKey(line1, line2, recipient);
  await add(addrWithPK);
  return addrWithPK;
}

export async function importUnsafe(unsafeData: string): Promise<AddressWithPrivateKey> {
  const addrWithPK = importAddressWithPrivateKey(unsafeData);
  await add(addrWithPK);
  return addrWithPK;
}

export async function add(addrWithPK: AddressWithPrivateKey) {
  (await data()).set(addrWithPK.hashId, addrWithPK);
}

export async function remove(hashId: string) {
  (await data()).delete(hashId);
}

export async function list(): Promise<AddressWithPrivateKey[]> {
  return [...(await data()).values()];
}

export async function has(hashId: string): Promise<boolean> {
  return (await data()).has(hashId);
}

export async function get(hashId: string): Promise<AddressWithPrivateKey | undefined> {
  return (await data()).get(hashId);
}

export async function releaseToPublic(hashId: string) {
  const addr = await get(hashId);
  if (addr === undefined) {
    throw new Error("Address not found");
  }

  await AddressCollection.add(addr);
}

export async function removeFromPublic(hashId: string) {
  await AddressCollection.remove(hashId);
}
