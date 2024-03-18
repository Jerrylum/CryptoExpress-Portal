"use client";

import * as React from "react";

import { Address, Courier } from "@/chaincode/Models";
import { AddressWithPrivateKey, CourierWithPrivateKey } from "@/internal/Models";
import { Data, TableNode } from "@table-library/react-table-library/types/table";
import { Semaphore } from "./SemaphoreHook";
import * as CourierCollection from "@/internal/CourierCollection";
import * as InternalAddressCollection from "@/internal/AddressCollection";
import { Column, CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

class AnyCourierNode implements TableNode {
  constructor(public _obj: Courier | CourierWithPrivateKey) {}

  get id() {
    return this._obj.hashId;
  }

  get hashId() {
    return this._obj.hashId;
  }

  get company() {
    return this._obj.company;
  }

  get telephone() {
    return this._obj.telephone;
  }

  get canExport() {
    return "privateKey" in this._obj;
  }
}

export function CourierDataGrid(props: { search: string; semaphore: Semaphore }) {
  const [rawData, setRawData] = React.useState<AnyCourierNode[]>([]);

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      CourierCollection.search(props.search).then(list => {
        setRawData(list.map(courier => new AnyCourierNode(courier)));
      });
    });
  }, [props.semaphore[0], props.search]);

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 10% 20% 60% 60px;`
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
      renderCell: item => <span title={item.id}>{item.id}</span>
    },
    {
      label: "Company",
      resize: true,
      renderCell: item => <span title={item.company}>{item.company}</span>
    },
    {
      label: "Telephone",
      resize: true,
      renderCell: item => <span title={item.telephone}>{item.telephone}</span>
    },
    // {
    //   label: "Line 2",
    //   resize: true,
    //   renderCell: item => <span title={item.line2}>{item.line2}</span>
    // },
    // {
    //   label: "Recipient",
    //   resize: true,
    //   renderCell: item => <span title={item.recipient}>{item.recipient}</span>
    // },
    {
      label: "Export",
      resize: true,
      renderCell: item => <span title={item.canExport ? "Yes" : "No"}>{item.canExport ? "Yes" : "No"}</span>
    }
  ] as Column<AnyCourierNode>[];

  const data = { nodes: rawData } as Data<AnyCourierNode>;

  return (
    <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} style={{ width: "100%" }} />
  );
}
