"use server";
import { Commit, CommitDetail, Route, RouteProposal, TransportStep } from "@/chaincode/Models";
import { RouteView } from "@/chaincode/RouteView";
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
  return getAllData(await getContract(), "rp");
}

export async function getProposal(routeUID: string): Promise<RouteProposal | undefined> {
  return getData(await getContract(), "rp", routeUID);
}

export async function listRoute(): Promise<Route[]> {
  return getAllData(await getContract(), "rt");
}

export async function getRoute(routeUID: string): Promise<Route | undefined> {
  return getData(await getContract(), "rt", routeUID);
}

export async function createProposal(route: Route): Promise<RouteProposal> {
  return createRouteProposal(await getContract(), route);
}

export async function removeProposal(routeUID: string): Promise<void> {
  await removeRouteProposal(await getContract(), routeUID);
}

export async function submitProposal(routeUID: string): Promise<Route> {
  return submitRouteProposal(await getContract(), routeUID);
}

export async function signProposalByAddress(route: Route, addressHashId: string) {
  const privateKey = (await InternalAddressCollection.get(addressHashId))?.privateKey;
  if (!privateKey) throw new Error("Address not found");
  const signature = signObject(route, privateKey);
  return signRouteProposal(await getContract(), route.uuid, addressHashId, signature);
}

export async function signProposalByCourier(route: Route, courierId: string) {
  const courier = await InternalCourierCollection.get(courierId);
  if (!courier) throw new Error("Courier not found");
  const signature = signObject(route, courier.privateKey);
  return signRouteProposal(await getContract(), route.uuid, courierId, signature);
}

export async function commitProgress(
  route: Route,
  segmentIndex: number,
  step: TransportStep,
  commitDetail: CommitDetail
): Promise<void> {
  const routeView = new RouteView(route);

  let privateKey: string;
  if (step === "srcOutgoing" || step === "dstIncoming") {
    const addrHashId = routeView.transports[segmentIndex][step].entity.hashId;
    const address = await InternalAddressCollection.get(addrHashId);
    if (!address) throw new Error("Address not found");
    privateKey = address.privateKey;
  } else {
    const courierHashId = routeView.transports[segmentIndex][step].entity.hashId;
    const courier = await InternalCourierCollection.get(courierHashId);
    if (!courier) throw new Error("Courier not found");
    privateKey = courier.privateKey;
  }

  const signature = signObject(commitDetail, privateKey);
  const commit = { detail: commitDetail, signature } satisfies Commit;

  return commitProgressTx(await getContract(), route.uuid, segmentIndex, step, commit);
}
