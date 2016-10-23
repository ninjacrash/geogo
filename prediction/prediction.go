package prediction

import(
	"fmt"
	"net/http"
	"os/exec"
	"bytes"
	"log"
)

func Predict(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("Rscript", "test.R")
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