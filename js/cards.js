console.log("cards.js has loaded");

//classes
var classCard = 'card';
var classPlayingCard = 'playingCard';
var classDeckCover = 'deckCover';

//DOM containers
var container = document.querySelector(".container");
var deckContainer = document.querySelector(".deckContainer");
var DOMhands = document.getElementsByClassName("hand");
var handContainer = document.querySelector(".handContainer");

container.addEventListener('click', selectCard);
container.addEventListener('click', switchCards);
container.addEventListener('click', switchCards);

const NUM_CARDS_IN_HAND = 6;
const MAX_CARDS_TO_BE_SWITCHED = 4;
const MIN_CARDS_TO_BE_SWITCHeD = 0;

var numHands = 0;

//enum for the suits
let Suits = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠"
}

//array for the ranks
let RanksFullDeck = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
let RanksHalfDeck = [9, 10, "J", "Q", "K", "A"];

//Create card objects
function card(suit, rank){
    this.suit = suit,
    this.rank = rank
}

function BindedCard(element, card){
    this.element = element;
    this.card = card;
    element.value = card;
}

// myBindedCard = new BindedCard(
//     DOMCreateCard(Suits.hearts, RanksFullDeck[0]),
//     new card(Suits.hearts, RanksFullDeck[0]), 
//     );

// console.log(myBindedCard.obj);

//function that allows user to select and deselect cards to switch out.
//pushes into and removes card from HandSelected array
function selectCard(e){

    if(e.target.classList.contains(classPlayingCard)){

        //make nodelist of hands into array
        var handsArray = Array.from(DOMhands);

        //find index of the hand that is being selected
        HandIndex = handsArray.findIndex(f => f == e.target.parentElement);

        //define the hand (it will be the same index).  Returns myHand object
        var theHand = Hands[HandIndex];


        var selected = false;

        if(theHand.hand.length == 0){
            HandSelected.push(e.target.value);
            e.target.style.top="-10px";
        }

        else{
            //loop through array
            for(var i =0; i < theHand.selected.length; i++){
                if(theHand.selected[i] === e.target.value){
                    theHand.selected.splice(i, 1);
                    e.target.style.top="0px";
                    selected = true;
                    break;
                }
                else{
                    selected = false;
                }
            }
            //if the clicked item is not already in the selected array
            //and the array is less than 4:
            //push the selected item into the selected array
            if(theHand.selected.length < MAX_CARDS_TO_BE_SWITCHED && selected == false){
                theHand.selected.push(e.target.value);
                e.target.style.top="-10px";
            }
        }
        console.log(theHand.selected);
    }
}

function switchCards(e){

    //OPTION 1: send cards back to the bottom of the deck
    //OPTION 2: send cards to another deck called 'discarded'

    if(e.target.classList.contains(classDeckCover)){

        //the hand is a myHand object
        var theHand;

        if(e.target.getAttribute("id") == "switch1"){
            theHand = Hands[0];
        }
        else if(e.target.getAttribute("id") == "switch2") {
            theHand = Hands[1];
        }

        if(theHand.selected.length < 1){
            console.log("Nothing selected");
        }
        //filter the Hand
        else{
            //filter and splice selected cards from hand

            //OPTION 1            
            //HandSelected.forEach(f => Discarded.unshift(Hand.splice(Hand.findIndex(e => e.card == f),1)));

            //OPTION 2
            theHand.selected.forEach(f => Deck.unshift(theHand.hand.splice(theHand.hand.findIndex(e => e.card == f),1)));

            //replace cards with new cards from deck
            var numCardsToBeReplaced = NUM_CARDS_IN_HAND - Hand.length;
            for (var i = 0; i < numCardsToBeReplaced; i++){
                Hand.push(flipCard(Deck.pop()));
            }
            //refresh DOM NEEDS TO BE REFACTORED
            //remove hand from container
            handContainer.removeChild(handContainer.children[0]);
            var newDiv = document.createElement("div");
            newDiv.classList.add("hand");
            theHand.hand.forEach(e => e.element.classList.add("card"));
            theHand.hand.forEach(e => newDiv.append(e.element));
            handContainer.appendChild(newDiv);
        }

        theHand.selected = [];
        console.log(Deck.length);
    }
}


//Deck is an array of Cards.
//Takes the Deck array and the array of ranks 
function fillDeck(deck, ranks){

    for(var i = 0; i < ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.hearts, ranks[i]),
                new card(Suits.hearts, ranks[i]), 
                ))
    }

    for(var i = 0; i < ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.diamonds, ranks[i]),
                new card(Suits.diamonds, ranks[i]), 
                ))
    }

    for(var i = 0; i < ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.clubs, ranks[i]),
                new card(Suits.clubs, ranks[i]), 
                ))
    }

    for(var i = 0; i < ranks.length; i++){
        deck.push(
            new BindedCard(
                DOMCreateCard(Suits.spades, ranks[i]),
                new card(Suits.spades, ranks[i]), 
                ))
    }
}


function DOMCreateCard(suit, rank){
    
    var newDiv = document.createElement("div");
    newDiv.classList.add(classCard);
    newDiv.classList.add(classPlayingCard);
    var DOMrank = document.createTextNode(rank);
    var DOMsuit = document.createTextNode(suit);

    if(suit == Suits.diamonds || suit == Suits.hearts){
        newDiv.style.color = "red";
    }

    newDiv.appendChild(DOMrank);
    newDiv.appendChild(DOMsuit);

    //create back of card overlay:
    var cardBack = document.createElement("div");
    cardBack.classList.add("cardBack");

    newDiv.appendChild(cardBack);

    return newDiv;
}

//by default the cards are flipped so the back is facing up
function displayDeck(deck){
    for(var i = 0; i < deck.length; i++){
        deckContainer.append(deck[i].DOM);
    }
}

function displayHand(hand){
    //create container
    var newDiv = document.createElement("div");
    newDiv.classList.add("hand");

    //flip the cards
    for(var i = 0; i < hand.length; i++){
        flipCard(hand[i]);
        newDiv.append(hand[i].element);
    }
    handContainer.append(newDiv);

    //create switch button
    
    numHands ++;
}

function shuffleDeck(deck){

    for(var i = 0; i < deck.length; i++){
        var temp = deck[i];
        var randomIndex = Math.round(Math.random()* deck.length)
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function flipCard(bindedCard){
    //toggle the back of card overlay display
    if (bindedCard.element.children[0].style.display == "none"){
        bindedCard.element.children[0].style.display = "block";
    }
    else {
        bindedCard.element.children[0].style.display = "none";
    }
    return bindedCard;
}

//takes the deck, the hand array and the numberOfCards
function fillHand(hand, deck, numCards){
    for(var i = 0; i < numCards; i++){
        hand.push(deck.pop());
    }
}


function sortHand(numCards){

}


//need to bind the 

function myHand(){
    this.hand = new Array();
    this.selected = new Array();
}


//create deck
Deck = new Array();
Discarded = new Array();

Hands = new Array();

Hand = new myHand();
Hand2 = new myHand();

Hands.push(Hand);
Hands.push(Hand2);
//fill deck
fillDeck(Deck, RanksFullDeck);

//shuffle deck
shuffleDeck(Deck);

//fill Hand
fillHand(Hands[0].hand, Deck, NUM_CARDS_IN_HAND);
fillHand(Hands[1].hand, Deck, NUM_CARDS_IN_HAND);

//display deck
//displayDeck(Deck);

//display hand
displayHand(Hands[0].hand);
displayHand(Hands[1].hand);




