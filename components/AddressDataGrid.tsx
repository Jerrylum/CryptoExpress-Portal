"use client";

import * as React from "react";

import { Address } from "@/chaincode/Models";
import { AddressWithPrivateKey } from "@/internal/Models";
import { Data, TableNode } from "@table-library/react-table-library/types/table";
import { Semaphore } from "./SemaphoreHook";
import * as AddressCollection from "@/internal/AddressCollection";
import * as InternalAddressCollection from "@/internal/AddressCollection";
import { Column, CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

class AnyAddressNode implements TableNode {
  constructor(public _obj: Address | AddressWithPrivateKey) {}

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

  get canExport() {
    return "privateKey" in this._obj;
  }
}

export function AddressDataGrid(props: { search: string, semaphore: Semaphore }) {
  const [rawData, setRawData] = React.useState<AnyAddressNode[]>([]);

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      AddressCollection.search(props.search).then(list => {
        setRawData(list.map(addr => new AnyAddressNode(addr)));
      });
    });
  }, [props.semaphore[0], props.search]);

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
      label: "Detail",
      resize: true,
      renderCell: item => <>
        <b>{item.recipient}</b><br/>
        <span title={item.line1}>{item.line1}</span><br/>
        <span title={item.line2}>{item.line2}</span>
      </>
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
  ] as Column<AnyAddressNode>[];

  const data = { nodes: rawData } as Data<AnyAddressNode>;

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 10% 60% 60px;`
    }
  ]);

  return (
    <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} style={{ width: "100%" }} />
  );
}
