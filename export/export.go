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
	Data string
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
	var life_is_pain_to_a_meeseeks SchemaStr
	err = json.Unmarshal([]byte(body), &life_is_pain_to_a_meeseeks)
	for i, meeseek := range life_is_pain_to_a_meeseeks {
		api_url := base_url + meeseek.Name
		table_data, err := http.Get(api_url)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		data, err := ioutil.ReadAll(table_data.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		meeseek.Data = string(data)
		life_is_pain_to_a_meeseeks[i] = meeseek
		defer table_data.Body.Close()
	}
	js, err := json.Marshal(life_is_pain_to_a_meeseeks)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "%s", js)
}