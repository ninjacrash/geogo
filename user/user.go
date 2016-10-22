package user

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    //"github.com/gorilla/mux"
    //"io/ioutil"
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
    decoder := json.NewDecoder(req.Body)
    var ur UserRequest
    err := decoder.Decode(&ur)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    defer req.Body.Close()
    log.Println(ur)

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
    log.Fatal(err)
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
