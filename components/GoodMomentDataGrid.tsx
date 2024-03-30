"use client";

import { WithId, withId } from "@/internal/Utils";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { observer } from "mobx-react";
import { TableCopyableCell } from "./TableCopyableCell";
import { GoodMoment } from "@/chaincode/RouteView";


export const GoodMomentDataGrid = observer((props: { data: readonly GoodMoment[] }) => {
  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80px 60% minmax(0, 1fr) 80px;`
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
      label: "Barcode",
      resize: true,
      renderCell: item => item.barcode
    },
    {
      label: "Qty.",
      resize: true,
      renderCell: item => item.quantity
    }
  ] as Column<WithId<GoodMoment>>[];

  const data = { nodes: props.data.map(val => withId(val, "uuid")) } as Data<WithId<GoodMoment>>;

  return <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} />;
});