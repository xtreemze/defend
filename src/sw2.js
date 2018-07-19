// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", (event) => {
  workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
});
