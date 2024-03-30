import { Courier } from "@/chaincode/Models";
import classNames from "classnames";

export function CourierCard(props: { courier: Courier; className?: string }) {
  const courier = props.courier;
  return (
    <div
      className={classNames(
        "bg-white border border-gray-200 rounded-lg shadow p-3 inline-block min-w-[50%]",
        props.className
      )}>
      <b>{courier.name}</b>
      <br />
      {courier.company}
      <br />
      {courier.telephone}
    </div>
  );
}
