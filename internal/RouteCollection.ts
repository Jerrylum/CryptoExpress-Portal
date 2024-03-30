"use server";
import { Commit, Route, RouteProposal, TransportStep } from "@/chaincode/Models";
import { signObject } from "@/chaincode/Utils";
import { getContract } from "@/gateway/Gateway";
import {
  getAllData,
  createRouteProposal,
  removeRouteProposal,
  submitRouteProposal,
  signRouteProposal,
  commitProgress as commitProgressTx,
  getData
} from "@/gateway/Transactions";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";

export async function listProposal(): Promise<RouteProposal[]> {
  return await getAllData(await getContract(), "rp");
}

export async function getProposal(routeUID: string): Promise<RouteProposal> {
  return await getData(await getContract(), "rp", routeUID);
}

export async function listRoute(): Promise<Route[]> {
  return await getAllData(await getContract(), "rt");
}

export async function getRoute(routeUID: string): Promise<Route> {
  return await getData(await getContract(), "rt", routeUID);
}

export async function createProposal(route: Route): Promise<RouteProposal> {
  return await createRouteProposal(await getContract(), route);
}

export async function removeProposal(routeUID: string): Promise<void> {
  await removeRouteProposal(await getContract(), routeUID);
}

export async function submitProposal(routeUID: string): Promise<Route> {
  return await submitRouteProposal(await getContract(), routeUID);
}

export async function signProposalByAddress(route: Route, addressHashId: string) {
  const privateKey = (await InternalAddressCollection.get(addressHashId))?.privateKey;
  if (!privateKey) throw new Error("Address not found");
  const signature = signObject(route, privateKey);
  return await signRouteProposal(await getContract(), route.uuid, addressHashId, signature);
}

export async function signProposalByCourier(route: Route, courierId: string) {
  const courier = await InternalCourierCollection.get(courierId);
  if (!courier) throw new Error("Courier not found");
  const signature = signObject(route, courier.privateKey);
  return await signRouteProposal(await getContract(), route.uuid, courierId, signature);
}

export async function commitProgress(
  routeUuid: string,
  segmentIndex: number,
  step: TransportStep,
  commit: Commit
): Promise<void> {
  await commitProgressTx(await getContract(), routeUuid, segmentIndex, step, commit);
}
