self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('airhorner').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.html?homescreen=1',
       '/?homescreen=1',
       '/home.html',
       '/bundle.js',
       '/chat.css',
       'data_summary.html',
       '/ds_bundle.js',
       '/data.css',
       '/favicon.png',
       '/home.css',
       '/home.js',
       '/loading.css',
       '/login.css',
       '/sakura1.png',
       '/sakura2.png',
       '/search.png',
       '/send.png',
       '/style.css',
       '/user.png'
     ]);
   })
 );
});

//activate event
self.addEventListener('activate', function(e) {
    console.log("[ServiceWorker] Activated");
})
//fetch event
self.addEventListener('fetch', function(e) {
    console.log("[ServiceWorker] Fetching", e.request.url);

    e.respondWith(
        caches.match(e.request).then(function(response) {
            if(response) {
                console.log("[ServiceWorker] Found in cache", e.request.url);
                return response;
            }
            return fetch(e.request);
        })
    )
});