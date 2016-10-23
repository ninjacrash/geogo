package export

import(
	"fmt"
	"net/http"
	"encoding/json"
	"io/ioutil"
)

type SchemaStr []struct {
	Schema string
	Name string
	Insertable bool
}

//type SchemaArr struct {
//	Collection []Schema
//}

func DataExport(w http.ResponseWriter, r *http.Request) {
	base_url := "http://pg.globalhack.ninja/"
	resp, err := http.Get(base_url)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var life_is_pain_to_a_meeseeks SchemaStr
	err = json.Unmarshal([]byte(body), &life_is_pain_to_a_meeseeks)
	// TODO: loop through tables, tar up, send back
	for _, meeseek := range life_is_pain_to_a_meeseeks {
		fmt.Fprintf(w, "%s\n", meeseek.Name)
	}

	//fmt.Fprintf(w, "%s", life_is_pain_to_a_meeseeks)
	//fmt.Fprintf(w, "%s", body)
}