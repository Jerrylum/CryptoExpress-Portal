import {
  HashIdObject,
  PublicKeyObject,
  KeyHexString,
  Address,
  Courier,
} from "../chaincode/Models";
import {
  objectToSha256Hash,
  exportPublicKey,
  generateKeyPair,
  exportPrivateKey,
} from "../chaincode/Utils";

export interface PrivateKeyObject {
  privateKey: KeyHexString;
}

export class AddressWithPrivateKey
  implements HashIdObject, PublicKeyObject, PrivateKeyObject
{
  hashId: string; // hash of the remaining fields
  line1: string;
  line2: string;
  recipient: string;
  publicKey: KeyHexString;
  privateKey: KeyHexString;

  constructor(line1: string, line2: string, recipient: string) {
    const keyPair = generateKeyPair();
    this.line1 = line1;
    this.line2 = line2;
    this.recipient = recipient;
    this.publicKey = exportPublicKey(keyPair.publicKey);
    this.privateKey = exportPrivateKey(keyPair.privateKey);
    this.hashId = objectToSha256Hash({
      line1: this.line1,
      line2: this.line2,
      recipient: this.recipient,
      publicKey: this.publicKey,
    });
  }

  toAddress(): Address {
    return {
      hashId: this.hashId,
      line1: this.line1,
      line2: this.line2,
      recipient: this.recipient,
      publicKey: this.privateKey,
    };
  }
}

export class CourierWithPrivateKey
  implements HashIdObject, PublicKeyObject, PrivateKeyObject
{
  hashId: string; // hash of the remaining fields
  name: string;
  company: string;
  telephone: string;
  publicKey: KeyHexString;
  privateKey: KeyHexString;

  constructor(name: string, company: string, telephone: string) {
    const keyPair = generateKeyPair();
    this.name = name;
    this.company = company;
    this.telephone = telephone;
    this.publicKey = exportPublicKey(keyPair.publicKey);
    this.privateKey = exportPrivateKey(keyPair.privateKey);
    this.hashId = objectToSha256Hash({
      name: this.name,
      company: this.company,
      telephone: this.telephone,
      publicKey: this.publicKey,
    });
  }

  toCourier(): Courier {
    return {
      hashId: this.hashId,
      name: this.name,
      company: this.company,
      telephone: this.telephone,
      publicKey: this.publicKey,
    };
  }
}
