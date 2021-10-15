'use strict';

function scanQrCodeAsync(dotNetObject) {
  return regeneratorRuntime.async(function scanQrCodeAsync$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap((function callee$1$0() {
          var html5QrCode, devices, cameraId;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                html5QrCode = new Html5Qrcode( /* element id */"reader");
                context$2$0.next = 3;
                return regeneratorRuntime.awrap(Html5Qrcode.getCameras());

              case 3:
                devices = context$2$0.sent;
                context$2$0.next = 6;
                return regeneratorRuntime.awrap(Promise.resolve(new Promise(function (resolve, reject) {
                  if (devices && devices.length) resolve(devices[0].id);else reject(new Error('Not found camera!'));
                })));

              case 6:
                cameraId = context$2$0.sent;

                console.log('devices', { cameraId: cameraId, devices: devices });

                //# 設定後鏡頭，If you want to prefer back camera
                //html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

                //# 開始掃qrcode
                html5QrCode.start(cameraId, {
                  fps: 10, // Optional frame per seconds for qr code scanning
                  qrbox: 250 // Optional if you want bounded box UI
                }, function (qrCodeMessage) {
                  // do something when code is read
                  console.info('qrCodeMessage', qrCodeMessage);
                  dotNetObject.invokeMethodAsync('OnScanResponse', 'SUCCESS', qrCodeMessage);
                }, function (errorMessage) {
                  // parse error, ignore it.
                  console.warn('Parse error, ignore it.', errorMessage);
                  dotNetObject.invokeMethodAsync('OnScanResponse', 'WARN', 'Parse error. ' + errorMessage);
                })['catch'](function (err) {
                  // Start failed, handle it.
                  console.error('Start failed, handle it.', err);
                  dotNetObject.invokeMethodAsync('OnScanResponse', 'ERROR', 'Start failed! ' + JSON.stringify(err));
                });

              case 9:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        })());

      case 3:
        context$1$0.next = 9;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);

        console.error('scanQrCode Exception!', context$1$0.t0);
        dotNetObject.invokeMethodAsync('OnScanResponse', 'EXCEPTION', 'scanQrCode Exception! ' + JSON.stringify(context$1$0.t0));

      case 9:
        context$1$0.prev = 9;
        return context$1$0.finish(9);

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 5, 9, 11]]);
}

//# 抓取設備，This method will trigger user permissions

