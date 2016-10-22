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

	var life_is_pain_to_a_meeseeks []Schema
	err = json.Unmarshal([]byte(body), &life_is_pain_to_a_meeseeks)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i := 0; i < len(life_is_pain_to_a_meeseeks); i++ {
		table := life_is_pain_to_a_meeseeks[i]
		pullData(base_url + table.name)
	}
	fmt.Fprintf(w, "%s", "OK")
}

func pullData(api_url string) error {
	fmt.Printf(api_url + "\n")
	return nil
}
