package shelter

import (
	"fmt"
	"net/http"
	"io/ioutil"
)

func GetShelter(w http.ResponseWriter, r *http.Request) {
	// TODO: this needs to accept parameters
	// Users may not be eligible for shelters based on gender/sex/etc
	api_url := "http://ec2-54-159-3-36.compute-1.amazonaws.com/shelter"
	resp, err := http.Get(api_url)
	if err != nil {
		fmt.Println("Failed to query shelters API")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to parse response from shelters API")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(body))
}