"use client";

import { Timeline } from "flowbite-react";
import React from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { HiArrowNarrowDown, HiCheck } from "react-icons/hi";
import { GoodMoment, RouteMoment, StopView } from "@/chaincode/RouteView";
import { UnixDate } from "@/internal/Models";
import { GoodMomentDataGrid } from "./GoodMomentDataGrid";
import { RouteLikeContext } from "./RouteManagePage";
import { observer } from "mobx-react";
import { action } from "mobx";
import { AddressCard } from "./AddressCard";
import { CourierCard } from "./CouriserCard";
import { GoodMomentDeltaDataGrid } from "./GoodMomentDeltaDataGrid";

const SignLabel = (props: { isSigned: boolean }) => {
  if (props.isSigned) return <span className="text-gray-400">Signed</span>;
  else return <span className="text-gray-400">Not Signed</span>;
};

const getDeltaTimeString = (unixDelta: number): `${number}h ${number}m` | `${number}m` => {
  const delta = unixDelta / 60;
  const hours = Math.floor(delta / 60);
  const minutes = delta % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const getGoodMomentsDelta = (expected: readonly GoodMoment[], actual: readonly GoodMoment[]): GoodMoment[] => {
  const buffer1 = new Map<string, GoodMoment>(expected.map(val => [val.uuid, val]));
  const buffer2 = new Map<string, number>(expected.map(val => [val.uuid, -val.quantity]));

  actual.forEach(val => buffer2.set(val.uuid, val.quantity - (buffer1.get(val.uuid)?.quantity ?? 0)));

  return Array.from(buffer2.entries())
    .filter(([_, delta]) => delta !== 0)
    .map(([uuid, delta]) => ({ ...buffer1.get(uuid)!, quantity: delta }));
};

const TimeInformation = (props: { expectedUnixTimestamp: number; actualUnixTimestamp: number | null }) => {
  if (props.actualUnixTimestamp === null) {
    return <span>--</span>;
  }

  const expected = new UnixDate(props.expectedUnixTimestamp);
  const actual = new UnixDate(props.actualUnixTimestamp);

  if (expected.unixTimestamp > actual.unixTimestamp) {
    const delta = expected.unixTimestamp - actual.unixTimestamp;

    return (
      <span>
        {actual.toDateString()} {actual.toTimeString()} (early by {getDeltaTimeString(delta)})
      </span>
    );
  } else if (expected.unixTimestamp === actual.unixTimestamp) {
    return (
      <span>
        {actual.toDateString()} {actual.toTimeString()} (on time)
      </span>
    );
  } else {
    const delta = actual.unixTimestamp - expected.unixTimestamp;

    return (
      <span>
        {actual.toDateString()} {actual.toTimeString()} (late by {getDeltaTimeString(delta)})
      </span>
    );
  }
};

const MomentInformation = (props: { moment: RouteMoment }) => {
  let title = "";
  switch (props.moment.event) {
    case "courierDelivering":
      title = "Courier confirms goods delivery to the destination.";
      break;
    case "dstIncoming":
      title = "Destination confirms incoming delivery.";
      break;
    case "srcOutgoing":
      title = "Source confirms outgoing delivery.";
      break;
    case "courierReceiving":
      title = "Courier confirms goods receiving from the source.";
      break;
  }

  let anomaliesInfo: React.ReactNode = "";
  if (props.moment.actualDelta !== null) {
    const delta = getGoodMomentsDelta(props.moment.expectedDelta, props.moment.actualDelta);
    if (delta.length > 0) {
      anomaliesInfo = (
        <>
          <p>The following anomalies were reported during the delivery:</p>
          <div className="w-full">
            <GoodMomentDeltaDataGrid data={delta} />
          </div>
        </>
      );
    } else {
      anomaliesInfo = "No anomalies reported.";
    }
  }

  const extraNotes = props.moment.commit?.detail.info;

  return (
    <Timeline.Item>
      <Timeline.Point icon={props.moment.commit ? HiCheck : undefined} />
      <Timeline.Content>
        <Timeline.Time>
          <TimeInformation
            expectedUnixTimestamp={props.moment.expectedTimestamp}
            actualUnixTimestamp={props.moment.actualTimestamp}
          />
        </Timeline.Time>
        <p className="mb-1">{title}</p>
        {anomaliesInfo}
        {extraNotes && (
          <>
            <p className="my-1">Extra notes:</p>
            <div className="whitespace-pre-line text-gray-500">{extraNotes}</div>
          </>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
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
  }, [routeLike.version, isProposal, !!courier, isAddressSigned, isCourierSigned]);

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
        {!isProposal && stop.courierDelivering && stop.dstIncoming && (
          <>
            <h3 className="mt-5 mb-3">Incoming Commits:</h3>
            <Timeline>
              <MomentInformation moment={stop.courierDelivering} />
              <MomentInformation moment={stop.dstIncoming} />
            </Timeline>
          </>
        )}
        <h3 className="">Address:</h3>
        <div className="flex gap-2">
          <AddressCard address={addr} />
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
        <h3 className="mt-5">Import:</h3>
        <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
          <div className="w-[768px] md:w-full">
            <GoodMomentDataGrid data={input} />
          </div>
        </div>
        <h3 className="mt-5">Export:</h3>
        <div className="w-full mb-4 overflow-x-auto md:overflow-hidden">
          <div className="w-[768px] md:w-full">
            <GoodMomentDataGrid data={output} />
          </div>
        </div>
        {transport && courier && (
          <>
            <h3 className="mt-5">Courier:</h3>
            <div className="flex gap-2">
              <CourierCard courier={courier} />
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
        {!isProposal && stop.srcOutgoing && stop.courierReceiving && (
          <>
            <h3 className="mt-5 mb-3">Outgoing Commits:</h3>
            <Timeline>
              <MomentInformation moment={stop.srcOutgoing} />
              <MomentInformation moment={stop.courierReceiving} />
            </Timeline>
          </>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
});
