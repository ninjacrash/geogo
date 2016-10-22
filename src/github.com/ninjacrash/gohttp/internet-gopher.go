package main

import (
    "fmt"
    "log"
    "net/http"
    "net/url"
    "encoding/json"
    "io/ioutil"
    "os"
)


type GeoResults struct {
  Results []Results
}

type Results struct {
  Geometry struct {
    Location struct {
      Lat float32
      Lng float32
    }
  }
}


type Final_Response struct{
  Lat float32
  Long float32
}


func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println("GET params were:", r.URL.Query());

        var addr string

        for key, value := range r.URL.Query() {
          if key == "zip_code" || key == "address" {
            addr = url.QueryEscape(value[0])
          }
          //fmt.Println("Key:", key, "Value:", value[0])
        }
        fmt.Println(addr)
        if addr != "" {
          var base_url string = "https://maps.googleapis.com/maps/api/geocode/json?address="
          var url string = base_url + addr
          response, err := http.Get(url)
          if err != nil{
            fmt.Println("error")
          }
          //fmt.Println(url)
          defer response.Body.Close()
            if response.StatusCode == 200 { // OK
              raw_json, err := ioutil.ReadAll(response.Body)
              if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
              }
              //fmt.Println(os.Stdout, string(raw_json))
              var jr GeoResults
              err = json.Unmarshal([]byte(raw_json), &jr)
              //fmt.Println(jr)
              final_json := &Final_Response{Lat: jr.Results[0].Geometry.Location.Lat,
                                            Long: jr.Results[0].Geometry.Location.Lng}
              b, err := json.Marshal(final_json)
              if err != nil {
                fmt.Println("err")
              }
              w.Header().Set("Content-Type", "application/json")
              //fmt.Println()
              w.Write(b)
            }
        }
    })

    log.Fatal(http.ListenAndServe(":8080", nil))

}
