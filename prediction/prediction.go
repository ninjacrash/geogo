package prediction

import(
	"fmt"
	"net/http"
	"os/exec"
	"bytes"
	"log"
	"io/ioutil"
)

func Predict(w http.ResponseWriter, r *http.Request) {
	js, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	cmd := exec.Command("Rscript", "live_prediction.R", js)
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		log.Fatal(err)
	}
	result := out.String()
	fmt.Printf("Rscript results: %q\n", result)
	fmt.Fprintf(w, "%s", result)
}
