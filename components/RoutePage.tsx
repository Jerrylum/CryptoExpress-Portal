"use client";

import { Button, Dropdown, Timeline } from "flowbite-react";

import { HiArrowNarrowRight, HiTrash } from "react-icons/hi";

export interface StopAndTransport {
  address: string | null; // Hash ID
  expectedArrivalTimestamp: number;
  input: { [goodUuid: string]: number };
  output: { [goodUuid: string]: number };
  courier: string | null;
  transportInfo: string;
}

interface g {}

function EditableTimelineItem(props: { sat: StopAndTransport }) {
  return (
    <Timeline.Item>
      <Timeline.Point icon={HiTrash} />
      <Timeline.Content>
        <Timeline.Time>February 2022</Timeline.Time>
        <Timeline.Title>Application UI code in Tailwind CSS</Timeline.Title>
        <Timeline.Body>
          Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order
          E-commerce & Marketing pages.
        </Timeline.Body>
        <Button color="gray">
          Learn More
          <HiArrowNarrowRight className="ml-2 h-3 w-3" />
        </Button>
      </Timeline.Content>
    </Timeline.Item>
  );
}

export function RoutePage() {
  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">Create a Route Proposal</h2>

      <Timeline>
        <Timeline.Item>
          <Timeline.Point icon={HiTrash} />
          <Timeline.Content>
            {/* <Timeline.Body> */}
            {/* </Timeline.Body> */}
            <div></div>
            <div className="my-1 *:text-left">
              <Dropdown
                label={
                  <span>
                    <b>Person Name</b>
                    <br />
                    Line 1<br />
                    Line 2<br />
                  </span>
                }
                dismissOnClick={false}
                className=""
                color="gray">
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
            <Button color="gray">
              Learn More
              <HiArrowNarrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiTrash} />
          <Timeline.Content>
            <Timeline.Time>March 2022</Timeline.Time>
            <Timeline.Title>Marketing UI design in Figma</Timeline.Title>
            <Timeline.Body>
              All of the pages and components are first designed in Figma and we keep a parity between the two versions
              even as we update the project.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiTrash} />
          <Timeline.Content>
            <Timeline.Time>April 2022</Timeline.Time>
            <Timeline.Title>E-Commerce UI code in Tailwind CSS</Timeline.Title>
            <Timeline.Body>
              Get started with dozens of web components and interactive elements built on top of Tailwind CSS.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </div>
  );
}
