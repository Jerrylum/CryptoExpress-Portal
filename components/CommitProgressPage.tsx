"use client";

import React, { useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { observer } from "mobx-react";
import { Good, Route, RouteProposal, SignatureHexString, TransportStep } from "@/chaincode/Models";

// Assuming necessary imports for Commit, TransportStep, etc., are correctly in place

export const CommitProgressPage = observer(() => {
  // State management for form fields
  const [routeUuid, setRouteUuid] = useState("");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [step, setStep] = useState<TransportStep>("srcOutgoing");
  const [commitDetail, setCommitDetail] = useState("");
  const [signature, setSignature] = useState("");

  const [goods, setGoods] = useState<Good[]>([]);
  const [quantities, setQuantities] = useState<{[uuid: string]: number}>({});
  const [barcode, setBarcode] = useState(""); 

  // Handler for form submission
  const handleSubmit = async () => {
    // Logic to handle the submission of progress information
  };

  const addGood = () => {
    const newGood = new Good();
    newGood.uuid = "asd";
    newGood.name = "asd";
    newGood.barcode = barcode;
    
    setGoods([...goods, newGood]);
    setQuantities({...quantities, [newGood.uuid]: 1});
  };

  const updateGoodQuantity = (uuid: string, delta: number) => {
    const newQuantity = Math.max((quantities[uuid] || 0) + delta, 0);
    setQuantities({...quantities, [uuid]: newQuantity});
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Commit Route Progress</h2>
      <div className="w-full max-w-xs">
        {/* Text input for Route UUID */}
        <div className="mb-4">
          <Label htmlFor="routeUuid">Route UUID</Label>
          <TextInput
            id="routeUuid"
            type="text"
            value={routeUuid}
            onChange={(e) => setRouteUuid(e.target.value)}
          />
        </div>
        {/* Text input for Segment Index */}
        <div className="mb-4">
          <Label htmlFor="segmentIndex">Segment Index</Label>
          <TextInput
            id="segmentIndex"
            type="number"
            value={segmentIndex}
            onChange={(e) => setSegmentIndex(Number(e.target.value))}
          />
        </div>
        {/* Select dropdown for choosing the Transport Step */}
        <div className="mb-4">
          <Label htmlFor="step">Step</Label>
          <Select
            id="step"
            value={step}
            onChange={(e) => setStep(e.target.value as TransportStep)}
          >
            <option value="srcOutgoing">Source Outgoing</option>
            <option value="courierReceiving">Courier Receiving</option>
            <option value="courierDelivering">Courier Delivering</option>
            <option value="dstIncoming">Destination Incoming</option>
          </Select>
        </div>
        {/* UI Components */}
        {/* Input for barcode and button to add a good */}
        <div className="mb-4">
          <Label htmlFor="barcode">Barcode</Label>
          <TextInput id="barcode" type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
          <Button onClick={addGood}>Add Good</Button>
        </div>
        {/* Displaying the list of goods with buttons to adjust quantity */}
        {goods.map((good) => (
          <div key={good.uuid}>
            <span>{good.name}</span>
            <Button onClick={() => updateGoodQuantity(good.uuid, -1)}>-</Button>
            <span>{quantities[good.uuid] || 0}</span>
            <Button onClick={() => updateGoodQuantity(good.uuid, 1)}>+</Button>
          </div>
        ))}
        {/* Additional inputs for Commit Detail and Signature */}
        <Button onClick={handleSubmit}>Submit Commit</Button>
      </div>
    </div>
  );
});
