const express = require('express');
const app = express();
const {MongoClient,ObjectId} = require('mongodb');
const connectionString : string = "mongodb+srv://s131632:gVnC1L2v3E7yoqox@cluster0.kdtug.mongodb.net/WebOntwikkeling?retryWrites=true&w=majority";
const client = new MongoClient(connectionString, { useUnifiedTopology: true });

app.set("port", 3000);
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended:true}));

interface BlacklistItem{
    _id: any,
    quote: string,
    reden: string,
}

interface Favorite{
    _id: any
    quote: string,
    character: string
}

let doSomeDBCalls =async () => {
    try{
        await client.connect();

        let blacklistCursor = client.db(/*database naam*/).collection(/*collection naam*/).find({});
        let blacklist : BlacklistItem[] = await blacklistCursor.toArray();

        app.get("/blacklist", (req:any,res:any) => {
            res.render("blacklist", {blacklist: blacklist});
        });

        app.post("/addedBlacklistitem/:keuze:reden", async (req:any,res:any) => {
            await client.connect();
            let blacklistItem : BlacklistItem = {_id: ObjectId(), quote: req.params.keuze, reden: req.params.reden};
            blacklist.push(blacklistItem);
            await client.db(/*database naam*/).collection(/*collection naam*/).insertOne(blacklist);
            res.render("blacklist", {blacklist: blacklist });
            await client.close();
        });

        app.get("/removeblacklistitem/:keuze",async (req:any,res:any) => {
            await client.connect();
            await client.db(/*database naam*/).collection(/*collection naam*/).deleteOne({_id: blacklist[req.params.keuze]._id});
            let blacklistCursor = client.db(/*database naam*/).collection(/*collection naam*/).find({});
            blacklist = await blacklistCursor.toArray();
            res.render("blacklist", {blacklist: blacklist});
            await client.close();
        });

        let favoritesCursor = client.db(/*database naam*/).collection(/*collection naam*/).find({});
        let favorites : Favorite[] = await blacklistCursor.toArray();

        app.get("/favorites", (req:any,res:any) => {
            res.render("favorites", {favorites: favorites});
        });

        app.post("/addedfavorite", async (req:any,res:any) => {
            await client.connect();
            let favorite : Favorite = {_id: ObjectId(), quote: req.params.quote, character: req.params.character};
            favorites.push(favorite);
            await client.db(/*database naam*/).collection(/*collection naam*/).insertOne(favorite);
            res.render("favorites", {favorites: favorites });
            await client.close();
        });

        app.get("/removefavorite/:keuze",async (req:any,res:any) => {
            await client.connect();
            await client.db(/*database naam*/).collection(/*collection naam*/).deleteOne({_id: favorites[req.params.keuze]._id});
            let favoritesCursor = client.db(/*database naam*/).collection(/*collection naam*/).find({});
            favorites = await favoritesCursor.toArray();
            res.render("favorites", {favorites: favorites});
            await client.close();
        });
        
    } catch (e) {
        console.error(e);
    }
}

doSomeDBCalls();

app.listen(app.get("port"), () => {
    console.log(`Web application started at http://localhost:${app.get("port")}`)
})

export{};