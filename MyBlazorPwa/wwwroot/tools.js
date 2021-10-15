



async function scanQrCodeAsync(dotNetObject) {
  try {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");

    //# 開始掃qrcode
    html5QrCode.start(
      { facingMode: "environment" }, // to prefer back camera
      {
        fps: 10,    // Optional frame per seconds for qr code scanning
        qrbox: 250  // Optional if you want bounded box UI
      },
      qrCodeMessage => {
        // do something when code is read
        console.info('qrCodeMessage', qrCodeMessage);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'SUCCESS', qrCodeMessage);
      },
      errorMessage => {
        // parse error, ignore it.
        console.warn('Parse error, ignore it.', errorMessage);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', 'Parse error. ' + errorMessage);
      })
      .catch(err => {
        // Start failed, handle it.
        console.error('Start failed, handle it.', err);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
      });
  }
  catch (err) {
    console.error('scanQrCode Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
  }
  finally {

  }
}

async function stopQrCodeAsync(dotNetObject) {
  try {
    html5QrCode.stop().then((ignore) => {
      // QR Code scanning is stopped.
    }).catch((err) => {
      // Stop failed, handle it.
    });
  }
  catch (err) {
    console.error('scanQrCode Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
  }
  finally {

  }
}
