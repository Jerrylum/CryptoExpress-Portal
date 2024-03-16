"use client";
import * as React from "react";

import {
  Column,
  CompactTable,
} from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
  Data,
  TableNode,
} from "@table-library/react-table-library/types/table";
import { Good } from "@/chaincode/Models";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";
import { TableEditableCell } from "./TableEditableCell";
import { useSemaphore } from "./SemaphoreHook";

class GoodNode implements TableNode {
  constructor(private good: Good) {}

  get id() {
    return this.good.uuid;
  }

  get uuid() {
    return this.good.uuid;
  }

  get name() {
    return this.good.name;
  }

  get barcode() {
    return this.good.barcode;
  }
}

export function GoodDataGrid() {
  const [rawData, setRawData] = React.useState<GoodNode[]>([]);
  const [dataSemaphore, dataUpdate] = useSemaphore();

  React.useEffect(() => {
    (async () => {
      const list = await InternalGoodCollection.list();
      setRawData(list.map((good) => new GoodNode(good)));
    })();
  }, [dataSemaphore]);

  const columns = [
    {
      label: "UUID",
      resize: true,
      renderCell: (item) => <span title={item.id}>{item.id.slice(8)}</span>,
    },
    {
      label: "Name",
      resize: true,
      renderCell: (item) => (
        <TableEditableCell
          getter={() => item.name}
          setter={(value) => {
            InternalGoodCollection.set({
              uuid: item.uuid,
              name: value,
              barcode: item.barcode,
            });
          }}
        />
      ),
    },
    { label: "Barcode", renderCell: (item) => item.barcode },
    {
      label: "",
      renderCell: (item) => (
        <button
          className="fill-gray-200 hover:fill-red-600"
          onClick={async () => {
            await InternalGoodCollection.remove(item.uuid);
            dataUpdate();
          }}
        >
          <svg
            className="w-full h-full"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
          </svg>
        </button>
      ),
    },
  ] as Column<GoodNode>[];

  const data = { nodes: rawData } as Data<GoodNode>;

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 10% 60% minmax(0, 1fr) 60px;`,
    },
  ]);

  return (
    <CompactTable
      columns={columns}
      data={data}
      theme={theme}
      layout={{ custom: true }}
      style={{ width: "100%" }}
    />
  );
}
