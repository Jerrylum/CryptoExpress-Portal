"use client";

import { observer } from "mobx-react";
import React from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { Address, Courier, Route, RouteProposal, SignatureHexString } from "@/chaincode/Models";
import { Button, Timeline } from "flowbite-react";
import { HiOutlineArrowCircleDown } from "react-icons/hi";
import { createHashIdObject, exportPublicKey, generateKeyPair, omitProperty, signObject } from "@/chaincode/Utils";
import { RouteView } from "@/chaincode/RouteView";
import classNames from "classnames";

const RouteProposalTimelineItem = observer((props: { rp: RouteProposal }) => {
  const routeView = new RouteView(props.rp.route);
  const allHashIdList = [...Object.keys(props.rp.route.addresses), ...Object.keys(props.rp.route.couriers)];
  const isFullSigned = Object.keys(props.rp.signatures).length === allHashIdList.length;
  return (
    <>
      {routeView.stops.map(sv => (
        <>
          <Timeline.Item>
            <Timeline.Point icon={HiOutlineArrowCircleDown} />
            <Timeline.Content>
              <b>
                <h3 className="mt-5">{sv.address.recipient}</h3>
              </b>
              {sv.address.line1}
              <br />
              {sv.address.line2}
            </Timeline.Content>
          </Timeline.Item>
          {sv.nextTransport === null ? (
            <>
              <Button
                className="h-6 w-20"
                onClick={async () => {
                  const addresses = Object.values(props.rp.route.addresses);

                  // find internal address with private key
                  const internalAddressesWithPrivateKey = await InternalAddressCollection.list();

                  const signableAddresses = internalAddressesWithPrivateKey.filter(addrWithKey => {
                    return addresses.some(targetAddr => targetAddr.hashId === addrWithKey.hashId);
                  });

                  // couriers
                  const couriers = Object.values(props.rp.route.couriers);
                  // find internal courier with private key
                  const internalCouriersWithPrivateKey = await InternalCourierCollection.list();

                  const signableCouriers = internalCouriersWithPrivateKey.filter(courierWithKey => {
                    return couriers.some(targetCourier => targetCourier.hashId === courierWithKey.hashId);
                  });
                  // all signable s
                  const signables = [...signableAddresses, ...signableCouriers];
                  // sign them
                  for (const signable of signables) {
                    const privateKey = signable.privateKey;
                    const signature = signObject(props.rp.route, privateKey);
                    // call chaincode to sign
                    RouteCollection.signProposal(props.rp.route.uuid, signable.hashId, signature);
                  }
                }}>
                Sign
              </Button>
              <Button
                className="h-6 w-20"
                onClick={async () => {
                  RouteCollection.removeProposal(sv.route.uuid);
                }}>
                Remove
              </Button>
              <Button
                className={classNames("h-6", "w-20", { hidden: !isFullSigned })}
                onClick={async () => {
                  RouteCollection.submitProposal(sv.route.uuid);
                }}>
                Submit
              </Button>
              <Button className="h-6 w-20" onClick={async () => {}}>
                Commit
              </Button>
            </>
          ) : (
            <Timeline.Item>
              {/* <Timeline.Point icon={HiOutlineArrowCircleDown} /> */}
              <Timeline.Content>
                <b>
                  <h3 className="mt-5">{sv.nextTransport.courier.name}</h3>
                </b>
                {sv.nextTransport.courier.company}
                <br />
                {sv.nextTransport.courier.telephone}
              </Timeline.Content>
            </Timeline.Item>
          )}
        </>
      ))}
    </>
  );
});

// const RouteViewTimelineItem = observer((props: { rv: RouteView; stop: StopView }) => {
//   return (
//     <Timeline.Item>
//       <Button
//         onClick={() => {
//           props.stop.address.hashId;
//         }}
//       />
//     </Timeline.Item>
//   );
// });

// const RouteViewTimelineItems = observer((props: { rv: RouteView; stop: StopView }) => {
//   return (
//     <>
//       {
//         props.rv.transports.map(tv => (
//           <RouteViewTimelineItem key={tv.source.address.hashId} rv={props.rv} stop={tv.source} />
//         ))
//       }
//     </>
//   )
// });

export const RouteManagePage = observer(() => {
  const uuid = "550e8400e29b41d4a716446655440000";
  const good1 = { uuid: "uuid000000000001", name: "name1", barcode: "barcode1" };
  const good2 = { uuid: "uuid000000000002", name: "name2", barcode: "barcode2" };

  const addrA: Address = createHashIdObject({
    line1: "my line1 A",
    line2: "my line2 A",
    recipient: "my recipient A",
    publicKey: ""
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

  //const allRouteProposal = await RouteCollection.list()
  const allRouteProposal: RouteProposal[] = [];
  allRouteProposal.push({ route: testRoute, signatures: {} });
  allRouteProposal.push({ route: testRoute2, signatures: {} });
  return (
    <div className="w-full" id="main-content">
      <h2 className="mb-12 text-3xl font-semibold">Route Proposal Management</h2>
      <div className="pl-3 w-full">
        {allRouteProposal.map((RouteProposal, idx) => (
          <>
            <Timeline>
              <RouteProposalTimelineItem key={idx} rp={RouteProposal} />
            </Timeline>
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-1 mx-auto my-4 bg-gray-200 border-0 rounded dark:bg-gray-700" />
            </div>
          </>
        ))}
      </div>
    </div>
  );
});