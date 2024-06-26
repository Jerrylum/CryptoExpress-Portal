import { z } from "zod";
import { HashIdObject, PublicKeyObject, KeyHexString, Address, Courier, Good } from "../chaincode/Models";
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

export interface GoodAndQuantity extends Good {
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  removable: boolean;
}

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
  const { hashId, line1, line2, recipient, publicKey, privateKey } = obj;
  return JSON.stringify({ hashId, line1, line2, recipient, publicKey, privateKey });
}

export function fromAnyToAddressObject(obj: Address): Address {
  const { hashId, line1, line2, recipient, publicKey } = obj;
  return { hashId, line1, line2, recipient, publicKey };
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
  const { hashId, name, company, telephone, publicKey, privateKey } = obj;
  return JSON.stringify({ hashId, name, company, telephone, publicKey, privateKey });
}

export function fromAnyToCourierObject(obj: Courier): Courier {
  const { hashId, name, company, telephone, publicKey } = obj;
  return { hashId, name, company, telephone, publicKey };
}

export class UnixDate {
  constructor(public unixTimestamp: number) {
    const curr = this.toDate();

    curr.setSeconds(0);

    this.unixTimestamp = Math.floor(curr.getTime() / 1000);
  }

  setDate(date: Date): this {
    const curr = this.toDate();
    curr.setFullYear(date.getFullYear());
    curr.setMonth(date.getMonth());
    curr.setDate(date.getDate());
    this.unixTimestamp = Math.floor(curr.getTime() / 1000);
    return this;
  }

  setTime(timeStr: `${number}:${number}`): this {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const curr = this.toDate();
    curr.setHours(hours);
    curr.setMinutes(minutes);
    this.unixTimestamp = Math.floor(curr.getTime() / 1000);
    return this;
  }

  toDate() {
    return new Date(this.unixTimestamp * 1000);
  }

  toDateString(): string {
    const date = this.toDate();
    return new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeZone: "HongKong" }).format(date); // "2024-03-30"
  }

  toTimeString(): string {
    const date = this.toDate();
    return date.toLocaleTimeString("sv-SE", { timeStyle: "short", timeZone: "HongKong" }); // "12:00"
  }

  isSameDay(other: UnixDate) {
    const date1 = this.toDate();
    const date2 = other.toDate();
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  static now() {
    return new UnixDate(Math.floor(Date.now() / 1000));
  }
}
