// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).
self.addEventListener('fetch', () => { });

///// �B�z���T��
//self.addEventListener('push', function (event) {
//  const payload = event.data ? event.data.text() : 'no payload';
//  const title = 'ServiceWorker Cookbook';
//  const options = {
//    body: payload,
//  };

//  // �e�X Notification
//  event.waitUntil(self.registration.showNotification(title, options));
//});

/// ����T���ɡA��ܰT�C
self.addEventListener('push', event => {
  const textMsg = event.data.text(); // �Y�O�¤�r�T����text()�禡�Ѷ}�C
  const jsonObj = event.data.json(); // �Y�OJson����ʥ]��json()�禡�Ѷ}�C
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

  // �e�X Notification
  event.waitUntil(self.registration.showNotification(title, options));
});
