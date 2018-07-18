//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function(event) {
  var indexPage = new Request("index.html");
  event.waitUntil(
    fetch(indexPage).then(function(response) {
      return caches.open("pwabuilder-offline").then(function(cache) {
        console.log(
          "[PWA Builder] Cached index page during Install" + response.url
        );
        return cache.put(indexPage, response);
      });
    })
  );
});
