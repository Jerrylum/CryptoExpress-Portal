"use client";

import { observer } from "mobx-react";
import React from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { Address, Courier, Route, RouteProposal, SignatureHexString } from "@/chaincode/Models";
import { Button, Timeline } from "flowbite-react";
import { HiOutlineArrowCircleDown, HiArrowNarrowDown } from "react-icons/hi";
import { createHashIdObject, exportPublicKey, generateKeyPair, omitProperty, signObject } from "@/chaincode/Utils";
import { RouteView, StopView } from "@/chaincode/RouteView";
import classNames from "classnames";
import { useSemaphore } from "./SemaphoreHook";
import { UnixDate } from "@/internal/Models";
import { GoodMomentDataGrid } from "./GoodMomentDataGrid";

const SignLabel = observer((props: { isSigned: boolean }) => {
  if (props.isSigned) return <span className="text-gray-400">Signed</span>;
  else return <span className="text-gray-400">Not Signed</span>;
});

export const RouteStopAndTransport = observer((props: { stop: StopView; signatures: string[] | undefined }) => {
  const stop = props.stop;
  const addr = stop.address;
  const transport = stop.nextTransport;
  const courier = transport?.courier;
  const expectedArrivalTimestamp = new UnixDate(stop.expectedArrivalTimestamp);
  const input = stop.expectedInput;
  const output = stop.expectedOutput;

  const isProposal = props.signatures !== undefined;
  const isAddressSigned = props.signatures?.includes(addr.hashId) || false;
  const isCourierSigned = (courier && props.signatures?.includes(courier.hashId)) || false;
  const [canSignAddress, setCanSignAddress] = React.useState(false);
  const [canSignCourier, setCanSignCourier] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (isProposal && isAddressSigned === false && (await InternalAddressCollection.has(stop.address.hashId))) {
        setCanSignAddress(true);
      }
      if (isProposal && courier && isCourierSigned === false && (await InternalCourierCollection.has(courier.hashId))) {
        setCanSignCourier(true);
      }
    })();
  }, []);

  const onSignAddress = () => {
    RouteCollection.signProposalByAddress(stop.route.model, addr.hashId);
  };

  const onSignCourier = () => {
    RouteCollection.signProposalByCourier(stop.route.model, courier!.hashId);
  };

  return (
    <>
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
    </>
  );
});

export const RouteTimeline = observer((props: { route: Route; signatures: string[] | undefined }) => {
  const routeView = new RouteView(props.route);

  return (
    <>
      {routeView.stops.map((sv, idx) => (
        <RouteStopAndTransport key={idx} stop={sv} signatures={props.signatures} />
      ))}
    </>
  );
});

export const RouteLike = observer((props: { route: Route; signatures: string[] | undefined }) => {
  const route = props.route;
  const allInvokedEntities = [...Object.keys(route.addresses), ...Object.keys(route.couriers)];

  const isProposal = props.signatures !== undefined;

  const allSignedEntities = props.signatures || [];
  const [ownedInvokedNonSignedEntities, setOwnedInvokedNotSignedEntities] = React.useState<string[]>([]);
  const isSignable = ownedInvokedNonSignedEntities.length > 0;
  const isSubmittable = allSignedEntities.length === allInvokedEntities.length;

  React.useEffect(() => {
    (async () => {
      const list: string[] = [];
      for (const hashId of allInvokedEntities) {
        const isOwnedInvoked =
          (await InternalAddressCollection.has(hashId)) || (await InternalCourierCollection.has(hashId));
        if (isOwnedInvoked && !allSignedEntities.includes(hashId)) {
          list.push(hashId);
        }
      }

      setOwnedInvokedNotSignedEntities(list);
    })();
  }, []);

  return (
    <div className="w-full my-10">
      <p className="my-2">Route ID: {route.uuid}</p>
      <div className="pl-3 w-full">
        <Timeline>
          <RouteTimeline route={route} signatures={props.signatures} />
        </Timeline>
      </div>
      {isProposal && (
        <div className="w-full flex gap-2">
          <Button disabled={!isSignable} onClick={() => {}}>
            Sign
          </Button>
          <Button disabled={!isSubmittable} onClick={() => {}}>
            Submit
          </Button>
          <Button onClick={() => {}}>Remove</Button>
        </div>
      )}
    </div>
  );
});

export const RouteManagePage = observer(() => {
  const uuid = "550e8400e29b41d4a716446655440000";
  const good1 = { uuid: "uuid000000000001", name: "name1", barcode: "barcode1" };
  const good2 = { uuid: "uuid000000000002", name: "name2", barcode: "barcode2" };

  const addrA: Address = createHashIdObject({
    line1: "918 Meadow Close",
    line2: "Suite 421",
    recipient: "Erin Torphy",
    publicKey:
      "3052301006072a8648ce3d020106052b81040003033e000448e6afdca15baa4dda124036fce2b5d5f60a105db4b125c5091f374c38045672249d9c9c465f79ccbb8d5246f45007990d9bd3add5471eadff2adc0f"
  });

  const addrB: Address = createHashIdObject({
    line1: "my line1 B",
    line2: "my line2 B",
    recipient: "my recipient B",
    publicKey: ""
  });

  const addrC: Address = createHashIdObject({
    line1: "my line1 C",
    line2: "my line2 C",
    recipient: "my recipient C",
    publicKey: ""
  });

  const courier: Courier = createHashIdObject({
    name: "my name",
    company: "my company",
    telephone: "my telephone",
    publicKey: ""
  });

  const courier2: Courier = createHashIdObject({
    name: "my name 2",
    company: "my company 2",
    telephone: "my telephone 2",
    publicKey: ""
  });

  const testRoute = {
    uuid,
    goods: { [good1.uuid]: good1, [good2.uuid]: good2 },
    addresses: { [addrA.hashId]: addrA, [addrB.hashId]: addrB, [addrC.hashId]: addrC },
    couriers: { [courier.hashId]: courier, [courier2.hashId]: courier2 },
    source: {
      address: addrA.hashId,
      expectedArrivalTimestamp: 0,
      input: {},
      output: { [good1.uuid]: 1, [good2.uuid]: 1 },
      next: {
        courier: courier.hashId,
        info: "info",
        destination: {
          address: addrB.hashId,
          expectedArrivalTimestamp: 10,
          input: { [good1.uuid]: 1, [good2.uuid]: 1 },
          output: {},
          next: {
            courier: courier2.hashId,
            info: "info",
            destination: {
              address: addrC.hashId,
              expectedArrivalTimestamp: 20,
              input: { [good1.uuid]: 1, [good2.uuid]: 1 },
              output: {}
              // next: undefined
            }
          }
        }
      }
    },
    commits: [{}, {}]
  } as Route;

  const testRoute2 = testRoute;

  const [rawData, setRawData] = React.useState<RouteProposal[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const dataSemaphore = useSemaphore();

  React.useEffect(() => {
    startTransition(() => {
      RouteCollection.listProposal().then(list => {
        setRawData(rawData => [
          ...list,
          { route: testRoute, signatures: {} } as RouteProposal,
          { route: testRoute2, signatures: {} } as RouteProposal
        ]);
      });
    });
  }, [dataSemaphore[0]]);

  React.useEffect(() => {
    console.log("rawData", rawData);
  }, [rawData]);

  return (
    <div className="w-full" id="main-content">
      <h2 className="mb-12 text-3xl font-semibold">All Route Proposals</h2>
      <div className="w-full">
        {rawData.map((RouteProposal, idx) => (
          <RouteLike key={idx} route={RouteProposal.route} signatures={Object.keys(RouteProposal.signatures)} />
        ))}
      </div>
    </div>
  );
});
