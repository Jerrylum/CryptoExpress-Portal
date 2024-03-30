"use server";
import { Commit, Route, RouteProposal, SignatureHexString, TransportStep } from "@/chaincode/Models";
import { getContract } from "@/gateway/Gateway";
import {
  getAllData,
  createRouteProposal,
  removeRouteProposal,
  submitRouteProposal,
  signRouteProposal,
  commitProgress as commitProgressTx
} from "@/gateway/Transactions";

export async function listRouteProposal(): Promise<RouteProposal[]> {
  // await smart contract call getAllData for rp and rt, combine and return
  return await getAllData(await getContract(), "rp");
}

export async function listSubmittedRoute(): Promise<Route[]> {
  return await getAllData(await getContract(), "rt");
}

export async function createProposal(route: Route): Promise<RouteProposal> {
  // await smart contract call createRouteProposal
  return await createRouteProposal(await getContract(), route);
}

// remove a non-submitted proposal
export async function removeProposal(routeUID: string): Promise<void> {
  // await smart contract call removeRouteProposal
  await removeRouteProposal(await getContract(), routeUID);
}

// submit a complete-signed proposal
export async function submitProposal(routeUID: string): Promise<void> {
  // await smart contract call submitRouteProposal
  return await submitRouteProposal(await getContract(), routeUID);
}

// sign a proposal
export async function signProposal(
  routeUuid: string,
  entityHashId: string,
  signature: SignatureHexString
): Promise<void> {
  // await smart contract call signRouteProposal
  return await signRouteProposal(await getContract(), routeUuid, entityHashId, signature);
}

export async function commitProgress(
  routeUuid: string,
  segmentIndex: number,
  step: TransportStep,
  commit: Commit
): Promise<void> {
  // await smart contract call commitProgress
  await commitProgressTx(await getContract(), routeUuid, segmentIndex, step, commit);
}
