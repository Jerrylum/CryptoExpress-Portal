import { Good } from "@/chaincode/Models";
import { WithId, withId } from "@/internal/Utils";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { Column } from "@table-library/react-table-library/types/compact";
import { Data } from "@table-library/react-table-library/types/table";
import { Modal, TextInput, Button } from "flowbite-react";
import React from "react";
import { useSemaphore } from "./SemaphoreHook";
import { TableCopyableCell } from "./TableCopyableCell";
import { HiRefresh, HiOutlinePlus } from "react-icons/hi";

export function GoodSelectModal(props: { ignored: string[]; onSelect: (value: Good) => void }) {
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