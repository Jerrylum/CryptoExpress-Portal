import { CourierWithPrivateKey } from "./Models";
import * as CourierCollection from "@/internal/CourierCollection";

const _data = new Map<string, CourierWithPrivateKey>();

export async function generate(name: string, company: string, telephone: string): Promise<CourierWithPrivateKey> {
  const courierWithPK = CourierWithPrivateKey.generate(name, company, telephone);
  await add(courierWithPK);
  return courierWithPK;
}

export async function importUnsafe(unsafeData: string): Promise<CourierWithPrivateKey> {
  const courierWithPK = CourierWithPrivateKey.import(unsafeData);
  await add(courierWithPK);
  return courierWithPK;
}

export async function add(courierWithPK: CourierWithPrivateKey) {
  _data.set(courierWithPK.hashId, courierWithPK);
}

export async function remove(hashId: string) {
  _data.delete(hashId);
}

export async function list(): Promise<CourierWithPrivateKey[]> {
  return [..._data.values()];
}

export async function has(hashId: string): Promise<boolean> {
  return _data.has(hashId);
}

export async function get(hashId: string): Promise<CourierWithPrivateKey | undefined> {
  return _data.get(hashId);
}

export async function releaseToPublic(hashId: string) {
  const courier = await get(hashId);
  if (courier === undefined) {
    throw new Error("Courier not found");
  }

  await CourierCollection.add(courier.toCourier());
}

export async function removeFromPublic(hashId: string) {
  await CourierCollection.remove(hashId);
}

let initial = false;

export async function init() {
  if (initial) {
    return;
  }
  initial = true;

  console.log("Initializing InternalCourierCollection database");

  type CourierWithPrivateKeyData = Omit<CourierWithPrivateKey, "export" | "toCourier">;
  const records = (await import("@/db/couriers.json")) as CourierWithPrivateKeyData[];
  for (let i = 0; i < records.length; i++) {
    // Must use traditional for
    await add(
      new CourierWithPrivateKey(
        records[i].hashId,
        records[1].name,
        records[i].company,
        records[i].telephone,
        records[i].publicKey,
        records[i].privateKey
      )
    );
  }
}
