import { CourierWithPrivateKey } from "./Models";
import * as CourierCollection from "@/internal/CourierCollection";

const _data = new Map<string, CourierWithPrivateKey>();

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

export async function get(
  hashId: string
): Promise<CourierWithPrivateKey | undefined> {
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
