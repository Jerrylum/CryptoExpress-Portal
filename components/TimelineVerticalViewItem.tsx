import { Timeline } from "flowbite-react";
import React from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { HiArrowNarrowDown } from "react-icons/hi";
import { StopView } from "@/chaincode/RouteView";
import { UnixDate } from "@/internal/Models";
import { GoodMomentDataGrid } from "./GoodMomentDataGrid";
import { RouteLikeContext } from "./RouteManagePage";
import { observer } from "mobx-react";
import { action } from "mobx";

const SignLabel = (props: { isSigned: boolean }) => {
  if (props.isSigned) return <span className="text-gray-400">Signed</span>;
  else return <span className="text-gray-400">Not Signed</span>;
};

export const RouteStopAndTransport = observer((props: { stop: StopView }) => {
  const routeLike = React.useContext(RouteLikeContext);

  const stop = props.stop;
  const addr = stop.address;
  const transport = stop.nextTransport;
  const courier = transport?.courier;
  const expectedArrivalTimestamp = new UnixDate(stop.expectedArrivalTimestamp);
  const input = stop.expectedInput;
  const output = stop.expectedOutput;

  const isProposal = routeLike.isProposal;
  const isAddressSigned = routeLike.signatures.includes(addr.hashId) || false;
  const isCourierSigned = (courier && routeLike.signatures.includes(courier.hashId)) || false;
  const [canSignAddress, setCanSignAddress] = React.useState(false);
  const [canSignCourier, setCanSignCourier] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setCanSignAddress(
        isProposal && isAddressSigned === false && (await InternalAddressCollection.has(stop.address.hashId))
      );
      setCanSignCourier(
        isProposal && !!courier && isCourierSigned === false && (await InternalCourierCollection.has(courier.hashId))
      );
    })();
  }, [routeLike.version, isProposal, !!courier, isAddressSigned]);

  const onSignAddress = () => {
    RouteCollection.signProposalByAddress(stop.route.model, addr.hashId).then(action(() => routeLike.version++));
  };

  const onSignCourier = () => {
    RouteCollection.signProposalByCourier(stop.route.model, courier!.hashId).then(action(() => routeLike.version++));
  };

  return (
    <Timeline.Item>
      <Timeline.Point icon={HiArrowNarrowDown} />
      <Timeline.Content>
        <Timeline.Time>
          {expectedArrivalTimestamp.toDateString()} {expectedArrivalTimestamp.toTimeString()}
        </Timeline.Time>
        <h3 className="">Address:</h3>
        <div className="flex gap-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow p-3 inline-block min-w-[50%]">
            <b>{addr.recipient}</b>
            <br />
            {addr.line1}
            <br />
            {addr.line2}
          </div>
          {isProposal && (
            <div>
              <SignLabel isSigned={isAddressSigned} />
              &nbsp;
              {canSignAddress && (
                <span className="text-blue-600 cursor-pointer" onClick={onSignAddress}>
                  {"<"}Sign{">"}
                </span>
              )}
            </div>
          )}
        </div>
        <h3 className="mt-5">Input:</h3>
        <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
          <div className="w-[768px] md:w-full">
            <GoodMomentDataGrid data={input} />
          </div>
        </div>
        <h3 className="mt-5">Output:</h3>
        <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
          <div className="w-[768px] md:w-full">
            <GoodMomentDataGrid data={output} />
          </div>
        </div>
        {transport && courier && (
          <>
            <h3 className="mt-5">Courier:</h3>
            <div className="flex gap-2">
              <div className="bg-white border border-gray-200 rounded-lg shadow p-3 inline-block min-w-[50%]">
                <b>{courier.name}</b>
                <br />
                {courier.company}
                <br />
                {courier.telephone}
              </div>
              {isProposal && (
                <div>
                  <SignLabel isSigned={isCourierSigned} />
                  &nbsp;
                  {canSignCourier && (
                    <span className="text-blue-600 cursor-pointer" onClick={onSignCourier}>
                      {"<"}Sign{">"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {transport && transport.info != "" && (
          <>
            <h3 className="mt-5">Transport Info:</h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow p-3 inline-block min-w-[50%]">
              {transport.info}
            </div>
          </>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
});
