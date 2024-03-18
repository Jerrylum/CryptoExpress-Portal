"use server";

import { Good } from "@/chaincode/Models";

// const (await data()) = new Map<string, Good>();

let _data: Map<string, Good>;

async function data() {
  if (_data === undefined) {
    _data = new Map<string, Good>();

    console.log("Initializing InternalGoodCollection database");

    const records = (await import("@/db/goods.json")) as Good[];
    for (let i = 0; i < records.length; i++) {
      // Must use traditional for
      await set(records[i]);
    }
  }

  return _data;
}

export async function set(good: Good) {
  (await data()).set(good.uuid, good);
}

export async function remove(uuid: string) {
  (await data()).delete(uuid);
}

export async function list() {
  return [...(await data()).values()];
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
  return (await data()).has(uuid);
}

export async function get(uuid: string) {
  return (await data()).get(uuid);
}

let initial = false;

export async function init() {
  if (initial) {
    return;
  }
  initial = true;

  console.log("Initializing InternalGoodCollection database");

  const records = (await import("@/db/goods.json")) as Good[];
  for (let i = 0; i < records.length; i++) {
    // Must use traditional for
    await set(records[i]);
  }
}
