"use client";

import { Button, Timeline } from "flowbite-react";
import React from "react";
import { useMobxStorage } from "@/internal/Utils";
import { observer } from "mobx-react";
import { GoodAndQuantity } from "@/internal/Models";
import { EditableTimeline, TimelineEditableItem } from "./TimelineEditableItem";

// observable
export interface StopAndTransport {
  address: string | null; // Hash ID
  expectedArrivalTimestamp: number; // unix timestamp
  input: GoodAndQuantity[];
  output: GoodAndQuantity[];
  courier: string | null;
  transportInfo: string;
}

export const RouteProposalCreatePage = observer(() => {
  const timeline = useMobxStorage(() => new EditableTimeline(), []);

  React.useEffect(() => {
    timeline.refreshAddressList();
    timeline.refreshCourierList();
  }, []);

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Create a Route Proposal</h2>

      <Timeline>
        {timeline.stopAndTransportList.map((sat, idx) => (
          <TimelineEditableItem key={idx} sat={sat} timeline={timeline} />
        ))}
      </Timeline>
      <div className="my-3">
        <Button
          color="gray"
          onClick={() => {
            timeline.addDestination();
          }}>
          Add Destination
        </Button>
      </div>
      <div className="my-3">
        <Button
          color="gray"
          onClick={() => {
            // TODO
          }}>
          Create Proposal
        </Button>
      </div>
    </div>
  );
});
