const express = require('express');
const app = express();
//const ejs= require('ejs');



//app.set('view engine', 'ejs');
//app.set('port', 3000);

app.get('/',(req,res)=>{
    var fs = require('fs');

    function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

    readModuleFile('./view/index.txt', function (err, words) {
        res.type('text/html');
        res.send(words);
})
    
    
});

app.set('port',(process.env.PORT||5000));
app.listen(app.get('port'));