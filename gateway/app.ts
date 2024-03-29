/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { SimpleJSONSerializer } from '@/chaincode/SimpleJSONSerializer';
import { Address, Commit, Courier, Route, RouteProposal, Transport, TransportStep } from "@/chaincode/Models";
import { createHashIdObject, exportPrivateKey, exportPublicKey, generateKeyPair, signObject } from "@/chaincode/Utils";


const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate.
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();
const assetId = `asset${Date.now()}`;

let contract: Contract;


/**
 * Evaluate a transaction to query all data.
 */
async function getAllData(contract: Contract, prefix: string): Promise<void>  {
    try {
        console.log('\n--> Evaluate Transaction: GetAllData, function returns all the current assets on the ledger with prefix', prefix);
        const resultBytes = await contract.evaluateTransaction('getAllData', SimpleJSONSerializer.serialize(prefix));
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log('*** Result:', result);
    } catch (error) {
        console.error('Failed to evaluate transaction:', error);
        throw new Error('Failed to get all assets'); 
    }
}

/**
 * Evaluate a transaction to query specific data based on prefix and uuid.
 */
async function getData(contract: Contract, prefix: string, uuid: string): Promise<void> {
    try {
        console.log(`\n--> Evaluate Transaction: GetData, function returns the data for prefix ${prefix} and uuid ${uuid}`);
        
        const resultBytes = await contract.evaluateTransaction('getData', SimpleJSONSerializer.serialize(prefix), SimpleJSONSerializer.serialize(uuid));
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        
        console.log('*** Result:', result);

        if(result) {
            return result;
        } else {
            throw new Error(`Data not found for prefix ${prefix} and uuid ${uuid}`);
        }
    } catch (error) {
        console.error('Failed to evaluate transaction:', error);
        // Throw the exception
        throw new Error(`Failed to get data for prefix ${prefix} and uuid ${uuid}`);
    }
}

/**
 * Submit a transaction to create an address.
 */
async function releaseAddress(contract: Contract, address: Address): Promise<void> {
    try {
        // Assuming the logic to create an address object, like createHashIdObject, has already been applied before calling this function
        console.log(`\n--> Submit Transaction: releaseAddress, creating address with hashId ${address.hashId}`);

        // Submit the transaction, assuming the address has been correctly serialized to match the smart contract's expectations
        await contract.submitTransaction('releaseAddress', SimpleJSONSerializer.serialize(address));
        
        console.log('*** Address created successfully');

    } catch (error) {
        console.error('Failed to submit transaction:', error);
        // Throw the error for the caller to handle
        throw new Error(`Failed to create address: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Submit a transaction to remove an address.
 */
async function removeAddress(contract: Contract, hashId: string): Promise<void> {
    try {
        // Log the action of submitting a transaction for removing an address
        console.log(`\n--> Submit Transaction: removeAddress, removing address with hashId ${hashId}`);

        // Call the removeAddress function on the smart contract
        await contract.submitTransaction('removeAddress', SimpleJSONSerializer.serialize(hashId));
        
        // Log success message
        console.log(`*** Address with hashId ${hashId} removed successfully`);

    } catch (error) {
        // Log error and rethrow for caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to remove address: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Submit a transaction to create a courier.
 */
async function releaseCourier(contract: Contract, courier: Courier): Promise<void> {
    try {
        // Log the received courier object for verification
        console.log(courier);

        // Log the action of submitting a transaction for creating a courier
        console.log(`\n--> Submit Transaction: releaseCourier, creating courier with hashId ${courier.hashId}`);

        // Call the releaseCourier function on the smart contract
        // Assuming courier object is properly structured for serialization
        await contract.submitTransaction('releaseCourier', SimpleJSONSerializer.serialize(courier));
        
        // Log the success message
        console.log('*** Courier created successfully');

    } catch (error) {
        // Log the error and rethrow for caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to create courier: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Submit a transaction to remove an courier.
 */
async function removeCourier(contract: Contract, hashId: string): Promise<void> {
    try {
        // Log the action of submitting a transaction for removing a courier
        console.log(`\n--> Submit Transaction: removeCourier, removing courier with hashId ${hashId}`);

        // Call the removeCourier function on the smart contract
        await contract.submitTransaction('removeCourier', SimpleJSONSerializer.serialize(hashId));
        
        // Log and return the success message
        const successMessage = `*** Courier with hashId ${hashId} removed successfully`;
        console.log(successMessage);

    } catch (error) {
        console.error('Failed to submit transaction:', error);
        // Throw an error with specific message if the courier does not exist,
        // or a general error message for other errors
        throw new Error(`Failed to remove courier: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Submit a transaction to create a route proposal.
 */
async function createRouteProposal(contract: Contract, routeProposal: Route): Promise<void> {
    try {
        // Logging the routeProposal object for debugging purposes
        console.log(routeProposal);

        // Log the action of submitting a transaction for creating a route proposal
        console.log(`\n--> Submit Transaction: createRouteProposal, creating route proposal with uuid ${routeProposal.uuid}`);

        // Submitting the transaction to the smart contract
        // Ensure the routeProposal object is correctly structured for serialization
        await contract.submitTransaction('createRouteProposal', SimpleJSONSerializer.serialize(routeProposal));

        // Log the success message
        console.log('*** Route proposal created successfully');

    } catch (error) {
        // Log the error and rethrow for the caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to create route proposal: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function removeRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
    try {
        // Logging the action
        console.log(`\n--> Submit Transaction: removeRouteProposal, removing route proposal with UUID ${routeUuid}`);

        // Submitting the transaction to the smart contract
        await contract.submitTransaction('removeRouteProposal', SimpleJSONSerializer.serialize(routeUuid));
        
        // Log the success message
        console.log(`*** Route proposal with UUID ${routeUuid} removed successfully`);

    } catch (error) {
        // Log the error and rethrow for the caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to remove route proposal: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function signRouteProposal(contract: Contract, routeUuid: string, entityHashId: string, signature: string): Promise<void> {
    try {
        // Logging the action of submitting a transaction for signing a route proposal
        console.log(`\n--> Submit Transaction: signRouteProposal, signing route proposal with UUID ${routeUuid} by entity ${entityHashId}`);

        // Submitting the transaction to the smart contract
        const signedRouteProposal = await contract.submitTransaction('signRouteProposal', SimpleJSONSerializer.serialize(routeUuid), SimpleJSONSerializer.serialize(entityHashId), SimpleJSONSerializer.serialize(signature));
        
        // Assuming the smart contract returns the updated route proposal object,
        // we decode and parse it to log some information.
        // Note: Adjust the serialization and parsing according to your contract's actual return type and format.
        const signedRouteProposalObject = JSON.parse(Buffer.from(signedRouteProposal).toString());
        console.log(`*** Route proposal with UUID ${routeUuid} signed successfully by entity ${entityHashId}`);
        console.log('Updated route proposal:', signedRouteProposalObject);

    } catch (error) {
        // Log the error and rethrow for the caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to sign route proposal: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function submitRouteProposal(contract: Contract, routeUuid: string): Promise<void> {
    try {
        // Logging the action of submitting a transaction for submitting a route proposal
        console.log(`\n--> Submit Transaction: submitRouteProposal, submitting route proposal with UUID ${routeUuid}`);

        // Submitting the transaction to the smart contract
        const submittedRoute = await contract.submitTransaction('submitRouteProposal', SimpleJSONSerializer.serialize(routeUuid));
        
        // Assuming the smart contract returns the submitted route object,
        // we decode and parse it to log some information.
        // Note: Adjust the serialization and parsing according to your contract's actual return type and format.
        const submittedRouteObject = JSON.parse(Buffer.from(submittedRoute).toString());
        console.log(`*** Route proposal with UUID ${routeUuid} submitted successfully`);
        console.log('Submitted route:', submittedRouteObject);

    } catch (error) {
        // Log the error and rethrow for the caller to handle
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to submit route proposal: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function commitProgress(
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

        await contract.submitTransaction('commitProgress', serializedUuid, serializedIndex, serializedStep, serializedCommit);
        
        console.log(`*** Progress committed successfully for route UUID ${routeUuid}, segment index ${segmentIndex}, step ${step}`);
        console.log(commit);

    } catch (error) {
        console.error('Failed to submit transaction:', error);
        throw new Error(`Failed to commit progress: ${error instanceof Error ? error.message : String(error)}`);
    }
}


async function testAPI() : Promise<void> {
    let address: Address = createHashIdObject({
        line1: "Example Line 1",
        line2: "Example Line 2",
        recipient: "John Doe",
        publicKey: exportPublicKey(generateKeyPair().publicKey)
      });

    let courier_tmp: Courier = createHashIdObject({
        name: "my name",
        company: "my company",
        telephone: "my telephone",
        publicKey: exportPublicKey(generateKeyPair().publicKey)
      });

    console.log(address);
    await releaseAddress(contract, address);
    await getAllData(contract, 'ad');
    await removeAddress(contract, address.hashId);
    await getAllData(contract, 'ad');
    await releaseCourier(contract, courier_tmp);
    await getAllData(contract, 'cr');
    await getData(contract, 'cr', courier_tmp.hashId);
    await removeCourier(contract, courier_tmp.hashId);
    await getAllData(contract, 'cr');

    const uuid = "550e8400e29b41d4a716446655440000";
    const good1 = { uuid: "uuid000000000001", name: "name1", barcode: "barcode1" };
    const good2 = { uuid: "uuid000000000002", name: "name2", barcode: "barcode2" };

    const keyPairA = generateKeyPair();
    const addrA: Address = createHashIdObject({
      line1: "my line1 A",
      line2: "my line2 A",
      recipient: "my recipient A",
      publicKey: exportPublicKey(keyPairA.publicKey)
    });

    const keyPairB = generateKeyPair();
    const addrB: Address = createHashIdObject({
      line1: "my line1 B",
      line2: "my line2 B",
      recipient: "my recipient B",
      publicKey: exportPublicKey(keyPairB.publicKey)
    });

    const keyPairC = generateKeyPair();

    const courier: Courier = createHashIdObject({
      name: "my name",
      company: "my company",
      telephone: "my telephone",
      publicKey: exportPublicKey(keyPairC.publicKey)
    });

    const route = {
      uuid,
      goods: { [good1.uuid]: good1, [good2.uuid]: good2 },
      addresses: { [addrA.hashId]: addrA, [addrB.hashId]: addrB },
      couriers: { [courier.hashId]: courier },
      source: {
        address: addrA.hashId,
        expectedArrivalTimestamp: 0,
        input: {},
        output: { [good1.uuid]: 1, [good2.uuid]: 1 },
        next: {
          courier: courier.hashId,
          info: "info",
          destination: {
            address: addrB.hashId,
            expectedArrivalTimestamp: 10,
            input: { [good1.uuid]: 1, [good2.uuid]: 1 },
            output: {}
            // next: undefined
          }
        }
      },
      commits: [{}]
    } as Route;

    const commit: Commit = {
        detail: {
            delta: { [good1.uuid]: 1 },
            info: "info",
            timestamp: 0
        },
        signature: "random invalid signature"
    };
    
    commit.detail.timestamp = Date.now() / 1000;
    commit.signature = signObject(commit.detail, exportPrivateKey(keyPairA.privateKey));
    
    await createRouteProposal(contract, route);

    await getAllData(contract, 'rp');

    // Sign
    const signA = signObject(route, exportPrivateKey(keyPairA.privateKey));
    const signB = signObject(route, exportPrivateKey(keyPairB.privateKey));
    const signC = signObject(route, exportPrivateKey(keyPairC.privateKey));

    await signRouteProposal(contract, route.uuid, addrA.hashId, signA);
    await signRouteProposal(contract, route.uuid, addrB.hashId, signB);
    await signRouteProposal(contract, route.uuid, courier.hashId, signC);

    await submitRouteProposal(contract, route.uuid);

    await commitProgress(contract, route.uuid, 0, "srcOutgoing", commit);
    
    await getAllData(contract, 'rp');
    await getAllData(contract, 'rt');
}

async function main(): Promise<void> {

    await displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        contract = network.getContract(chaincodeName);

        await testAPI();

    } finally {
        gateway.close();
        client.close();
    }
}

main().catch(error => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certPath:          ${certPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}