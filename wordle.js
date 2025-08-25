const PARENT = document.querySelector(".game");
let CURRENT = document.querySelector(".current");
let ANSWER = "";

async function getAnswer() {
	const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
	const jsonResponse = await promise.json();
	ANSWER = jsonResponse.word;

	// TODO check for API errors!
}

function isLetter(key) {
	if (key.length != 1)
		return (false);
	return ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z'));
}

async function getCorrectWord(word) {
	const promise = await fetch("https://words.dev-apis.com/validate-word", {
		method: "POST",
		body: JSON.stringify({
			"word": word
		})
	});

	// TODO check for API errors!

	return (promise.json());
}

function checkIfMisplaced(letter) {
	const answerArray = Array.from(ANSWER);
	if (!answerArray.find((element) => element === letter))
		return (false);

	// TODO check if letter is already right

	return (true);
}

function updateCurrent() {
	siblingArray = Array.from(PARENT.children);
	CURRENT.classList.remove("current");
	let nextChild = siblingArray.indexOf(CURRENT) + 1;
	if (nextChild >= 6) {
		alert(`You lost! The word was ${ANSWER}`)
	} else {
		PARENT.children[nextChild].classList.add("current");
		CURRENT = document.querySelector(".current");
		console.log(CURRENT);
	}
};

async function checkWord(word) {
	let validWord = false;
	await getCorrectWord(word).then(function (objResponse) {
		validWord = objResponse.validWord;
	});

	// TODO check for API errors!

	let currentInput = CURRENT.children[0];
	if (!validWord) {
		Array.from(CURRENT.children).forEach((letter) => letter.classList.add("wrong-word"))
		currentInput.disabled = false;
		return;
	}

	let correct = true;
	for (let i = 0; i < word.length; i++) {	
		CURRENT.children[i + 1].classList.add("flip");
		if (word[i] === ANSWER[i])
			CURRENT.children[i + 1].classList.add("correct");
		else {
			correct = false;
			if (!checkIfMisplaced(word[i]))
				CURRENT.children[i + 1].classList.add("wrong");
			else
				CURRENT.children[i + 1].classList.add("misplaced");
		}
	}

	if (correct === true) {
		alert("You won!!!");
	} else {
		updateCurrent();
	}
}

function handleInput(event) {
	let currentInput = CURRENT.children[0];
	if (currentInput.disabled)
		return;
	if (event.key === "Backspace") {
		CURRENT.children[currentInput.value.length].value = "";
		currentInput.value = currentInput.value.slice(0, currentInput.value.length - 1);
	} else if (currentInput.value.length < 5 && isLetter(event.key)) {
		currentInput.value += event.key.toLowerCase();
		CURRENT.children[currentInput.value.length].value = event.key;
		CURRENT.children[currentInput.value.length].classList.add("rumble");
	} else if (event.key == "Enter") {
		if (currentInput.value.length != 5)
			return;
		currentInput.disabled = true;
		checkWord(currentInput.value);
	}
}

async function main() {
	await getAnswer();

	document.querySelector("body").addEventListener("keydown", handleInput);
	document.querySelectorAll(".letter").forEach((letter) => {
			letter.addEventListener("animationend", (event) => event.target.classList.remove("rumble", "wrong-word"));
		});
}

main();