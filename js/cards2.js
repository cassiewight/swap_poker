//Single Deck, Single Hand game

//DOM containers
var container = document.querySelector(".container");
var gameContainer = document.querySelector(".gameContainer");
var deckContainer = document.querySelector(".deckContainer");
var handContainer = document.querySelector(".handContainer");
var discardedContainer = document.querySelector(".discarded");
var containerOverlay = document.querySelector(".gameContainerOverlay");

//popups
var resultPopup = document.querySelector(".resultPopup");
var gameOverPopup = document.querySelector(".gameOverPopup");
var discardedPeek = document.querySelector(".discardedPeek");
//DOM container for the cards in he discarded peek popup
var cardsContainer = document.querySelector(".discardedCardsContainer");

//control panel entities
var DOMDeck = document.querySelector("#result_cardsInDeck");
var DOMSwitches = document.querySelector("#result_switches");
var DOMPoints = document.querySelector("#result_points");
var DOMPeek = document.querySelector("#btnPeek");
var DOMSubmit = document.querySelector("#btnSubmit");

//HTML/CSS classes
var classCard = 'card';
var classPlayingCard = 'playingCard';
var classDeckCover = 'deckCover';
var classDiscarded = 'discarded';

//game constants
const NUM_CARDS_IN_HAND = 5;
const MAX_CARDS_TO_BE_SWITCHED = 4;
const MAX_NUMBER_OF_SWITCHES = 5;

//keeps track of the switches made
var switches = 0;

var points = 0;

Outcomes = {
    'royalFlush' : {name: 'Royal Flush', points: 800},
    'straightFlush' : {name: 'Straight Flush', points: 600},
    'fourOfAKind' : {name: 'Four of a Kind', points: 400},
    'fullHouse' : {name: 'FullHouse', points: 350},
    'flush' : {name: 'Flush', points: 300},
    'straight' : {name: 'Straight', points: 250},
    'threeOfAKind' : {name: 'Three of a Kind', points: 200},
    'twoPair' : {name: 'Two Pair', points: 100},
    'pair' : {name: 'One Pair', points: 50},
    'nothing' : {name: 'Nothing', points: -100}
}

var myDeck = new Array();
var myHand = new Hand();
var discarded = new Array();

//event listeners are placed on the whole container.  
//Depending on the target the correct function is called
container.addEventListener('click', selectCard);
container.addEventListener('click', switchCards);
DOMPeek.addEventListener('click', peek);
DOMSubmit.addEventListener('click', submit);

//popup ok buttons event listeners

//peek popup ok button
document.querySelector("#btnDiscardedPeek").addEventListener("click", function(){
    discardedPeek.style.display="none";
    containerOverlay.style.display="none";
});

//starting score
var score = 0;

//#region OBJECT CONSTUCTORS

//Enum for the suits
let Suits = {
    hearts: "hearts",
    diamonds: "diamonds",
    clubs: "clubs",
    spades: "spades"
}

//array for the ranks
let Ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

//Card object
function Card(suit, rank){
    this.suit = suit,
    this.rank = rank
}

//Binded card object (arguments are DOM element and js object)
function BindedCard(element, card){
    this.element = element;
    this.card = card;
    element.value = card;
}

//Hand object
function Hand(){
    //hand is the cards, selected is the array when user clicks on cards
    this.hand = new Array();
    this.selected = new Array();
}

//Decks are arrays of BindedCards

//#endregion


//#region FUNCTIONS TO INITIALIZE GAME


//Function that creates Binded Cards and pushes them into a Deck array
function fillDeck(deck){

    for(var i = 0; i < Ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.hearts, Ranks[i]),
                new Card(Suits.hearts, Ranks[i]), 
                ))
    }

    for(var i = 0; i < Ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.diamonds, Ranks[i]),
                new Card(Suits.diamonds, Ranks[i]), 
                ))
    }

    for(var i = 0; i < Ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.clubs, Ranks[i]),
                new Card(Suits.clubs, Ranks[i]), 
                ))
    }

    for(var i = 0; i < Ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.spades, Ranks[i]),
                new Card(Suits.spades, Ranks[i]), 
                ))
    }

}

//function to create DOM card element
function DOMCreateCard(suit, rank){
    
    //create div
    var div = document.createElement("div");
    div.classList.add(classCard);
    div.classList.add(classPlayingCard);
    div.style.backgroundImage="url('img/card_faces/" + suit + "_" + rank + ".svg')";
    
    return div;

}

//Function to fill the hand from a deck
function fillHand(deck, hand){
    for(var i = 0; i < NUM_CARDS_IN_HAND; i++){
        hand.push(deck.pop());
    }
    return hand;
}

//Function to display hand in the DOM
function DOMDisplayHand(hand){

    //create container
    var div = document.createElement("div");
    div.classList.add("hand");

    for(var i = 0; i < hand.length; i++){
        div.append(hand[i].element);
    }

    handContainer.append(div);
    
}

//takes an array of cards and shuffles them
function shuffle(cards){
    for(var i = 0; i < cards.length; i++){
        var temp = cards[i];
        var randomIndex = Math.round(Math.random() * (cards.length - 1))
        cards[i] = cards[randomIndex];
        cards[randomIndex] = temp;
    }
}

//#endregion

//#region SWITCH CARDS FUNCTIONALITY

//toggles selection/deselection of cards
function selectCard(e){
    //check if clicked element is a card
    if(e.target.classList.contains(classPlayingCard)){

        //the max number of cards that can be selected is the const MAX_CARDS_TO_BE_SWITCHED 
        //unless there is less cards than that in the deck, in which case only the number of cards left in the deck can be selected and switched
        var maxNumCardsSelected = MAX_CARDS_TO_BE_SWITCHED;

        //check the number of cards left in the deck
        if(myDeck.length < MAX_CARDS_TO_BE_SWITCHED){
            maxNumCardsSelected = myDeck.length;
        }

        if(switches < MAX_NUMBER_OF_SWITCHES){

            //boolean to store whether the card is being selected or deselected
            var selected = false;

            //if the selected array is empty, push in the clicked element to the selected array
            if(myHand.hand.length == 0){
                myHand.selected.push(e.target.value);
                e.target.classList.add('cardSelected');
            }

            else {
                //loop through array to check if it is already selected
                for(var i =0; i < myHand.selected.length; i++){
                    if(myHand.selected[i] === e.target.value){
                        //deselect
                        myHand.selected.splice(i, 1);
                        e.target.classList.remove('cardSelected');
                        selected = true;
                        break;
                    }
                    else {
                        //select
                        selected = false;
                    }
                }

                if(myHand.selected.length < maxNumCardsSelected && selected == false){
                    myHand.selected.push(e.target.value);
                    e.target.classList.add('cardSelected');
                }
            }
        }
    }        
}


function switchCards(e){

    //check if clicked item is the deck cover
    if(e.target.classList.contains("deckCover")){

        //check if there is anything in the selected array
        if(myHand.selected.length < 1){
            console.log("Nothing selected");
        }
        
        else {
        
            //Splice the selected cards from the hand and replace with new cards from deck
            myHand.selected.forEach(f =>
                    myHand.hand.splice(
                        myHand.hand.findIndex(
                            e => e.card == f),1, myDeck.pop()));
            
            
            //add playing card class
            
            //Recreate card objects and put them back on the bottom of the deck
            myHand.selected.forEach(f => myDeck.unshift(
                    new BindedCard(
                        DOMCreateCard(f.suit, f.rank),
                            new Card(f.suit, f.rank), 
                        )));

            // //push cards into dicsarded array
            // myHand.selected.forEach(f => discarded.unshift(
            //             new BindedCard(
            //                 DOMCreateCard(f.suit, f.rank),
            //                     new Card(f.suit, f.rank), 
            //                 )));
            
            //refresh the hand
            refreshHand();

            myHand.selected = [];
            switches ++;

            //update controls
            DOMSwitches.innerHTML= MAX_NUMBER_OF_SWITCHES - switches;
            DOMDeck.innerHTML = myDeck.length;
            
            if(switches == MAX_NUMBER_OF_SWITCHES || myDeck.length == 0){
                refreshHand();
                submit(myHand.hand);
                
            }

        }

        //reset selected array to empty;
        
    }
}

//#endregion


function peek(e){
    if(e.target.id == "btnPeek"){

        //empty DOM
        cardsContainer.innerHTML = '';

        //display transparent overlay over screen
        containerOverlay.style.display="block";
        discardedPeek.style.display="flex";

        for(var i = 0; i < discarded.length; i++){
            cardsContainer.append(discarded[i].element);
        }

    }
}

//#region SUBMIT AND DETERMINE OUTCOME

function submit(hand){

    //push hand into discarded array.  Remove playing class card so the cards cannot be selected
    for(var i = 0; i < myHand.hand.length; i++){
        myHand.hand[i].element.classList.remove("playingCard");
        discarded.push(myHand.hand[i]);
    }

    var result = getResult(hand);
    points += Outcomes[result].points;

    displayResultPopup(result);

    //update controls
    DOMPoints.innerHTML = points;

}

function getResult(){

    sortByRank();
    //check for sequence(5 consecutive cards)
    if(isSequence()){
        //check for the suits
        if(isAllOneSuit()){
            if(myHand.hand[0].card.rank == 1){
                //Outcomes['royalFlush'].isOutcome = true;
                return 'royalFlush';
            }
            else {
                //Outcomes['straightFlush'].isOutcome = true;
                return 'straightFlush';
            }
        }
        else {
            //Outcomes['straight'].isOutcome = true;
            return 'straight';
        }
    }
    else {
            //check for 4 or a kind:
        if(myHand.hand[0].card.rank == myHand.hand[3].card.rank || 
            myHand.hand[1].card.rank == myHand.hand[4].card.rank){
                //Outcomes['fourOfAKind'].isOutcome = true;
                return 'fourOfAKind';
        }

        //check for flush
        else if(isAllOneSuit()){
            return 'flush';
        }
        //check for full house
        else if((myHand.hand[0].card.rank == myHand.hand[2].card.rank &&
                myHand.hand[3].card.rank == myHand.hand[4].card.rank) ||
                (myHand.hand[0].card.rank == myHand.hand[1].card.rank &&
                myHand.hand[2].card.rank == myHand.hand[4].card.rank)){
                    //Outcomes['fullHouse'].isOutcome = true;
                    return 'fullHouse';
        }
        else {
            //check for three of a kind
            for(var i = 0; i <= myHand.hand.length / 2; i++){
                if(myHand.hand[i].card.rank == myHand.hand[i+2].card.rank){
                    //Outcomes['threeOfAKind'].isOutcome = true;
                    return 'threeOfAKind'
                }
            }

            //check for pairs
            var pairs = 0;
            var i = 0; 
            while(i < myHand.hand.length - 1){
                if(myHand.hand[i].card.rank == myHand.hand[i+1].card.rank){
                    console.log("pair found!)");
                    pairs ++;
                    i += 2;
                }
                else{
                    i ++;
                }
            }
            if(pairs == 2){
                //Outcomes['twoPair'].isOutcome = true;
                return 'twoPair';
            }
            else if(pairs == 1){
                //Outcomes['pair'].isOutcome = true;
                return 'pair';
            }
            else{
                return 'nothing';
            }

        }

    }

}

function sortByRank(){

    for(var i = 0; i < myHand.hand.length-1; i++){
        for(var j = 0; j < myHand.hand.length -i -1; j++){
            if(myHand.hand[j].card.rank > myHand.hand[j+1].card.rank){
                var temp = myHand.hand[j];
                myHand.hand[j] = myHand.hand[j+1];
                myHand.hand[j+1] = temp;
            }
        }
    }
}

//returns true if hand is a sequence of 5
function isSequence(){
    //sort and remove aces

    var endPoint = 0;
    hasAce = false;
    //check if first card is an ace.  If second card is Ace then return false(not a sequence)
    if(myHand.hand[0].card.rank == 1){
        if(myHand.hand[1].card.rank == 1){
            return false;
        }
        else{
            hasAce = true;
            endPoint = 1;
        }
        
    }
    //check if the sequence exists without aces
    for(var i = myHand.hand.length - 1; i > endPoint; i--){
        if(myHand.hand[i].card.rank - myHand.hand[i-1].card.rank != 1){
            return false;
        }
    }
    //if there are aces, check if they fit into the sequence
    if(hasAce && 
        (myHand.hand[0].card.rank != 2 
            && myHand.hand[myHand.hand.length-1].card.rank != 13
        )){
        return false;
    }

    console.log("sequence exists");
    return true;
}

//Returns true if the hand is all one suit
function isAllOneSuit(){
    for(var i = myHand.hand.length - 1; i > 0; i--){
        if (myHand.hand[i].card.suit != myHand.hand[i-1].card.suit){
            return false;
        }
    }
    return true;

}

//#endregion


//#region DISPLAY POPUPS

function displayResultPopup(result){

    //display transparent overlay over screen
    containerOverlay.style.display="block";
    //display popup
    resultPopup.style.display="flex";

    var outcome = Outcomes[result].name;
    var points = Outcomes[result].points;
    //create the content and OK button
    resultPopup.innerHTML = ("<span class='font-primary'>" + outcome + "</span><span class='font-main'>" + points + " points </span><button id='btnResultPopupOK' class='btn-popup'>OK</button>");
    
    //result popup ok button
    document.querySelector('#btnResultPopupOK').addEventListener("click", function(){
        resultPopup.style.display="none";
        containerOverlay.style.display="none";
        if(myDeck.length <= 5){
            displayGameOver();
        }
        else {
            refreshGame();
        }
    });



}

function displayGameOver(){

    //display transparent overlay over screen
    containerOverlay.style.display="block";

    gameOverPopup.style.display="flex";

    gameOverPopup.innerHTML = '<p class="font-primary">Final Score: ' + points + " points</p> <button id='btnGameOverPopupOK' class='btn-popup'>Play Again</button>";

    //game over popup ok button
    document.querySelector("#btnGameOverPopupOK").addEventListener("click", function(){
        gameOverPopup.style.display="none";
        containerOverlay.style.display="none";
        resetGame();

    });

}

//#endregion


//complete reset of game
function resetGame(){

    //remove DOM hand
    handContainer.removeChild(handContainer.children[0]);
    //reset points
    points = 0;
    //empty deck
    myDeck = [];
    //empty hand
    myHand.hand = [];
    //empty selected array
    myHand.selected = [];
    //empty discarded array
    discarded = [];

    //TODO: EMPTY DISCARDED DOM


    //reset switches to 0
    switches = 0;
    //initialize game
    initializeGame();
}

//refreshes the hand in the DOM
function refreshHand(){
    //remove currend hand
    handContainer.removeChild(handContainer.children[0]);
    var newDiv = document.createElement("div");
    newDiv.classList.add("hand");
    myHand.hand.forEach(e => e.element.classList.add(classCard));
    myHand.hand.forEach(e => e.element.classList.add(classPlayingCard));
    myHand.hand.forEach(e => newDiv.append(e.element));
    handContainer.appendChild(newDiv);
}


function updateControls(){
    DOMDeck.innerHTML = myDeck.length;
    DOMPoints.innerHTML = points;
    DOMSwitches.innerHTML = MAX_NUMBER_OF_SWITCHES; 
}


//MAIN METHOD

function initializeGame(){

    fillDeck(myDeck);

    //add playingCard class to make the cards selectable (the class is removed when they are pushed into the dicarded deck) 
    for(var i = 0; i < myDeck.length; i++){
        myDeck[i].element.classList.add("playingCard");
    }
    shuffle(myDeck);
    //fill player's hand from shuffled deck
    fillHand(myDeck, myHand.hand);
    //display hand
    DOMDisplayHand(myHand.hand);
    //set DOM controls
    updateControls();
}

//refreshGame is called 
function refreshGame(){

    myHand.hand = [];
    fillHand(myDeck, myHand.hand);

    //refresh DOM hand
    refreshHand();

    switches = 0;

    //update control
    updateControls();
}

initializeGame();

