package prediction

import(
	"fmt"
	"net/http"
	"os/exec"
	"bytes"
	"io/ioutil"
)

func Predict(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-type")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// Stop here if its Preflighted OPTIONS request
	if r.Method == "OPTIONS" {
			return
	}
	js, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "%s", err)
		return
	}
	fmt.Println(js)
	fmt.Println(r.Body)
	defer r.Body.Close()
	cmd := exec.Command("Rscript", "live_prediction.R", string(js))
	var out bytes.Buffer
	cmd.Stdout = &out
	err2 := cmd.Run()
	if err2 != nil {
		fmt.Println("ey yo fatal")
		//log.Fatal(err)
		fmt.Fprintf(w, "%s", err2)
		return
	}
	result := out.String()
	fmt.Printf("Rscript results: %q\n", result)
	fmt.Fprintf(w, "%s", result)
}
