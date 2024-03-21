"use client";

import React, { useState } from "react";
import { useSemaphore } from "./SemaphoreHook";
import { QRScanner } from "./QRScanner";
import { QRScannerDataGrid } from "./QRScannerDataGrid";
import { Html5QrcodeResult } from "html5-qrcode";
import { Dropdown } from "flowbite-react";

export function QRScannerPage() {
  const [decodedResults, setDecodedResults] = useState<Html5QrcodeResult[]>([]);
  const semaphore = useSemaphore();
  const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log("App [result]", decodedResult);
    setDecodedResults(prev => [...prev, decodedResult]);
    semaphore[1]();
  };
  return (
    <div className="max-sm:fixed left-2 right-2 top-[70px] bottom-2 sm:w-full h-full">
      {/* <h2 className="mb-12 text-3xl font-semibold">QR Code Scanner</h2> */}
      <div className="h-full relative">
        <QRScanner
          className="h-full max-h-[calc(100%-200px)]"
          config={{
            fps: 10,
            qrbox: { width: 250, height: 100 },
            disableFlip: false,
            videoConstraints: {
              height: 50
            }
          }}
          verbose={false}
          qrCodeSuccessCallback={onNewScanResult}
          qrCodeErrorCallback={undefined}
        /> 
        <div className="w-full h-[200px] max-sm:absolute max-sm:bottom-0 bg-white">
          <Dropdown label="Dropdown top" placement="top" color={"gray"}>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          <br />
          <br />
          <br />
          <br />
          Hello
        </div>
      </div>
      {/* <QRScannerDataGrid results={decodedResults} /> */}
    </div>
  );
}
