const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    app.render("iets");
    
})
    
    


app.set('port',(process.env.PORT||5000));
app.listen(app.get('port'));