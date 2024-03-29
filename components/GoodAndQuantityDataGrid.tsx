"use client";

import { WithId, withId } from "@/internal/Utils";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { action } from "mobx";
import { observer } from "mobx-react";
import { TableCopyableCell } from "./TableCopyableCell";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { GoodAndQuantity } from "@/internal/Models";


export const GoodAndQuantityDataGrid = observer((props: { data: GoodAndQuantity[] }) => {
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