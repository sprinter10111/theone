const express = require("express");
const app = express();
const ejs = require("ejs"); // EJS import
const axios = require('axios');

const uri =
  "mongodb+srv://YJSK:LOTRYJSK@theone.4lvoc.mongodb.net/TheOne?retryWrites=true&w=majority";
const { MongoClient, ObjectId } = require("mongodb");
const req = require("express/lib/request");
const res = require("express/lib/response");
//const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
const client = new MongoClient(uri, { useUnifiedTopology: true });

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

function shuffle(array ){//gooit de antwoorden door elkaar
  let currentIndex  = array.length;
  let randomIndex ;
  while (currentIndex != 0){
      randomIndex = Math.floor(Math.random() * array.length);
      currentIndex--;
      let tempValue  = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
  }
  return array;
}

let doSomeDBCalls = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const quoteResponse = await axios.get("https://the-one-api.dev/v2/quote", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const characterResponse = await axios.get("https://the-one-api.dev/v2/character", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const movieResponse = await axios.get("https://the-one-api.dev/v2/movie", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const allQuotes = quoteResponse.data;
    const allCharacters = characterResponse.data;
    const allMovies = movieResponse.data;

    app.get("/", (req, res) => {
      res.render("index");
    });
    app.get("/LOTR", (req, res) => {
      res.render("quiz");
    });

    let rounds = 0;
    let score = 0;
    let lastQuoteIndex = 0;//index van de vorige quote (voor oplossingen te checken)

    app.get("/LOTR/1", (req, res) => {
      let isBlacklisted = true;
      if(rounds<10){
        let quote;
        let characters;
        let movies;
        while(isBlacklisted){
        let quoteIndex = Math.floor(Math.random() * allQuotes.docs.length);
        lastQuoteIndex = quoteIndex;
        quote = allQuotes.docs[quoteIndex];
        if(!blacklist.includes(quote.dialog)){
          isBlacklisted = false;
        }
        let character  = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
        for(let i = 0;i<allCharacters.docs.length;i++){// zoekt het character dat bij de quote hoort
            if (allCharacters.docs[i]._id === quote.character){
                character = allCharacters.docs[i];
            }
        }
        characters = [character, allCharacters.docs[Math.floor(Math.random() * allCharacters.docs.length)], allCharacters.docs[Math.floor(Math.random() * allCharacters.docs.length)]];//array met het correcte antwoord en 2 random characters
        shuffle(characters);
        let movie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
        for(let i  = 0;i<allMovies.docs.length;i++){// zoekt de film die bij de quote hoort
            if (allMovies.docs[i]._id === quote.movie){
                movie = allMovies.docs[i];
            }
        }
        movies = [movie, allMovies.docs[Math.floor(Math.random() * allMovies.docs.length)], allMovies.docs[Math.floor(Math.random() * allMovies.docs.length)]];//array met het correcte antwoord en 2 random filmen
        shuffle(movies);
        }
        res.render("q1", {quote: quote, characters: characters, movies: movies, score: score, unfinished: true});
      }if (rounds >= 10){
        res.render("q1", {score: score, unfinished: false});
        score = 0;
        rounds = 0;
      }
    });
    app.post("/LOTR/quiz1", (req, res) => {
      rounds++
        let lastQuote = allQuotes.docs[lastQuoteIndex];
        lastCharacter = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
        for(let i = 0;i<allCharacters.docs.length;i++){
            if (allCharacters.docs[i]._id === lastQuote.character){
                lastCharacter = allCharacters.docs[i];
            }
        }
        let lastMovie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
        for(let i  = 0;i<allMovies.docs.length;i++){
            if (allMovies.docs[i]._id === lastQuote.movie){
                lastMovie = allMovies.docs[i];
            }
        }  
        if(req.body.character === lastCharacter.name){
          score++;
        }if(req.body.movie === lastMovie.name){
          score++;
        }

        if(req.body.addToDB === "blacklist"){
          res.redirect(`/addedBlacklistitem?quote=${lastQuote.dialog}&blacklistReden=${req.body.blacklistReden}&quizType=tienRonden`);
        }else if(req.body.addToDB === "favorite"){
          res.redirect(`/addedfavorite?quote=${lastQuote.dialog}&lastCharacter=${lastCharacter.name}&quizType=tienRonden`);
        }else if(req.body.addToDB === undefined || req.body.addToDB === "none"){
          res.redirect("/LOTR/1");
        }    
      });

    let SuddenDeathCorrectAnswer = true;

    app.get("/LOTR/2", (req, res) => {
      let isBlacklisted = true;
      if(SuddenDeathCorrectAnswer){
        let quote;
        let characters;
        let movies;
        while(isBlacklisted){
        let quoteIndex = Math.floor(Math.random() * allQuotes.docs.length);
        lastQuoteIndex = quoteIndex;
        quote = allQuotes.docs[quoteIndex];
        if(!blacklist.includes(quote.dialog)){
          isBlacklisted = false;
        }
        let character  = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
        for(let i = 0;i<allCharacters.docs.length;i++){// zoekt het character dat bij de quote hoort
            if (allCharacters.docs[i]._id === quote.character){
                character = allCharacters.docs[i];
            }
        }
        characters = [character, allCharacters.docs[Math.floor(Math.random() * allCharacters.docs.length)], allCharacters.docs[Math.floor(Math.random() * allCharacters.docs.length)]];//array met het correcte antwoord en 2 random characters
        shuffle(characters);
        let movie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
        for(let i  = 0;i<allMovies.docs.length;i++){// zoekt de film die bij de quote hoort
            if (allMovies.docs[i]._id === quote.movie){
                movie = allMovies.docs[i];
            }
        }
        movies = [movie, allMovies.docs[Math.floor(Math.random() * allMovies.docs.length)], allMovies.docs[Math.floor(Math.random() * allMovies.docs.length)]];//array met het correcte antwoord en 2 random filmen
        shuffle(movies);
        }
        res.render("q2", {quote: quote, characters: characters, movies: movies, score: score, unfinished: SuddenDeathCorrectAnswer});
      }else{
        res.render("q2", {score: score, rounds: rounds,unfinished: SuddenDeathCorrectAnswer});
        score = 0;
        rounds = 0;
        SuddenDeathCorrectAnswer = true;
      }
    });

    app.post("/LOTR/quiz2", (req, res) => {
      rounds++
      let lastQuote = allQuotes.docs[lastQuoteIndex];
      lastCharacter = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
      for(let i = 0;i<allCharacters.docs.length;i++){
          if (allCharacters.docs[i]._id === lastQuote.character){
              lastCharacter = allCharacters.docs[i];
          }
      }
      let lastMovie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
      for(let i  = 0;i<allMovies.docs.length;i++){
          if (allMovies.docs[i]._id === lastQuote.movie){
              lastMovie = allMovies.docs[i];
          }
      }  
      if(req.body.character === lastCharacter.name){
        score++;
      }
      if(req.body.movie === lastMovie.name){
        score++;
      }
      if(req.body.character != lastCharacter.name || req.body.movie != lastMovie.name){
        SuddenDeathCorrectAnswer = false;
      }
      if(req.body.addToDB === "blacklist"){
        res.redirect(`/addedBlacklistitem?quote=${lastQuote.dialog}&blacklistReden=${req.body.blacklistReden}&quizType=suddenDeath`);
      }else if(req.body.addToDB === "favorite"){
        res.redirect(`/addedfavorite?quote=${lastQuote.dialog}&lastCharacter=${lastCharacter.name}&quizType=suddenDeath`);
      }else if(req.body.addToDB === undefined || req.body.addToDB === "none"){
        res.redirect("/LOTR/2");
      }    
    });

    let blacklistCursor = client.db("TheOne").collection("Blacklist").find({});
    let blacklist = await blacklistCursor.toArray();

    app.get("/blacklist", (req, res) => {
      res.render("blacklist", { blacklist: blacklist });
    });

    app.get("/blacklistitem/:keuze", (req, res) => {
      res.render("blacklistItem", {keuze: req.params.keuze, blacklist: blacklist});
    });

    app.post("/updateblacklistitem/:keuze", async (req, res) => {
      await client.connect();
      blacklist[req.params.keuze].reden = req.body.blacklistReden;
      await client.db("TheOne").collection("Blacklist").updateOne({_id: blacklist[req.params.keuze]._id}, {$set:{reden: req.body.blacklistReden}});
      res.redirect("/blacklist");
      await client.close();
    });

    app.get("/addedBlacklistitem", async (req, res) => {
      await client.connect();
      
      let blacklistItem = {
        _id: ObjectId(),
        quote: req.query.quote,
        reden: req.query.blacklistReden
      };
      if(blacklistItem.reden != ""){
        blacklist.push(blacklistItem);
        await client.db("TheOne").collection("Blacklist").insertOne(blacklistItem);
      }
      if(req.query.quizType === "tienRonden"){
        res.redirect("/LOTR/1");  
      }else{
        res.redirect("/LOTR/2");  
      }
      await client.close();
    });

    app.get("/removeblacklistitem/:keuze", async (req, res) => {
      await client.connect();
      await client
        .db("TheOne")
        .collection("Blacklist")
        .deleteOne({ _id: blacklist[req.params.keuze]._id });
      let blacklistCursor = client
        .db("TheOne")
        .collection("Blacklist")
        .find({});
      blacklist = await blacklistCursor.toArray();
      res.redirect("/blacklist");
      await client.close();
    });

    let favoritesCursor = client.db("TheOne").collection("Favorites").find({});
    let favorites = await favoritesCursor.toArray();

    app.get("/favorites", (req, res) => {
      res.render("favorites", { favorites: favorites });
    });

    app.get("/addedfavorite", async (req, res) => {
      await client.connect();
      let favorite= {
        _id: ObjectId(),
        quote: req.query.quote,
        character: req.query.lastCharacter,
      };
      favorites.push(favorite);
      await client.db("TheOne").collection("Favorites").insertOne(favorite);
      if(req.query.quizType === "tienRonden"){
        res.redirect("/LOTR/1");  
      }else{
        res.redirect("/LOTR/2");  
      }
      await client.close();
    });

    app.get("/removefavorite/:keuze", async (req, res) => {
      await client.connect();
      await client
        .db("TheOne")
        .collection("Favorites")
        .deleteOne({ _id: favorites[req.params.keuze]._id });
      let favoritesCursor = client
        .db("TheOne")
        .collection("Favorites")
        .find({});
      favorites = await favoritesCursor.toArray();
      res.redirect("/favorites");
      await client.close();
    });

    app.listen(app.get("port"), () =>
      console.log("[server] http://localhost:" + app.get("port"))
    );

    // app.set('port', (process.env.PORT || 5000));
    // app.listen(app.get('port'), function() { });


    // Make the appropriate DB calls
    //...
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};
doSomeDBCalls();
