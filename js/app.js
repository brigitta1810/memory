let pictures = ['eye', 'eye', 'female', 'female', 'gift', 'gift', 'gear', 'gear', 'globe', 'globe', 'home', 'home', 'heart', 'heart','key', 'key'],
	opened = [],
	match = 0,
	moves = 0,

//selecting classes
	$deck = $('.deck'),
	$scorePanel = $('.score-panel'),
	$moveCount = $('.moves'),
	$starGradings = $('.fa-star'),
	$restart = $('.restart'),

	delay = 800, 
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	allCards = pictures.length / 2, 
	
//Here I determine how star rating changes, i.e. after how many moves the player loses a star or two
	best = 8,
	medium = 18,
	low = 25;

//The following function shuffles the cards

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//GAME START -----------These functions determine how everything should look when the game starts
function startGame() {
	var cards = shuffle(pictures);
	$deck.empty(); //to make sure that all cards are face down when game starts or restarts
	match = 0;
	moves = 0;
	$moveCount.text('0');  //when game starts, "Move" shows zero*/

//according to the number of moves declared in the "best" "medium" and "low" statements, the filled stars turn to unfilled stars. But in the beginning of the game with no moves, all the stars ar filled, i.e. "fa-star"
	$starGradings.removeClass('fa-star-o').addClass('fa-star'); 
	
//looping through all cards and adding listeners to all of them
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();

//at the beginning of the game and when restarting the game, the timer is set to 0 seconds
	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	startTime();
};

//Stars decrease according to the specified number of moves
function rateGame(moves) {
	var rating = 3;
	if (moves > best && moves < medium) {
		$starGradings.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > medium && moves < low) {
		$starGradings.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > low) {
		$starGradings.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;

	}
	return { score: rating };
};

//The game ends: congratulation message appears. 

function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congrats! You Found All Matching Cards!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Yayyy!',
		type: 'success',
		confirmButtonColor: '#00ff00',
		confirmButtonText: 'Play again!'
	}).then(function (yes) {
		if (yes) {
			startGame();
		}
	})
}

// Restaring the game when clicking on the restart icon. A message appears when the restart icon is clicked on. 
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Would you like to restart the game?',
		text: "Your moves and scores will be deleted!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#00ff00',
		cancelButtonColor: '#cd0000',
		confirmButtonText: 'Yeah, I want to restart!'
	}).then(function (yes) {
		if (yes) {
			startGame();
		}
	})
});

var addCardListener = function () {

// Card opening
	$deck.find('.card').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

// Check if opened cards match or do not match
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite pulse');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite swing');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite shake');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite shake');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite shake');
				}, delay);
			}
			opened = [];
			moves++;
			rateGame(moves);
			$moveCount.html(moves);
		}

/*When all cards are matched :) */

		if (allCards === match) {
			rateGame(moves);
			var score = rateGame(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};


function startTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 800);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

startGame();