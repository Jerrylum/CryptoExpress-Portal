"use client";

import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import React from "react";
import styles from "./QRScanner.module.scss";
import { randomUUID } from "@/internal/Utils";

export function QRScanner(props: {
  className?: string;
  config: Html5QrcodeScannerConfig;
  verbose: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback: QrcodeErrorCallback | undefined;
}) {
  const id = React.useMemo(() => randomUUID(), []);
  const qrCodeRegionId = `qr-code-scanner-region-${id}`;

  const html5QrcodeScannerRef = React.useRef<Html5QrcodeScanner | null>(null);
  const mountTimeRef = React.useRef(Date.now());

  React.useEffect(() => {
    if (html5QrcodeScannerRef.current === null) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(qrCodeRegionId, props.config, props.verbose);
      html5QrcodeScannerRef.current.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
      mountTimeRef.current = Date.now();
    }

    return () => {
      const delta = Date.now() - mountTimeRef.current;
      if (delta < 300) {
        console.log(`QRScanner unmounted too quickly in ${delta}ms, ignoring`);
        return;
      }
      html5QrcodeScannerRef.current?.clear();
    };
  }, []);

  return <div id={qrCodeRegionId} className={[styles.QRScanner, props.className ?? ""].join(" ")} />;
}
