// define the time limit
let TIME_LIMIT = 99;

// define quotes to be used
let quotes_array = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
  'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
  'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
  'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
  'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
  'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
  'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
  'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
  'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
  'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
  'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
  'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
  'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
  'keyboard', 'window'];

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let quote_text = document.querySelector(".quote");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;
updateHtml();
function saveData(accuracy,wordCount){
  
  if(localStorage.getItem('score')){
    let scores = {
        "accuracy": accuracy,
        "wordCount": wordCount
      }
    let preScores = localStorage.getItem('score');
       preScores = JSON.parse(preScores);
       preScores.push(scores);
       preScores?.sort((a, b) => (a.wordCount < b.wordCount ? 1 : -1))
         localStorage.setItem('score',JSON.stringify(preScores));
  }else{
    let scores = [{
        "accuracy": accuracy,
        "wordCount": wordCount
      }]
    localStorage.setItem('score',JSON.stringify(scores));
  }
}
function updateHtml(){
    if(localStorage.getItem('score')){
        scores =   localStorage.getItem('score');
        scores = JSON.parse(scores);
        let ScoresHtml = '';
        for(let i=0; i<scores.length && i<9; i++){
            ScoresHtml += "<li><span>#"+(i+1)+"</span><span>"+scores[i].wordCount+" words</span><span>"+scores[i].accuracy+"%</span></li>"
        }
        document.getElementById("scores").innerHTML = ScoresHtml
    }
}
function updateQuote() {
  quote_text.textContent = null;
  current_quote = quotes_array[quoteNo];

  // separate each character and make an element 
  // out of each of them to individually style them
  current_quote.split('').forEach(char => {
    const charSpan = document.createElement('span')
    charSpan.innerText = char
    quote_text.appendChild(charSpan)
  })

  // roll over to the first quote
  if (quoteNo < quotes_array.length - 1)
    quoteNo++;
  else
    quoteNo = 0;
}

function processCurrentText() {

  // get current input text and split it
  curr_input = input_area.value;
  curr_input_array = curr_input.split('');

  // increment total characters typed
  characterTyped++;

  errors = 0;

  quoteSpanArray = quote_text.querySelectorAll('span');
  quoteSpanArray.forEach((char, index) => {
    let typedChar = curr_input_array[index]

    // characters not currently typed
    if (typedChar == null) {
      char.classList.remove('correct_char');
      char.classList.remove('incorrect_char');

      // correct characters
    } else if (typedChar === char.innerText) {
      char.classList.add('correct_char');
      char.classList.remove('incorrect_char');

      // incorrect characters
    } else {
      char.classList.add('incorrect_char');
      char.classList.remove('correct_char');

      // increment number of errors
      errors++;
    }
  });

  // display the number of errors
  error_text.textContent = total_errors + errors;

  // update accuracy text
  let correctCharacters = (characterTyped - (total_errors + errors));
  let accuracyVal = ((correctCharacters / characterTyped) * 100);
  accuracy_text.textContent = Math.round(accuracyVal);

  // if current text is completely typed
  // irrespective of errors
  if (curr_input.length == current_quote.length) {
    updateQuote();

    // update total errors
    total_errors += errors;

    // clear the input area
    input_area.value = "";
  }
}

function updateTimer() {
  if (timeLeft > 0) {
    // decrease the current time left
    timeLeft--;

    // increase the time elapsed
    timeElapsed++;

    // update the timer text
    timer_text.textContent = timeLeft + "s";
  }
  else {
    // finish the game
    let totalAccuracy = document.querySelector(".curr_accuracy").innerText;
    saveData(totalAccuracy,quoteNo);
    updateHtml();
    finishGame();
  }
}

function finishGame() {
  // stop the timer
  clearInterval(timer);

  // disable the input area
  input_area.disabled = true;

  // show finishing text
  quote_text.textContent = "Click on restart to start a new game.";

  // display restart button
  restart_btn.style.display = "block";
}


function startGame() {

  resetValues();
  updateQuote();

  // clear old and start a new timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  input_area.disabled = false;

  input_area.value = "";
  quote_text.textContent = 'Click on the area below to start the game.';
  accuracy_text.textContent = 100;
  timer_text.textContent = timeLeft + 's';
  error_text.textContent = 0;
  restart_btn.style.display = "none";
}