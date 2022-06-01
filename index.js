const express = require("express");
const app = express();
const ejs = require("ejs"); // EJS import

const uri =
  "mongodb+srv://YJSK:LOTRYJSK@theone.4lvoc.mongodb.net/TheOne?retryWrites=true&w=majority";
const { MongoClient, ObjectId } = require("mongodb");
//const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
const client = new MongoClient(uri, { useUnifiedTopology: true });

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



let doSomeDBCalls = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    app.get("/", (req, res) => {
      res.render("index");
    });
    app.get("/LOTR", (req, res) => {
      res.render("quiz");
    });
    app.get("/LOTR/1", (req, res) => {
      res.render("q1");
    });
    app.get("/LOTR/2", (req, res) => {
      res.render("q2");
    });

    let blacklistCursor = client.db("TheOne").collection("Blacklist").find({});
    let blacklist = await blacklistCursor.toArray();

    app.get("/blacklist", (req, res) => {
      res.render("blacklist", { blacklist: blacklist });
    });

    app.post("/addedBlacklistitem/:keuze:reden", async (req, res) => {
      await client.connect();
      let blacklistItem = {
        _id: ObjectId(),
        quote: req.params.keuze,
        reden: req.params.reden,
      };
      blacklist.push(blacklistItem);
      await client.db("TheOne").collection("Blacklist").insertOne(blacklist);
      res.render("blacklist", { blacklist: blacklist });
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
      res.render("blacklist", { blacklist: blacklist });
      await client.close();
    });

    let favoritesCursor = client.db("TheOne").collection("Favorites").find({});
    let favorites= await blacklistCursor.toArray();

    app.get("/favorites", (req, res) => {
      res.render("favorites", { favorites: favorites });
    });

    app.post("/addedfavorite", async (req, res) => {
      await client.connect();
      let favorite= {
        _id: ObjectId(),
        quote: req.params.quote,
        character: req.params.character,
      };
      favorites.push(favorite);
      await client.db("TheOne").collection("Favorites").insertOne(favorite);
      res.render("favorites", { favorites: favorites });
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
      res.render("favorites", { favorites: favorites });
      await client.close();
    });

    app.listen(app.get("port"), () =>
      console.log("[server] http://localhost:" + app.get("port"))
    );
    /*
    app.set('port', (process.env.PORT || 5000));
    app.listen(app.get('port'), function() { });
    */


    // Make the appropriate DB calls
    //...
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};
doSomeDBCalls();
