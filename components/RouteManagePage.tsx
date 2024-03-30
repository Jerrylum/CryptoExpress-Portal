"use client";

import { observer } from "mobx-react";
import React, { useMemo } from "react";
import * as RouteCollection from "@/internal/RouteCollection";
import { Route, RouteProposal } from "@/chaincode/Models";
import { Button, Timeline } from "flowbite-react";
import { RouteView } from "@/chaincode/RouteView";
import { Semaphore, SemaphoreContext, useSemaphore } from "./SemaphoreHook";
import { RouteStopAndTransport } from "./TimelineVerticalViewItem";
import { RouteStopAndTransport as RouteStopAndTransportHorizontal } from "./TimelineHorizontalViewItem";
import { useMobxStorage } from "@/internal/Utils";
import { action, observable } from "mobx";
import { useAsyncTransition } from "./AsyncHook";

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
    <div className="pl-3 w-full">
      <Timeline>
        {routeView.stops.map((sv, idx) => (
          <RouteStopAndTransport key={idx} stop={sv} />
        ))}
      </Timeline>
    </div>
  );
});

export const RouteHorizontalTimeline = observer((props: {}) => {
  const routeLike = React.useContext(RouteLikeContext);

  const routeView = new RouteView(routeLike.route);

  return (
    <div className="w-full mb-4 overflow-x-auto">
      <div className="pl-3 pt-3 w-[max-content]">
        <Timeline horizontal>
          {routeView.stops.map((sv, idx) => (
            <RouteStopAndTransportHorizontal key={idx} stop={sv} />
          ))}
        </Timeline>
      </div>
    </div>
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
            if (!proposal) return;
            routeLike.route = proposal.route;
            routeLike.signatures = Object.keys(proposal.signatures);
          })
        );
      } else {
        RouteCollection.getRoute(routeLike.route.uuid).then(action(r => r && (routeLike.route = r)));
      }
    }
  }, [routeLike.version]);

  return (
    <RouteLikeContext.Provider value={routeLike}>
      <div className="w-full mb-10">
        <p className="my-2">Route ID: {routeLike.route.uuid}</p>
        <RouteHorizontalTimeline />
        {routeLike.isProposal ? (
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
        ) : new RouteView(routeLike.route).moments.find(m => m.commit === null) ? (
          <div className="w-full flex gap-2">
            <Button
              onClick={() => {
                window.location.href = "/routes/commit?uuid=" + routeLike.route.uuid;
              }}>
              Commit
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </RouteLikeContext.Provider>
  );
});

export const RouteManagePage = observer(() => {
  const dataSemaphoreRouteProposal = useSemaphore();
  const dataSemaphoreRoute = useSemaphore();

  const [proposals, isPendingProposal] = useAsyncTransition(
    () => RouteCollection.listProposal(),
    [dataSemaphoreRouteProposal[0]]
  );

  const [routes, isPendingRoute] = useAsyncTransition(() => RouteCollection.listRoute(), [dataSemaphoreRoute[0]]);

  return (
    <div className="w-full" id="main-content">
      <h2 className="mt-12 mb-2 text-3xl font-semibold">All Route Proposals</h2>
      <SemaphoreContext.Provider value={dataSemaphoreRouteProposal}>
        <span className="[&>a]:inline">
          <Button as="a" href="/routes/create" className="my-4">
            Create
          </Button>
        </span>
        {(isPendingProposal || !proposals) && <p>Loading...</p>}
        {!isPendingProposal && proposals && proposals.length === 0 && <p>No route proposal found</p>}
        {!isPendingProposal &&
          proposals &&
          proposals.length !== 0 &&
          proposals.map((rp, idx) => (
            <RouteLikeSection key={idx} route={rp.route} signatures={Object.keys(rp.signatures)} />
          ))}
      </SemaphoreContext.Provider>

      <h2 className="mt-12 mb-2 text-3xl font-semibold">All Submitted Route</h2>
      <SemaphoreContext.Provider value={dataSemaphoreRoute}>
        {(isPendingRoute || !routes) && <p>Loading...</p>}
        {!isPendingRoute && routes && routes.length === 0 && <p>No route found</p>}
        {!isPendingRoute &&
          routes &&
          routes.length !== 0 &&
          routes.map((rt, idx) => <RouteLikeSection key={idx} route={rt} signatures={undefined} />)}
      </SemaphoreContext.Provider>
    </div>
  );
});
