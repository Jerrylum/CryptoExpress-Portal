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

export class GoodNode implements TableNode {
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
  const data = { nodes: rawData } as Data<GoodNode>;

  React.useEffect(() => {
    (async () => {
      const list = await InternalGoodCollection.list();
      console.log(list);
      
      setRawData(list.map((good) => new GoodNode(good)));
    })();
  }, []);

  const theme = useTheme(getTheme());

  const COLUMNS = [
    {
      label: "UUID",
      renderCell: (item) => <span title={item.id}>{item.id.slice(8)}</span>,
    },
    {
      label: "Name",
      renderCell: (item) => (
        <input
          type="text"
          className="w-full"
          value={item.name}
          onChange={
            (event) => {}
            // handleUpdate(new Date(event.target.value), item.id, "deadline")
          }
        />
      ),
    },
    { label: "Barcode", renderCell: (item) => item.barcode },
  ] as Column<GoodNode>[];

  return (
    <CompactTable
      columns={COLUMNS}
      data={data}
      theme={theme}
      style={{ width: "100%" }}
    />
  );
}
