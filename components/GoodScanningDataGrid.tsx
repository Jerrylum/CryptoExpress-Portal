"use client";

import { WithId, withId } from "@/internal/Utils";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { observer } from "mobx-react";
import { TableCopyableCell } from "./TableCopyableCell";
import { GoodMoment, RouteMoment } from "@/chaincode/RouteView";
import { Good } from "@/chaincode/Models";

export interface GoodScanningDataGridProps {
  scanned: Map<string, number>;
  moment: RouteMoment;
}

export const GoodScanningDataGrid = observer((props: GoodScanningDataGridProps) => {
  const expectedDelta = props.moment.expectedDelta;

  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px 60% minmax(0, 1fr) 120px;`
    }
  ]);

  type GoodRow = { id: string; uuid: string; name: string; barcode: string; quantity: number; expected: number };
  const rows = expectedDelta.map(good => {
    return {
      id: good.uuid,
      uuid: good.uuid,
      name: good.name,
      barcode: good.barcode,
      quantity: props.scanned.get(good.uuid) || 0,
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
      renderCell: item => <span>{item.quantity}/{item.expected}</span>
    }
  ] as Column<WithId<GoodRow>>[];

  const data = { nodes: rows } as Data<WithId<GoodRow>>;

  return <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />;
});
