

/// return Object
export function checkSupport() {
  return {
    serviceWorker: ('serviceWorker' in navigator),
    PushManager: ('PushManager' in window),
    Notification: ('Notification' in window),
    indexedDB: ("indexedDB" in window)
  }
}


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
