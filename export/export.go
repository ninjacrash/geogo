package export

import(
	"fmt"
	"net/http"
	"encoding/json"
	"io/ioutil"
)

type Schema struct {
	schema string
	name string
	insertable bool
}

type SchemaArr struct {
	Collection []Schema
}

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
	var life_is_pain_to_a_meeseeks SchemaArr
	err = json.Unmarshal([]byte(body), &life_is_pain_to_a_meeseeks)
	// TODO: loop through tables, tar up, send back
	fmt.Fprintf(w, "%s", body)
}