"use server";
import { Commit, Route, RouteProposal, SignatureHexString, TransportStep } from "@/chaincode/Models";

// any user can do, for rp and rt
export async function list(): Promise<RouteProposal[]> {
  // await smart contract call getAllData for rp and rt, combine and return
  // TODO
  return [];
}

// any user can do, for rp only
export async function createRouteProposal(route: Route): Promise<RouteProposal> {
  // await smart contract call createRouteProposal
  // TODO
  return {} as RouteProposal;
}

// remove a non-submitted proposal
export async function removeRouteProposal(routeUID: string): Promise<void> {
  // await smart contract call removeRouteProposal
  // TODO
}

// submit a complete-signed proposal
export async function submitRouteProposal(routeUID: string): Promise<Route> {
  // await smart contract call submitRouteProposal
  // TODO
  return {} as Route;
}

// if the user is included in the route, for rp only
// sign a proposal
export async function signRouteProposal(
  routeUuid: string,
  entityHashId: string,
  signature: SignatureHexString
): Promise<RouteProposal> {
  // await smart contract call signRouteProposal
  // TODO
  return {} as RouteProposal;
}

// if the user is included in the route, and does not have the commit process yet, for rt only
export async function commitProgress(
  routeUuid: string,
  segmentIndex: number,
  step: TransportStep,
  commit: Commit
): Promise<void> {
  // await smart contract call commitProgress
  // TODO
}
