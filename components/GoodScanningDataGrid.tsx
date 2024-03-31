"use client";

import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { observer } from "mobx-react";
import { TableCopyableCell } from "./TableCopyableCell";
import { RouteMoment } from "@/chaincode/RouteView";
import React from "react";
import { action } from "mobx";

export interface GoodScanningDataGridProps {
  scanned: { [key: string]: number };
  moment: RouteMoment;
}

type GoodRow = { id: string; uuid: string; name: string; barcode: string; quantity: number; expected: number };

const GoodQuantityCell = observer((props: { row: GoodRow; scanned: { [key: string]: number } }) => {
  const item = props.row;
  const scanned = props.scanned;

  const num = scanned[item.uuid] || 0;

  const [qtyInput, setQtyInput] = React.useState(num + "");

  React.useEffect(() => {
    setQtyInput(num + "");
  }, [num]);

  const onConfirm = action((e: React.SyntheticEvent<HTMLInputElement>) => {
    let val = new Number(qtyInput).valueOf();
    if (isNaN(val) || val < 0) val = num;
    scanned[item.uuid] = val;
    setQtyInput(scanned[item.uuid] + "");

    e.currentTarget.blur();
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onConfirm(e);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onConfirm(e);
  };

  return (
    <span>
      <input
        value={qtyInput}
        onChange={e => setQtyInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className="w-12 border-[1px] rounded text-right pr-1"
      />
      /{item.expected}
    </span>
  );
});

export const GoodScanningDataGrid = observer((props: GoodScanningDataGridProps) => {
  const expectedDelta = props.moment.expectedDelta;

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px 60% minmax(0, 1fr) 120px;`
    }
  ]);

  const rows = expectedDelta.map(good => {
    return {
      id: good.uuid,
      uuid: good.uuid,
      name: good.name,
      barcode: good.barcode,
      quantity: props.scanned[good.uuid] || 0,
      expected: good.quantity
    };
  });

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
      resize: true,
      renderCell: item => item.barcode
    },
    {
      label: "Qty.",
      resize: true,
      renderCell: item => <GoodQuantityCell row={item} scanned={props.scanned} />
    }
  ] as Column<GoodRow>[];

  const data = { nodes: rows } as Data<GoodRow>;

  return <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />;
});
