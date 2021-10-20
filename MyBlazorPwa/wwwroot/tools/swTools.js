/**
 * JavaScript module:ES6+  
 */

const SW_JS_PATH = '/service-worker.js'

/// ref→ https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/// return Boolean
export function isSupportPush() {
  return ('serviceWorker' in navigator && 'PushManager' in window);
}

/// return Boolean
export function isSupportNotify() {
  return ('Notification' in window);
}

/// return Object
export function checkSupport() {
  return {
    serviceWorker: ('serviceWorker' in navigator),
    PushManager: ('PushManager' in window),
    Notification: ('Notification' in window),
    indexedDB: ("indexedDB" in window)
  }
}

/// return PushSubscription
export async function getUserSubscription() {
  try {
    if (!isSupportPush())
      throw new Error('Push is not support.');

    const swRegistration = await navigator.serviceWorker.getRegistration(SW_JS_PATH);
    if (!swRegistration)
      return null;

    const subscription = await swRegistration.pushManager.getSubscription();
    return subscription;
  }
  catch (err) {
    console.error('getUserSubscription exception!', err);
    throw err;
  }
}

/// 使用者訂閱，並同時註冊或更新註冊。
/// return PushSubscription
export async function subscribeUser(vapidPublicKey) {
  try {
    if (!isSupportPush())
      throw new Error('Push is not support.');

    // 取得註冊
    let swRegistration = await navigator.serviceWorker.getRegistration(SW_JS_PATH);
    if (swRegistration === null) {
      // 若已註冊則更新註冊
      const swReg = await swRegistration.update();
      console.log('subscribeUser => swRegistration.update', swReg);
      swRegistration = swReg;
    }
    else {
      // 若未註冊則註冊
      const swReg = await navigator.serviceWorker.register(SW_JS_PATH);
      console.log('subscribeUser => swRegistration.register', swReg);
      swRegistration = swReg;
    }

    // 若已訂閱，回傳現有訂閱。
    let subscription = await swRegistration.pushManager.getSubscription();
    if (subscription !== null) {
      console.log('subscribeUser => getSubscription', subscription);
      return subscription;
    }

    /// 若未訂閱，執行訂閱
    // 已註冊但未訂閱，先訂閱再送出使用者訂閱資料到伺服器
    const applicationServerKey = urlB64ToUint8Array(vapidPublicKey);
    const userVisibleOnly = true;
    subscription = await swRegistration.pushManager.subscribe({ userVisibleOnly, applicationServerKey });
    return subscription;
  }
  catch (err) {
    console.error('subscribeUser exception!', err);
    throw err;
  }
}

/// 取消訂閱，並同時取消註冊
/// return Boolean
export async function unsubscribeUser() {
  try {
    if (!isSupportPush())
      throw new Error('Push is not support.');

    // 取得註冊
    const swRegistration = await navigator.serviceWorker.getRegistration(SW_JS_PATH);
    if (!swRegistration) return true; // 連註冊都沒有，當作已取消訂閱。

    // 取消訂閱，若有訂閱的話。
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }

    // 並同時取消註冊
    await swRegistration.unregister();

    return true;
  }
  catch (err) {
    console.error('unsubscribeUser exception!', err);
    throw err;
  }
}

/// 送出通知訊息
/// return string
export async function SendNotification() {
  // 首先讓我們確定瀏覽器支援 Notification
  if (!("Notification" in window)) {
    alert("這個瀏覽器不支援 Notification");
  }

  // 再檢查使用者是否已經授權執行 Notification
  else if (Notification.permission === "granted") {
    // 如果已經授權就可以直接新增 Notification 了!
    var notification = new Notification("安安你好!");
  }

  // 否則，我們會需要詢問使用者是否開放權限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // 如果使用者同意了就來新增一個 Notification 打聲招呼吧
      if (permission === "granted") {
        var notification = new Notification("安安~");
      }
    });
  }

  // 如果使用者還是不同意授權執行 Notification
  // 最好還是進行適當的處理以避免繼續打擾使用者
}

/// 再註冊 Background Synchronization
export async function syncMessagesLater() {
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('serviceWorker is ready.');

    /// SyncManager.register([options]).then(function(syncRegistration) { ... })
    /// https://developer.mozilla.org/en-US/docs/Web/API/SyncManager/register
    await registration.sync.register('sync-messages');

    console.log('sync[sync-messages] is registered');
  } catch (err) {
    console.log('Background Sync could not be registered!', err);
    throw err;
  }
}
