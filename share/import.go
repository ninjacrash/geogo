package share

import(
	"fmt"
	"net/http"
	"encoding/json"
	"io/ioutil"
	"bytes"
)

func DataImport(w http.ResponseWriter, r *http.Request) {
	base_url := "http://pg.globalhack.ninja/"
	js, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var life_is_pain_to_a_meeseeks SchemaStr
	err = json.Unmarshal([]byte(js), &life_is_pain_to_a_meeseeks)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, meeseek := range life_is_pain_to_a_meeseeks {
		api_url := base_url + meeseek.Name
		fmt.Printf(api_url)
		resp, err := http.Post(api_url, "application/json", bytes.NewBuffer([]byte(meeseek.Data)))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "%s", resp)
	}
}