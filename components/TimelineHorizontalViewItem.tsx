import { StopView } from "@/chaincode/RouteView";
import { UnixDate } from "@/internal/Models";
import { Timeline } from "flowbite-react";
import { observer } from "mobx-react";
import React from "react";
import { AddressCard } from "./AddressCard";
import { HiArrowNarrowRight } from "react-icons/hi";

export const RouteStopAndTransport = observer((props: { stop: StopView }) => {
  const stop = props.stop;
  const addr = stop.address;
  const expectedArrivalTimestamp = new UnixDate(stop.expectedArrivalTimestamp);

  return (
    <Timeline.Item>
      <Timeline.Point icon={HiArrowNarrowRight} />
      <Timeline.Content>
        <Timeline.Time>
          <p className="py-2">
            {expectedArrivalTimestamp.toDateString()} {expectedArrivalTimestamp.toTimeString()}
          </p>
        </Timeline.Time>
        <Timeline.Body>
          <AddressCard address={addr} className="min-w-auto" />
        </Timeline.Body>
      </Timeline.Content>
    </Timeline.Item>
  );
});
