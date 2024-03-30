import React from "react";
import { observer } from "mobx-react";
import { Good } from "@/chaincode/Models";

// Define props type for the GoodsTable component
interface GoodsTableProps {
  goods: Good[]; // Annotate the goods parameter with the Good type array
  quantities: { [uuid: string]: number };
}

// Annotate the GoodsTable component's props with the GoodsTableProps
export const GoodsTable = observer(({ goods, quantities }: GoodsTableProps) => {
  return (
    <div className="pl-3 w-full">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">UUID</th>
            <th className="px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through each good and display its details along with the quantity in a table row */}
          {goods.map(good => (
            <tr key={good.uuid}>
              <td className="border px-4 py-2">{good.name}</td>
              <td className="border px-4 py-2">{good.uuid}</td>
              {/* Use the good's uuid to find its quantity from the quantities mapping */}
              <td className="border px-4 py-2">{quantities[good.uuid]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
