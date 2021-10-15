/*
 * 於手機上掃條碼
 * ref→[html5-qrcode](https://github.com/mebjas/html5-qrcode)
 * JS module, ES6+
 */

let html5QrCode = undefined;
let targetElementId = undefined;

export function scanQrCode(dotNetObject, elementId, f_readStop) {
  try {
    //# 建立掃描物件，只掃QR Code而已。hidden
    targetElementId = elementId;
    document.getElementById(elementId).style.visibility = 'visible';
    html5QrCode = new Html5Qrcode(elementId, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] });

    //# 開始掃描 QR code
    html5QrCode.start(
      { facingMode: "environment" }, // to prefer back camera
      {
        fps: 10,    // Optional frame per seconds for qr code scanning
        qrbox: 250  // Optional if you want bounded box UI
      },
      qrCodeMessage => {
        //console.info('Code is read', qrCodeMessage);

        if (f_readStop) {
          html5QrCode.stop();
          document.getElementById(elementId).style.visibility = 'hidden';
        }

        dotNetObject.invokeMethodAsync('OnScanResponse', 'SUCCESS', qrCodeMessage);
      },
      errorMessage => {
        //console.warn('Parse error, ignore it.', errorMessage);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', errorMessage);
      }
    ).catch(err => {
      //console.error('Start failed, handle it.', err);
      dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
    });
  }
  catch (err) {
    console.error('scanQrCode Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
  }
}

export function stopScan(dotNetObject) {
  html5QrCode.stop().then((ignore) => {
    // QR Code scanning is stopped.
    dotNetObject.invokeMethodAsync('OnScanResponse', 'STOP', 'QR Code scanning is stopped.');
    document.getElementById(targetElementId).style.visibility = 'hidden';
  }).catch((err) => {
    // Stop failed, handle it.
    console.error('stopScan Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Stop failed! ' + JSON.stringify(err));
  });
}
