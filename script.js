// script.js
const randomNumber = Math.floor(Math.random() * 10);
console.log(`The random number (for debugging purposes) is: ${randomNumber};`);

const guessInput = document.getElementById("guessInputs");
const guessButton = document.getElementById("guessButton");
const result = document.getElementById("result");
let hearts = document.getElementById("hearts");
let lives = document.getElementById("lives");
let scoreHolder = document.getElementById("scoreHolder");
let hintHolder = document.getElementById("hintHolder");
let givenHint = document.getElementById("givenHint");
let actualHint = document.getElementById("actualHint");
let tryAgain = document.getElementById("tryAgain");
let winSound = document.getElementById("winSound")
let loseSound = document.getElementById("loseSound")
let clickSound = document.getElementById("clickSound")
let hintSound = document.getElementById("hintSound")
let wrongSound = document.getElementById("wrongSound")

let attempt = 5;
let guess;
let defaultPoints = 0;
let defaultHint = 3;
let lastGuess = null;
let lastHintedGuess = null;

hearts.innerHTML = '<i class="ri-heart-2-fill"></i>'.repeat(attempt);

const savedScore = localStorage.getItem("totalScore");
defaultPoints = savedScore ? parseInt(savedScore) : 0;
scoreHolder.innerHTML = `High Score: ${defaultPoints}`;
hintHolder.innerHTML = `Get Hint: ${defaultHint}`;

guessInput.setAttribute("type", "number");
guessInput.setAttribute("min", "0");
guessInput.setAttribute("max", "9");

guessInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getGuess();
    }
});

tryAgain.addEventListener("click", function() {
    location.reload();
});

scoreHolder.addEventListener("click", function() {
    localStorage.removeItem("totalScore");
    defaultPoints = 0;
    scoreHolder.innerHTML = `High Score: ${defaultPoints}`;
    clickSound.play();
});

scoreHolder.addEventListener("mouseover", function() {
    scoreHolder.innerHTML = "Reset the Score";
});

scoreHolder.addEventListener("mouseout", function() {
    const savedScore = localStorage.getItem("totalScore");
    defaultPoints = savedScore ? parseInt(savedScore) : 0;
    scoreHolder.innerHTML = `High Score is ${defaultPoints}`;
});

hintHolder.addEventListener("click", function() {
    hintSound.play();
    console.log("Hint maang rha he ye");
    hintSystem();
});

function getGuess() {
    if (guessButton.disabled) return;

    if (guessInput.value.trim() === "") {
        result.innerHTML = "Please enter a number first ⚠️";
        result.style.color = "#faa307";
        return;
    }

    guess = Number(guessInput.value);
    lastGuess = guess;
    console.log(`User Guess (for debugging purposes is ${guess})`);
    attempt--;
    hearts.innerHTML = '<i class="ri-heart-2-fill"></i>'.repeat(attempt);

    console.log(`attempts left: ${attempt}`);
    guessCheck();
}

function guessCheck() {
    if (guess === randomNumber) {
        guessButton.disabled = true;
        result.innerHTML = "You uncovered the secret number! 🙌";
        result.style.color = "green";
        guessButton.style.backgroundColor = "#6c757d";
        guessButton.style.border = "4px solid #495057";
        guessButton.style.boxShadow = "0 0 0 4px #212529";
        hearts.style.display = "none";
        tryAgain.style.display = "block";
        winSound.play();
        rightGuess();
        return;
    } else if (attempt === 0) {
        result.innerHTML = "You’ve used all your attempts 😢";
        noClue();
        result.style.color = "grey";
        guessButton.style.backgroundColor = "#6c757d";
        guessButton.style.border = "4px solid #495057";
        guessButton.style.boxShadow = "0 0 0 4px #212529";
        guessButton.disabled = true;
        hearts.style.display = "none";
        tryAgain.style.display = "block";
        loseSound.play();
        return;
    } else {
        result.innerHTML = "Don’t give up—keep guessing! 🤔";
        wrongSound.play();
        result.style.color = "red";
    }

    guessInput.value = "";
}

function rightGuess() {
    let positivePoints = 0;

    if (attempt === 4) positivePoints += 5;
    else if (attempt === 3) positivePoints += 4;
    else if (attempt === 2) positivePoints += 3;
    else if (attempt === 1) positivePoints += 2;
    else positivePoints += 1;

    defaultPoints += positivePoints;
    localStorage.setItem("totalScore", defaultPoints);
    scoreHolder.innerHTML = `High Score: ${defaultPoints}`;
}

function noClue() {
    if (defaultPoints >= 5) {
        defaultPoints -= 5;
        localStorage.setItem("totalScore", defaultPoints);
        scoreHolder.innerHTML = `High Score: ${defaultPoints}`;
    } else {
        return;
    }
}

function hintSystem() {
    givenHint.style.display = "flex";

    if (lastGuess === null) {
        actualHint.innerHTML = "Please Guess the Value first!";
        return;
    }

    if (lastGuess === lastHintedGuess) {
        actualHint.innerHTML = "You Already Got a hint for this Guess!";
        return;
    }

    lastHintedGuess = lastGuess;
    defaultHint--;
    hintHolder.innerHTML = `Get Hint: ${defaultHint}`;

    if (attempt >= 4) {
        highlowHint();
    }

    if (defaultHint === 0) {
        hintHolder.disabled = true;
        hintHolder.style.backgroundColor = "#6c757d";
        hintHolder.style.border = "4px solid #495057";
        hintHolder.style.boxShadow = "0 0 0 4px #212529";
    }
}


function highlowHint() {
    const diff = Math.abs(lastGuess - randomNumber);
    const guessNature = lastGuess > randomNumber ? "high" : "low";
    const suggestion = lastGuess > randomNumber ? "lower" : "higher";

    if (diff >= 5) {
        actualHint.innerHTML = `Way too ${guessNature}! Think much ${suggestion}!`;
    } else if (diff >= 3) {
        actualHint.innerHTML = `Too ${guessNature}! Try ${suggestion}!`;
    } else if (diff >= 1) {
        actualHint.innerHTML = `Very close! Just a little ${suggestion}!`;
    } else {
        actualHint.innerHTML = `You're on it! 🎯`;
    }
}
