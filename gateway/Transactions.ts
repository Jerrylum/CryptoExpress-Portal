import { Contract } from "@hyperledger/fabric-gateway";
import { SimpleJSONSerializer } from "@/chaincode/SimpleJSONSerializer";
import { Address, Commit, Courier, Route, TransportStep, RouteProposal, ModelPrefix, ModelTypeMap } from "@/chaincode/Models";

async function evaluateTransaction<T>(contract: Contract, name: string, ...args: ({} | null)[]): Promise<T> {
  try {
    console.log(`\n--> Evaluate Transaction: ${name} with args ${args}`);

    const argBuffers = args.map(arg => SimpleJSONSerializer.serialize(arg));
    const resultBytes = await contract.evaluateTransaction(name, ...argBuffers);

    if (resultBytes.length === 0) {
      return undefined as unknown as T;
    } else {
      return SimpleJSONSerializer.deserialize(resultBytes);
    }
  } catch (error) {
    console.error("Failed to evaluate transaction:", error);
    throw error;
  }
}

async function submitTransaction<T>(contract: Contract, name: string, ...args: ({} | null)[]): Promise<T>;
async function submitTransaction(contract: Contract, name: string, ...args: ({} | null)[]): Promise<void>;
async function submitTransaction<T>(contract: Contract, name: string, ...args: ({} | null)[]): Promise<T | void> {
  try {
    console.log(`\n--> Submit Transaction: ${name} with args ${args}`);

    const argBuffers = args.map(arg => SimpleJSONSerializer.serialize(arg));
    const resultBytes = await contract.submitTransaction(name, ...argBuffers);

    console.log(`*** Transaction ${name} submitted successfully`);

    if (resultBytes.length === 0) {
      return;
    } else {
      return SimpleJSONSerializer.deserialize(resultBytes);
    }
  } catch (error) {
    console.error("Failed to submit transaction:", error);
    throw error;
  }
}

/**
 * Evaluate a transaction to query all data.
 */
export async function getAllData<T extends ModelPrefix>(contract: Contract, prefix: T): Promise<ModelTypeMap[T][]> {
  return evaluateTransaction(contract, "getAllData", prefix);
}

/**
 * Evaluate a transaction to query specific data based on prefix and uuid.
 */
export async function getData<T extends ModelPrefix>(contract: Contract, prefix: string, uuid: string): Promise<ModelTypeMap[T]> {
  return evaluateTransaction(contract, "getData", prefix, uuid);
}

/**
 * Submit a transaction to create an address.
 */
export async function releaseAddress(contract: Contract, address: Address): Promise<void> {
  return submitTransaction(contract, "releaseAddress", address);
}

/**
 * Submit a transaction to remove an address.
 */
export async function removeAddress(contract: Contract, hashId: string): Promise<void> {
  return submitTransaction(contract, "removeAddress", hashId);
}

/**
 * Submit a transaction to create a courier.
 */
export async function releaseCourier(contract: Contract, courier: Courier): Promise<void> {
  return submitTransaction(contract, "releaseCourier", courier);
}

/**
 * Submit a transaction to remove an courier.
 */
export async function removeCourier(contract: Contract, hashId: string): Promise<void> {
  return submitTransaction(contract, "removeCourier", hashId);
}

/**
 * Submit a transaction to create a route proposal.
 */
export async function createRouteProposal(contract: Contract, routeProposal: Route): Promise<RouteProposal> {
  return submitTransaction(contract, "createRouteProposal", routeProposal);
}

/**
 * Submit a transaction to remove a route proposal.
 */
export async function removeRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
  return submitTransaction(contract, "removeRouteProposal", routeUuid);
}

export async function signRouteProposal(
  contract: Contract,
  routeUuid: string,
  entityHashId: string,
  signature: string
): Promise<void> {
  return submitTransaction(contract, "signRouteProposal", routeUuid, entityHashId, signature);
}

export async function submitRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
  return submitTransaction(contract, "submitRouteProposal", routeUuid);
}

export async function commitProgress(
  contract: Contract,
  routeUuid: string,
  segmentIndex: number,
  step: TransportStep,
  commit: Commit
): Promise<void> {
  return submitTransaction(contract, "commitProgress", routeUuid, segmentIndex, step, commit);
}
