"use client";

import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import React from "react";
import styles from "./QRScanner.module.scss";

let scannerInstance: Html5QrcodeScanner | undefined;

export function getScanner() {
  return scannerInstance;
}

export function QRScanner(props: {
  className?: string;
  config: Html5QrcodeScannerConfig;
  verbose: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback: QrcodeErrorCallback | undefined;
}) {
  const qrCodeRegionId = "qr-code-scanner-region";

  React.useEffect(() => {
    if (scannerInstance !== undefined) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(qrCodeRegionId, props.config, props.verbose);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
    scannerInstance = html5QrcodeScanner;
  }, []);

  return <div id={qrCodeRegionId} className={[styles.QRScanner, (props.className ?? "")].join(" ")}/>;
}
