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
