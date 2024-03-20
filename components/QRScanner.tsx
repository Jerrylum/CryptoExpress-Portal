import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

export function QRScanner(props: {
  QRconfig: Html5QrcodeScannerConfig;
  verbose: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback: QrcodeErrorCallback | undefined;
}) {
  const qrcodeRegionId = "ElementId";
  let html5QrcodeScanner: Html5QrcodeScanner | undefined = undefined;
  useEffect(() => {
    if (html5QrcodeScanner) return;
    // when component mounts
    const verbose = props.verbose === true;
    // Suceess callback is required.
    html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, props.QRconfig, verbose);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
  }, []);

  return <div id={qrcodeRegionId} />;
}
