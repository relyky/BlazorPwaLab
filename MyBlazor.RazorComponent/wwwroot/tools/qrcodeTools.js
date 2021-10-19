/// <reference path="../html5-qrcode.min.js" />
/*
 * 於手機上掃條碼
 * ref→[html5-qrcode](https://github.com/mebjas/html5-qrcode)
 * JS module, ES6+
 * 
 * HTML 應用參考
<div style="width:600px; max-width:80vw; border:solid 1px darkgrey; background-color:lightgrey; padding:4px; margin: 8px auto; border-radius: 4px;">
    <div id="qrcodeReader" style="visibility:hidden"></div>
</div>
 */

let html5QrCode = undefined;
let targetElementId = undefined;

/// 掃描 QR code 後立刻停止
/// return string; QR code.
export async function scanQrCodeOnce(elementId) {
  return await Promise.resolve(new Promise((resolve, reject) => {
    //#region 轉換成 Promise 形式以處理非同步計算。

    //# 建立掃描物件，只掃QR Code而已。
    const targetElement = document.getElementById(elementId);
    targetElement.style.visibility = 'visible';
    const html5QrCode = new Html5Qrcode(elementId, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] });

    //# 開始掃描 QR code
    html5QrCode.start(
      { facingMode: "environment" }, // to prefer back camera
      {
        fps: 10,    // Optional frame per seconds for qr code scanning
        qrbox: 250  // Optional if you want bounded box UI
      },
      qrCodeMessage => {
        // console.log('Code is read', qrCodeMessage);

        //# when read code then stop immediately.
        html5QrCode.stop();
        targetElement.style.visibility = 'hidden';

        // return the scan code
        resolve(qrCodeMessage);
      },
      errorMessage => {
        // console.warn('Parse error, ignore it.', errorMessage);
      }
    ).catch(err => {
      console.error('Start failed, handle it.', err);
      throw new Error('啟動掃描 QR Code 失敗！');
    });

    //#endregion ------ 轉換成 Promise 形式以處理非同步計算。
  }));
}

/// 可連續掃描 QR code
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
        // console.warn('Parse error, ignore it.', errorMessage);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', errorMessage);
      }
    ).catch(err => {
      console.error('Start failed, handle it.', err);
      dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
    });
  }
  catch (err) {
    console.error('scanQrCode Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
  }
}

/// 停止連續掃描 QR code
export function stopScan(dotNetObject) {
  html5QrCode.stop().then((ignore) => {
    // console.log('QR Code scanning is stopped.', targetElementId);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'STOP', 'QR Code scanning is stopped.');
    document.getElementById(targetElementId).style.visibility = 'hidden';
  }).catch((err) => {
    // Stop failed, handle it.
    console.error('stopScan Exception!', err);
    dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Stop failed! ' + JSON.stringify(err));
  });
}

///// 掃描 QR code 後立刻停止(舊)
//export function scanQrCodeOnce(dotNetObject, elementId) {
//  try {
//    //# 建立掃描物件，只掃QR Code而已。
//    const targetElement = document.getElementById(elementId);
//    targetElement.style.visibility = 'visible';
//    const html5QrCode = new Html5Qrcode(elementId, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] });
//
//    //# 開始掃描 QR code
//    html5QrCode.start(
//      { facingMode: "environment" }, // to prefer back camera
//      {
//        fps: 10,    // Optional frame per seconds for qr code scanning
//        qrbox: 250  // Optional if you want bounded box UI
//      },
//      qrCodeMessage => {
//        //console.info('Code is read', qrCodeMessage);
//
//        // when read code then stop immediately.
//        html5QrCode.stop();
//        targetElement.style.visibility = 'hidden';
//
//        // send the scan code return
//        dotNetObject.invokeMethodAsync('OnScanResponse', 'SUCCESS', qrCodeMessage);
//      },
//      errorMessage => {
//        //console.warn('Parse error, ignore it.', errorMessage);
//        dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', errorMessage);
//      }
//    ).catch(err => {
//      //console.error('Start failed, handle it.', err);
//      dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
//    });
//  }
//  catch (err) {
//    //console.error('scanQrCode Exception!', err);
//    dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(err));
//  }
//}
