
const DB_NAME = "MyIndexDb";

/// return resultList; // List<FcmPushInfo>
export async function qryNotice(dotNetObject, args) {
  return await Promise.resolve(new Promise((resolve, reject) => {
    //#region 轉換成 Promise 形式以處理非同步計算。

    const resultList = [];
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = function (event) {
      console.error('qryNotice FAIL! open indexedDB fail!', event);
      reject('qryNotice FAIL! open indexedDB fail!');
    };

    request.onupgradeneeded = HandleUpgradeNeeded;

    request.onsuccess = function (event) {
      const db = request.result;

      const objectStore = db.transaction("Notice").objectStore("Notice");

      objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          resultList.push(cursor.value);
          cursor.continue();
        }
        else {
          console.log('qryNotice SUCCESS.', resultList);
          resolve(resultList);
        }
      };
    };

    //#endregion ------ 轉換成 Promise 形式以處理非同步計算。
  }));
}

//export function qryNotice(dotNetObject, args) {
//  const resultList = [];

//  const request = indexedDB.open(DB_NAME, 1);

//  request.onerror = function (event) {
//    console.error('open indexedDB fail!', event);
//  };

//  request.onupgradeneeded = HandleUpgradeNeeded;

//  request.onsuccess = function (event) {
//    const db = request.result;

//    const objectStore = db.transaction("Notice").objectStore("Notice");

//    objectStore.openCursor().onsuccess = function (event) {
//      var cursor = event.target.result;
//      if (cursor) {
//        resultList.push(cursor.value);
//        cursor.continue();
//      }
//      else {
//        console.log('Got all items', resultList);
//        dotNetObject.invokeMethodAsync('OnQueryResponse', 'Notice', resultList);
//      }
//    };
//  };
//}

//----------------------------------------------------------

class FcmPushInfo {
  constructor(title, body, url, imageUrl) {
    this.title = title || '';
    this.body = body || '';
    this.url = url || '';
    this.imageUrl = imageUrl || '';
  }
}

// This is what our customer data looks like.
const initDataList = [
  new FcmPushInfo('訊息抬頭１', '這是測試訊息１。', 'http://www.google.com.tw', 'http://www.asiavista.com.tw/AppPortal/images/logo.png'),
  new FcmPushInfo('訊息抬頭２', '這是測試訊息２。', 'http://www.asiavista.com.tw', 'http://www.asiavista.com.tw/AppPortal/images/logo.png'),
  new FcmPushInfo('訊息抬頭３', '這是測試訊息３。', 'http://www.asiavista.com.tw', 'http://www.asiavista.com.tw/AppPortal/images/logo.png'),
];

/// 資料庫昇級
function HandleUpgradeNeeded(event) {
  const db = event.target.result;

  // Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique.
  const objectStore = db.createObjectStore("Notice", { keyPath: "title" });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex("title", "title", { unique: true });

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  objectStore.createIndex("body", "body", { unique: false });

  // Store values in the newly created objectStore.
  initDataList.forEach((item, i) => {
    objectStore.add(item);
  });
};
