if ((window.location.href).search('/pages') > 0 && document.body.getAttribute('data-page-type') == 'quiz' && document.body.getAttribute('data-quiz-type') == 'persona') {
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

    let minMakeSaleIconWidth = parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-small').width()) + 4; // border thickness 2px
    let iconsHolderPosition = ($('#persona-slide-users').width() / 2) - ((parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-big').width()) + 4) / 2); //127; // 250 width for big icon plus 4 for border thickness divided by 2
    let userIndex = 1;
    let animationFinihed = true;
    let scorePerPersona = 0;
    let profile = false;
    let remove = false;
    let leftRightArrows = false;
    let engage = false;
    let nextPageReady = false;
    let clickSubmit = false;
    // const audio = document.getElementById('audio');
    

    var playCertainAudio = function (audioFile) {
        stopAudio();
        $("#audio source").each(function(){
            if(insideOfWrapper) {
                $(this).attr("src",parent.audioPath + audioFile);
            } else {
                $(this).attr("src",'../media/audio/' + audioFile);
            }
        });
        document.getElementById('audio').load();
        audioPlay();
        if(insideOfWrapper) {
            parent.showPauseBtn();
        }
    }

    var setMakeSalesUserData = function (obj) {
        const mainObj = obj.parent();
        const userID = obj.parent().attr('data-user');
        const perObj = personaObj.find(val => {return val.id == userID});
        
        if(mainObj.attr('data-correct') == 'true' && mainObj.hasClass('active') || 
            mainObj.attr('data-correct') == 'false' && !mainObj.hasClass('active')) {
            $('#persona-slide-user-selected').html(perObj.correctTxt);
        } else {
            $('#persona-slide-user-selected').html(perObj.incorrectTxt);
        }
        /* if (obj.parent().attr('data-correct') == 'true') {
            $('#persona-slide-user-selected').text('This is a good persona to target.');

        } else {
            $('#persona-slide-user-selected').text('There are better personas to target.');
        } */
        $('#persona-slide-user-name').text(obj.find('.user-name').text());
        $('#persona-slide-user-title').text(obj.find('.user-title').text());
        $('#persona-slide-user-data').html(obj.find('.user-data').html());
    }

    var resetMakeSales = function () {
        var objElem = $('.persona-slide-user-icon-wrap').eq(0).find('.persona-slide-user-hl-user-data').eq(0);
        minMakeSaleIconWidth = parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-small').width()) + 4;
        iconsHolderPosition = ($('#persona-slide-users').width() / 2) - ((parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-big').width()) + 4) / 2); // 250 width for big icon plus 4 for border thickness divided by 2
        userIndex = 1;
        animationFinihed = true;
        $('#persona-slide-user-icons-holder').css({
            left: (iconsHolderPosition + 'px')
        });
        $('#persona-slide-user-arrow-left').css({
            opacity: 0.5
        });
        $('#persona-slide-user-arrow-right').css({
            opacity: 1
        });
        $('.persona-slide-user-icon-wrap').each(function (index) {
            if (index > 0) {
                $('.persona-slide-user-icon-wrap').eq(index).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-small');
            }
        });
        $('.persona-slide-user-icon-wrap').eq(0).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-big');
        setMakeSalesUserData(objElem);
    }
    var setButtonInstruction = function (obj) {
        if (obj.hasClass('inactive')) {
            $('#persona-select-hl-user-fit').text('Is this persona a good fit?');
            $('#persona-select-hl-user-fit-instruction').html('The Select button will add this persona to your mobilization team.');
        } else {
            $('#persona-select-hl-user-fit').text('Change your mind?');
            $('#persona-select-hl-user-fit-instruction').html('Use the ‘remove’ button if you change your mind about an answer.');
        }
    }

    var initPersona = function() {
        const generateSlideUser = function(obj) {
            $('#persona-slide').append('<div id="persona-slide-users" class="bg-dark"><div id="persona-slide-user-icons-holder"></div></div>');
            obj.forEach((val, index) => {
                $('#persona-slide-user-icons-holder').append(`
                    <div class="persona-slide-user-icon-wrap ${((index == 0) ? 'persona-slide-user-icon-big' : 'persona-slide-user-icon-small')}">
                        <div class="persona-slide-user-icon-box inactive" data-user="${val.id}" data-correct="${val.correct}">
                            <img class="img-responsive persona-select-user-icon" src="../img/persona/${val.img}">
                            <img class="img-responsive check-x-indicator persona-select-user-x" src="../img/persona/red-x.svg">
                            <img class="img-responsive check-x-indicator persona-select-user-check" src="../img/persona/green-check.svg">
                            <div class="persona-slide-user-hl-user-data dont-display">
                                <p class="user-name">${val.name}</p>
                                <p class="user-title">${val.nameTitle}</p>
                                <div class="user-data">${val.responseTxt}</div>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
        const generateSelectUserIcon = function(obj) {
            return `
                <div class="persona-select-user-icon-wrap">
                    <div class="persona-select-user-icon-box inactive" data-user="${obj.id}" data-correct="${obj.correct}">
                        <img class="img-responsive persona-select-user-icon" src="../img/persona/${obj.img}">
                        <img class="img-responsive check-x-indicator persona-select-user-check active" src="../img/persona/green-check.svg">
                        <div class="persona-select-user-icon-hover">
                            <div>
                                <img class="img-responsive wht-hexagon" src="../img/persona/wht-hexagon.svg">
                                <p class="persona-select-user-icon-name">${obj.name}</p>
                                <div class="button-wrap engage">
                                    <button class="engage-btn engage-remove-btn" type="button">Select</button>
                                    <button class="remove-btn engage-remove-btn" type="button">Remove</button>
                                </div>
                            </div>
                        </div>
                        <div class="persona-select-user-hl-user-data dont-display">
                            <p class="user-name">${obj.name}</p>
                            <p class="user-title">${obj.nameTitle}</p>
                            <div class="user-data">${obj.info}</div>
                        </div>
                    </div>
                </div>
            `;
        };
        const generateRowSelectUserIcon = function(obj) {
            obj.forEach((val, index) => {
                if(index % 4 == 0) {
                    $('#persona-select-user-icons-wrap').append('<div class="persona-select-user-row"></div>');
                }
                ($('.persona-select-user-row').last()).append(generateSelectUserIcon(val));
            });
        };
        $('#persona-slide').empty();
        $('#persona-box-items').empty();
        generateSlideUser(personaObj);
        $('#persona-slide').append(`
            <div id="persona-slide-user-data-wrap">
                <div id="persona-slide-user-arrows">
                    <div id="persona-slide-user-arrow-left" class="arrow-wht-btn"><img src="../img/persona/arrow-wht-left.svg" id="arrow-left"></div>
                    <div id="persona-slide-user-arrow-right" class="arrow-wht-btn"><img src="../img/persona/arrow-wht-right.svg" id="arrow-right"></div>
                </div>
                <div id="persona-slide-user-data-holder">
                    <p class="text-center">Click the left and right arrows to cycle through the feedback. </p>
                    <div class="text-center large-font" id="persona-slide-user-selected">Paragraph</div>
                    <p class="text-center biggest-font" id="persona-slide-user-name">Paragraph</p>
                    <p class="text-center large-font" id="persona-slide-user-title">Paragraph</p>
                    <div id="persona-slide-user-data"></div>
                    <p class="text-center dont-display" id="persona-slide-ready-for-quiz"><strong>When you are ready to begin, click Next to test your knowledge. </strong></p>
                </div>
                <div class="text-center">
                    <button class="btn blue next-btn" type="button">Continue</button>
                    <!-- <button id="persona-slides-page-btn" class="btn yellow" type="button">Back</button> -->
                </div>
            </div>
        `);
        $('#persona-box-items').append('<div id="persona-box-items-center"></div>');
        $('#persona-box-items-center').append('<div id="persona-select-user-icons-wrap"></div>');
        generateRowSelectUserIcon(personaObj);
        $('#persona-box-items-center').append('<div id="persona-slide-wrap" class="text-center"><p class="text-center" id="persona-select-hl-user-fit">Paragraph</p><p class="text-center" id="persona-select-hl-user-fit-instruction">Paragraph</p><button id="persona-slide-btn" class="btn yellow" type="button">Submit</button></div>');
        resetMakeSales();

        scorePerPersona = 20 / document.querySelectorAll('.persona-slide-user-icon-box').length;
        
        $('#persona-slide').removeClass('active');
        $('#persona-select').addClass('active');
        document.body.querySelectorAll('.dont-display').forEach(val => {
            val.style.display = 'none';
        });
    }
    showResponseReview = () => {};
    submitAnswer = () => {};
    resetQuizPage = () => {
        initPersona();
        // $('#persona-select-hl-user-info-wrap, .button-wrap').hide();
        //$('#persona-select-hl-user-info-wrap, .button-wrap').hide();

        $('#persona-select-user-icons-wrap .persona-select-user-row .persona-select-user-icon-box').each(function () {
            $(this).off().on('click', function () {
                $('.persona-select-user-icon-box').removeClass('tap');
                // $('.persona-select-user-icon-box').find('.button-wrap').hide();
                $(this).addClass('tap');
                // $(this).find('.button-wrap').show();
                $('#persona-select-hl-user-info-name').html($(this).find('.user-name').html());
                $('#persona-select-hl-user-info-job-title').html($(this).find('.user-title').html());
                $('#persona-select-hl-user-info-data').html($(this).find('.user-data').html());
                $('#persona-select-hl-user-info-wrap').show();

                setButtonInstruction($(this));
                /* if (!profile) {
                    playCertainAudio("breakMe04a.mp3");
                    profile = true;
                } else {
                    if ($(this).hasClass('active') && !remove) {
                        playCertainAudio("breakMe04b.mp3");
                        remove = true;
                    }
                } */
            });
        });
        $('#persona-slides-page-btn').off().on('click', function () {
            $('#persona-slide').removeClass('active');
            $('#persona-select').addClass('active');
            
            /* $('.persona-select-user-icon-box').removeClass('tap');
            $('.persona-select-user-icon-box').find('.button-wrap').hide();
            $('#persona-select-hl-user-info-wrap').hide(); */
        });
        $('#persona-slide-btn').off().on('click', function () {
            const learnerRes = new Array();
            let correct = 0;
            let incorrect = 0;
            $('#persona-slide').addClass('active');
            $('#persona-select').removeClass('active');
            
            $('.persona-slide-user-icon-box').each(function(){
                // console.log($(this).attr('data-correct') == 'true', $(this).hasClass('active'), $(this).attr('data-correct') == 'true' && $(this).hasClass('.active'));
                if($(this).attr('data-correct') == 'true' && $(this).hasClass('active') || 
                   $(this).attr('data-correct') == 'false' && !$(this).hasClass('active')) {
                    correct++;
                } else {
                    incorrect++;
                }
            });
            
            document.querySelector('.page-info-txt[data-info="score"]').innerText = (correct * scorePerPersona).toString();

            $('.persona-select-user-icon-box.active').each(function() {
                learnerRes.push(setupCorrectResponses($(this).find('.persona-select-user-icon-name').text()));
            });
            
            quizInfo.learnerResponse = learnerRes.join('|');
            quizInfo.result = (quizInfo.learnerResponse == quizInfo.correctResponses) ? 'correct' : 'incorrect';
            
            if(insideOfWrapper) {
                parent.addScore();
                /* if(quizInfo.learnerResponse == quizInfo.correctResponses) {
                    parent.addScore();
                } */
            }
            resetMakeSales();
            if (!clickSubmit) {
                playCertainAudio("persona-after-submit.mp3");
                clickSubmit = true;
            }
        });
        $('.persona-select-user-icon-hover').each(function() {
            $(this).on('click', function() {
                const parent = $(this).parent();
                if(parent.hasClass('active')) {
                    const iconBox = $(this).parent();
                    const targetSlide = $(('.persona-slide-user-icon-box[data-user="' + iconBox.attr('data-user') + '"]'));
                    iconBox.removeClass('active').addClass('inactive');
                    $(this).find('.button-wrap').removeClass('remove').addClass('engage');
                    targetSlide.removeClass('active').removeClass('inactive');
                    targetSlide.addClass('inactive');
                    targetSlide.find('.check-x-indicator').each(function(){
                        $(this).removeClass('active');
                    });
                    setButtonInstruction($(this).parent().parent());
                } else {
                    const iconBox = $(this).parent();
                    const targetSlide = $(('.persona-slide-user-icon-box[data-user="' + iconBox.attr('data-user') + '"]'));
                    iconBox.removeClass('inactive').addClass('active');
                    $(this).find('.button-wrap').removeClass('engage').addClass('remove');
                    $('#persona-slide-wrap').css({
                        opacity: 1
                    });
                    targetSlide.removeClass('active').removeClass('inactive');
                    targetSlide.addClass('active');
                    targetSlide.find('.check-x-indicator').each(function(){
                        $(this).removeClass('active');
                    });

                    if(iconBox.attr('data-correct') == 'true') {
                        targetSlide.find('.persona-select-user-check').addClass('active');
                    } else {
                        targetSlide.find('.persona-select-user-x').addClass('active');
                    }

                    if (!engage) {
                        playCertainAudio("persona-after-click.mp3");
                        engage = true;
                    }
                    setButtonInstruction($(this).parent().parent());
                }
            })
        });
        $('#persona-slide-user-arrow-right').off().on('click', function () {
            var left = parseInt(($('#persona-slide-user-icons-holder').css('left')).replace('px', ''));
            var objElem = null;

            if (animationFinihed) {
                animationFinihed = false;
                if (userIndex >= 1 && userIndex <= 11) {
                    $('#persona-slide-user-icons-holder').animate({
                        left: (left - minMakeSaleIconWidth + 'px')
                    });
                    left = left - minMakeSaleIconWidth;
                    iconsHolderPosition = parseInt(($('#persona-slide-user-icons-holder').css('left')).replace('px', ''));
                    userIndex++;
                    $('.persona-slide-user-icon-wrap').eq((userIndex - 2)).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-small');
                    $('.persona-slide-user-icon-wrap').eq((userIndex - 1)).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-big');
                    setTimeout(function () {
                        animationFinihed = true;
                    }, 500);
                }
                if (userIndex == 12) {
                    $(this).css({
                        opacity: 0.5
                    });
                    animationFinihed = true;
                    //nextPageReady
                    /* if (!nextPageReady) {
                        if (!nextPageReady) {
                            parent.showNextPageBtn();
                            playCertainAudio("breakMe07.mp3");
                        }
                        nextPageReady = true;
                        parent.nextPageReady = true;
                        $('#persona-slide-ready-for-quiz').fadeIn();
                    } */
                }

                objElem = $('.persona-slide-user-icon-wrap').eq((userIndex - 1)).find('.persona-slide-user-hl-user-data').eq(0);
                setMakeSalesUserData(objElem);
                $('#persona-slide-user-arrow-left').css({
                    opacity: 1
                });
            }
        });

        $('#persona-select-hl-user-info-name, #persona-select-hl-user-info-job-title, #persona-select-hl-user-fit, #persona-select-hl-user-fit-instruction').text('');

        $('#persona-slide-user-arrow-left').off().on('click', function () {
            var left = parseInt(($('#persona-slide-user-icons-holder').css('left')).replace('px', ''));
            var objElem = null;

            if (animationFinihed) {
                animationFinihed = false;
                if (userIndex >= 2 && userIndex <= 12) {
                    $('#persona-slide-user-icons-holder').animate({
                        left: (left + minMakeSaleIconWidth + 'px')
                    });
                    left = left + minMakeSaleIconWidth;
                    iconsHolderPosition = parseInt(($('#persona-slide-user-icons-holder').css('left')).replace('px', ''));
                    userIndex--;
                    $('.persona-slide-user-icon-wrap').eq((userIndex)).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-small');
                    $('.persona-slide-user-icon-wrap').eq((userIndex - 1)).removeClass('persona-slide-user-icon-big').removeClass('persona-slide-user-icon-small').addClass('persona-slide-user-icon-big');
                    setTimeout(function () {
                        animationFinihed = true;
                    }, 500);
                }
                if (userIndex == 1) {
                    $(this).css({
                        opacity: 0.5
                    });
                    animationFinihed = true;
                }

                objElem = $('.persona-slide-user-icon-wrap').eq((userIndex - 1)).find('.persona-slide-user-hl-user-data').eq(0);
                setMakeSalesUserData(objElem);
                $('#persona-slide-user-arrow-right').css({
                    opacity: 1
                });
            }
        });
        $(window).resize(function () {
            var position = 0;
            minMakeSaleIconWidth = parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-small').width()) + 4;
            iconsHolderPosition = ($('#persona-slide-users').width() / 2) - ((parseInt($('.persona-slide-user-icon-wrap.persona-slide-user-icon-big').width()) + 4) / 2);

            position = iconsHolderPosition - (minMakeSaleIconWidth * (userIndex - 1));

            $('#persona-slide-user-icons-holder').css({
                left: (position + 'px')
            });
        });
        document.querySelectorAll('.next-btn').forEach((val, index) => {
            val.addEventListener('click', function() {
                if(insideOfWrapper) {
                    parent.nextPage();
                }
            });
        });
        if(engage) {
            profile = false;
            remove = false;
            leftRightArrows = false;
            engage = false;
            nextPageReady = false;
            clickSubmit = false;
            playCertainAudio("persona-start.mp3");
        }
    }
    
    quizInfo.correctResponses = ((personaObj.filter((obj) => {return obj.correct == true})).map((obj) => {return setupCorrectResponses(obj.name)})).join('|');
    resetQuizPage();
}