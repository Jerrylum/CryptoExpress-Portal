import { AddressWithPrivateKey } from "./Models";

const _data = new Map<string, AddressWithPrivateKey>();

export async function add(addrWithPK: AddressWithPrivateKey) {
    _data.set(addrWithPK.hashId, addrWithPK);
}

export async function remove(hashId: string) {
    _data.delete(hashId);
}

export async function list(): Promise<AddressWithPrivateKey[]> {
    return [..._data.values()];
}

export async function has(hashId: string): Promise<boolean> {
    return _data.has(hashId);
}

export async function get(hashId: string): Promise<AddressWithPrivateKey | undefined> {
    return _data.get(hashId);
}

export async function releaseToPublic(hashId: string) {
    const addr = await get(hashId);
    if (addr === undefined) {
        throw new Error("Address not found");
    }

    await add(addr);
}

export async function removeFromPublic(hashId: string) {
    await remove(hashId);
}