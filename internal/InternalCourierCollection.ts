"use server";

import { CourierWithPrivateKey, generateCourierWithPrivateKey, importCourierWithPrivateKey } from "./Models";
import * as CourierCollection from "@/internal/CourierCollection";

let _data: Map<string, CourierWithPrivateKey>;

async function data() {
  if (_data === undefined) {
    _data = new Map<string, CourierWithPrivateKey>();

    console.log("Initializing InternalCourierCollection database");

    const records = (await import("@/db/couriers.json")) as CourierWithPrivateKey[];
    for (let i = 0; i < records.length; i++) {
      // Must use traditional for
      await add(records[i]);
    }
  }

  return _data;
}

export async function generate(name: string, company: string, telephone: string): Promise<CourierWithPrivateKey> {
  const courierWithPK = generateCourierWithPrivateKey(name, company, telephone);
  await add(courierWithPK);
  return courierWithPK;
}

export async function importUnsafe(unsafeData: string): Promise<CourierWithPrivateKey> {
  const courierWithPK = importCourierWithPrivateKey(unsafeData);
  await add(courierWithPK);
  return courierWithPK;
}

export async function add(courierWithPK: CourierWithPrivateKey) {
  (await data()).set(courierWithPK.hashId, courierWithPK);
}

export async function remove(hashId: string) {
  (await data()).delete(hashId);
}

export async function list(): Promise<CourierWithPrivateKey[]> {
  return [...(await data()).values()];
}

export async function has(hashId: string): Promise<boolean> {
  return (await data()).has(hashId);
}

export async function get(hashId: string): Promise<CourierWithPrivateKey | undefined> {
  return (await data()).get(hashId);
}

export async function releaseToPublic(hashId: string) {
  const courier = await get(hashId);
  if (courier === undefined) {
    throw new Error("Courier not found");
  }

  await add(courier);
}

export async function removeFromPublic(hashId: string) {
  await remove(hashId);
}
