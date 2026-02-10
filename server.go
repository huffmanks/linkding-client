package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"regexp"
)

func main() {
	apiTarget := os.Getenv("LINKDING_CONTAINER_URL")
	if apiTarget == "" {
		apiTarget = "http://linkding:9090"
	}

	target, err := url.Parse(apiTarget)
	if err != nil {
		log.Fatal("Invalid API_TARGET URL")
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
	}

	isLinkdingPath := regexp.MustCompile(`^/(api|assets|favicons|media|previews|static)`)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if isLinkdingPath.MatchString(r.URL.Path) {
			proxy.ServeHTTP(w, r)
			return
		}

		path := "./dist" + r.URL.Path
		info, err := os.Stat(path)

		if os.IsNotExist(err) || info.IsDir() || r.URL.Path == "/" {
			http.ServeFile(w, r, "./dist/index.html")
			return
		}

		http.ServeFile(w, r, path)
	})

	appPort := os.Getenv("APP_PORT")
	if appPort == "" {
		appPort = "3000"
	}

	addr := ":" + appPort
	log.Printf("Server starting on %s", addr)

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
