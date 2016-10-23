package share

import(
	"fmt"
	"net/http"
	"encoding/json"
	"io/ioutil"
)

func DataImport(w http.ResponseWriter, r *http.Request) {
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
		fmt.Fprintf(w, "%s", meeseek.Schema)
	}
}