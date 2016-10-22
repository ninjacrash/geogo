package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"github.com/ninjacrash/geogo/gohttp"
	"github.com/ninjacrash/geogo/user"
	"github.com/ninjacrash/geogo/shelter"
)

func main() {
	r := mux.NewRouter()
	r.StrictSlash(true)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.HandleFunc("/geo", gohttp.Geolocate)
	r.HandleFunc("/user", user.CreateUser)
	r.HandleFunc("/shelters", shelter.GetShelter)

	http.Handle("/", r)
	fmt.Printf("server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func getStaticDir() string {
	staticDir := os.Getenv("www")
	if staticDir == "" {
		staticDir = "www/"
	}
	return staticDir
}
