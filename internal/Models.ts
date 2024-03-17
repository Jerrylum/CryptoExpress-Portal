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
  constructor(
    public hashId: string,
    public line1: string,
    public line2: string,
    public recipient: string,
    public publicKey: KeyHexString,
    public privateKey: KeyHexString
  ) {}

  static generate(line1: string, line2: string, recipient: string) {
    const keyPair = generateKeyPair();
    const publicKey = exportPublicKey(keyPair.publicKey);
    const privateKey = exportPrivateKey(keyPair.privateKey);
    const hashId = objectToSha256Hash({ line1, line2, recipient, publicKey });
    return new AddressWithPrivateKey(hashId, line1, line2, recipient, publicKey, privateKey);
  }

  static import(data: string): AddressWithPrivateKey {
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
    return new AddressWithPrivateKey(obj.hashId, obj.line1, obj.line2, obj.recipient, obj.publicKey, obj.privateKey);
  }

  export(): string {
    return JSON.stringify(this);
  }

  toAddress(): Address {
    return omitProperty(this, "privateKey");
  }
}

export class CourierWithPrivateKey implements HashIdObject, PublicKeyObject, PrivateKeyObject {
  constructor(
    public hashId: string,
    public name: string,
    public company: string,
    public telephone: string,
    public publicKey: KeyHexString,
    public privateKey: KeyHexString
  ) {}

  static generate(name: string, company: string, telephone: string) {
    const keyPair = generateKeyPair();
    const publicKey = exportPublicKey(keyPair.publicKey);
    const privateKey = exportPrivateKey(keyPair.privateKey);
    const hashId = objectToSha256Hash({ name, company, telephone, publicKey });
    return new CourierWithPrivateKey(hashId, name, company, telephone, publicKey, privateKey);
  }

  static import(data: string): CourierWithPrivateKey {
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
    return new CourierWithPrivateKey(obj.hashId, obj.name, obj.company, obj.telephone, obj.publicKey, obj.privateKey);
  }

  export(): string {
    return JSON.stringify(this);
  }

  toCourier(): Courier {
    return omitProperty(this, "privateKey");
  }
}
