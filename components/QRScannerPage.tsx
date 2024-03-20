"use client";

import React, { useState } from "react";
import { useSemaphore } from "./SemaphoreHook";
import { QRScanner } from "./QRScanner";
import { QRScannerDataGrid } from "./QRScannerDataGrid";
import { Html5QrcodeResult } from "html5-qrcode";

export function QRScannerPage() {
  const [decodedResults, setDecodedResults] = useState<Html5QrcodeResult[]>([]);
  const semaphore = useSemaphore();
  const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log("App [result]", decodedResult);
    setDecodedResults(prev => [...prev, decodedResult]);
    semaphore[1]();
  };
  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-semibold">QR Code Scanner</h2>
      <QRScanner
        QRconfig={{
          fps: 10,
          qrbox: {width: 250, height:100},
          disableFlip: false
        }}
        verbose={false}
        qrCodeSuccessCallback={onNewScanResult}
        qrCodeErrorCallback={undefined}
      />
      <QRScannerDataGrid results={decodedResults} />
    </div>
  );
}
