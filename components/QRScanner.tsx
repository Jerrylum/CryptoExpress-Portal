import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import React from "react";
import styles from "./QRScanner.module.scss";

export function QRScanner(props: {
  className?: string;
  QRconfig: Html5QrcodeScannerConfig;
  verbose: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback: QrcodeErrorCallback | undefined;
}) {
  const qrcodeRegionId = "qr-code-scanner-region";

  React.useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, props.QRconfig, props.verbose === true);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return <div id={qrcodeRegionId} className={[styles.QRScanner, (props.className ?? "")].join(" ")}/>;
}
