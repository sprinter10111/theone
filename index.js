const express = require('express');
const app = express();
const fs = require("fs");

app.set("port", 3000);
app.set("view engine", "ejs");

app.get('/',(req,res)=>{
    
});
/*app.set('port',(process.env.PORT||5000));
app.listen(app.get('port'));*/

app.listen(app.get("port"), () => {
    console.log(`Web application started at http://localhost:${app.get("port")}`);
  });
  