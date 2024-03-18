"use server";

import { Courier } from "@/chaincode/Models";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";

export async function add(arg0: Courier) {
  // TODO
}

export async function remove(arg0: string) {
  // TODO
}

export async function list() {
  return [...(await InternalCourierCollection.list())];
}

export async function search(search: string) {
  if (search === "") {
    return list();
  } else {
    return (await list()).filter(
      courier => courier.company.includes(search) || courier.name.includes(search) || courier.telephone.includes(search)
    );
  }
}
