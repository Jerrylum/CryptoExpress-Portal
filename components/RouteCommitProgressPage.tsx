"use client";

import React from "react";
import { Button, TextInput } from "flowbite-react";
import { Observer, observer } from "mobx-react";
import { CommitDetail, Good } from "@/chaincode/Models";
import { RouteMoment, RouteView } from "@/chaincode/RouteView";
import { useSearchParams } from "next/navigation";
import { AddressCard } from "./AddressCard";
import { CourierCard } from "./CouriserCard";
import { useAsyncHook } from "./AsyncHook";
import * as RouteCollection from "@/internal/RouteCollection";
import * as InternalAddressCollection from "@/internal/InternalAddressCollection";
import * as InternalCourierCollection from "@/internal/InternalCourierCollection";
import { useMobxStorage } from "@/internal/Utils";
import { action, observable } from "mobx";
import { GoodScanningDataGrid } from "./GoodScanningDataGrid";
import { UnixDate } from "@/internal/Models";
import { useSemaphore } from "./SemaphoreHook";

// Assuming necessary imports for Commit, TransportStep, etc., are correctly in place

const MomentInformation = observer((props: { moment: RouteMoment }) => {
  const moment = props.moment;

  if (moment.event === "srcOutgoing") {
    return (
      <div className="w-full">
        <p className="mb-2">Outgoing from address</p>
        <div className="flex gap-2 flex-wrap items-center">
          <AddressCard address={moment.currentStop.address} className="!min-w-[30%]" />
          <span>to</span>
          <CourierCard courier={moment.transport.courier} className="!min-w-[30%]" />
        </div>
      </div>
    );
  } else if (moment.event === "courierReceiving") {
    return (
      <div className="w-full">
        <p className="mb-2">Courier receiving goods</p>
        <div className="flex gap-2 flex-wrap items-center">
          <CourierCard courier={moment.transport.courier} className="!min-w-[30%]" />
          <span>from</span>
          <AddressCard address={moment.currentStop.address} className="!min-w-[30%]" />
        </div>
      </div>
    );
  } else if (moment.event === "courierDelivering") {
    return (
      <div className="w-full">
        <p className="mb-2">Courier delivering goods</p>
        <div className="flex gap-2 flex-wrap items-center">
          <CourierCard courier={moment.transport.courier} className="!min-w-[30%]" />
          <span>to</span>
          <AddressCard address={moment.currentStop.address} className="!min-w-[30%]" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full">
        <p className="mb-2">Incoming to address</p>
        <div className="flex gap-2 flex-wrap items-center">
          <AddressCard address={moment.currentStop.address} className="min-w-[30%]" />
          <span>from</span>
          <CourierCard courier={moment.transport.courier} className="min-w-[30%]" />
        </div>
      </div>
    );
  }
});

export const RouteCommitProgressForm = observer((props: { routeView: RouteView; currentMoment: RouteMoment }) => {
  const routeView = props.routeView;
  const firstUncommittedMoment = props.currentMoment;

  const goods = routeView.model.goods;
  const barcodeMap: { [key: string]: Good } = React.useMemo(() => {
    const rtn: { [key: string]: Good } = {};
    Object.values(goods).forEach(good => {
      rtn[good.barcode] = good;
    });

    return rtn;
  }, []);

  const segmentIndex = routeView.transports.indexOf(firstUncommittedMoment.transport);
  const step = firstUncommittedMoment.event;

  const canCommit =
    useAsyncHook(() => {
      if (step === "srcOutgoing" || step === "dstIncoming") {
        return InternalAddressCollection.has(firstUncommittedMoment.entity.hashId);
      } else {
        return InternalCourierCollection.has(firstUncommittedMoment.entity.hashId);
      }
    }, []) || false;

  const scanned = useMobxStorage(() => observable<{ [goodUuid: string]: number }>({}), []);

  const barcodeInputRef = React.useRef<HTMLInputElement>(null);

  const onScan = action(() => {
    const barcode = barcodeInputRef.current?.value || "";
    const good: Good | undefined = barcodeMap[barcode];

    if (good === undefined) {
      barcodeInputRef.current!.value = "";
      return;
    }

    scanned[good.uuid] = (scanned[good.uuid] || 0) + 1;
    barcodeInputRef.current!.value = "";
  });

  const onCommit = async () => {
    const commitDetail = {
      delta: scanned,
      info: "",
      timestamp: UnixDate.now().unixTimestamp
    } satisfies CommitDetail;
    await RouteCollection.commitProgress(routeView.model, segmentIndex, step, commitDetail);
    window.location.reload();
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold">Import/Export Commit</h2>
      <p className="my-2">Route ID: {routeView.uuid}</p>

      <div className="w-full my-5">
        <h3 className="my-2 text-2xl">Current Step</h3>
        <MomentInformation moment={firstUncommittedMoment} />
      </div>

      {canCommit && (
        <>
          <div className="w-full my-5">
            <h3 className="my-2 text-2xl">Scanning</h3>
            <div className="w-full flex gap-2">
              <TextInput ref={barcodeInputRef} type="text" className="min-w-[50%]" placeholder="Barcode" />
              <Button color="gray" onClick={onScan}>
                Enter
              </Button>
            </div>
          </div>

          <div className="w-full my-5">
            <GoodScanningDataGrid scanned={scanned} moment={firstUncommittedMoment} />
          </div>

          <div className="w-full my-5">
            {/* TODO info */}
            <Button color="gray" onClick={onCommit}>
              Commit
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

export const RouteCommitProgressPage = observer(() => {
  const searchParams = useSearchParams();

  const routeUuid = searchParams.get("uuid") || "";
  const route = useAsyncHook(() => RouteCollection.getRoute(routeUuid), []);

  if (!routeUuid) {
    return <div>Route UUID not provided</div>;
  }

  if (route === null) {
    return <div>Loading...</div>;
  }

  if (route === undefined) {
    return <div>Route not found</div>;
  }

  const routeView = new RouteView(route);

  const firstUncommittedMoment = routeView.moments.find(m => m.commit === null);

  if (firstUncommittedMoment === undefined) {
    return <div>Route is already completed</div>;
  }

  return <RouteCommitProgressForm routeView={routeView} currentMoment={firstUncommittedMoment} />;
});
