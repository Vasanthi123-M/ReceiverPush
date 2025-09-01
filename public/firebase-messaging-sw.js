

// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// firebase.initializeApp({
  //  apiKey: "AIzaSyByEtZhjP2GLenwl_tRomrLF4KPIA-Hu5Y",
  // authDomain: "fcm-demo2-9e065.firebaseapp.com",
  // projectId: "fcm-demo2-9e065",
  // storageBucket: "fcm-demo2-9e065.firebasestorage.app",
  // messagingSenderId: "643285046695",
  // appId: "1:643285046695:web:90cf7023825a25427fd282",
  // measurementId: "G-G8EFHEDPSS"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   const notificationTitle = payload.data?.title || "Notification";
//   const notificationOptions = {
//     body: payload.data?.body || "",
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((windowClients) => {
//       for (let client of windowClients) {
//         if (client.url.includes("localhost:3001")) {
//           client.focus();
//           client.navigate("/Home");
//           return;
//         }
//       }
//       clients.openWindow("http://localhost:3001/Home");
//     })
//   );
// });

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyByEtZhjP2GLenwl_tRomrLF4KPIA-Hu5Y",
  authDomain: "fcm-demo2-9e065.firebaseapp.com",
  projectId: "fcm-demo2-9e065",
  storageBucket: "fcm-demo2-9e065.firebasestorage.app",
  messagingSenderId: "643285046695",
  appId: "1:643285046695:web:90cf7023825a25427fd282",
  measurementId: "G-G8EFHEDPSS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.data?.title || "Notification";
   console.log("notificationTitle",notificationTitle);

  const notificationOptions = {
    body: payload.data?.body || "",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  console.log("notificationOptions",notificationOptions)

});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(location.origin)) {
          client.focus();
          client.navigate("/Home");
          return;
        }
      }
      clients.openWindow("/Home");
    })
  );
});
