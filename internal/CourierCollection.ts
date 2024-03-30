"use server";

import { Courier } from "@/chaincode/Models";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { CourierWithPrivateKey, fromAnyToCourierObject } from "./Models";
import { releaseCourier, removeCourier } from "@/gateway/Transactions";
import { getContract } from "@/gateway/Gateway";

export async function add(courier: Courier) {
  await releaseCourier(await getContract(), fromAnyToCourierObject(courier));
}

export async function remove(hashId: string) {
  await removeCourier(await getContract(), hashId);
}

export type CourierQueryingResult = (Courier | CourierWithPrivateKey) & { isPublic: boolean };

export async function list() {
  const publicList: Courier[] = [];
  const publicHashIdList = publicList.map(addr => addr.hashId);
  const internalList = await InternalCourierCollection.list();
  return [
    ...publicList
      .map(addr => ({ ...addr, isPublic: true }))
      .filter(addr => internalList.find(a => a.hashId === addr.hashId) === undefined),
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
