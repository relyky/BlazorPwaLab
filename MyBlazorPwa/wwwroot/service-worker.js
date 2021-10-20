// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).
self.addEventListener('fetch', () => { });

///// 處理文件訊息
//self.addEventListener('push', function (event) {
//  const payload = event.data ? event.data.text() : 'no payload';
//  const title = 'ServiceWorker Cookbook';
//  const options = {
//    body: payload,
//  };

//  // 送出 Notification
//  event.waitUntil(self.registration.showNotification(title, options));
//});

/// 當收到訊息時，顯示訊。
self.addEventListener('push', event => {
  const textMsg = event.data.text(); // 若是純文字訊息用text()函式解開。
  const jsonObj = event.data.json(); // 若是Json物件封包用json()函式解開。
  console.log(`Push Received.`, { textMsg, jsonObj });

  const { title, body, url, imageUrl } = jsonObj;
  const options = {
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    body,
    image: imageUrl,
    data: {
      url
    }
  };

  // 送出 Notification
  event.waitUntil(self.registration.showNotification(title, options));
});
