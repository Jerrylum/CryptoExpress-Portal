import { Contract } from "@hyperledger/fabric-gateway";
import { TextDecoder } from "util";
import { SimpleJSONSerializer } from "@/chaincode/SimpleJSONSerializer";
import { Address, Commit, Courier, Route, TransportStep } from "@/chaincode/Models";

const utf8Decoder = new TextDecoder();

/**
 * Evaluate a transaction to query all data.
 */
export async function getAllData<T>(contract: Contract, prefix: string): Promise<T[]> {
  try {
    console.log(
      "\n--> Evaluate Transaction: GetAllData, function returns all the current assets on the ledger with prefix",
      prefix
    );
    const resultBytes = await contract.evaluateTransaction("getAllData", SimpleJSONSerializer.serialize(prefix));

    return SimpleJSONSerializer.deserialize(resultBytes);
  } catch (error) {
    console.error("Failed to evaluate transaction:", error);
    throw new Error("Failed to get all assets");
  }
}

/**
 * Evaluate a transaction to query specific data based on prefix and uuid.
 */
export async function getData<T>(contract: Contract, prefix: string, uuid: string): Promise<T> {
  try {
    console.log(`\n--> Evaluate Transaction: GetData, function returns the data for prefix ${prefix} and uuid ${uuid}`);

    const resultBytes = await contract.evaluateTransaction(
      "getData",
      SimpleJSONSerializer.serialize(prefix),
      SimpleJSONSerializer.serialize(uuid)
    );

    return SimpleJSONSerializer.deserialize(resultBytes);
  } catch (error) {
    console.error("Failed to evaluate transaction:", error);
    throw new Error(`Failed to get data for prefix ${prefix} and uuid ${uuid}`);
  }
}

/**
 * Submit a transaction to create an address.
 */
export async function releaseAddress(contract: Contract, address: Address): Promise<void> {
  try {
    // Assuming the logic to create an address object, like createHashId`Object, has already been applied before calling this function
    console.log(`\n--> Submit Transaction: releaseAddress, creating address with hashId ${address.hashId}`);

    // Submit the transaction, assuming the address has been correctly serialized to match the smart contract's expectations
    await contract.submitTransaction("releaseAddress", SimpleJSONSerializer.serialize(address));

    console.log("*** Address created successfully");
  } catch (error) {
    console.error("Failed to submit transaction:", error);
    // Throw the error for the caller to handle
    throw new Error(`Failed to create address: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Submit a transaction to remove an address.
 */
export async function removeAddress(contract: Contract, hashId: string): Promise<void> {
  try {
    // Log the action of submitting a transaction for removing an address
    console.log(`\n--> Submit Transaction: removeAddress, removing address with hashId ${hashId}`);

    // Call the removeAddress function on the smart contract
    await contract.submitTransaction("removeAddress", SimpleJSONSerializer.serialize(hashId));

    // Log success message
    console.log(`*** Address with hashId ${hashId} removed successfully`);
  } catch (error) {
    // Log error and rethrow for caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to remove address: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Submit a transaction to create a courier.
 */
export async function releaseCourier(contract: Contract, courier: Courier): Promise<void> {
  try {
    // Log the received courier object for verification
    console.log(courier);

    // Log the action of submitting a transaction for creating a courier
    console.log(`\n--> Submit Transaction: releaseCourier, creating courier with hashId ${courier.hashId}`);

    // Call the releaseCourier function on the smart contract
    // Assuming courier object is properly structured for serialization
    await contract.submitTransaction("releaseCourier", SimpleJSONSerializer.serialize(courier));

    // Log the success message
    console.log("*** Courier created successfully");
  } catch (error) {
    // Log the error and rethrow for caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to create courier: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Submit a transaction to remove an courier.
 */
export async function removeCourier(contract: Contract, hashId: string): Promise<void> {
  try {
    // Log the action of submitting a transaction for removing a courier
    console.log(`\n--> Submit Transaction: removeCourier, removing courier with hashId ${hashId}`);

    // Call the removeCourier function on the smart contract
    await contract.submitTransaction("removeCourier", SimpleJSONSerializer.serialize(hashId));

    // Log and return the success message
    const successMessage = `*** Courier with hashId ${hashId} removed successfully`;
    console.log(successMessage);
  } catch (error) {
    console.error("Failed to submit transaction:", error);
    // Throw an error with specific message if the courier does not exist,
    // or a general error message for other errors
    throw new Error(`Failed to remove courier: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Submit a transaction to create a route proposal.
 */
export async function createRouteProposal(contract: Contract, routeProposal: Route): Promise<void> {
  try {
    // Logging the routeProposal object for debugging purposes
    console.log(routeProposal);

    // Log the action of submitting a transaction for creating a route proposal
    console.log(
      `\n--> Submit Transaction: createRouteProposal, creating route proposal with uuid ${routeProposal.uuid}`
    );

    // Submitting the transaction to the smart contract
    // Ensure the routeProposal object is correctly structured for serialization
    await contract.submitTransaction("createRouteProposal", SimpleJSONSerializer.serialize(routeProposal));

    // Log the success message
    console.log("*** Route proposal created successfully");
  } catch (error) {
    // Log the error and rethrow for the caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to create route proposal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function removeRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
  try {
    // Logging the action
    console.log(`\n--> Submit Transaction: removeRouteProposal, removing route proposal with UUID ${routeUuid}`);

    // Submitting the transaction to the smart contract
    await contract.submitTransaction("removeRouteProposal", SimpleJSONSerializer.serialize(routeUuid));

    // Log the success message
    console.log(`*** Route proposal with UUID ${routeUuid} removed successfully`);
  } catch (error) {
    // Log the error and rethrow for the caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to remove route proposal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function signRouteProposal(
  contract: Contract,
  routeUuid: string,
  entityHashId: string,
  signature: string
): Promise<void> {
  try {
    // Logging the action of submitting a transaction for signing a route proposal
    console.log(
      `\n--> Submit Transaction: signRouteProposal, signing route proposal with UUID ${routeUuid} by entity ${entityHashId}`
    );

    // Submitting the transaction to the smart contract
    const signedRouteProposal = await contract.submitTransaction(
      "signRouteProposal",
      SimpleJSONSerializer.serialize(routeUuid),
      SimpleJSONSerializer.serialize(entityHashId),
      SimpleJSONSerializer.serialize(signature)
    );

    // Assuming the smart contract returns the updated route proposal object,
    // we decode and parse it to log some information.
    // Note: Adjust the serialization and parsing according to your contract's actual return type and format.
    const signedRouteProposalObject = JSON.parse(Buffer.from(signedRouteProposal).toString());
    console.log(`*** Route proposal with UUID ${routeUuid} signed successfully by entity ${entityHashId}`);
    console.log("Updated route proposal:", signedRouteProposalObject);
  } catch (error) {
    // Log the error and rethrow for the caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to sign route proposal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function submitRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
  try {
    // Logging the action of submitting a transaction for submitting a route proposal
    console.log(`\n--> Submit Transaction: submitRouteProposal, submitting route proposal with UUID ${routeUuid}`);

    // Submitting the transaction to the smart contract
    const submittedRoute = await contract.submitTransaction(
      "submitRouteProposal",
      SimpleJSONSerializer.serialize(routeUuid)
    );

    // Assuming the smart contract returns the submitted route object,
    // we decode and parse it to log some information.
    // Note: Adjust the serialization and parsing according to your contract's actual return type and format.
    const submittedRouteObject = JSON.parse(Buffer.from(submittedRoute).toString());
    console.log(`*** Route proposal with UUID ${routeUuid} submitted successfully`);
    console.log("Submitted route:", submittedRouteObject);
  } catch (error) {
    // Log the error and rethrow for the caller to handle
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to submit route proposal: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function commitProgress(
  contract: Contract,
  routeUuid: string,
  segmentIndex: number,
  step: TransportStep,
  commit: Commit
): Promise<void> {
  try {
    console.log(`\n--> Submit Transaction: commitProgress, committing progress for route UUID ${routeUuid}`);

    const serializedUuid = SimpleJSONSerializer.serialize(routeUuid);
    const serializedIndex = SimpleJSONSerializer.serialize(segmentIndex);
    const serializedStep = SimpleJSONSerializer.serialize(step);
    const serializedCommit = SimpleJSONSerializer.serialize(commit);

    await contract.submitTransaction(
      "commitProgress",
      serializedUuid,
      serializedIndex,
      serializedStep,
      serializedCommit
    );

    console.log(
      `*** Progress committed successfully for route UUID ${routeUuid}, segment index ${segmentIndex}, step ${step}`
    );
    console.log(commit);
  } catch (error) {
    console.error("Failed to submit transaction:", error);
    throw new Error(`Failed to commit progress: ${error instanceof Error ? error.message : String(error)}`);
  }
}
