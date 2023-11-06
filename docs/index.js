const points = ["0", "15", "30", "40", "AD", "W"];

const gameState = {
	gameOver: false,
	tieBreak: false,
	deuce: false,
	currentSet: 1,
};

const SwapServe = (p1, p2) => {
	p1.serving = !p1.serving;
	p2.serving = !p2.serving;

	p1.servingHTML.style.display = p1.serving ? "flex" : "none";
	p2.servingHTML.style.display = p2.serving ? "flex" : "none";
};

const ResetPoints = (p1, p2) => {
	p1.points = 0;
	p2.points = 0;

	p1.pointsHTML.innerText = "0";
	p2.pointsHTML.innerText = "0";
};

const ResetGames = (p1, p2) => {
	p1.games = 0;
	p2.games = 0;

	p1.gamesHTML.innerText = "0";
	p2.gamesHTML.innerText = "0";

	ResetPoints(p1, p2);
};

const ResetMatch = (servingPlayer, otherPlayer) => {
	servingPlayer.sets = 0;
	otherPlayer.sets = 0;

	servingPlayer.setsHTML.innerText = "0";
	otherPlayer.setsHTML.innerText = "0";

	ResetGames(servingPlayer, otherPlayer);

	servingPlayer.serving = true;
	otherPlayer.serving = false;

	servingPlayer.servingHTML.style.display = "flex";
	otherPlayer.servingHTML.style.display = "none";

	gameState.currentSet = 1;
	gameState.tieBreak = false;
	gameState.gameOver = false;
};

const AddSet = (currentPlayer, otherPlayer) => {
	gameState.currentSet++;
	gameState.tieBreak = false;

	ResetGames(currentPlayer, otherPlayer);

	currentPlayer.sets++;
	currentPlayer.setsHTML.innerText = currentPlayer.sets.toString();

	if (currentPlayer.sets === 3) {
		gameState.gameOver = true;
		const winnerName = currentPlayer.nameHTML.innerText;
		setTimeout(
			() =>
				alert(
					`The game is finished! Congratulations to the winner ${winnerName}`
				),
			500
		);
	}
};

const AddGame = (currentPlayer, otherPlayer) => {
	currentPlayer.games++;
	currentPlayer.gamesHTML.innerText = currentPlayer.games.toString();

	ResetPoints(currentPlayer, otherPlayer);

	SwapServe(currentPlayer, otherPlayer);

	if (gameState.tieBreak) {
		AddSet(currentPlayer, otherPlayer);
		return;
	}

	if (
		currentPlayer.games >= 6 &&
		otherPlayer.games + 2 <= currentPlayer.games
	) {
		AddSet(currentPlayer, otherPlayer);
		return;
	}

	if (
		currentPlayer.games === 6 &&
		otherPlayer.games === 6 &&
		gameState.currentSet < 5
	) {
		gameState.tieBreak = true;
	}
};

const AddPoint = (currentPlayer, otherPlayer) => {
	currentPlayer.points++;

	if (gameState.tieBreak) {
		currentPlayer.pointsHTML.innerText = currentPlayer.points.toString();

		if (
			currentPlayer.points >= 7 &&
			otherPlayer.points < currentPlayer.points - 1
		) {
			AddGame(currentPlayer, otherPlayer);
			return;
		}

		if ((currentPlayer.points + otherPlayer.points) % 2 === 1) {
			SwapServe(currentPlayer, otherPlayer);
		}
	} else {
		if (
			currentPlayer.points >= 4 &&
			otherPlayer.points < currentPlayer.points - 1
		) {
			AddGame(currentPlayer, otherPlayer);
			return;
		}

		if (otherPlayer.points === 4 && currentPlayer.points === 4) {
			otherPlayer.points--;
			otherPlayer.pointsHTML.innerText = points[otherPlayer.points];

			currentPlayer.points--;
		}

		currentPlayer.pointsHTML.innerText = points[currentPlayer.points];
	}
};

function StylizeName(name, player) {
	const splitName = name.split(" ");
	const span = document.querySelector(`#${player}-error`);

	if (splitName.length !== 2 || splitName[1].length < 1) {
		span.style.display = "block";
		return "N/A";
	}

	span.style.display = "none";

	return (
		splitName[0][0].toUpperCase() +
		splitName[0].slice(1).toLowerCase() +
		" " +
		splitName[1].toUpperCase()
	);
}

document.addEventListener("DOMContentLoaded", (e) => {
	const p1 = {
		points: 0,
		pointsHTML: document.querySelector("#p1-points"),
		games: 0,
		gamesHTML: document.querySelector("#p1-games"),
		sets: 0,
		setsHTML: document.querySelector("#p1-sets"),
		serving: true,
		servingHTML: document.querySelector("#p1-serve"),
		nameHTML: document.querySelector("#p1-name"),
	};
	const p2 = {
		points: 0,
		pointsHTML: document.querySelector("#p2-points"),
		games: 0,
		gamesHTML: document.querySelector("#p2-games"),
		sets: 0,
		setsHTML: document.querySelector("#p2-sets"),
		serving: false,
		servingHTML: document.querySelector("#p2-serve"),
		nameHTML: document.querySelector("#p2-name"),
	};

	const pointButtons = document.querySelectorAll(".button");
	const form = document.querySelector("form");
	const newGameButton = form.querySelector(".new-game-button");

	newGameButton.addEventListener("click", (e) => {
		e.preventDefault();

		if (form.querySelector("#p1-serve-first").checked) {
			ResetMatch(p1, p2);
		} else {
			ResetMatch(p2, p1);
		}

		document.querySelector("#p1-name").innerText = StylizeName(
			form.querySelector("#first-player").value,
			"p1"
		);

		document.querySelector("#p2-name").innerText = StylizeName(
			form.querySelector("#second-player").value,
			"p2"
		);
	});

	pointButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			if (!gameState.gameOver) {
				if (button.id === "p1-button") {
					AddPoint(p1, p2);
				} else {
					AddPoint(p2, p1);
				}
			}
		});
	});
});
