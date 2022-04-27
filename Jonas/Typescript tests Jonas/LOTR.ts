const input = require('readline-sync');
const axios = require('axios');

export interface Movies {
    docs:   MovieDoc[];
    total:  number;
    limit:  number;
    offset: number;
    page:   number;
    pages:  number;
}
export interface MovieDoc {
    _id:                        string;
    name:                       string;
    runtimeInMinutes:           number;
    budgetInMillions:           number;
    boxOfficeRevenueInMillions: number;
    academyAwardNominations:    number;
    academyAwardWins:           number;
    rottenTomatoesScore:        number;
}
export interface Quotes {
    docs:   QouteDoc[];
    total:  number;
    limit:  number;
    offset: number;
    page:   number;
    pages:  number;
}
export interface QouteDoc {
    _id:       string;
    dialog:    string;
    movie:     string;
    character: string;
    id:        string;
}
export interface Books {
    docs:   BookDoc[];
    total:  number;
    limit:  number;
    offset: number;
    page:   number;
    pages:  number;
}
export interface BookDoc {
    _id:  string;
    name: string;
}
export interface Characters {
    docs:   CharacterDoc[];
    total:  number;
    limit:  number;
    offset: number;
    page:   number;
    pages:  number;
}
export interface CharacterDoc {
    _id:      string;
    height:   string;
    race:     string;
    gender?:  String;
    birth:    string;
    spouse:   string;
    death:    string;
    realm:    string;
    hair:     string;
    name:     string;
    wikiUrl?: string;
}

function shuffle(array : any[]) : any[]{
    let currentIndex : number = array.length;
    let randomIndex : number;
    while (currentIndex != 0){
        randomIndex = Math.floor(Math.random() * array.length);
        currentIndex--;
        let tempValue : any = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }
    return array;
}

async function TienRonden(){
    const quoteResponse = await axios.get("https://the-one-api.dev/v2/quote", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const quoteData : Quotes = quoteResponse.data;
    const characterResponse = await axios.get("https://the-one-api.dev/v2/character", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const characterData : Characters = characterResponse.data;
    const movieResponse = await axios.get("https://the-one-api.dev/v2/movie", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const movieData : Movies = movieResponse.data;
    let score : number = 0; 
    for(let i : number = 0;i<10;i++){
        let quoteIndex : number = Math.floor(Math.random() * quoteData.docs.length);
        let quote : QouteDoc = quoteData.docs[quoteIndex];
        console.log(`Quote: "${quote.dialog}"`);
        console.log("Van wie is deze quote?\n");
        let character : CharacterDoc = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
        for(let i : number = 0;i<characterData.docs.length;i++){
            if (characterData.docs[i]._id === quote.character){
                character = characterData.docs[i];
            }
        }
        let characters : CharacterDoc[] = [character, characterData.docs[Math.floor(Math.random() * characterData.docs.length)], characterData.docs[Math.floor(Math.random() * characterData.docs.length)]];
        shuffle(characters);
        for(let i : number = 0;i<characters.length;i++){
            console.log(characters[i].name);
        }
        let antwoordCharacter : string = input.question("\nAntwoord: ");
        if(antwoordCharacter.toLowerCase() === character.name.toLowerCase()){
            console.log(`Correct! ${character.name} was het juiste antwoord.\n`);
            score++;
        }else{
            console.log(`Fout! ${character.name} was het juiste antwoord.\n`);
        }

        console.log("Van welke film is deze quote?\n");
        let movie : MovieDoc = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
        for(let i : number = 0;i<movieData.docs.length;i++){
            if (movieData.docs[i]._id === quote.movie){
                movie = movieData.docs[i];
            }
        }
        let movies : MovieDoc[] = [movie, movieData.docs[Math.floor(Math.random() * movieData.docs.length)], movieData.docs[Math.floor(Math.random() * movieData.docs.length)]];
        shuffle(movies);
        for(let i : number = 0;i<movies.length;i++){
            console.log(movies[i].name);
        }
        let antwoordMovie : string = input.question("Antwoord: ");
        if(antwoordMovie.toLowerCase() === movie.name.toLowerCase()){
            console.log(`Correct! ${movie.name} was het juiste antwoord.\n`);
            score++;
        }else{
            console.log(`Fout! ${movie.name} was het juiste antwoord.\n`);
        }
    }
    console.log(`Je totaalscore was ${score/2.0}`);
}

async function SuddenDeath(){
    const quoteResponse = await axios.get("https://the-one-api.dev/v2/quote", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const quoteData : Quotes = quoteResponse.data;
    const characterResponse = await axios.get("https://the-one-api.dev/v2/character", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const characterData : Characters = characterResponse.data;
    const movieResponse = await axios.get("https://the-one-api.dev/v2/movie", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    const movieData : Movies = movieResponse.data;
    let score : number = 0; 
    let juistAntwoord : boolean = true;
    while(juistAntwoord){
        let quoteIndex : number = Math.floor(Math.random() * quoteData.docs.length);
        let quote : QouteDoc = quoteData.docs[quoteIndex];
        console.log(`Quote: "${quote.dialog}"`);
        console.log("Van wie is deze quote?\n");
        let character : CharacterDoc = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
        for(let i : number = 0;i<characterData.docs.length;i++){
            if (characterData.docs[i]._id === quote.character){
                character = characterData.docs[i];
            }
        }
        let characters : CharacterDoc[] = [character, characterData.docs[Math.floor(Math.random() * characterData.docs.length)], characterData.docs[Math.floor(Math.random() * characterData.docs.length)]];
        shuffle(characters);
        for(let i : number = 0;i<characters.length;i++){
            console.log(characters[i].name);
        }
        let antwoordCharacter : string = input.question("\nAntwoord: ");
        if(antwoordCharacter.toLowerCase() === character.name.toLowerCase()){
            console.log(`Correct! ${character.name} was het juiste antwoord.\n`);
            score++;
        }else{
            console.log(`Fout! ${character.name} was het juiste antwoord.\n`);
            juistAntwoord = false;
        }

        console.log("Van welke film is deze quote?\n");
        let movie : MovieDoc = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
        for(let i : number = 0;i<movieData.docs.length;i++){
            if (movieData.docs[i]._id === quote.movie){
                movie = movieData.docs[i];
            }
        }
        let movies : MovieDoc[] = [movie, movieData.docs[Math.floor(Math.random() * movieData.docs.length)], movieData.docs[Math.floor(Math.random() * movieData.docs.length)]];
        shuffle(movies);
        for(let i : number = 0;i<movies.length;i++){
            console.log(movies[i].name);
        }
        let antwoordMovie : string = input.question("Antwoord: ");
        if(antwoordMovie.toLowerCase() === movie.name.toLowerCase()){
            console.log(`Correct! ${movie.name} was het juiste antwoord.\n`);
            score++;
        }else{
            console.log(`Fout! ${movie.name} was het juiste antwoord.\n`);
            juistAntwoord = false;
        }
    }
    console.log(`Je totaalscore was ${score/2.0}`);
}
SuddenDeath();
export{};