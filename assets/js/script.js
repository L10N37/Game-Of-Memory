let defaultHiddenImage = "./assets/images/qmark.jpg";
let tickImage = "./assets/images/tick.jpg";
let cardstate = {
  hidden:"hidden",
  showing:"showing",
  paired: "paired"
}
let cardsFlipped = 0;
let interval;

let cardImageArray1= [];
cardImageArray1.push('./assets/images/1.png');
cardImageArray1.push('./assets/images/2.png');
cardImageArray1.push('./assets/images/3.png');
cardImageArray1.push('./assets/images/4.png');
cardImageArray1.push('./assets/images/5.png');
cardImageArray1.push('./assets/images/6.png');
cardImageArray1.push('./assets/images/7.png');
cardImageArray1.push('./assets/images/8.png');
cardImageArray1.push('./assets/images/9.png');
cardImageArray1.push('./assets/images/10.png');

let cardImageArray2= [];
cardImageArray2.push('./assets/images/1.png');
cardImageArray2.push('./assets/images/2.png');
cardImageArray2.push('./assets/images/3.png');
cardImageArray2.push('./assets/images/4.png');
cardImageArray2.push('./assets/images/5.png');
cardImageArray2.push('./assets/images/6.png');
cardImageArray2.push('./assets/images/7.png');
cardImageArray2.push('./assets/images/8.png');
cardImageArray2.push('./assets/images/9.png');
cardImageArray2.push('./assets/images/10.png');

function cardgen1(y){
const randomIndex = Math.floor(Math.random() * cardImageArray1.length);
let hiding = cardImageArray1[randomIndex];
cardImageArray1.splice(randomIndex, 1);
return hiding;
}
function cardgen2(y){
  const randomIndex = Math.floor(Math.random() * cardImageArray2.length);
  let hiding = cardImageArray2[randomIndex];
  cardImageArray2.splice(randomIndex, 1);
  return hiding;
  }

function createCards() {
  //Create parent div
  let playdiv= document.createElement("div");
  playdiv.className= "img-container"
  document.body.appendChild(playdiv);
  //Create child img elements 2 * 10(20 total) playing cards
  for (let index = 0; index < 10; index++) {
    let playcard= document.createElement("img");
    playcard.className= "cards";
    playcard.dataset.state=cardstate.hidden;
    playcard.dataset.flipped=cardgen1();
    playcard.dataset.paired=tickImage;
    playcard.src=defaultHiddenImage;
    playdiv.appendChild(playcard);
  }
  for (let index = 0; index < 10; index++) {
    let playcard= document.createElement("img");
    playcard.className= "cards";
    playcard.dataset.state=cardstate.hidden;
    playcard.dataset.flipped=cardgen2();
    playcard.dataset.paired=tickImage;
    playcard.src=defaultHiddenImage;
    playdiv.appendChild(playcard);
  }
}

function updateScoreboard(turnsleft) {
  document.querySelector('._tracker').textContent = turnsleft;
}

function removeInPlayElements() {
  // delete unecessary elements
  let delete1 = document.getElementById('GameDescription');
  delete1.parentNode.removeChild(delete1);
  let delete2 = document.getElementById('toPlay');
  delete2.parentNode.removeChild(delete2);
}

function addTracker(){
  //tracker text
  let attemptsTracker= document.createElement("div");
  attemptsTracker.className= "tracker";
  attemptsTracker.innerHTML = "Attempts Left: ";
  document.body.appendChild(attemptsTracker);
  //tracker variable
  let _attemptsTracker= document.createElement("div");
  _attemptsTracker.className= "_tracker";
  document.body.appendChild(_attemptsTracker);
}

function paired(x,y){
x.setAttribute("data-state", cardstate.paired);
y.setAttribute("data-state", cardstate.paired);
x.setAttribute("src", x.dataset.paired);
y.setAttribute("src", y.dataset.paired);
window.alert("Aww Hell Yeah!, You're on Fire!");
}

function uncover(x){
  //change the attribute (we check the attribute to see which image is selected, not check the image directly)
  x.setAttribute("data-state", cardstate.showing);
  // change the image
  x.setAttribute("src", x.dataset.flipped);

}

function hide(x){                               
  //change the attribute
  x.setAttribute("data-state", cardstate.hidden); 
  //change the image associated with new attribute
  x.setAttribute("src", defaultHiddenImage);
}

function flashAllCards(){
  let selectAllCardsHidden = document.querySelectorAll("img[data-state='hidden']");
  for (let i= 0; i< selectAllCardsHidden.length; i++) {
    uncover(selectAllCardsHidden[i]);
  }
}

function hideAllCards(){
  selectAllCardsShowing = document.querySelectorAll("img[data-state='showing']");
  for (let i= 0; i < selectAllCardsShowing.length; i++) {
  hide(selectAllCardsShowing[i]);
  cardsFlipped=0;
  }
}

createCards();
function play(){


  const difficulty=prompt("Difficulty Level?: Easy, Medium or Hard? (1, 2, 3)");
  let attempts;

  if (difficulty<1||difficulty>3|| isNaN(difficulty)) {
    window.alert("Invalid difficulty selection entered")
    play();
    return;
  }
      switch(difficulty){
      case '1': attempts = 20; interval=4000;
      break;
      case '2': attempts = 15; interval=3000;
      break;
      case '3': attempts = 10; interval=2500;
      break;
}

// Flash all the cards for a set time depending on difficulty level
flashAllCards();
setInterval(hideAllCards, interval);

  let imageContainer = document.querySelector(".img-container");
  // Listen for any clicks within the img-container div
  imageContainer.addEventListener("click", function(event) {
  let element = event.target;
  // Check if the clicked element was an image
  if (element.matches("img")) {
  
    // https://stackoverflow.com/questions/8635502/how-do-i-clear-all-intervals
    // Get a reference to the last interval + 1
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
    window.clearInterval(i);
  }


    if (element.getAttribute("data-state")== cardstate.hidden) {
      uncover(element);
      cardsFlipped++;
    }
                //check if a matching pair has being flipped
                if (cardsFlipped==2) {
                  attempts--;
                  updateScoreboard(attempts);
                  if (attempts==0){
                    window.alert("Better luck next time!");
                    location.reload();
                    return;
                  }
                  // select cards showing and switch them to 'paired' data type if a match
                  let selectAllCardsShowing = document.querySelectorAll("img[data-state='showing']");
                  if(selectAllCardsShowing[0].src == selectAllCardsShowing[1].src) {
                    paired(selectAllCardsShowing[0],selectAllCardsShowing[1]);
                    cardsFlipped=0;
                  }
                  // reselect all cards showing (now minus matches) and hide them 
                  selectAllCardsShowing = document.querySelectorAll("img[data-state='showing']");
                  for (let i= 0; i < selectAllCardsShowing.length; i++) {
                    hide(selectAllCardsShowing[i]);
                    cardsFlipped=0;
                  }
                }

  }
});

}


// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
