package user

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    //"github.com/gorilla/mux"
    //"io/ioutil"
    "regexp"
    "os"
    "database/sql"
    _ "github.com/lib/pq"
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
    w.Header().Set("Access-Control-Allow-Origin", "*")
    /*(if req.Method != "POST"{
      return
    }*/
    decoder := json.NewDecoder(req.Body)
    var ur UserRequest
    err := decoder.Decode(&ur)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer req.Body.Close()
    log.Println(ur)
    uuid := ur.User_Id
    uuid_b := []byte(uuid)
    var phone_regex = regexp.MustCompile(`^(\d{3,4}.{0,1}){3}$`)
    var email_regex = regexp.MustCompile(`^.*@.*.*$`)

    if phone_regex.Match(uuid_b){
      ur.Id_Type = "phone"
    } else if email_regex.Match(uuid_b) {
      ur.Id_Type = "email"
    } else {
      ur.Id_Type = "anonymous"
    }
    fmt.Println("GET params were:", req.URL.Query());
    res, err := handleSql(ur)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
    } else {
      w.WriteHeader(http.StatusOK)
      fmt.Fprintf(w, "%s", res)
    }
}

func handleSql(ur UserRequest) (string, error) {
  fmt.Printf("%s",ur)
  username := os.Getenv("db_user")
  password := os.Getenv("db_password")
  db, err := sql.Open("postgres", "postgres://" + username + ":" + password + "@homelessdb.cmcvtt7pgaun.us-east-1.rds.amazonaws.com/homelessdb")
  if err != nil {
    fmt.Printf("Failed to connect to the database: " + err.Error())
    return "", err
  }
  stmt, err := db.Prepare("insert into public.user (user_id,id_type,email," +
    "phone,reason,password,gender,veteran,education,dependents,ethnicity," +
    "homeless,employed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)")
  if err != nil {
    fmt.Printf("\n\n%s\n\n", stmt)
    return "", err
  }
  //fmt.Printf("%s",stmt)
  res, err := stmt.Exec(ur.User_Id,ur.Id_Type,ur.Email,ur.Phone,ur.Reason,
    ur.Password,ur.Gender,ur.Veteran,ur.Education,ur.Dependents,ur.Ethnicity,
    ur.Homeless,ur.Employed)
  if err != nil {
    return "", err
  }
  fmt.Printf("%s", res)
  return "success", nil
  /*rows, err := db.Query("select * from public.user")
  if err != nil {
    fmt.Printf("Failed to query the database: " + err.Error())
    return
  }
  fmt.Printf("%s", rows)
  defer rows.Close()
  //for rows.Next() {
  //  fmt.Printf("%s", row)
  //  // TODO: effort. we're switching to postgrest
  //}*/
}
