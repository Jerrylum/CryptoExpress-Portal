"use server";

import { Courier } from "@/chaincode/Models";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { CourierWithPrivateKey } from "./Models";

export async function add(arg0: Courier) {
  // TODO
}

export async function remove(arg0: string) {
  // TODO
}

export type CourierQueryingResult = (Courier | CourierWithPrivateKey) & { isPublic: boolean };

export async function list() {
  const publicList: Courier[] = [];
  const publicHashIdList = publicList.map(addr => addr.hashId);
  const internalList = await InternalCourierCollection.list();
  return [
    ...publicList.map(addr => ({ ...addr, isPublic: true })).filter(addr => internalList.find(a => a.hashId === addr.hashId) === undefined),
    ...internalList.map(addr => ({ ...addr, isPublic: publicHashIdList.includes(addr.hashId) }))
  ];
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
