import { Courier } from "@/chaincode/Models";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";

export function add(arg0: Courier) {
  // TODO
}

export function remove(arg0: string) {
  // TODO
}

export async function list() {
  return [...(await InternalCourierCollection.list())];
}
