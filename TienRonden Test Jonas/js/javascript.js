function shuffle(array ){
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

    // const characterResponse = await axios.get("https://the-one-api.dev/v2/character", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    // const response[1]  = characterResponse.data;
    // const movieResponse = await axios.get("https://the-one-api.dev/v2/movie", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}});
    // const response[2]  = movieResponse.data;
    // const button = document.getElementsByTagName("button");
    // console.log(response[2]);
    // let score  = 0; 
    // for(let i  = 0;i<10;i++){
    //     let quoteIndex  = Math.floor(Math.random() * quoteData.docs.length);
    //     let quote  = quoteData.docs[quoteIndex];
    //     console.log(`Quote: "${quote.dialog}"`);
    //     console.log("Van wie is deze quote?\n");
    //     let character  = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
    //     for(let i = 0;i<response[1].docs.length;i++){
    //         if (response[1].docs[i]._id === quote.character){
    //             character = response[1].docs[i];
    //         }
    //     }
    //     let characters = [character, response[1].docs[Math.floor(Math.random() * response[1].docs.length)], response[1].docs[Math.floor(Math.random() * response[1].docs.length)]];
    //     shuffle(characters);
    //     for(let i = 0;i<characters.length;i++){
    //         console.log(characters[i].name);
    //     }
    //     let antwoordCharacter = ""
    //     if(antwoordCharacter.toLowerCase() === character.name.toLowerCase()){
    //         console.log(`Correct! ${character.name} was het juiste antwoord.\n`);
    //         score++;
    //     }else{
    //         console.log(`Fout! ${character.name} was het juiste antwoord.\n`);
    //     }

    //     console.log("Van welke film is deze quote?\n");
    //     let movie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
    //     for(let i  = 0;i<response[2].docs.length;i++){
    //         if (response[2].docs[i]._id === quote.movie){
    //             movie = response[2].docs[i];
    //         }
    //     }
    //     let movies = [movie, response[2].docs[Math.floor(Math.random() * response[2].docs.length)], response[2].docs[Math.floor(Math.random() * response[2].docs.length)]];
    //     shuffle(movies);
    //     for(let i = 0;i<movies.length;i++){
    //         console.log(movies[i].name);
    //     }
    //     let antwoordMovie = "";
    //     if(antwoordMovie.toLowerCase().trim() === movie.name.toLowerCase().trim()){
    //         console.log(`Correct! ${movie.name} was het juiste antwoord.\n`);
    //         score++;
    //     }else{
    //         console.log(`Fout! ${movie.name} was het juiste antwoord.\n`);
    //     }
    // }
    // console.log(`Je totaalscore was ${score/2.0}`);
let score = 0;
let rounds = 0;
let lastQuoteIndex = 0;

document.getElementById("finish").style.display = "none";
const TienRonden = () => {
    document.getElementById("finish").style.display = "none";
    rounds++;
    // if(rounds === 10){
    //     document.getElementById("finish").style.display = "block";
    //     document.getElementById("submit").style.display = "none";
    // }
    const quoteFetch = fetch("https://the-one-api.dev/v2/quote", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}})
    .then((response) => {return response.json();})
    const characterFetch = fetch("https://the-one-api.dev/v2/character", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}})
    .then((response) => {return response.json();})
    const movieFetch = fetch("https://the-one-api.dev/v2/movie", {headers: {"Authorization" : 'bearer gAAIgrTSktkemLaiBud2'}})
    .then((response) => {return response.json();})
    const Data = Promise.all([quoteFetch,characterFetch,movieFetch])
    Data.then((response) => {
        let inputElements = document.getElementsByTagName("input");
        if(rounds>0){    
            let lastQuote = response[0].docs[lastQuoteIndex];
            let lastCharacter  = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
            for(let i = 0;i<response[1].docs.length;i++){
                if (response[1].docs[i]._id === lastQuote.character){
                    lastCharacter = response[1].docs[i];
                }
            }
            let lastMovie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
            for(let i  = 0;i<response[2].docs.length;i++){
                if (response[2].docs[i]._id === lastQuote.movie){
                    lastMovie = response[2].docs[i];
                }
            }    
            for(let i = 0;i<inputElements.length;i++){
                if (inputElements[i].checked){
                    if(inputElements[i].value === lastCharacter.name ||inputElements[i].value === lastMovie.name){
                        score++;
                    }
                }
            }    
        }
        let article = document.getElementsByTagName("article");
        article[1].remove();
        if(rounds<=10){
            let quoteIndex = Math.floor(Math.random() * response[0].docs.length);
            lastQuoteIndex = quoteIndex;
            let quote = response[0].docs[quoteIndex];
            let character  = {_id:"",height:"",race:"",gender:"",birth:"",spouse:"",death:"",realm:"",hair:"",name:"",wikiUrl:""};
            for(let i = 0;i<response[1].docs.length;i++){
                if (response[1].docs[i]._id === quote.character){
                    character = response[1].docs[i];
                }
            }
            let characters = [character, response[1].docs[Math.floor(Math.random() * response[1].docs.length)], response[1].docs[Math.floor(Math.random() * response[1].docs.length)]];
            // shuffle(characters);
            let movie  = {_id:"",name:"",runtimeInMinutes:0,budgetInMillions:0,boxOfficeRevenueInMillions:0,academyAwardNominations:0,academyAwardWins:0,rottenTomatoesScore:0};
            for(let i  = 0;i<response[2].docs.length;i++){
                if (response[2].docs[i]._id === quote.movie){
                    movie = response[2].docs[i];
                }
            }
            let movies = [movie, response[2].docs[Math.floor(Math.random() * response[2].docs.length)], response[2].docs[Math.floor(Math.random() * response[2].docs.length)]];
            // shuffle(movies);
            let h2 = document.getElementsByTagName("h2");
            article[0].insertAdjacentHTML("afterbegin",`<article><p>${quote.dialog}</p>
                <p>Van welk personage komt deze quote?</p>
                <input type="radio" id="character1" name="character" value="${characters[0].name}">
                <label for="character1">${characters[0].name}</label><br>
                <input type="radio" id="character2" name="character" value="${characters[1].name}">
                <label for="character2">${characters[1].name}</label><br>
                <input type="radio" id="character3" name="character" value="${characters[2].name}">
                <label for="character3">${characters[2].name}</label>
                <p>Uit welke film komt deze quote?</p>
                <input type="radio" id="character1" name="movie" value="${movies[0].name}">
                <label for="character1">${movies[0].name}</label><br>
                <input type="radio" id="character2" name="movie" value="${movies[1].name}">
                <label for="character2">${movies[1].name}</label><br>
                <input type="radio" id="character3" name="movie" value="${movies[2].name}">
                <label for="character3">${movies[2].name}</label></article>`);
            console.log(score);
            console.log(rounds);
        }if (rounds === 9){
            let button = document.getElementById("submit");
            button.textContent = "Finish"
        }if (rounds > 10){
            article[0].insertAdjacentHTML("afterbegin",`<article>
            <h2><strong>Gefeliciteerd!</strong><h2>
            <p>je hebt een score van ${score}</p></article>`);
        }
    })
}
const checkRadiobuttons = () => {

}