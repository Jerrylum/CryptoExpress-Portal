"use server";

import { Good } from "@/chaincode/Models";
import { readCSV } from "./API";

const _data = new Map<string, Good>();

export async function set(good: Good) {
  _data.set(good.uuid, good);
}

export async function remove(uuid: string) {
  _data.delete(uuid);
}

export async function list() {
  return [..._data.values()];
}

export async function search(search: string) {
  if (search === "") {
    return list();
  } else {
    return (await list()).filter(
      good => good.uuid.includes(search) || good.name.includes(search) || good.barcode.includes(search)
    );
  }
}

export async function has(uuid: string) {
  return _data.has(uuid);
}

export async function get(uuid: string) {
  return _data.get(uuid);
}

let initial = false;

export async function init() {
  if (initial) {
    return;
  }
  initial = true;

  console.log("Initializing InternalGoodCollection database");

  const records = await readCSV<Good>("db/goods.csv");
  for (const record of records) {
    await set(record);
  }
}
