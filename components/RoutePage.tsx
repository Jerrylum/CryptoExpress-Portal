"use client";

import {
  Button,
  Card,
  Datepicker,
  Dropdown,
  FlowbiteDatepickerTheme,
  Modal,
  Popover,
  TextInput,
  Timeline
} from "flowbite-react";
import React, { startTransition } from "react";
import * as AddressCollection from "@/internal/AddressCollection";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";
import { HiArrowNarrowRight, HiTrash, HiRefresh, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { Good } from "@/chaincode/Models";
import { Column } from "@table-library/react-table-library/types/compact";
import { TableNode, Data } from "@table-library/react-table-library/types/table";
import { TableCopyableCell } from "./TableCopyableCell";
import { TableEditableCell } from "./TableEditableCell";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useSemaphore } from "./SemaphoreHook";
import { WithId, withId } from "@/internal/Utils";

export interface StopAndTransport {
  address: string | null; // Hash ID
  expectedArrivalTimestamp: number;
  input: { [goodUuid: string]: number };
  output: { [goodUuid: string]: number };
  courier: string | null;
  transportInfo: string;
}

interface g {}

function EditableTimelineItem(props: {
  /* sat: StopAndTransport */
}) {
  // React.useEffect(() => {
  //   startTransition(() => {
  //     AddressCollection.search(props.search).then(list => {
  //       setRawData(list.map(addr => new AnyAddressNode(addr)));
  //     });
  //   });
  // }, [props.semaphore[0], props.search]);

  const [input, setInput] = React.useState<GoodAndQuantity[]>([]);
  const [output, setOutput] = React.useState<GoodAndQuantity[]>([]);
  return (
    <Timeline.Item>
      <Timeline.Point icon={HiTrash} />
      <Timeline.Content>
        <h3 className="mt-2">Address:</h3>
        <div className="my-2 *:text-left [&>button:first-child]:min-w-[50%] [&>button:first-child]:max-w-full [&>button:first-child>span]:w-full [&>button:first-child>span]:flex-wrap [&>button:first-child>span]:justify-between flex items-baseline gap-2">
          <Dropdown
            label={
              <span>
                <b>Person Name</b>
                <br />
                Line 1<br />
                Line 2<br />
              </span>
            }
            dismissOnClick={false}
            className=" "
            color="gray">
            <Dropdown.Header>
              <a href="./addresses" target="_blank">
                Create an Address
              </a>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          <Button color="gray">
            <HiRefresh />
          </Button>
        </div>
        <h3 className="mt-2">Expected Arrival Date & Time:</h3>
        <div className="my-2 *:bg-white flex gap-2 [&_input]:bg-gray-50">
          <Datepicker color="gray" />
          <input
            type="time"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
        <h3 className="mt-2">Input:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={input} />
        </div>
        <div className="my-2">
          <GoodSelectModal
            ignored={input.map(val => val.uuid)}
            onSelect={value => {
              setInput([
                ...input,
                { ...value, quantity: 1, minQuantity: 1, maxQuantity: Number.MAX_SAFE_INTEGER, removable: true }
              ]);
            }}
          />
        </div>
        <h3 className="mt-2">Output:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={output} />
        </div>
        <div className="my-2">
          <GoodSelectModal
            ignored={output.map(val => val.uuid)}
            onSelect={value => {
              setOutput([
                ...output,
                { ...value, quantity: 1, minQuantity: 1, maxQuantity: Number.MAX_SAFE_INTEGER, removable: true }
              ]);
            }}
          />
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}

interface GoodAndQuantity extends Good {
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  removable: boolean;
}

function GoodAndQuantityDataGrid(props: { data: GoodAndQuantity[] }) {
  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px minmax(0, 1fr) 160px 60px;`
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
      label: "",
      renderCell: item => (
        <span className="flex gap-2">
          <button
            className="fill-gray-200 hover:fill-black"
            disabled={item.quantity <= item.minQuantity}
            onClick={async () => {
              if (item.quantity > item.minQuantity) {
                item.quantity--; // TODO
              }
            }}>
            <HiOutlineMinus />
          </button>
          <span>{item.quantity}</span>
          <button
            className="fill-gray-200 hover:fill-black"
            disabled={item.quantity >= item.maxQuantity}
            onClick={async () => {
              if (item.quantity < item.maxQuantity) {
                item.quantity++; // TODO
              }
            }}>
            <HiOutlinePlus />
          </button>
        </span>
      )
    },
    {
      label: "",
      resize: true,
      renderCell: item => (
        <button>
          <HiTrash onClick={async () => {}} />
        </button>
      )
    }
  ] as Column<WithId<GoodAndQuantity>>[];

  const data = { nodes: props.data.map(val => withId(val, "uuid")) } as Data<WithId<GoodAndQuantity>>;

  return <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />;
}

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

export function RoutePage() {
  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Create a Route Proposal</h2>

      <Timeline>
        <EditableTimelineItem />
        <Timeline.Item>
          <Timeline.Point icon={HiTrash} />
          <Timeline.Content>
            <Timeline.Time>March 2022</Timeline.Time>
            <Timeline.Title>Marketing UI design in Figma</Timeline.Title>
            <Timeline.Body>
              All of the pages and components are first designed in Figma and we keep a parity between the two versions
              even as we update the project.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiTrash} />
          <Timeline.Content>
            <Timeline.Time>April 2022</Timeline.Time>
            <Timeline.Title>E-Commerce UI code in Tailwind CSS</Timeline.Title>
            <Timeline.Body>
              Get started with dozens of web components and interactive elements built on top of Tailwind CSS.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </div>
  );
}
