"use server";

import { Courier } from "@/chaincode/Models";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { CourierWithPrivateKey, fromAnyToCourierObject } from "./Models";
import { getAllData, releaseCourier, removeCourier } from "@/gateway/Transactions";
import { getContract } from "@/gateway/Gateway";
import { combinePublicPrivateList } from "./Utils";

export async function add(courier: Courier) {
  await releaseCourier(await getContract(), fromAnyToCourierObject(courier));
}

export async function remove(hashId: string) {
  await removeCourier(await getContract(), hashId);
}

export type CourierQueryingResult = (Courier | CourierWithPrivateKey) & { isPublic: boolean };

export async function list(): Promise<CourierQueryingResult[]>{
  const publicList = await getAllData(await getContract(), "cr");
  const internalList = await InternalCourierCollection.list();
  return combinePublicPrivateList(publicList, internalList);
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
