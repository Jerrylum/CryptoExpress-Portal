import { HashIdObject, PublicKeyObject, KeyHexString, Address, Courier } from "../chaincode/Models";
import { objectToSha256Hash, exportPublicKey, generateKeyPair, exportPrivateKey, omitProperty } from "../chaincode/Utils";

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
    const hashId = objectToSha256Hash({
      line1,
      line2,
      recipient,
      publicKey
    });
    return new AddressWithPrivateKey(hashId, line1, line2, recipient, publicKey, privateKey);
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
    const hashId = objectToSha256Hash({
      name,
      company,
      telephone,
      publicKey
    });
    return new CourierWithPrivateKey(hashId, name, company, telephone, publicKey, privateKey);
  }

  toCourier(): Courier {
    return omitProperty(this, "privateKey");
  }
}
