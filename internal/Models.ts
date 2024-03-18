import { z } from "zod";
import { HashIdObject, PublicKeyObject, KeyHexString, Address, Courier } from "../chaincode/Models";
import {
  objectToSha256Hash,
  exportPublicKey,
  generateKeyPair,
  exportPrivateKey,
  omitProperty,
  isValidHashIdObject,
  signObject,
  verifyObject
} from "../chaincode/Utils";

export interface PrivateKeyObject {
  privateKey: KeyHexString;
}

export class AddressWithPrivateKey implements HashIdObject, PublicKeyObject, PrivateKeyObject {
  hashId!: string;
  line1!: string;
  line2!: string;
  recipient!: string;
  publicKey!: KeyHexString;
  privateKey!: KeyHexString;
}

export function generateAddressWithPrivateKey(line1: string, line2: string, recipient: string) {
  const keyPair = generateKeyPair();
  const publicKey = exportPublicKey(keyPair.publicKey);
  const privateKey = exportPrivateKey(keyPair.privateKey);
  const hashId = objectToSha256Hash({ line1, line2, recipient, publicKey });
  return { hashId, line1, line2, recipient, publicKey, privateKey };
}

export function importAddressWithPrivateKey(data: string): AddressWithPrivateKey {
  const obj = z
    .object({
      hashId: z.string(),
      line1: z.string(),
      line2: z.string(),
      recipient: z.string(),
      publicKey: z.string(),
      privateKey: z.string()
    })
    .parse(JSON.parse(data));
  const objWithoutPrivateKey = omitProperty(obj, "privateKey");
  if (isValidHashIdObject(objWithoutPrivateKey) === false) {
    throw new Error("Invalid hashId");
  }
  if (verifyObject(obj, signObject(obj, obj.privateKey), obj.publicKey) === false) {
    throw new Error("Invalid public key private key pair");
  }
  return obj;
}

export function exportAddressWithPrivateKey(obj: AddressWithPrivateKey): string {
  return JSON.stringify(obj);
}

export function fromAddressWithPrivateKeyToAddressObject(obj: AddressWithPrivateKey): Address {
  return omitProperty(obj, "privateKey");
}

export interface CourierWithPrivateKey extends HashIdObject, PublicKeyObject, PrivateKeyObject {
  hashId: string;
  name: string;
  company: string;
  telephone: string;
  publicKey: KeyHexString;
  privateKey: KeyHexString;
}

export function generateCourierWithPrivateKey(name: string, company: string, telephone: string) {
  const keyPair = generateKeyPair();
  const publicKey = exportPublicKey(keyPair.publicKey);
  const privateKey = exportPrivateKey(keyPair.privateKey);
  const hashId = objectToSha256Hash({ name, company, telephone, publicKey });
  return { hashId, name, company, telephone, publicKey, privateKey };
}

export function importCourierWithPrivateKey(data: string): CourierWithPrivateKey {
  const obj = z
    .object({
      hashId: z.string(),
      name: z.string(),
      company: z.string(),
      telephone: z.string(),
      publicKey: z.string(),
      privateKey: z.string()
    })
    .parse(JSON.parse(data));
  const objWithoutPrivateKey = omitProperty(obj, "privateKey");
  if (isValidHashIdObject(objWithoutPrivateKey) === false) {
    throw new Error("Invalid hashId");
  }
  if (verifyObject(obj, signObject(obj, obj.privateKey), obj.publicKey) === false) {
    throw new Error("Invalid public key private key pair");
  }
  return obj;
}

export function exportCourierWithPrivateKey(obj: CourierWithPrivateKey): string {
  return JSON.stringify(obj);
}

export function fromCourierWithPrivateKeyToCourierObject(obj: CourierWithPrivateKey): Courier {
  return omitProperty(obj, "privateKey");
}
