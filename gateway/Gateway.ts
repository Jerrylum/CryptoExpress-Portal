import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';


const channelName = process.env.CHANNEL_NAME || "";
const chaincodeName = process.env.CHAINCODE_NAME || "";
const mspId = process.env.MSP_ID || "";

// Path to crypto materials.
const cryptoPath = process.env.CRYPTO_PATH || "";

// Path to user private key directory.
const keyDirectoryPath = process.env.KEY_DIRECTORY_PATH || "";

// Path to user certificate.
const certPath = process.env.CERT_PATH || "";

// Path to peer tls certificate.
const tlsCertPath = process.env.TLS_CERT_PATH || "";

// Gateway peer endpoint.
const peerEndpoint = process.env.PEER_ENDPOINT || "";

// Gateway peer SSL host name override.
const peerHostAlias = process.env.PEER_HOST_ALIAS || "";


let contract: Contract;

export async function getContract(): Promise<Contract> {
  if (!contract) {
    await startGateway();
  }
  return contract;
}

export async function startGateway(): Promise<void> {

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

  // Get a network instance representing the channel where the smart contract is deployed.
  const network = gateway.getNetwork(channelName);

  // Get the smart contract from the network.
  contract = network.getContract(chaincodeName);
}

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