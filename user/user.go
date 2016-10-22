package user

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
)

type UserRequest struct {
    User_Id string
    Id_Type string
    Email string
    Phone string
    Password string
    Reason string
    Gender string
    Veteran bool
    Education string
    Dependents int
    Ethnicity string
    Homeless bool
    Employed bool
    Date_Of_Birth string
    Needs string
}

func CreateUser(w http.ResponseWriter, req *http.Request) {
    decoder := json.NewDecoder(req.Body)
    var ur UserRequest
    err := decoder.Decode(&ur)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    defer req.Body.Close()
    log.Println(ur)

    fmt.Println("GET params were:", req.URL.Query());
}
