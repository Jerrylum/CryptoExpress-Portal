import { Html5QrcodeResult } from "html5-qrcode";
import React from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Data, TableNode } from "@table-library/react-table-library/types/table";
import { Column, CompactTable } from "@table-library/react-table-library/compact";
class AnyHtml5QrcodeResultNode implements TableNode {
  constructor(public _obj: Html5QrcodeResult) {}

  get id() {
    return this._obj.decodedText;
  }

  get decodedText() {
    return this._obj.decodedText;
  }

  get result() {
    return this._obj.result;
  }
}

export function filterResults(results: Html5QrcodeResult[]): Html5QrcodeResult[] {
  // Filter unique results.
  let filteredResults = [];
  for (var i = 0; i < results.length; ++i) {
    if (i === 0) {
      filteredResults.push(results[i]);
      continue;
    }

    if (results[i].decodedText !== results[i - 1].decodedText) {
      filteredResults.push(results[i]);
    }
  }
  return filteredResults;
}

export function QRScannerDataGrid(props: { results: Html5QrcodeResult[] }) {
  const results = filterResults(props.results);
  const theme = useTheme([
    getTheme(),
    {
      Table: `--data-table-library_grid-template-columns: 80% minmax(0, 1fr);`
    }
  ]);
  const columns = [
    {
      label: "Decoded Text",
      resize: true,
      renderCell: item => <span title={item.decodedText}>{item.decodedText}</span>
    },
    {
      label: "Format",
      renderCell: item => <span>{item.result.format ? item.result.format.formatName : undefined}</span>
    }
  ] as Column<AnyHtml5QrcodeResultNode>[];

  const data = { nodes: results } as Data<AnyHtml5QrcodeResultNode>;
  return (
    <CompactTable columns={columns} data={data} theme={theme} layout={{ custom: true }} style={{ width: "100%" }} />
  );
}
