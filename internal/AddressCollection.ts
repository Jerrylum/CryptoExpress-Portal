import { Address } from "@/chaincode/Models";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";

export function add(arg0: Address) {
  // TODO
}

export function remove(arg0: string) {
  // TODO
}

export async function list() {
  // TODO: return a list of public addresses

  return [...(await InternalAddressCollection.list())];
}
