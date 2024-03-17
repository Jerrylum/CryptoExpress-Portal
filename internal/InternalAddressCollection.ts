import { AddressWithPrivateKey } from "./Models";

const _data = new Map<string, AddressWithPrivateKey>();

export async function generate(line1: string, line2: string, recipient: string): Promise<AddressWithPrivateKey> {
  const addrWithPK = AddressWithPrivateKey.generate(line1, line2, recipient);
  await add(addrWithPK);
  return addrWithPK;
}

export async function importUnsafe(unsafeData: string): Promise<AddressWithPrivateKey> {
  const addrWithPK = AddressWithPrivateKey.import(unsafeData);
  await add(addrWithPK);
  return addrWithPK;
}

export async function add(addrWithPK: AddressWithPrivateKey) {
  _data.set(addrWithPK.hashId, addrWithPK);
}

export async function remove(hashId: string) {
  _data.delete(hashId);
}

export async function list(): Promise<AddressWithPrivateKey[]> {
  return [..._data.values()];
}

export async function has(hashId: string): Promise<boolean> {
  return _data.has(hashId);
}

export async function get(hashId: string): Promise<AddressWithPrivateKey | undefined> {
  return _data.get(hashId);
}

export async function releaseToPublic(hashId: string) {
  const addr = await get(hashId);
  if (addr === undefined) {
    throw new Error("Address not found");
  }

  await add(addr);
}

export async function removeFromPublic(hashId: string) {
  await remove(hashId);
}

let initial = false;

export async function init() {
  if (initial) {
    return;
  }
  initial = true;

  console.log("Initializing InternalGoodCollection database");

  type AddressWithPrivateKeyData = Omit<AddressWithPrivateKey, "export" | "toAddress">;
  const records = (await import("@/db/addresses.json")) as AddressWithPrivateKeyData[];
  for (let i = 0; i < records.length; i++) {
    // Must use traditional for
    await add(
      new AddressWithPrivateKey(
        records[i].hashId,
        records[i].line1,
        records[i].line2,
        records[i].recipient,
        records[i].publicKey,
        records[i].privateKey
      )
    );
  }
}
