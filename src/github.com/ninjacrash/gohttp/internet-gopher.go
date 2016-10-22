package main

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    "io/ioutil"
)


type results struct {
    geometry struct {
        location struct {
          lat float32
          lng float32
        }
    }
}


type final_response struct{
  lat float32
  long float32
}


func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println("GET params were:", r.URL.Query());

        var zip string
        //var address string

        for key, value := range r.URL.Query() {
          if key == "zip_code" {
            zip = value[0]
          }
          //fmt.Println("Key:", key, "Value:", value[0])
        }
        fmt.Println(zip)
        if zip != "" {
          var base_url string = "https://maps.googleapis.com/maps/api/geocode/json?address="
          var url string = base_url + zip
          response, err := http.Get(url)
          if err != nil{
            fmt.Println("error")
          }
          fmt.Println(url)
          //json.NewDecoder(response.Body).Decode(&body)
          var body_string string
          defer response.Body.Close()
            if response.StatusCode == 200 { // OK
              res := &results{}
              raw_json, err := ioutil.ReadAll(response.Body)
              if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
              }
              var json_data results
              err = json.Unmarshal([]byte(raw_json), &json_data)
              final := &final_response{lat: json_data.geometry.location.lat, long: json_data.geometry.location.lng}
              b, err := json.Marshall(final)
              if err != nil {
                fmt.Println("err")
              }
              //bodyBytes, err := ioutil.ReadAll(response.Body)
              //if err != nil{
                //fmt.Println("wut")
              //}
              //body_string = string(bodyBytes)
              //fmt.Println(body_string)
              w.Header().Set("Content-Type", "application/json")
              //fmt.Println()
              w.Write(b)
            }
        } else {
          fmt.Printf("fail")
        }
    })

    log.Fatal(http.ListenAndServe(":8080", nil))

}
