const CACHE_NAME = "makilu-kiara-v2";

const ARCHIVOS_APP = [
    "./kiara.html",
    "./manifest-kiara.json",
    "./icon-kiara.svg"
];

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    function(cache) {

                        return cache.addAll(
                            ARCHIVOS_APP
                        );

                    }
                )
                .then(
                    function() {

                        return self.skipWaiting();

                    }
                )

        );

    }
);


self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches
                .keys()
                .then(
                    function(keys) {

                        return Promise.all(

                            keys
                                .filter(
                                    function(key) {

                                        return (
                                            key !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function(key) {

                                        return caches.delete(
                                            key
                                        );

                                    }
                                )

                        );

                    }
                )
                .then(
                    function() {

                        return self.clients.claim();

                    }
                )

        );

    }
);


self.addEventListener(
    "fetch",
    function(event) {

        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }


        const url =
            new URL(
                event.request.url
            );


        if (
            url.origin !==
            self.location.origin
        ) {
            return;
        }


        event.respondWith(

            fetch(
                event.request
            )
            .then(
                function(response) {

                    if (
                        response &&
                        response.status === 200
                    ) {

                        const copia =
                            response.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(
                                function(cache) {

                                    cache.put(
                                        event.request,
                                        copia
                                    );

                                }
                            );

                    }

                    return response;

                }
            )
            .catch(
                function() {

                    return caches.match(
                        event.request
                    );

                }
            )

        );

    }
);