"use client";

import { Button, Timeline } from "flowbite-react";
import React from "react";
import { useMobxStorage } from "@/internal/Utils";
import { observer } from "mobx-react";
import { TimelineEditableItem } from "./TimelineEditableItem";
import { EditableTimeline } from "@/internal/EditableTimeline";
import * as RouteCollection from "@/internal/RouteCollection";

export const CommitProgressPage = observer(() => {
  const timeline = useMobxStorage(() => new EditableTimeline(), []);

  React.useEffect(() => {
    timeline.refreshAddressList();
    timeline.refreshCourierList();
  }, []);

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Create a Route Proposal</h2>

      <div className="pl-3 w-full">
        <Timeline>
          {timeline.stopAndTransportList.map((sat, idx) => (
            <TimelineEditableItem key={idx} sat={sat} timeline={timeline} />
          ))}
        </Timeline>
      </div>
      <div className="my-3">
        <Button
          color="gray"
          onClick={() => {
            timeline.addStop();
          }}>
          Add Stop
        </Button>
      </div>
      <div className="my-3">
        <Button
          color="gray"
          onClick={async () => {
            try {
              const routeMobX = timeline.toRoute();
              const route = JSON.parse(JSON.stringify(routeMobX));
              
              console.log(route);
              RouteCollection.createProposal(route);
            } catch (e) {
              console.log(e);
              
              alert(e);
            }
          }}>
          Create Proposal
        </Button>
      </div>
    </div>
  );
});
