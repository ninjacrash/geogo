package sms

import (
	"fmt"
	"os"
	"net/http"
	"net/url"
	"io/ioutil"
	"strings"
)

func SendMessage(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	message := fmt.Sprintf("%s", query["message"])
	phone := fmt.Sprintf("%s", query["phone"])

	twilio_id := os.Getenv("TWILIO_ACCOUNT_SID")
	twilio_auth := os.Getenv("TWILIO_AUTH_TOKEN")
	api_url := "https://api.twilio.com/2010-04-01/Accounts/" + twilio_id + "/Messages.json"
	msg := url.Values{}
	msg.Set("To","+1" + phone)
	msg.Set("From","+16303184442")
	msg.Set("Body",message)
	payload := *strings.NewReader(msg.Encode())

	client := &http.Client{}
 
	req, _ := http.NewRequest("POST", api_url, &payload)
	req.SetBasicAuth(twilio_id, twilio_auth)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", body)
}