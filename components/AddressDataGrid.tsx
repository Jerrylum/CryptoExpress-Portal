"use client";

import * as React from "react";

import { Data, TableNode } from "@table-library/react-table-library/types/table";
import { Semaphore } from "./SemaphoreHook";
import * as AddressCollection from "@/internal/AddressCollection";
import { Column, CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Tooltip } from "flowbite-react";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import { AddressWithPrivateKey, exportAddressWithPrivateKey } from "@/internal/Models";
import { TableCopyableCell } from "./TableCopyableCell";

class AnyAddressNode implements TableNode {
  constructor(public _obj: AddressCollection.AddressQueryingResult) {}

  get id() {
    return this._obj.hashId;
  }

  get hashId() {
    return this._obj.hashId;
  }

  get line1() {
    return this._obj.line1;
  }

  get line2() {
    return this._obj.line2;
  }

  get recipient() {
    return this._obj.recipient;
  }

  get isPublic() {
    return this._obj.isPublic;
  }

  get isInternal() {
    return "privateKey" in this._obj;
  }
}

export function AddressDataGrid(props: { search: string; semaphore: Semaphore }) {
  const [rawData, setRawData] = React.useState<AnyAddressNode[]>([]);

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      AddressCollection.search(props.search).then(list => {
        setRawData(list.map(addr => new AnyAddressNode(addr)));
      });
    });
  }, [props.semaphore[0], props.search]);

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 100px minmax(0, 1fr) 120px;`
    }
  ]);

  if (isPending && rawData.length === 0) {
    // reduce the chance of flickering
    return <div>Loading...</div>;
  }

  const columns = [
    {
      label: "Hash ID",
      resize: true,
      renderCell: item => <TableCopyableCell value={item.id} />
    },
    {
      label: "Detail",
      renderCell: item => (
        <>
          <b>{item.recipient}</b>
          <br />
          <span title={item.line1}>{item.line1}</span>
          <br />
          <span title={item.line2}>{item.line2}</span>
        </>
      )
    },
    {
      label: "",
      renderCell: item => (
        <div className="w-full h-full flex justify-start gap-2">
          {item.isPublic ? (
            <Tooltip content="Unlist From Public">
              <button
                className="fill-gray-200 hover:fill-red-600 m-auto"
                onClick={async () => {
                  // await InternalGoodCollection.remove(item.uuid);
                  await InternalAddressCollection.removeFromPublic(item.hashId);
                  props.semaphore[1]();
                }}>
                <svg className="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M11 8.17 6.49 3.66C8.07 2.61 9.96 2 12 2c5.52 0 10 4.48 10 10 0 2.04-.61 3.93-1.66 5.51l-1.46-1.46C19.59 14.87 20 13.48 20 12c0-3.35-2.07-6.22-5-7.41V5c0 1.1-.9 2-2 2h-2zm10.19 13.02-1.41 1.41-2.27-2.27C15.93 21.39 14.04 22 12 22 6.48 22 2 17.52 2 12c0-2.04.61-3.93 1.66-5.51L1.39 4.22 2.8 2.81zM11 18c-1.1 0-2-.9-2-2v-1l-4.79-4.79C4.08 10.79 4 11.38 4 12c0 4.08 3.05 7.44 7 7.93z"></path>
                </svg>
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Release To Public">
              <button
                className="fill-gray-200 hover:fill-gray-600 m-auto"
                onClick={async () => {
                  // await InternalGoodCollection.remove(item.uuid);
                  await InternalAddressCollection.releaseToPublic(item.hashId);
                  props.semaphore[1]();
                }}>
                <svg className="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39"></path>
                </svg>
              </button>
            </Tooltip>
          )}
          {item.isInternal && (
            <Tooltip content="Remove From Internal">
              <button
                className="fill-gray-200 hover:fill-red-600 m-auto"
                onClick={async () => {
                  await InternalAddressCollection.remove(item.hashId);
                  props.semaphore[1]();
                }}>
                <svg className="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
                </svg>
              </button>
            </Tooltip>
          )}
          {item.isInternal && (
            <Tooltip content="Export Secret">
              <button
                className="fill-gray-200 hover:fill-gray-600 m-auto"
                onClick={async () => {
                  navigator.clipboard.writeText(exportAddressWithPrivateKey(item._obj as AddressWithPrivateKey));
                }}>
                <svg className="w-6 h-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m16 5-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2"></path>
                </svg>
              </button>
            </Tooltip>
          )}
        </div>
      )
    }
  ] as Column<AnyAddressNode>[];

  const data = { nodes: rawData } as Data<AnyAddressNode>;

  return (
    <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} style={{ width: "100%" }} />
  );
}
