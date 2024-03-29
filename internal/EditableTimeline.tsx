import { GoodAndQuantity } from "./Models";
import * as AddressCollection from "@/internal/AddressCollection";
import * as CourierCollection from "@/internal/CourierCollection";
import { Address, Courier, Good, Segment, Stop, Transport } from "@/chaincode/Models";
import { makeAutoObservable, runInAction } from "mobx";
import { randomUUID } from "./Utils";

// observable
export interface StopAndTransport {
  address: string | null; // Hash ID
  expectedArrivalTimestamp: number; // unix timestamp
  input: GoodAndQuantity[];
  output: GoodAndQuantity[];
  courier: string | null;
  transportInfo: string;
}

// observable
export class EditableTimeline {
  addressList: Address[] = [];

  async refreshAddressList() {
    return AddressCollection.list().then(list => {
      runInAction(() => {
        this.addressList = list;
      });
    });
  }

  courierList: Courier[] = [];

  async refreshCourierList() {
    return CourierCollection.list().then(list => {
      runInAction(() => {
        this.courierList = list;
      });
    });
  }

  stopAndTransportList: StopAndTransport[] = [];

  isLastStop(sat: StopAndTransport): boolean {
    return this.stopAndTransportList[this.stopAndTransportList.length - 1] === sat;
  }

  addStop() {
    this.stopAndTransportList.push({
      address: null,
      expectedArrivalTimestamp: Math.floor(Date.now() / 1000),
      input: [],
      output: [],
      courier: null,
      transportInfo: ""
    });
  }

  removeStop(sat: StopAndTransport) {
    if (this.stopAndTransportList.length <= 2) {
      throw new Error("Cannot remove the stop.");
    }

    const idx = this.stopAndTransportList.indexOf(sat);
    if (idx !== -1) {
      this.stopAndTransportList.splice(idx, 1);
    }
  }

  toRoute() {
    const uuid = randomUUID();
    const goods: { [uuid: string]: Good } = {};
    const addresses: { [hashId: string]: Address } = {};
    const couriers: { [hashId: string]: Courier } = {};
    let source: Stop = undefined!;
    const commits: Segment[] = [];

    let currentStop: Stop = undefined!;
    for (let i = 0; i < this.stopAndTransportList.length; i++) {
      const sat = this.stopAndTransportList[i];

      const address = sat.address;
      if (address === null) {
        throw new Error(`Address is not selected for stop ${i}.`);
      }
      addresses[address] = this.addressList.find(a => a.hashId === address)!;

      const courier = sat.courier;
      if (courier === null && !this.isLastStop(sat)) {
        throw new Error(`Courier is not selected for stop ${i}.`);
      }
      couriers[courier!] = this.courierList.find(c => c.hashId === courier)!;

      if (i !== 0) {
        const prev = this.stopAndTransportList[i - 1];
        if (prev.expectedArrivalTimestamp > sat.expectedArrivalTimestamp) {
          throw new Error(`Invalid expected arrival timestamp for stop ${i}.`);
        }
      }

      const input: { [uuid: string]: number } = {};
      for (const { quantity, minQuantity, maxQuantity, removable, ...good } of sat.input) {
        input[good.uuid] = quantity;
        goods[good.uuid] = good;
      }

      const output: { [uuid: string]: number } = {};
      for (const { quantity, minQuantity, maxQuantity, removable, ...good } of sat.output) {
        output[good.uuid] = quantity;
        goods[good.uuid] = good;
      }

      const stop: Stop = {
        address,
        expectedArrivalTimestamp: sat.expectedArrivalTimestamp,
        input,
        output,
        next: undefined
      };

      if (i === 0) {
        source = stop;
      } else {
        const prev = this.stopAndTransportList[i - 1];

        const transport: Transport = {
          courier: prev.courier!,
          info: prev.transportInfo,
          destination: stop
        };

        currentStop!.next = transport;

        commits.push({
          srcOutgoing: undefined,
          courierReceiving: undefined,
          courierDelivering: undefined,
          dstIncoming: undefined
        });
      }

      currentStop = stop;
    }

    return { uuid, goods, addresses, couriers, source, commits };
  }

  constructor() {
    this.addStop();
    this.addStop();

    makeAutoObservable(this, undefined, { deep: true });
  }
}
