// JavaScript Document
if ((window.location.href).search('/pages') > 0 && document.body.getAttribute('data-page-type') == 'quiz' && document.body.getAttribute('data-quiz-type') == 'flashcard') {
	var correctAnsAry = new Array();
	var userAnsAry = new Array();
	info = {
        id: '',
        file: '',
        title: '',
        description: '',
        company: '',
        companyLogo: '',
        courseName: '',
        lastUpdated: '',
    };
    quizCountID = insideOfWrapper ? parent.getInteractionsCount() : '0';
    quizInfo = {
        num: quizCountID,
        type: 'choice',
        objectives: info.id,
        correctResponses: '',
        weighting: insideOfWrapper ? parent.getInteractionWeighting(quizCountID) : 1,
        learnerResponse: '',
        result: ''
    };
	document.querySelectorAll('.next-btn').forEach((val, index) => {
		val.addEventListener('click', function() {
			if(insideOfWrapper) {
				quizInfo.correctResponses = correctAnsAry.join('|');
				quizInfo.learnerResponse = userAnsAry.join('|');
				quizInfo.result = (quizInfo.learnerResponse == quizInfo.correctResponses) ? 'correct' : 'incorrect';
				console.log(quizInfo);
				parent.addScore();
				parent.nextPage();
			}
		});
	});
	showResponseReview = () => {};
    submitAnswer = () => {};
    resetQuizPage = () => {
		document.querySelector('.page-info-txt[data-info="score"]').innerText = '0';
		location.reload();
	};
}
function initScenarioGame(){
		//initilization
		var cNum = 0; //current number - used to track which slide the quiz is on.
		var cTotal = $('.fc_group').length; //Total nmber of cards
		var qTotal = $('.fc_group').length; //Total nmber of Questions
		var scoreTotal = 0;
		var cardNumber = 1;
		var qNum = 0; //Quiz number used to track which quiz item in the array the user is on
		var questionNum = 0;  //get the current question to get the compare the correct answer
		var scoreMin = 0; //minimum score user needs in order to pass course
		//var qOptions = [0,1,2,3] //used to shuffle the options for the quiz answers
		var answerKey = []; //used to store the answers for each question
		
        var pauseTimer = 0;
		//var card_array = new Array();
		var original_card_array = $('.fc_group').map(function(index) {
			// this callback function will be called once for each matching element
			return this.id; 
		});
		//answerKey = $('.fc_group').map(function(index, element) {
            
			//return this.correct;
        //});
		
		collectAllAnswers();
		
		//array_order.sort(function() { return 0.5 - Math.random() });
		//array_order;
		
		var card_array = original_card_array.slice(0);
		card_array = randomizeArrayOrder(card_array);  //shuffle array
		var known_array = card_array.slice(0);
		var quiz_array = original_card_array.slice(0);
		
		//var trace = card_array;
	
		
		/*$.each($('').each(function() {
			card_array[]
		});*/
        
		$('.currentNum').text(cardNumber.toString());
		$('.curTotal').text(cTotal.toString());
		$('.quizTotal').text(qTotal.toString());
		updateScoreDisplay();
		calculatePassingScore();
		//methods section
		
		function collectAllAnswers(){
			$('.fc_group').each(function(index, element) {
                
				var answerTmp = $(this).find('.correct').attr('class');
				var answerStr = answerTmp.replace("option-", "");
				answerStr = answerStr.replace(" ", "");
				answerStr = answerStr.replace("correct", "");
				answerKey[index] = answerStr;
				$(this).find('.correct').removeClass('correct');
			});
            // quizInfo.correctResponses = (answerKey.map(obj => setupCorrectResponses(obj))).join('|');
			// console.log(quizInfo);
		}
		
		function calculatePassingScore(){
			var totalPointsPossible = 10 * qTotal;
			scoreMin = 	totalPointsPossible * .8;
			scoreMin = Math.ceil(scoreMin / 10) * 10;
			$('.ScoreMin').text(scoreMin.toString());
		}
		
		function randomizeArrayOrder(sentArray){
			var tArray = [];
			tArray = sentArray;
			
			tArray.sort(function() { return 0.5 - Math.random(); });
			return tArray;
		}
		
		//used to remove the know cards from the deck
		function removeItemFromArray(itemToRemove, ArrayToUse){
			ArrayToUse.splice($.inArray(itemToRemove, ArrayToUse),1);

		}
		
		function updateNumberDisplay(){
			cardNumber = cNum;
			$('.currentNum').text(cardNumber.toString());
			$('.curTotal').text(cTotal.toString());
		}
		
		function updateScoreDisplay(){
			$('.ScoreNum').text(scoreTotal.toString());
		}
		
		function updateQuizDisplay(){
			//$('.ScoreNum').text(scoreTotal.toString());
			var currentQuizNum = qNum + 1;
			$('.quizNum').text(currentQuizNum.toString());
		}
		
		function continueToNextCard(){
			//$('.fc_group').toggleClass("dontDisplay");
			hideAllReviewCards();
			//if cards are still left in deck
			if(cNum < cTotal){
			  
			  if(cNum === 0){
				  $('.review').toggleClass('dontDisplay');
				  $('.cardInstuctions').toggleClass('dontDisplay');
			  }
			  if(cNum === -1){
				  cNum = 0;
			  }
			  updateNumberDisplay();
			  var selectedCard = '#' + card_array[cNum];
			  $(selectedCard).fadeIn(500, cNumIncrease);
			  $(selectedCard).toggleClass("dontDisplay");
			}else{
				//var note = "Display Reshuffle Cards";
				showReviewQuizOptions();
				var knownCards = qTotal - known_array.length;
				var unkonwnCards = known_array.length;
				$('.cardsKnown').text(knownCards.toString());
				$('.knownArray').text(unkonwnCards.toString());
				$('.shuffle').fadeIn(500);
				if ($('.shuffle').hasClass('dontDisplay')){ //remove the hidden class if it exists so the div can fade in
					$('.shuffle').toggleClass("dontDisplay");
				}
				if (!$('.cardInstuctions').hasClass('dontDisplay')){ //remove the hidden class if it exists so the div can fade in
					$('.cardInstuctions').toggleClass("dontDisplay");
				}
				
			}
			
		}
		
		function hideReview(){
			$('.review').fadeOut(500, toggleReviewOff);
			if ($('.review').hasClass('dontDisplay')){
				$('.review').toggleClass('dontDisplay');
			}
		}
		
		function toggleReviewOff(){
			
			if (!$('.review').hasClass('dontDisplay')){
				$('.review').toggleClass('dontDisplay');
			}
		}
		
		function revealSubmitBtn(){
			if ($('#qu_0_submit').hasClass('dontDisplay')){
				$('#qu_0_submit').toggleClass('dontDisplay');
			}
		}
		
		function hideSubmitBtn(){
			if (!$('#qu_0_submit').hasClass('dontDisplay')){
				$('#qu_0_submit').toggleClass('dontDisplay');
			}
		}
		
		function fadeInQuiz(){
			updateQuizDisplay();
			$('.quiz').fadeIn(200, revealSubmitBtn);
			if ($('.quiz').hasClass('dontDisplay')){
				$('.quiz').toggleClass('dontDisplay');
			}
			
		}
		
		function fadeOutQuiz(){
			$('.quiz').fadeOut(200, quizFaded);
		}

		function modalFadeOut(){
			$("#narrator").fadeOut();
		}
	
		function quizFaded(){
			populateQuiz();
			fadeInQuiz();
		}
		
		function populateQuiz(){
			$("input").prop('disabled', false);
			$('.rButton').prop('checked', false);
			hideAllCorrectIncorrect();
			var selectedQuestion = '#' + quiz_array[qNum];
			//$(selectedQuestion)
			var question = $(selectedQuestion).find('.question').text();
			var op_0 = $(selectedQuestion).find('.option-0').text();
			var op_1 = $(selectedQuestion).find('.option-1').text();
			var op_2 = $(selectedQuestion).find('.option-2').text();
			var op_3 = $(selectedQuestion).find('.option-3').text();
			var cat = $(selectedQuestion).find('.category').text();
			//var optionArray = [op_0, op_1, op_2, op_3];
			//optionArray = randomizeArrayOrder(optionArray);
			$('#qu_0').find('.dynamicQuestion').text(question);
			$('#qu_0').find('.qu_option-0').text(op_0); 
			$('#qu_0').find('.qu_option-1').text(op_1); 
			$('#qu_0').find('.qu_option-2').text(op_2); 
			$('#qu_0').find('.qu_option-3').text(op_3); 
			$('#qu_0').find('.qu_category').text(cat); 
			
			var numStr = quiz_array[qNum];
			numStr = numStr.replace("fc_", "");
			questionNum = parseInt(numStr);
		}
		
		
		function hideAllCorrectIncorrect(){
			$('.glyphicon-remove').each(function(index, element) {
                if (!$(this).hasClass('dontDisplay')){
					$(this).toggleClass('dontDisplay');
				}
            });
			$('.glyphicon-ok').each(function(index, element) {
                if (!$(this).hasClass('dontDisplay')){
					$(this).toggleClass('dontDisplay');
				}
            });
		}
		
		function resetQuiz(){
			pauseTimer = 0;
            qNum = 0;
			quiz_array = randomizeArrayOrder(quiz_array);  //shuffle array	
			var _timer = 60 * 6;
			var display = $('.TimerNum');
			startTimer(_timer, display);
		}
		
		function hideAllReviewCards(){
			$('.fc_group').each(function(index, element) {
                if (!$(this).hasClass('dontDisplay')){
					$(this).toggleClass('dontDisplay');
				}
            });
		}
		
		/*function NextCard(){
			
			var selectedCard = '#' + card_array[cNum];
			$(selectedCard).fadeIn(500, cNumIncrease);
		}*/
		
		function PreviousCard(){
			
		}
		function cNumDecrease(){
			cNum --;
		}
		function cNumIncrease(){
			//$('.currentNum').text(cNum -1);
			cNum ++;
			updateNumberDisplay();
		}
        
		function showReviewQuizOptions(){
			if(known_array.length > 0){
				if ($('.shuffleDeck').hasClass('dontDisplay')){
					$('.shuffleDeck').toggleClass('dontDisplay');
				}
			}else{
				if (!$('.shuffleDeck').hasClass('dontDisplay')){
					$('.shuffleDeck').toggleClass('dontDisplay');
				}
			}
			if ($('.phase3').hasClass('dontDisplay')){
				$('.phase3').toggleClass('dontDisplay');
			}
		}

		function ScenarioGameScore(reportScore) {
			document.querySelector('.page-info-txt[data-info="score"]').innerText = reportScore;
		}
		
		
		function ResolveEndGame(){
			pauseTimer = 1;
			var reportScore = Math.round(scoreTotal / (10 * qTotal) * 100);
			try{
                ScenarioGameScore(reportScore);
            }catch(err){}
            
			if(scoreTotal >= scoreMin){
				//trigger win
				if (!$('.youLoose').hasClass('dontDisplay')){
					$('.youLoose').toggleClass('dontDisplay');
				}
				if ($('.youWin').hasClass('dontDisplay')){
					$('.youWin').toggleClass('dontDisplay');
				}
				$('.finalScore').addClass('text-success');
				//scorePassed();
				
			}else{
				if (!$('.youWin').hasClass('dontDisplay')){
					$('.youWin').toggleClass('dontDisplay');
				}
				if ($('.youLoose').hasClass('dontDisplay')){
					$('.youLoose').toggleClass('dontDisplay');
				}
				$('.finalScore').addClass('text-danger');
				
			}
			
			$('.gameOver').fadeIn(300);
			if ($('.gameOver').hasClass('dontDisplay')){
					$('.gameOver').toggleClass('dontDisplay');
				}
			if (!$('.quizSection').hasClass('dontDisplay')){
				$('.quizSection').toggleClass('dontDisplay');
			}
			
		}
		
		function startTimer(duration, display) {
			var timer = duration, minutes, seconds;
			var countDown = setInterval(function () {
				minutes = parseInt(timer / 60, 10);
				seconds = parseInt(timer % 60, 10);
		
				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;
		
				display.text(minutes + ":" + seconds);
		
				if (--timer < 0) {
					timer = duration;
					clearInterval(countDown);
					ResolveEndGame();
				}
                if(pauseTimer == 1){
                    clearInterval(countDown);
                    
                }
			}, 1000);
		}
		
		function scorePassed(){
			//Insert SCORM Code here.
			
			
		}
		
		function startQuiz(){
			var quizDisplay = qNum + 1;
			$('.quizNum').text(quizDisplay.toString());
			/*if(!$('.secondaryRow').hasClass('bg_gray')){
				$('.secondaryRow').toggleClass('bg_gray');
			}*/
			if($('.intro').is(":visible")){
				//$('.intro').fadeOut(200);
				$('.intro').toggleClass('dontDisplay');
			}
			if (!$('.phase3').hasClass('dontDisplay')){
				$('.phase3').toggleClass('dontDisplay');
			}
			//turn off review text
			if (!$('.reviewText').hasClass('dontDisplay')){
				$('.reviewText').toggleClass('dontDisplay');
			}
			//turn off cardInstructions
			if (!$('.cardInstuctions').hasClass('dontDisplay')){
				$('.cardInstuctions').toggleClass('dontDisplay');
			}
			//turn off logo
			if (!$('.intelLogo').hasClass('dontDisplay')){
				$('.intelLogo').toggleClass('dontDisplay');
			}
			//turn on all quiz text
			if ($('.scoreText').hasClass('dontDisplay')){
				$('.scoreText').toggleClass('dontDisplay');
			}
			if ($('.scoreTotal').hasClass('dontDisplay')){
				$('.scoreTotal').toggleClass('dontDisplay');
			}
			if ($('.timerText').hasClass('dontDisplay')){
				$('.timerText').toggleClass('dontDisplay');
			}
			if($('.review').is(":visible")){
				//hideReview();
				toggleReviewOff();
			}
			resetQuiz();
			populateQuiz();
			fadeInQuiz();
		}
		
//============  button assignment  =====================
		//start flashcard review phase 2
		$('.phase2').click(function () {
			if($('.secondaryRow').hasClass('bg_gray')){
				$('.secondaryRow').toggleClass('bg_gray');
			}
			if (!$('.phase3').hasClass('dontDisplay')){
				$('.phase3').toggleClass('dontDisplay');
			}
			if (!$('.phase2').hasClass('dontDisplay')){
				$('.phase2').toggleClass('dontDisplay');
			}
			//turn on logo
			if ($('.intelLogo').hasClass('dontDisplay')){
				$('.intelLogo').toggleClass('dontDisplay');
			}
			$('.intro').fadeOut(500, continueToNextCard);
		});
		
		//start quiz phase 3 quiz phase
		$('.phase3').click(function () {
			startQuiz();
		});
		
		$('.skipBtn').click(function () {
			startQuiz();
		});
		
		$('.noBtn').click(function(){
			//alert("$(this).parent.parent.parent.parent = " + $(this).parent().parent().parent().parent());
			var selectedCard = "#" + $(this).parent().parent().parent().attr('id');
			//selectedCard;
			$(selectedCard).fadeOut(500, continueToNextCard);
		});
		
		$('.yesBtn').click(function(){
			//alert("$(this).parent.parent.parent.parent = " + $(this).parent().parent().parent().parent());
			var cardID = $(this).parent().parent().parent().attr('id');
			removeItemFromArray(cardID, known_array);
			var selectedCard = "#" + cardID;
			//selectedCard;
			$(selectedCard).fadeOut(500, continueToNextCard);
		});
		
		$('.shuffleDeck').click(function(){
			/*This method resets and reshuffles the deck of the remaining cards that the answers were not known*/
			cNum = -1; //trigger reshuffle in continueToNextCard method
			card_array = known_array.slice(0);
			card_array = randomizeArrayOrder(card_array);  //shuffle array
			known_array = card_array.slice(0);
			cTotal = card_array.length; //Total nmber of cards
			cardNumber = 1;
			$('.shuffle').fadeOut(500, continueToNextCard);
		});
		
		$('#qu_0_submit').click(function(){
		//$('#quizForm').submit(function () {
			
			var selectedAnswer = $("input[name='radios']:checked").val();
			if (!$("input[name='radios']:checked").val()){
				//show error
				if ($('.errorMsg').hasClass('dontDisplay')){
					$('.errorMsg').toggleClass('dontDisplay');
				}
			}else{
				$("input").prop('disabled', true);
				//turn off submit button to prevent multiple triggers
				hideSubmitBtn();
				//hide error
				if (!$('.errorMsg').hasClass('dontDisplay')){
					$('.errorMsg').toggleClass('dontDisplay');
				}
				//check answer
				//var selectedAnswer = $("input[name='radios']:checked").val();
				var correctAnswer = answerKey[questionNum];
				correctAnsAry.push(correctAnswer)
				userAnsAry.push(selectedAnswer)
				
				if(selectedAnswer === correctAnswer){
					$('.correct-'+selectedAnswer).toggleClass('dontDisplay');
					scoreTotal += 10;	
					updateScoreDisplay();
				}else{
					$('.incorrect-'+selectedAnswer).toggleClass('dontDisplay');	
					$('.correct-'+correctAnswer).toggleClass('dontDisplay');
				}
				if(qTotal === qNum + 1){
					//scoreMin
					//ResolveEndGame();
                    if($('.resolveGame').hasClass('dontDisplay')){
						$('.resolveGame').toggleClass('dontDisplay');
					}
				}else{
					if($('.nextQuestion').hasClass('dontDisplay')){
						$('.nextQuestion').toggleClass('dontDisplay');
					}
				}
				
				
			}
			
			return false;
		});
		
		$('.nextQuestion').click(function(){
			if(!$('.nextQuestion').hasClass('dontDisplay')){
				$('.nextQuestion').toggleClass('dontDisplay');
			}
			qNum ++;
			fadeOutQuiz();
		});
		
        $('.resolveGame').click(function(){
			//answered all questions before time ended
			ResolveEndGame();
		});
	
        $('.displayMiddle').click(function(){
			//answered all questions before time ended
			modalFadeOut();
		});
	
		$('.restartGame').click(function() {
			location.reload();
		});
        /*$('#loading-example-btn').click(function () {
            var btn = $(this);
            btn.button('loading');
            setTimeout(function () {
                btn.button('reset');
            }, 1000);
        });*/
		
    	setTimeout(modalFadeOut, 300);
} //scenarioGame 