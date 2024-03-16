"use server";

import fs from "fs";
import { parse } from "csv-parse";

import { Address, Courier, Good } from "../chaincode/Models";
import { AddressWithPrivateKey, CourierWithPrivateKey } from "./Models";

// export class AddressCollection {
//   static add(arg0: Address) {
//     // TODO
//   }
//   static remove(arg0: string) {
//     // TODO
//   }

//   static async list() {
//     // TODO: return a list of public addresses

//     return [...(await InternalAddressCollection.list())];
//   }
// }

// export class InternalAddressCollection {
//   static _data = new Map<string, AddressWithPrivateKey>();

//   static async add(addrWithPK: AddressWithPrivateKey) {
//     InternalAddressCollection._data.set(addrWithPK.hashId, addrWithPK);
//   }

//   static async remove(hashId: string) {
//     InternalAddressCollection._data.delete(hashId);
//   }

//   static async list(): Promise<AddressWithPrivateKey[]> {
//     return [...InternalAddressCollection._data.values()];
//   }

//   static async has(hashId: string): Promise<boolean> {
//     return InternalAddressCollection._data.has(hashId);
//   }

//   static async get(hashId: string): Promise<AddressWithPrivateKey | undefined> {
//     return InternalAddressCollection._data.get(hashId);
//   }

//   static async releaseToPublic(hashId: string) {
//     const addr = await InternalAddressCollection.get(hashId);
//     if (addr === undefined) {
//       throw new Error("Address not found");
//     }

//     await AddressCollection.add(addr.toAddress());
//   }

//   static async removeFromPublic(hashId: string) {
//     await AddressCollection.remove(hashId);
//   }
// }

// export class CourierCollection {
//   static add(arg0: Courier) {
//     // TODO
//   }

//   static remove(arg0: string) {
//     // TODO
//   }

//   static async list() {
//     return [...(await InternalCourierCollection.list())];
//   }
// }

// export class InternalCourierCollection {
//   static _data = new Map<string, CourierWithPrivateKey>();

//   static async add(courierWithPK: CourierWithPrivateKey) {
//     InternalCourierCollection._data.set(courierWithPK.hashId, courierWithPK);
//   }

//   static async remove(hashId: string) {
//     InternalCourierCollection._data.delete(hashId);
//   }

//   static async list(): Promise<CourierWithPrivateKey[]> {
//     return [...InternalCourierCollection._data.values()];
//   }

//   static async has(hashId: string): Promise<boolean> {
//     return InternalCourierCollection._data.has(hashId);
//   }

//   static async get(hashId: string): Promise<CourierWithPrivateKey | undefined> {
//     return InternalCourierCollection._data.get(hashId);
//   }

//   static async releaseToPublic(hashId: string) {
//     const courier = await InternalCourierCollection.get(hashId);
//     if (courier === undefined) {
//       throw new Error("Courier not found");
//     }

//     await CourierCollection.add(courier.toCourier());
//   }

//   static async removeFromPublic(hashId: string) {
//     await CourierCollection.remove(hashId);
//   }
// }

// export class Contract {
//   static async createRouteProposal() {}

//   static async getAllRouteProposals() {}

//   static async removeRouteProposal() {}

//   static async signRouteProposal() {}

//   static async commitRouteProposal() {}

//   static async commitProgress() {}
// }

// read file db/goods.csv, use csv-parse to decode it

export async function readCSV<T>(fileName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const parser = parse(fs.readFileSync(fileName), {
      delimiter: ",",
      columns: true,
      skip_empty_lines: true,
    });
    const records: any[] = [];
    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on("end", function () {
      resolve(records);
    });
  });
}
