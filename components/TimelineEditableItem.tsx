"use client";

import { UnixDate } from "@/internal/Models";
import { Timeline, Button, Dropdown, Datepicker, Textarea } from "flowbite-react";
import { runInAction, action } from "mobx";
import { observer } from "mobx-react";
import { GoodAndQuantityDataGrid } from "./GoodAndQuantityDataGrid";
import { HiRefresh, HiArrowNarrowDown } from "react-icons/hi";
import React from "react";
import { GoodSelectModal } from "./GoodSelectModal";
import { EditableTimeline, StopAndTransport } from "@/internal/EditableTimeline";

export const TimelineEditableItem = observer((props: { sat: StopAndTransport; timeline: EditableTimeline }) => {
  const input = props.sat.input;
  const output = props.sat.output;

  const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);

  const addr = props.timeline.addressList.find(address => address.hashId === props.sat.address);
  const courier = props.timeline.courierList.find(courier => courier.hashId === props.sat.courier);

  const stopIndex = props.timeline.stopAndTransportList.indexOf(props.sat);
  const previousStop = props.timeline.stopAndTransportList[stopIndex - 1] as StopAndTransport | undefined;
  const previousStopDate = new UnixDate(previousStop?.expectedArrivalTimestamp ?? 0);
  const minDate = previousStopDate;
  const minTime = unixDate.isSameDay(previousStopDate) ? previousStopDate.toTimeString() : undefined;

  React.useEffect(() => {
    if (minDate !== undefined && minDate.toDate() > unixDate.toDate()) {
      runInAction(() => {
        props.sat.expectedArrivalTimestamp = minDate.unixTimestamp;
      });
    }
  }, [minDate?.toDateString()]);

  React.useEffect(() => {
    if (minTime !== undefined && minDate !== undefined && minTime > unixDate.toTimeString()) {
      runInAction(() => {
        props.sat.expectedArrivalTimestamp = minDate.unixTimestamp;
      });
    }
  }, [minTime]);

  return (
    <Timeline.Item>
      <Timeline.Point icon={HiArrowNarrowDown} />
      <Timeline.Content>
        {props.timeline.stopAndTransportList.length > 2 && (
          <Button
            color="gray"
            onClick={() => {
              props.timeline.removeStop(props.sat);
            }}>
            Remove Destination
          </Button>
        )}
        <h3 className="mt-5">Address:</h3>
        <div className="my-2 *:text-left [&>button:first-child]:min-w-[50%] [&>button:first-child]:max-w-full [&>button:first-child>span]:w-full [&>button:first-child>span]:flex-wrap [&>button:first-child>span]:justify-between flex items-baseline gap-2">
          <Dropdown
            label={
              addr === undefined ? (
                <i>Select an Address</i>
              ) : (
                <span>
                  <b>{addr.recipient}</b>
                  <br />
                  {addr.line1}
                  <br />
                  {addr.line2}
                </span>
              )
            }
            dismissOnClick={true}
            className=" "
            color="gray">
            <Dropdown.Header>
              <a href="/addresses" target="_blank">
                Create an Address
              </a>
            </Dropdown.Header>
            {props.timeline.addressList.map(address => (
              <Dropdown.Item key={address.hashId} onClick={action(() => (props.sat.address = address.hashId))}>
                <span className="w-full text-left">
                  <b>{address.recipient}</b>
                  <br />
                  {address.line1}
                  <br />
                  {address.line2}
                </span>
              </Dropdown.Item>
            ))}
          </Dropdown>
          <Button
            color="gray"
            onClick={() => {
              props.timeline.refreshAddressList();
            }}>
            <HiRefresh />
          </Button>
        </div>
        <h3 className="mt-5">Expected Arrival Date & Time:</h3>
        <div className="my-2 *:bg-white flex gap-2 [&_input]:bg-gray-50">
          <Datepicker
            color="gray"
            minDate={minDate?.toDate()}
            value={unixDate.toDateString()}
            onSelectedDateChanged={action(newDate => {
              const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);
              props.sat.expectedArrivalTimestamp = unixDate.setDate(newDate).unixTimestamp;
            })}
          />
          <input
            type="time"
            min={minTime}
            value={unixDate.toTimeString()}
            onChange={action(e => {
              const setValue = e.currentTarget.value;
              if (setValue === "") return;
              const unixDate = new UnixDate(props.sat.expectedArrivalTimestamp);
              props.sat.expectedArrivalTimestamp = unixDate.setTime(setValue as `${number}:${number}`).unixTimestamp;
            })}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
        <h3 className="mt-5">Import:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={input} />
        </div>
        <div className="my-3">
          <GoodSelectModal
            ignored={input.map(val => val.uuid)}
            onSelect={action(value => {
              input.push({
                ...value,
                quantity: 1,
                minQuantity: 1,
                maxQuantity: Number.MAX_SAFE_INTEGER,
                removable: true
              });
            })}
          />
        </div>
        <h3 className="mt-5">Export:</h3>
        <div className="my-2">
          <GoodAndQuantityDataGrid data={output} />
        </div>
        <div className="my-3">
          <GoodSelectModal
            ignored={output.map(val => val.uuid)}
            onSelect={action(value => {
              output.push({
                ...value,
                quantity: 1,
                minQuantity: 1,
                maxQuantity: Number.MAX_SAFE_INTEGER,
                removable: true
              });
            })}
          />
        </div>
        {props.timeline.isLastStop(props.sat) === false && (
          <>
            <h3 className="mt-10">Courier:</h3>
            <div className="my-2 *:text-left [&>button:first-child]:min-w-[50%] [&>button:first-child]:max-w-full [&>button:first-child>span]:w-full [&>button:first-child>span]:flex-wrap [&>button:first-child>span]:justify-between flex items-baseline gap-2">
              <Dropdown
                label={
                  courier === undefined ? (
                    <i>Select a Courier</i>
                  ) : (
                    <span>
                      <b>{courier.name}</b>
                      <br />
                      {courier.company}
                      <br />
                      {courier.telephone}
                    </span>
                  )
                }
                dismissOnClick={true}
                className=" "
                color="gray">
                <Dropdown.Header>
                  <a href="/couriers" target="_blank">
                    Create a Courier
                  </a>
                </Dropdown.Header>
                {props.timeline.courierList.map(courier => (
                  <Dropdown.Item key={courier.hashId} onClick={action(() => (props.sat.courier = courier.hashId))}>
                    <span className="w-full text-left">
                      <b>{courier.name}</b>
                      <br />
                      {courier.company}
                      <br />
                      {courier.telephone}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown>
              <Button
                color="gray"
                onClick={() => {
                  props.timeline.refreshCourierList();
                }}>
                <HiRefresh />
              </Button>
            </div>
            <h3 className="mt-5">Transport Info:</h3>
            <div className="my-2">
              <Textarea
                placeholder="Extra Information for Courier"
                value={props.sat.transportInfo}
                onChange={action(e => (props.sat.transportInfo = e.target.value))}
              />
            </div>
          </>
        )}
      </Timeline.Content>
    </Timeline.Item>
  );
});
