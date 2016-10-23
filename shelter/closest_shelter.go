package shelter

import(
	"fmt"
	"net/http"
	"net/url"
	"encoding/json"
	"io/ioutil"
  "strconv"
	"math"
	"sort"
)

type Geo_Response []struct{
  Shelter_Name string
  Latitude float64
  Longitude float64
	Distance float64
	Shelter_Id int
	Population int
	Capacity int
	Pct_Occupied float64
	Gender_Restriction string
}

type Lat_Long struct{
  Lat float64
  Long float64
}

func (slice Geo_Response) Len() int {
    return len(slice)
}

func (slice Geo_Response) Less(i, j int) bool {
    return slice[i].Distance < slice[j].Distance;
}

func (slice Geo_Response) Swap(i, j int) {
    slice[i], slice[j] = slice[j], slice[i]
}

// haversin(θ) function
func hsin(theta float64) float64 {
	return math.Pow(math.Sin(theta/2), 2)
}

// Distance function returns the distance (in meters) between two points of
//     a given longitude and latitude relatively accurately (using a spherical
//     approximation of the Earth) through the Haversin Distance Formula for
//     great arc distance on a sphere with accuracy for small distances
//
// point coordinates are supplied in degrees and converted into rad. in the func
//
// distance returned is METERS!!!!!!
// http://en.wikipedia.org/wiki/Haversine_formula
func Distance_Between(lat1, lon1, lat2, lon2 float64) float64 {
	// convert to radians
  // must cast radius as float to multiply later
	var la1, lo1, la2, lo2, r float64
	la1 = lat1 * math.Pi / 180
	lo1 = lon1 * math.Pi / 180
	la2 = lat2 * math.Pi / 180
	lo2 = lon2 * math.Pi / 180

	r = 6378100 // Earth radius in METERS

	// calculate
	h := hsin(la2-la1) + math.Cos(la1)*math.Cos(la2)*hsin(lo2-lo1)

	return 2 * r * math.Asin(math.Sqrt(h))
}

func Get_Shelters() (Geo_Response, error) {
  pg_url := "http://pg.globalhack.ninja/shelter_capacity"
  response, err := http.Get(pg_url)
	var jr Geo_Response
	if err != nil{
    fmt.Println("error")
    return jr, err
  }
  defer response.Body.Close()
  if response.StatusCode == 200 { // OK
    raw_json, err := ioutil.ReadAll(response.Body)
    if err != nil {
      return jr, err
    }
    //fmt.Println(os.Stdout, string(raw_json))

    err = json.Unmarshal([]byte(raw_json), &jr)
    return jr, nil
	} else {
		fmt.Println("pg not 200")
		return jr, nil
	}
}

func Get_Closest_Shelter(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-type")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    // Stop here if its Preflighted OPTIONS request
    if req.Method == "OPTIONS" {
        return
    }

    var lat_str string
    var lon_str string
		var lat float64
		var lon float64
		var record_limit int = 3
		var user_gender string = "no_conflicts"
		var address string = ""

    for key, value := range req.URL.Query() {
      if key == "lat" || key == "latitude" {
        lat_str = url.QueryEscape(value[0])
      } else if key == "lon" || key == "longitude" {
          lon_str = url.QueryEscape(value[0])
      } else if key == "num" {
					limit_str := url.QueryEscape(value[0])
					limit_int, err := strconv.Atoi(limit_str)
					if err != nil {
			      http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
					record_limit = limit_int
			} else if key == "gender" {
					user_gender = value[0]
			} else if key == "address" {
				  address = url.QueryEscape(value[0])
			}
			//fmt.Println("Key:", key, "Value:", value[0])
    }
		if address != "" {
			api_url := "http://api.globalhack.ninja/geo?address=" + address
			fmt.Println(api_url)
			resp, err := http.Get(api_url)
			if err != nil {
				fmt.Println("Failed to query geo API")
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			raw_json, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println("Failed to read response body")
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
    	defer resp.Body.Close()
			var ll Lat_Long
			err = json.Unmarshal([]byte(raw_json), &ll)
			lat = ll.Lat
			lon = ll.Long
		} else {
			lat, _ = strconv.ParseFloat(lat_str, 64)
	    lon, _ = strconv.ParseFloat(lon_str, 64)
		}

    var gr Geo_Response
    gr, err := Get_Shelters()
		if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
			return
    }

		for i, shelter := range gr {
			gr[i].Distance = Distance_Between(shelter.Latitude,	shelter.Longitude,
																					lat, lon)
			if shelter.Population > shelter.Capacity ||	shelter.Gender_Restriction == user_gender {
				gr[i].Distance = 9999999.0000
			}
		}

		sort.Sort(gr)
		gr = gr[ : record_limit]

		fmt.Println(lat)
		fmt.Println(lon)

    b, err := json.Marshal(gr)
    if err != nil {
      fmt.Println("err")
      http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    w.Header().Set("Content-Type", "application/json")
    //fmt.Println()
    w.Write(b)
  }
