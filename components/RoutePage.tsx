"use client";

import { Button, Datepicker, Dropdown, Modal, TextInput, Textarea, Timeline } from "flowbite-react";
import React from "react";
import * as AddressCollection from "@/internal/AddressCollection";
import * as CourierCollection from "@/internal/CourierCollection";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";
import { HiTrash, HiRefresh, HiOutlinePlus, HiOutlineMinus, HiArrowNarrowDown } from "react-icons/hi";
import { Address, Courier, Good } from "@/chaincode/Models";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { TableCopyableCell } from "./TableCopyableCell";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useSemaphore } from "./SemaphoreHook";
import { WithId, useMobxStorage, withId } from "@/internal/Utils";
import { observer } from "mobx-react";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { UnixDate } from "@/internal/Models";

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
class EditableTimeline {
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

  addDestination() {
    this.stopAndTransportList.push({
      address: null,
      expectedArrivalTimestamp: Math.floor(Date.now() / 1000),
      input: [],
      output: [],
      courier: null,
      transportInfo: ""
    });
  }

  removeDestination(sat: StopAndTransport) {
    const idx = this.stopAndTransportList.indexOf(sat);
    if (idx !== -1) {
      this.stopAndTransportList.splice(idx, 1);
    }
  }

  constructor() {
    this.addDestination();
    this.addDestination();

    makeAutoObservable(this, undefined, { deep: true });
  }
}

const EditableTimelineItem = observer((props: { sat: StopAndTransport; timeline: EditableTimeline }) => {
  const input = props.sat.input;
  const output = props.sat.output;

  const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);

  const addr = props.timeline.addressList.find(address => address.hashId === props.sat.address);
  const courier = props.timeline.courierList.find(courier => courier.hashId === props.sat.courier);

  const stopIndex = props.timeline.stopAndTransportList.indexOf(props.sat);
  const previousStop = props.timeline.stopAndTransportList[stopIndex - 1] as StopAndTransport | undefined;
  const previousStopDate = new UnixDate(previousStop?.expectedArrivalTimestamp ?? 0);
  const minDate = previousStopDate;
  const minTime = unixDate.isSameDay(previousStopDate) ? previousStopDate.toTimeString() : undefined;

  React.useEffect(() => {
    if (minDate !== undefined && minDate.toDate() > unixDate.toDate()) {
      runInAction(() => {
        props.sat.expectedArrivalTimestamp = minDate.unixTimestamp;
      });
    }
  }, [minDate?.toDateString()]);

  React.useEffect(() => {
    if (minTime !== undefined && minDate !== undefined && minTime > unixDate.toTimeString()) {
      runInAction(() => {
        props.sat.expectedArrivalTimestamp = minDate.unixTimestamp;
      });
    }
  }, [minTime]);

  return (
    <Timeline.Item>
      <Timeline.Point icon={HiArrowNarrowDown} />
      <Timeline.Content>
        {props.timeline.stopAndTransportList.length > 2 && (
          <Button
            color="gray"
            onClick={() => {
              props.timeline.removeDestination(props.sat);
            }}>
            Remove Destination
          </Button>
        )}
        <h3 className="mt-5">Address:</h3>
        <div className="my-2 *:text-left [&>button:first-child]:min-w-[50%] [&>button:first-child]:max-w-full [&>button:first-child>span]:w-full [&>button:first-child>span]:flex-wrap [&>button:first-child>span]:justify-between flex items-baseline gap-2">
          <Dropdown
            label={
              addr === undefined ? (
                <i>Select an Address</i>
              ) : (
                <span>
                  <b>{addr.recipient}</b>
                  <br />
                  {addr.line1}
                  <br />
                  {addr.line2}
                </span>
              )
            }
            dismissOnClick={true}
            className=" "
            color="gray">
            <Dropdown.Header>
              <a href="./addresses" target="_blank">
                Create an Address
              </a>
            </Dropdown.Header>
            {props.timeline.addressList.map(address => (
              <Dropdown.Item key={address.hashId} onClick={action(() => (props.sat.address = address.hashId))}>
                <span className="w-full text-left">
                  <b>{address.recipient}</b>
                  <br />
                  {address.line1}
                  <br />
                  {address.line2}
                </span>
              </Dropdown.Item>
            ))}
          </Dropdown>
          <Button
            color="gray"
            onClick={() => {
              props.timeline.refreshAddressList();
            }}>
            <HiRefresh />
          </Button>
        </div>
        <h3 className="mt-5">Expected Arrival Date & Time:</h3>
        <div className="my-2 *:bg-white flex gap-2 [&_input]:bg-gray-50">
          <Datepicker
            color="gray"
            minDate={minDate?.toDate()}
            value={unixDate.toDateString()}
            onSelectedDateChanged={action(newDate => {
              const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);
              props.sat.expectedArrivalTimestamp = unixDate.setDate(newDate).unixTimestamp;
            })}
          />
          <input
            type="time"
            min={minTime}
            value={unixDate.toTimeString()}
            onChange={action(e => {
              const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);
              props.sat.expectedArrivalTimestamp = unixDate.setTime(
                e.target.value as `${number}:${number}`
              ).unixTimestamp;
            })}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
        <h3 className="mt-5">Input:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={input} />
        </div>
        <div className="my-3">
          <GoodSelectModal
            ignored={input.map(val => val.uuid)}
            onSelect={action(value => {
              input.push({
                ...value,
                quantity: 1,
                minQuantity: 1,
                maxQuantity: Number.MAX_SAFE_INTEGER,
                removable: true
              });
            })}
          />
        </div>
        <h3 className="mt-5">Output:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={output} />
        </div>
        <div className="my-3">
          <GoodSelectModal
            ignored={output.map(val => val.uuid)}
            onSelect={action(value => {
              output.push({
                ...value,
                quantity: 1,
                minQuantity: 1,
                maxQuantity: Number.MAX_SAFE_INTEGER,
                removable: true
              });
            })}
          />
        </div>
        {props.timeline.isLastStop(props.sat) === false && (
          <>
            <h3 className="mt-10">Courier:</h3>
            <div className="my-2 *:text-left [&>button:first-child]:min-w-[50%] [&>button:first-child]:max-w-full [&>button:first-child>span]:w-full [&>button:first-child>span]:flex-wrap [&>button:first-child>span]:justify-between flex items-baseline gap-2">
              <Dropdown
                label={
                  courier === undefined ? (
                    <i>Select a Courier</i>
                  ) : (
                    <span>
                      <b>{courier.name}</b>
                      <br />
                      {courier.company}
                      <br />
                      {courier.telephone}
                    </span>
                  )
                }
                dismissOnClick={true}
                className=" "
                color="gray">
                <Dropdown.Header>
                  <a href="./couriers" target="_blank">
                    Create a Courier
                  </a>
                </Dropdown.Header>
                {props.timeline.courierList.map(courier => (
                  <Dropdown.Item key={courier.hashId} onClick={action(() => (props.sat.courier = courier.hashId))}>
                    <span className="w-full text-left">
                      <b>{courier.name}</b>
                      <br />
                      {courier.company}
                      <br />
                      {courier.telephone}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown>
              <Button
                color="gray"
                onClick={() => {
                  props.timeline.refreshCourierList();
                }}>
                <HiRefresh />
              </Button>
            </div>
            <h3 className="mt-5">Transport Info:</h3>
            <div className="my-2">
              <Textarea
                placeholder="Extra Information for Courier"
                value={props.sat.transportInfo}
                onChange={action(e => (props.sat.transportInfo = e.target.value))}
              />
            </div>
          </>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
});

interface GoodAndQuantity extends Good {
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  removable: boolean;
}

const GoodAndQuantityDataGrid = observer((props: { data: GoodAndQuantity[] }) => {
  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px minmax(0, 1fr) 90px 60px;`
    }
  ]);

  const get = (uuid: string) => props.data.find(val => val.uuid === uuid);

  const indexOf = (uuid: string) => props.data.findIndex(val => val.uuid === uuid);

  const columns = [
    {
      label: "UUID",
      resize: true,
      renderCell: item => <TableCopyableCell value={item.id} />
    },
    {
      label: "Name",
      resize: true,
      renderCell: item => item.name
    },
    {
      label: "",
      resize: true,
      renderCell: item => (
        <span className="flex gap-2 justify-center">
          <button
            className="fill-gray-200 hover:fill-black"
            disabled={item.quantity <= item.minQuantity}
            onClick={action(() => {
              if (item.quantity > item.minQuantity) {
                get(item.uuid)!.quantity--;
              }
            })}>
            <HiOutlineMinus />
          </button>
          <span>{item.quantity}</span>
          <button
            className="fill-gray-200 hover:fill-black"
            disabled={item.quantity >= item.maxQuantity}
            onClick={action(() => {
              if (item.quantity < item.maxQuantity) {
                get(item.uuid)!.quantity++;
              }
            })}>
            <HiOutlinePlus />
          </button>
        </span>
      )
    },
    {
      label: "",
      resize: true,
      renderCell: item =>
        item.removable && (
          <span className="flex justify-center">
            <button
              onClick={action(() => {
                if (item.removable) {
                  props.data.splice(indexOf(item.uuid), 1);
                }
              })}>
              <svg className="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
              </svg>
            </button>
          </span>
        )
    }
  ] as Column<WithId<GoodAndQuantity>>[];

  const data = { nodes: props.data.map(val => withId(val, "uuid")) } as Data<WithId<GoodAndQuantity>>;

  return <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />;
});

function GoodSelectModal(props: { ignored: string[]; onSelect: (value: Good) => void }) {
  const [openModal, setOpenModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [rawData, setRawData] = React.useState<WithId<Good>[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const dataSemaphore = useSemaphore();

  React.useEffect(() => {
    startTransition(() => {
      InternalGoodCollection.search(search).then(list => {
        setRawData(list.map(good => withId(good, "uuid")));
      });
    });
  }, [dataSemaphore[0], search]);

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px 60% minmax(0, 1fr) 60px;`
    }
  ]);

  const columns = [
    {
      label: "UUID",
      resize: true,
      renderCell: item => <TableCopyableCell value={item.id} />
    },
    {
      label: "Name",
      resize: true,
      renderCell: item => item.name
    },
    {
      label: "Barcode",
      renderCell: item => item.barcode
    },
    {
      label: "",
      renderCell: item => (
        <button
          className="fill-gray-200 hover:fill-black"
          onClick={async () => {
            props.onSelect(item);
          }}>
          <HiOutlinePlus />
        </button>
      )
    }
  ] as Column<WithId<Good>>[];

  const data = { nodes: rawData.filter(value => props.ignored.indexOf(value.uuid) === -1) } as Data<WithId<Good>>;

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
          <div className="flex gap-2 mb-2">
            <TextInput placeholder="Search" className="flex-1" onChange={e => setSearch(e.target.value)} />
            <Button color="gray" onClick={() => dataSemaphore[1]()} disabled={isPending}>
              <HiRefresh />
            </Button>
          </div>
          <div className="*:w-full h-[50vh] overflow-y-auto">
            <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Button color="gray" onClick={() => setOpenModal(true)}>
        Add
      </Button>
    </>
  );
}

export const RoutePage = observer(() => {
  const timeline = useMobxStorage(() => new EditableTimeline(), []);

  React.useEffect(() => {
    timeline.refreshAddressList();
    timeline.refreshCourierList();
  }, []);

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Create a Route Proposal</h2>

      <Timeline>
        {timeline.stopAndTransportList.map((sat, idx) => (
          <EditableTimelineItem key={idx} sat={sat} timeline={timeline} />
        ))}
      </Timeline>
      <div className="my-3">
        <Button
          color="gray"
          onClick={() => {
            timeline.addDestination();
          }}>
          Add Destination
        </Button>
      </div>
      <div className="my-3">
        <Button
          color="gray"
          onClick={() => {
            // TODO
          }}>
          Create Proposal
        </Button>
      </div>
    </div>
  );
});
