"use client";

import { observer } from "mobx-react";
import React, { useMemo } from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import { Route, RouteProposal } from "@/chaincode/Models";
import { Button, Timeline } from "flowbite-react";
import { RouteView } from "@/chaincode/RouteView";
import { Semaphore, SemaphoreContext, useSemaphore } from "./SemaphoreHook";
import { RouteStopAndTransport } from "./TimelineVerticalViewItem";
import { useMobxStorage } from "@/internal/Utils";
import { action, observable } from "mobx";

export interface RouteLike {
  route: Route;
  signatures: string[];
  isProposal: boolean;
  version: number;
  // refresh: () => void;
}

export const RouteLikeContext = React.createContext<RouteLike>({} as RouteLike);

export const RouteVerticalTimeline = observer((props: {}) => {
  const routeLike = React.useContext(RouteLikeContext);

  const routeView = new RouteView(routeLike.route);

  return (
    <Timeline>
      {routeView.stops.map((sv, idx) => (
        <RouteStopAndTransport key={idx} stop={sv} />
      ))}
    </Timeline>
  );
});

export const RouteLikeSection = observer((props: { route: Route; signatures: string[] | undefined }) => {
  const routeLike = useMobxStorage<RouteLike>(
    () =>
      observable(
        {
          route: props.route,
          signatures: props.signatures || [],
          isProposal: props.signatures !== undefined,
          version: 0
        },
        undefined,
        { deep: false }
      ),
    []
  );

  const allInvokedEntities = [...Object.keys(routeLike.route.addresses), ...Object.keys(routeLike.route.couriers)];

  const allSignedEntities = routeLike.signatures || [];
  const isSubmittable = allSignedEntities.length === allInvokedEntities.length;

  const dataSemaphore = React.useContext(SemaphoreContext);

  React.useEffect(() => {
    if (routeLike.version !== 0) {
      // Skip first render
      if (routeLike.isProposal) {
        RouteCollection.getProposal(routeLike.route.uuid).then(
          action(proposal => {
            routeLike.route = proposal.route;
            routeLike.signatures = Object.keys(proposal.signatures);
          })
        );
      } else {
        RouteCollection.getRoute(routeLike.route.uuid).then(action(r => (routeLike.route = r)));
      }
    }
  }, [routeLike.version]);

  return (
    <RouteLikeContext.Provider value={routeLike}>
      <div className="w-full my-10">
        <p className="my-2">Route ID: {routeLike.route.uuid}</p>
        <div className="pl-3 w-full">
          <RouteVerticalTimeline />
        </div>
        {routeLike.isProposal && (
          <div className="w-full flex gap-2">
            <Button
              disabled={!isSubmittable}
              onClick={() => {
                RouteCollection.submitProposal(routeLike.route.uuid).then(() => dataSemaphore[1]());
              }}>
              Submit
            </Button>
            <Button
              onClick={() => {
                RouteCollection.removeProposal(routeLike.route.uuid).then(() => dataSemaphore[1]());
              }}>
              Remove
            </Button>
          </div>
        )}
      </div>
    </RouteLikeContext.Provider>
  );
});

export const RouteManagePage = observer(() => {
  const [rawProposalData, setRawProposalData] = React.useState<RouteProposal[]>([]);
  const [rawRouteData, setRawRouteData] = React.useState<Route[]>([]);
  const [isPending, startTransition] = React.useTransition();

  const dataSemaphore = useSemaphore();

  React.useEffect(() => {
    startTransition(() => {
      RouteCollection.listProposal().then(list => {
        setRawProposalData(rawData => [...list]);
      });
      RouteCollection.listRoute().then(list => {
        setRawRouteData(rawData => [...list]);
      });
    });
  }, [dataSemaphore[0]]); // TODO

  React.useEffect(() => {
    console.log("rawData", rawProposalData);
  }, [rawProposalData]);

  return (
    <SemaphoreContext.Provider value={dataSemaphore}>
      <div className="w-full" id="main-content">
        <h2 className="mb-12 text-3xl font-semibold">All Route Proposals</h2>
        <div className="w-full">
          {rawProposalData.map((RouteProposal, idx) => (
            <RouteLikeSection
              key={idx}
              route={RouteProposal.route}
              signatures={Object.keys(RouteProposal.signatures)}
            />
          ))}
        </div>
        <h2 className="mb-12 text-3xl font-semibold">All Submitted Route</h2>
        <div className="w-full">
          {rawRouteData.map((route, idx) => (
            <RouteLikeSection key={idx} route={route} signatures={undefined} />
          ))}
        </div>
      </div>
    </SemaphoreContext.Provider>
  );
});
