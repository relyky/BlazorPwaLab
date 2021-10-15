/*
 * 於手機上掃條碼
 * ref→[html5-qrcode](https://github.com/mebjas/html5-qrcode)
 * JS module, ES6+
 */

let html5QrCode = undefined;
let targetElementId = undefined;

export async function scanQrCodeAsync(elementId, dotNetObject) {
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
        dotNetObject.invokeMethodAsync('OnScanResponse', 'SUCCESS', qrCodeMessage);
      },
      errorMessage => {
        //console.warn('Parse error, ignore it.', errorMessage);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', 'Parse error. ' + errorMessage);
      }
    ).catch(err => {
      //console.error('Start failed, handle it.', err);
      dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
    });
  }
  catch (err) {
    console.error('scanQrCodeAsync Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
  }
}

export async function stopScanAsync(dotNetObject) {
  try {
    await html5QrCode.stop();
    // QR Code scanning is stopped.
    dotNetObject.invokeMethodAsync('OnScanResponse', 'STOP', 'QR Code scanning is stopped.');
    document.getElementById(targetElementId).style.visibility = 'hidden';
  }
  catch (err) {
    // Stop failed, handle it.
    console.error('stopQrCodeAsync Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Stop failed! ' + JSON.stringify(err));
  }
}
