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

let score = 0;
let rounds = 0;
let lastQuoteIndex = 0;//index van de vorige quote (voor oplossingen te checken)
let CorrectAnswer = true;
if(rounds === 0){
    document.getElementById("submit").style.display = "none";
}


const SuddenDeath = () => {
    rounds++;
    // if(rounds === 10){
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
        let article = document.getElementsByTagName("article");
        if(rounds>0){    // indien er een ronde is geweest => controleert het antwoord
            document.getElementById("submit").style.display = "block";
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
            let checkedExists = false
            let mistake = false;
            for(let i = 0;i<inputElements.length;i++){
                if (inputElements[i].checked){
                    checkedExists = true;
                    if(i<3 && inputElements[i].value != lastCharacter.name){
                        CorrectAnswer = false;
                        article[1].remove();
                        article[0].insertAdjacentHTML("afterbegin",`<article>
                        <h2><strong>Gefeliciteerd!</strong><h2>
                        <p>je hebt ${rounds-2} ronde(n) correct voor een score van ${Math.floor(score/2)}</p></article>`);
                        document.getElementById("submit").style.display = "none";
                        mistake = true;
                    }else if(i>=3 && inputElements[i].value != lastMovie.name){
                        CorrectAnswer = false;
                        article[1].remove();
                        article[0].insertAdjacentHTML("afterbegin",`<article>
                        <h2><strong>Gefeliciteerd!</strong><h2>
                        <p>je hebt ${rounds-2} ronde(n) correct voor een score van ${Math.floor(score/2)}</p></article>`);
                        document.getElementById("submit").style.display = "none";
                        mistake = true;
                    }else{
                        if(!mistake){
                            score++;
                            CorrectAnswer = true;
                       }
                    }
                }
            }  
            if(!checkedExists && rounds > 1){
                CorrectAnswer = false;
                article[1].remove();
                article[0].insertAdjacentHTML("afterbegin",`<article>
                <h2><strong>Gefeliciteerd!</strong><h2>
                <p>je hebt ${rounds-2} ronde(n) correct voor een score van ${Math.floor(score/2)}</p></article>`);
                document.getElementById("submit").style.display = "none";
            }
        }
        if(CorrectAnswer){
            article[1].remove();
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
        }
    })
}
const checkRadiobuttons = () => {

}