// Revised in October 16, 2018


// Wrapper
var wrapperPage = (window.location.href).search("/pages") < 0 ? true : false;
// Simple on and off settings
var courseGated = false;
var retrieveNumOfAttempt = false;
var retrieveScore = false;
var shuffleAnswer = false;
var setSCORMcompleteAtTheLastPage = false;

// Passing Grade.
// If the course disregards the user score and automatically marks complete/pass. Set values to zero.
var passingGrade = 80; // This represents a percentage score. As a default, this is set to 80%.
var maxScore = 100; // This represents the course's maximum score of 100. If by any chance the maximum score will be greater than this, change the current value.

var pages = new Array();
var quizes = new Array();
var wrapperObj = new Object();
var coursePass = false;
var quizPageIndex = 0;
var quizNames = null;
var pageNames = null;
var totalQuestions = 10;
var scorePercent = 0;
var SCORM = (typeof SCORM2004_Initialize === "function");
var student = "";
var courseStart = false;
var pageProgress = 0;
var scaledScore = 0;
var processedUnload = false;
var startTimeStamp = null;
var numOfAttempt = 1;
var repeatCourse = false;
var suspendData = null;
var resourcesPath = SCORM ? "./resources/" : "https://projectcog.com/user_files/McAfee/resources/Understand_Cloud_Architecture";
var pptPath = SCORM ? "./ppt/" : "http://projectcog.com/user_files/McAfee/resources/ppt/Understand_Cloud_Architecture";
var pdfPath = SCORM ? "./pdf/" : "https://projectcog.com/user_files/McAfee/resources/pdf/Understand_Cloud_Architecture/";
var audioPath = SCORM ? "../media/audio/" : "https://projectcog.com/user_files/McAfee/resources/audio/Understand_Cloud_Architecture/";
var videoPath = SCORM ? "./media/video/" : "https://projectcog.com/user_files/McAfee/resources/video/Understand_Cloud_Architecture/";

wrapperObj.student = student;
wrapperObj.currentPage = 0;
wrapperObj.score = 0;
wrapperObj.pageProgress = 0;
wrapperObj.numOfAttempt = numOfAttempt;

// HTML Pages
var audio = $("#audio")[0];
var video = $("#video video").eq(0)[0];
var imgContainerElementReady = true;
var showClickedElementReady = true;

var showClickedElement = null;
var imgContainerElement = null;
var seriesOfImagesIndex = 0;
var audioProgress2 = 0;
var winWidth = $(window).width();
var winHeight = $(window).height();
var scrollTop = 0;

// Slide Side Bar
var menuOpen = false;
var mobileMenuOpen = false;
var audioOpen = false;

// Quiz Page
var timer = null;
var scoreValue = parseFloat(($("#score").text()).length > 0 ? $("#score").text() : 0);
var labelText = $("#textContent").text();
var quizCountID = 0;
var answer = "";
var quizType = $(".quizContainer").attr("data-type");
var correctResponses = "";
var answered = false;
var gainScore = false;
var doneAnswering = false;
var numCorrect = 0;
var quizPage = (window.location.href).search("quiz") > 0 ? true : false;
var time = null;
var matchingTxt = "";
var response = "";
var percentMagnifierSize = 0;
var magnifyElemWidth = 0;
var magnifyImgWidth = 0;
var magnifyElemHeight = 0;
var magnifyImgHeight = 0;
var previewElemWidth = 0;
var previewImgWidth = 0;
var previewElemHeight = 0;
var previewImgHeight = 0;
var scrollingLength = 0;
var docHeight = 0;

/*
	This section is for the Wrapper which encapsulate all available
    HTML files, Pages or Slides and make them work as one.
*/

var initSCORM = function()
{
    if(SCORM && !courseStart)
    {
        SCORM2004_Initialize();
        startTimeStamp = new Date();

        var continueCourse = null;
        var completionStatus = SCORM2004_CallGetValue("cmi.completion_status", true);
        suspendData = SCORM2004_CallGetValue("cmi.suspend_data") ? JSON.parse(SCORM2004_CallGetValue("cmi.suspend_data")) : wrapperObj;

        if (completionStatus == "unknown")
        {
            SCORM2004_CallSetValue("cmi.completion_status", "incomplete");
        }

        wrapperObj.student = SCORM2004_CallGetValue("cmi.learner_name");

        if(retrieveScore)
        {
            wrapperObj.score = SCORM2004_CallGetValue("cmi.score.raw") ? SCORM2004_CallGetValue("cmi.score.raw") : 0;
        }
        else
        {
            wrapperObj.score = 0;
        }

        if(retrieveNumOfAttempt)
        {
            numOfAttempt = suspendData.numOfAttempt >= 3 ? 3 : suspendData.numOfAttempt;
            wrapperObj.numOfAttempt = suspendData.numOfAttempt;
        }

        scaledScore = wrapperObj.score / maxScore;
        SCORM2004_CallSetValue("cmi.score.scaled", scaledScore);

        /*if (wrapperObj.score >= passingGrade){
            SCORM2004_CallSetValue("cmi.success_status", SCORM2004_PASSED);
        }
        else
        {
            SCORM2004_CallSetValue("cmi.success_status", SCORM2004_FAILED);
        }*/
        if(parseInt(SCORM2004_GetBookmark()) > 0)
        {
            continueCourse = confirm("Would you like to continue on where you left?");
            if(continueCourse)
            {
                wrapperObj.currentPage = parseInt(SCORM2004_GetBookmark());

                if(wrapperObj.currentPage == (pages.length - 1))
                {
                    setTimeout(function(){lastPageInfo()},800);
                }
                $.each(pages,function(index,val){
                    if(index <= wrapperObj.currentPage)
                    {
                        val.opened = true;
                    }
                });
                $("#pageContent .page").eq(wrapperObj.currentPage).load(function(){
                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(window).load(function(){

                        $("#couseLoader p").html("<span id='clickHereToStart'>Click here to Start...</span>")
                        $("#couseLoader p").off("click").on("click",function(){
                            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
                            $("#playBtn").hide();
                            $("#pauseBtn").show();

                            if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo == "function")
                            {
                                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo();
                            }
                            $("#couseLoader").remove();
                            setPage();
                            showProperAudioBtn();
                        });
                    });
                });
            }
            else
            {
                wrapperObj.currentPage = 0;
                $("#pageContent .page").eq(wrapperObj.currentPage).load(function(){
                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(window).load(function(){

                        $("#couseLoader p").html("<span id='clickHereToStart'>Click here to Start...</span>")
                        $("#couseLoader p").off("click").on("click",function(){
                            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
                            $("#playBtn").hide();
                            $("#pauseBtn").show();

                            if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo == "function")
                            {
                                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo();
                            }
                            $("#couseLoader").remove();
                            setPage();
                            showProperAudioBtn();
                        });
                    });
                });
            }
        }
        else
        {
            $("#pageContent .page").eq(wrapperObj.currentPage).load(function(){
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(window).load(function(){

                    $("#couseLoader p").html("<span id='clickHereToStart'>Click here to Start...</span>")
                    $("#couseLoader p").off("click").on("click",function(){
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
                        $("#playBtn").hide();
                        $("#pauseBtn").show();

                        if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo == "function")
                        {
                            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pauseYTVideo();
                        }
                        $("#couseLoader").remove();
                        setPage();
                        showProperAudioBtn();
                    });
                });
            });
        }
        courseStart = true;
    }
}
var setSCORMvalues = function()
{
    if(SCORM && courseStart)
    {
        SCORM2004_CallSetValue("cmi.suspend_data",JSON.stringify(wrapperObj));
    }
}
var setSCORMcomplete = function()
{
    if(SCORM && courseStart)
    {
        wrapperObj.pageProgress = (pageProgress / pages.length * 100);
        SCORM2004_CallSetValue("cmi.suspend_data",JSON.stringify(wrapperObj));

        if(wrapperObj.score >= passingGrade){
            SCORM2004_CallSetValue("cmi.completion_status","completed");
            SCORM2004_CallSetValue("cmi.success_status", "passed");
        }
        else
        {
            SCORM2004_CallSetValue("cmi.completion_status","incomplete");
            SCORM2004_CallSetValue("cmi.success_status", "failed");
        }

        SCORM2004_CallSetValue("cmi.exit", "");
        SCORM2004_CallSetValue("adl.nav.request", "exitAll");
    }
}
var setCMIInteractions = function(settings)
{
    var obj = new Object();
    obj.num = settings.num ? settings.num : getInteractionsCount();
    obj.type = settings.type ? settings.type : "true-false";
    obj.id = settings.id ? settings.id : "Quiz" + obj.num;
    obj.objectives = settings.objectives ? settings.objectives : "Quiz" + obj.num;
    // temporary disabled obj.timestamp = ConvertDateToIso8601TimeStamp(new Date());
    obj.correctResponses = settings.correctResponses ? settings.correctResponses : "true";
    obj.weighting = settings.weighting ? settings.weighting : 1;
    obj.learnerResponse = settings.learnerResponse ? settings.learnerResponse : "true";
    obj.result = settings.result ? settings.result : "incorrect";
    // temporary disabled obj.latency = ConvertMilliSecondsIntoSCORM2004Time(new Date((new Date()).getMilliseconds()));
    obj.description = settings.description ? settings.description : "Question" + obj.num + " text";

    if(SCORM)
    {
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".id"),obj.id);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".type"),obj.type);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".objectives.0.id"),obj.objectives);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".timestamp"),obj.timestamp);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".correct_responses.0.pattern"),obj.correctResponses);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".weighting"),obj.weighting);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".learner_response"),obj.learnerResponse);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".result"),obj.result);
        //SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".latency"),obj.latency);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".description"),obj.description);
    }
}
var getInteractionsCount = function()
{
    var num = 0;
    if(SCORM)
    {
        num =  SCORM2004_CallGetValue("cmi.interactions._count");
    }
    return num;
}
var setCMIInteractionsLatency = function(count,response,result,time)
{
    if(SCORM)
    {
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".learner_response"),response);
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".result"),result);
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".latency"),ConvertMilliSecondsIntoSCORM2004Time(time));
    }
}
var setCoursePage = function()
{
    if($(window).width() > 1024) // Desktop
    {
        $("#pageContent").height(($(window).height() - 153));
    }
    else if($(window).width() <= 1024 && $(window).width() > 767) // Tablet
    {
        $("#pageContent").height(($(window).height() - 112));
    }
    else if($(window).width() <= 766 && $(window).width() >= 480) // Mobile
    {
        $("#pageContent").height(($(window).height() - 92));
    }
    else
    {
        $("#pageContent").height(($(window).height() - 92));
    }

    $("#pageContent .page").each(function(index){
        if($("#pageContent .page").eq(index)[0].contentWindow.$("body"))
        {
            if($(window).width() > 1024) // Desktop
            {
                $("#pageContent .page").eq(index)[0].contentWindow.$("body").height(($(window).height() - 153));
                $("#pageContent .page").eq(index).attr("height",($(window).height() - 153));
            }
            else if($(window).width() <= 1024 && $(window).width() > 767) // Tablet
            {
                $("#pageContent .page").eq(index)[0].contentWindow.$("body").height(($(window).height() - 112));
                $("#pageContent .page").eq(index).attr("height",($(window).height() - 112));
            }
            else if($(window).width() <= 766 && $(window).width() >= 480)
            {
                $("#pageContent .page").eq(index)[0].contentWindow.$("body").height(($(window).height() - 92));
                $("#pageContent .page").eq(index).attr("height",($(window).height() - 92));
            }
            else
            {
                $("#pageContent .page").eq(index)[0].contentWindow.$("body").height(($(window).height() - 92));
                $("#pageContent .page").eq(index).attr("height",($(window).height() - 92));
            }
        }
    });
}
var hidePages = function()
{
    $("#pageContent .page").hide();
}
var addScore = function()
{
    wrapperObj.score += parseFloat($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.scoreValue);
    wrapperObj.score = wrapperObj.score >= 99 ? 100 : wrapperObj.score;
    if(SCORM && courseStart && $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.scorm)
    {
        SCORM2004_CallSetValue("cmi.score.min", 0);
        SCORM2004_CallSetValue("cmi.score.max", maxScore);
        SCORM2004_CallSetValue("cmi.score.raw", wrapperObj.score);

        scaledScore = wrapperObj.score / maxScore;
        scaledScore = scaledScore >= 99 ? 100 : scaledScore;
        SCORM2004_CallSetValue("cmi.score.scaled", scaledScore);

        if (wrapperObj.score >= passingGrade){
            SCORM2004_CallSetValue("cmi.completion_status","completed");
            SCORM2004_CallSetValue("cmi.success_status", "passed");
        }
        else
        {
            SCORM2004_CallSetValue("cmi.completion_status","incomplete");
            SCORM2004_CallSetValue("cmi.success_status", "failed");
        }
    }
}
var setWhenAudioIsFinish = function()
{
    $("#playBtn").show();
    $("#pauseBtn").hide();

    var quizPage = false;

    $.each(pages,function(index,val){
        if(quizes.indexOf(pages[wrapperObj.currentPage].pageName) >= 0)
        {
            quizPage = true;

            $("#resetScreenBtn").css({opacity:1});
            $("#resetScreenBtn").off("click").on("click",function(){
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.resetAnimation();
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioReplay();
                showPauseBtn();
            });

            return false;
        }
    });
    if(!quizPage)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish = true;
        $("#nextPage").fadeIn();
        showPageProgress();
    }
}
var showPageProgress = function()
{
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish)
    {
        $("#resetScreenBtn").css({opacity:1});
        $("#completePercentage").text("100%");
        $("#pageComplete").css({opacity:1});
        $("#resetScreenBtn").off("click").on("click",function(){
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.resetAnimation();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioReplay();
            showPauseBtn();
        });
    }
    else
    {
        var timeProgress = $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioProgress;

        if(timeProgress == "-1" || timeProgress == "undefined")
        {
            timeProgress = 0;
        }
        $("#resetScreenBtn").css({opacity:0});
        $("#completePercentage").text(timeProgress + ("%"));
        $("#pageComplete").css({opacity:0.25});
        $("#resetScreenBtn").off("click");
    }
}
var showPauseBtn = function()
{
    $("#playBtn").hide();
    $("#pauseBtn").hide();
    $("#pauseBtn").show();
}
var showPlayBtn = function()
{
    $("#playBtn").hide();
    $("#pauseBtn").hide();
    $("#playBtn").show();
}
var showProperAudioBtn = function()
{
    changeScreenName($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#pageScreenName").text());
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.muted = false;
    $("#muteBtn").show();
    $("#unmuteBtn").hide();

    //$("#wrapperBG").css($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.bgImage);

    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay == "function")
    {   
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;

        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlayed = true;
        $("#playBtn").hide();
        $("#pauseBtn").removeClass("hidden");
        $("#pauseBtn").show();

        // Reserve code
        /*
        if(!$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlayed)
        {
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlayed = true;
            $("#playBtn").hide();
            $("#pauseBtn").removeClass("hidden");
            $("#pauseBtn").show();
        }
        else
        {
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
            $("#playBtn").removeClass("hidden");
            $("#playBtn").show();
            $("#pauseBtn").hide();
        }
        */
    }
    else
    {
        $("#playBtn").removeClass("hidden");
        $("#playBtn").show();
        $("#pauseBtn").hide();
    }
}
var doUnload = function()
{
    //don't call this function twice
    if (processedUnload == true){return;}

    processedUnload = true;

    //record the session time
    var endTimeStamp = new Date();
    var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
    var scormTime = ConvertMilliSecondsIntoSCORM2004Time(totalMilliseconds);

    SCORM2004_CallSetValue("cmi.session_time", scormTime);

    SCORM2004_CallTerminate();
}
var closeCourse = function()
{
    setSCORMcomplete();

    if(SCORM && courseStart)
    {
        SCORM2004_CallSetValue("cmi.exit", "");
        SCORM2004_CallSetValue("adl.nav.request", "exitAll");
        doUnload();
    }
}
var hideNextBtn = function()
{
    if(courseGated)
    {
        $("#nextPage").hide();
    }
    else
    {
        $("#nextPage").show();
    }
}
var showNextPageBtn = function()
{
    $("#nextPage").fadeIn();
}
var nextPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#videoModal").modal("hide");
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }

    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(".audioPlayer").each(function(){
        $(this).each(function(){
            if($(this).find("source").attr("src") != undefined)
            {
                $(this)[0].pause();
            }
        });
    });

    /*if(pages[wrapperObj.currentPage].pageName == "stop_and_think" ||
           pages[wrapperObj.currentPage].pageName == "stop_and_think_answer")
    {
        $.each(pages,function(index,val){
            if(val.pageName == "page05")
            {
                wrapperObj.currentPage = index;
                return false;
            }
        });
    }
    else
    {*/
        wrapperObj.currentPage += 1;
    //}

    if(repeatCourse || coursePass)
    {
        quizPageIndex = (quizPageIndex < (quizes.length - 1)) ? (quizPageIndex + 1) : quizPageIndex;
        $.each(pages,function(index,val){
            if(val.pageName == quizes[quizPageIndex])
            {
                wrapperObj.currentPage = index;
                return false;
            }
        });
    }

    for(var i = 0; i < quizes.length; i++)
    {
        if(pages[wrapperObj.currentPage].pageName == quizes[i])
        {
            if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer == "function")
            {
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer();
            }
        }
    }
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.setSeeMoreBtn();
    setPage();
    showProperAudioBtn();
}
var prevPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#videoModal").modal("hide");
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(".audioPlayer").each(function(){
        $(this).each(function(){
            if($(this).find("source").attr("src") != undefined)
            {
                $(this)[0].pause();
            }
        });
    });
    /*if(pages[wrapperObj.currentPage].pageName == "page05" ||
           pages[wrapperObj.currentPage].pageName == "stop_and_think_answer")
    {
        $.each(pages,function(index,val){
            if(val.pageName == "stop_and_think")
            {
                wrapperObj.currentPage = index;
                return false;
            }
        });
    }
    else
    {*/
        wrapperObj.currentPage -= 1;
    //}
    if(repeatCourse || coursePass)
    {
        quizPageIndex = (quizPageIndex <= (quizes.length - 1) && quizPageIndex > 0) ? (quizPageIndex - 1) : quizPageIndex;
        $.each(pages,function(index,val){
            if(val.pageName == quizes[quizPageIndex])
            {
                wrapperObj.currentPage = index;
                return false;
            }
        });
    }
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.setSeeMoreBtn();
    setPage();
    showProperAudioBtn();
}
var retakeCourse = function()
{
    wrapperObj.score = 0;
    numOfAttempt = numOfAttempt >= 3 ? 3 : numOfAttempt + 1;
    wrapperObj.numOfAttempt = numOfAttempt;
    repeatCourse = true;
    quizPageIndex = 0;

    for(var i = 0; i < pages.length; i++)
    {
        $("#pageContent .page").eq(i)[0].contentWindow.pageFinish = false;
        $("#pageContent .page").eq(i)[0].contentWindow.audioPlayed = false;
        $("#pageContent .page").eq(i)[0].contentWindow.resetAnimation();
        $("#pageContent .page").eq(i)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(i)[0].contentWindow.audio.currentTime = 0;
        $("#pageContent .page").eq(i)[0].contentWindow.audioProgress = 0;

        for(var j = 0; j < quizes.length; j++)
        {
            if(pages[i].pageName == quizes[j])
            {
                if(typeof $("#pageContent .page").eq(i)[0].contentWindow.resetQuizPage == "function")
                {
                    if(shuffleAnswer)
                    {
                        $("#pageContent .page").eq(i)[0].contentWindow.shuffleAnswer();
                    }
                    $("#pageContent .page").eq(i)[0].contentWindow.resetQuizPage();
                    $("#pageContent .page").eq(i)[0].contentWindow.$("#responseSelectAnswer").hide();
                    $("#pageContent .page").eq(i)[0].contentWindow.$("#responseCorrect").hide();
                    $("#pageContent .page").eq(i)[0].contentWindow.$("#responseIncorrect").hide();

                    $("#pageContent .page").eq(i)[0].contentWindow.$("#submitBtn").show();
                    $("#pageContent .page").eq(i)[0].contentWindow.$("#submitDragDropBtn").show();
                    $("#pageContent .page").eq(i)[0].contentWindow.$("#submitDropDownBtn").show();
                }
            }
        }
    }
    $.each(pages,function(index,val){
        if(val.pageName == quizes[0])
        {
            wrapperObj.currentPage = index;
            if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer == "function")
            {
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer();
            }
            return false;
        }
    });

    showCertainPage(pages[wrapperObj.currentPage].pageName);
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioPlay();
}
var lastPageInfo = function()
{

    if(wrapperObj.currentPage == (pages.length - 1))
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#result p").text("");

        setTimeout(function(){
            scorePercent = Math.round((wrapperObj.score / maxScore) * 100);
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#scored").text(Math.round(wrapperObj.score));
            //$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#maxScore").text(maxScore);
            //$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#totalQuestions").text(totalQuestions);
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#accuracy").text(scorePercent + "%");
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#attempts").text(numOfAttempt);

            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#failNotification.dontDisplay").hide();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#passNotification.dontDisplay").hide();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#retakeBtn.dontDisplay").hide();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#reviewBtn.dontDisplay").hide();

            if(scorePercent >= passingGrade)
            {
                coursePass = true;
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#passNotification.dontDisplay").show();
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#reviewBtn.dontDisplay").show();
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#reviewBtn.dontDisplay").css({display: "inline-table"});
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#result p").text("Congratulations! You pass!");
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#result p").css({color: "#14487E"});
            }
            else
            {
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#failNotification.dontDisplay").show();
                if(numOfAttempt <= 2)
                {
                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#retakeBtn.dontDisplay").show();
                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#retakeBtn.dontDisplay").css({display: "inline-table"});
                }
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#result p").text("Sorry, you failed.");
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#result p").css({color: "#9C1C36"});
            }

        },800);
        if(setSCORMcompleteAtTheLastPage)
        {
            setSCORMcomplete();
        }
    }
}
var gotoFistQuizPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }
    quizPageIndex = 0;
    $.each(pages,function(index,val){
        if(val.pageName == quizes[quizPageIndex])
        {
            wrapperObj.currentPage = index;
            return false;
        }
    });

    setPage();
    showProperAudioBtn();
}
var gotoLastPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }
    wrapperObj.currentPage = (pages.length - 1);
    setPage();
    showProperAudioBtn();
}
var showCertainPage= function(page)
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }
    $.each(pages,function(index,val){
        if(val.pageName == page)
        {
            wrapperObj.currentPage = index;
            return false;
        }
    });
    setPage();
    showProperAudioBtn();
}
var setPage = function()
{
    var quizPage = false;
    hidePages();

    if(SCORM && courseStart)
    {
        SCORM2004_SetBookmark((wrapperObj.currentPage).toString());
        setSCORMvalues();
    }

    if(!pages[wrapperObj.currentPage].opened)
    {
        pages[wrapperObj.currentPage].opened = true;
    }
    pageProgress = 0;
    $.each(pages,function(index,val){

        if(val.opened)
        {
            pageProgress += 1;
            $("#progressBar").css({width: ((pageProgress / pages.length * 100) + "%")});
            if(repeatCourse || coursePass)
            {
                $(".tableOfContentsLink").off("click");
            }
            else
            {
                $(".tableOfContentsName").each(function(){
                    if(val.pageName == $(this).data("page"))
                    {
                        $(this).addClass("tableOfContentsLink").off("click").on("click",function(){
                            showCertainPage($(this).data("page"));
                            return false;
                        });
                    }
                });
            }
        }
    });

    $("#playPauseBtn .glyphicon").removeClass("glyphicon-pause");
    $("#playPauseBtn .glyphicon").addClass("glyphicon-play");

    $("#pageContent .page").eq(wrapperObj.currentPage).show();

    if(wrapperObj.currentPage == 0 && courseGated && !$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish)
    {
        $("#prevPage").hide();
        $("#nextPage").hide();
    }
    else if(wrapperObj.currentPage == 0 && courseGated && $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish || 
           wrapperObj.currentPage == 0 && !courseGated && !$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish)
    {
        $("#prevPage").hide();
        $("#nextPage").show();
    }
    else if(wrapperObj.currentPage == (pages.length - 1))
    {
        $("#prevPage").show();
        $("#nextPage").hide();
    }
    else if(wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && !courseGated)
    {
        $("#prevPage").show();
        $("#nextPage").show();
    }
    else if(wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && courseGated && !$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish)
    {
        $("#prevPage").show();
        $("#nextPage").hide();
    }
    else if(wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && courseGated && $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish ||
            wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && !courseGated && !$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.pageFinish)
    {
        $("#prevPage").show();
        $("#nextPage").show();
    }

    if(coursePass)
    {
        $.each(quizes,function(index,val){
            if(pages[wrapperObj.currentPage].pageName == val)
            {
                quizPage = true;
                return false;
            }
        });
        if(quizPage)
        {
            //$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#prevNextQuizBtns.dontDisplay").show();
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(".quizResponse, #nextPage").hide();
        }

        if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.revealAnswer == "function")
        {
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.revealAnswer();
        }
    }
    $("#wrapperSubmitBtn").css({display: "none"});

    if(pages[wrapperObj.currentPage].pageName.search("_submit") > 0)
    {
        if(wrapperObj.currentPage != (pages.length - 1))
        {
            $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(".submitBtn").each(function(){
                var id = $(this).context.id;
                $("#wrapperSubmitBtn").css({display: "table"});
                $("#wrapperSubmitBtn").off("click").on("click",function(){
                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(("#" + id)).trigger("click");
                    $("#wrapperSubmitBtn").css({display: "none"});
                });
            });
        }
    }

    $.each(quizes,function(index,val){
        if(pages[wrapperObj.currentPage].pageName == val)
        {
            if(!$("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.answered && wrapperObj.currentPage != (pages.length - 1))
            {
                $("#wrapperSubmitBtn").css({display: "table"});
                $("#wrapperSubmitBtn").off("click").on("click",function(){

                    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#submitBtn").trigger("click");
                    if($(window).width() > 992) // Desktop
                    {
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#submitDragDropBtn").trigger("click");
                    }
                    else if($(window).width() <= 992 && $(window).width() > 767) // Tablet
                    {
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#submitDropDownBtn").trigger("click");
                    }
                    else if($(window).width() <= 766 && $(window).width() >= 480)
                    {
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#submitDropDownBtn").trigger("click");
                    }
                    else
                    {
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#submitDropDownBtn").trigger("click");
                    }
                    //if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.answered)
                    //{
                        $(this).css({display: "none"});
                    //}
                })
            }
            return false;
        }
    });

    // For the first page
    $("#pageContent .page").eq(wrapperObj.currentPage).load(function(){
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(document).ready(function(){
            var page = $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow;
            //page.audioPlay();
            showProperAudioBtn();

            //$("#wrapperBG").css($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.bgImage);
            for(var i = 0; i < quizes.length; i++)
            {
                if(pages[wrapperObj.currentPage].pageName == quizes[i])
                {
                    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer == "function")
                    {
                        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer();
                    }
                }
            }
        });
    });

    if(wrapperObj.currentPage == 0)
    {
        $("#screenLogo").slideDown();
        $("#slideSideBar").animate({top:"120px"});
    }
    else
    {
        $("#screenLogo").slideUp();
        $("#slideSideBar").animate({top:"10px"});
    }
    $("#pageIndicator").text(("Slide ") + (wrapperObj.currentPage + 1) + "/" + pages.length);

    lastPageInfo();
}
var gotoPrevQuizPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }
    quizPageIndex -= 1;
    $.each(pages,function(index,val){
        if(val.pageName == quizes[quizPageIndex])
        {
            wrapperObj.currentPage = index;
            return false;
        }
    });
    setPage();
    showProperAudioBtn();
}
var gotoNextQuizPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
    }

    quizPageIndex += 1;
    $.each(pages,function(index,val){
        if(val.pageName == quizes[quizPageIndex])
        {
            wrapperObj.currentPage = index;
            return false;
        }
    });
    setPage();
    showProperAudioBtn();
}
var openPDFModal = function(fileName)
{
    $("#pdfModal").modal("show");
    $("#pdfIframe").attr("src", (pdfPath + fileName));

    $("#pdfIframeWrapper iframe").attr("width","100%");
    $("#pdfIframeWrapper iframe").attr("height",(winHeight - 250));
    $("#pdfIframeWrapper").attr("style",("height:" + (winHeight - 240) + "px; overflow: auto"));
    $("#pdfIframeWrapper").parent().attr("style",("height:" + (winHeight - 240) + "px"));

    $("#viewPDF").attr("href",(pdfPath + fileName));
    $("#downloadPDF").attr("href",(pdfPath + fileName));
    $("#downloadPDF").attr("download",(fileName));
}
var changeScreenName = function(screenName)
{
    $("#screenName").text(screenName);
}
var audioPlay = function()
{
    audio.play();
}
var audioMute = function()
{
    audio.muted = true;
}
var audioUnmute = function()
{
    audio.muted = false;
}
var audioPause = function()
{
    audio.pause();
}
var audioStop = function()
{
    audio.pause();
    audioProgress2 = audioProgress;
    //audio.currentTime = 0;
}
var audioReplay = function()
{
    audio.pause();
    audio.currentTime = 0;
    audioPlay();
}
var resetAnimation = function()
{
    seriesOfImagesIndex = 0;

    $(".imgContainer").each(function(){
        $(this).attr("src",$(this).data("default"));
    });
    $(".hideElement").each(function(){
        $(this).css({opacity:0.25});
    });
    $(".wow").each(function(){
        $(this).removeClass($(this).data("animation"));
        if($(this).hasClass("hideElement"))
        {
            $(this).css({opacity:0.25});
        }
    });

    $(".addAnimation").each(function(a){
        $(this).removeClass($(this).data("animation"));
        if($(this).hasClass("hideElement"))
        {
            $(this).css({opacity:0.25});
        }
    });
}
var playAnimation = function()
{
    $(".addAnimation.imgContainer").data("timing",$(".seriesOfImages img").eq(seriesOfImagesIndex).data("timing"));
    $(".addAnimation.imgContainer").data("animation",$(".seriesOfImages img").eq(seriesOfImagesIndex).data("animation"));

    // Disabled for now
    /*if($(".seriesOfImages img").eq(seriesOfImagesIndex).data("exit-timing"))
    {
        $(".addAnimation.imgContainer").data("timing",$(".seriesOfImages img").eq(seriesOfImagesIndex).data("exit-timing"));
        $(".addAnimation.imgContainer").data("animation",$(".seriesOfImages img").eq(seriesOfImagesIndex).data("exit-animation"));
    }*/

    $(".addAnimation").each(function(a){
        var currentElementAnimating = null;
        var elementExitAnimating = null;
        var currentImageAnimating = null;
        var imageExitAnimating = null;

        if(audio.currentTime >= parseFloat($(this).data("timing")) && audio.currentTime <= parseFloat($(this).data("timing") + 0.5))
        {
            currentElementAnimating = $(this);
            currentElementAnimating.css({opacity:1});
            currentElementAnimating.addClass($(this).data("animation"));

            //scrollTop = scrollTop + 30;

            //$("body").scrollTop(scrollTop);

            if($(this).hasClass("imgContainer"))
            {

                $(this).attr("src",$(".seriesOfImages img").eq(seriesOfImagesIndex).attr("src"));
                $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(".seriesOfImages img").each(function(){
                        $(currentElementAnimating).removeClass($(this).data("animation"));
                    });
                });
                seriesOfImagesIndex = (seriesOfImagesIndex < $(".seriesOfImages img").length) ? (seriesOfImagesIndex + 1) : seriesOfImagesIndex;
            }
            else
            {
                $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass($(this).data("animation"));
                });
            }
        }
        if(audio.currentTime >= parseFloat($(this).data("exit-timing")) && audio.currentTime <= parseFloat($(this).data("exit-timing") + 0.5))
        {
            elementExitAnimating = $(this);
            elementExitAnimating.css({opacity:1});
            elementExitAnimating.addClass($(this).data("exit-animation"));

            // Disabled for now
            /*if($(this).hasClass("imgContainer"))
            {
                $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(".seriesOfImages img").each(function(){
                        $(elementExitAnimating).removeClass($(this).data("exit-animation"));
                    });
                });
            }
            else
            {
                $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass($(this).data("exit-animation"));
                });
            }*/
            $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass($(this).data("exit-animation"));
                if(elementExitAnimating.hasClass("hideElement"))
                {
                    elementExitAnimating.css({opacity:0.25});
                }
            });
        }
    });

    if(self != top)
    {
        if((window.location.href).search("quiz") < 0)
        {
            if((parseInt((audio.currentTime / audio.duration) * 100) >= audioProgress))
            {
                audioProgress = parseInt((audio.currentTime / audio.duration) * 100);
            }
            parent.showPageProgress();
        }
        else
        {
            if((parseInt((audio.currentTime / audio.duration) * 100) >= audioProgress))
            {
                audioProgress = parseInt((audio.currentTime / audio.duration) * 100) - 1;
            }
            parent.showPageProgress();
        }
    }
}
function addResetBtn()
{
    /*
    $("#pageWrapper").append("<div id='resetScreenBtn'><span class='glyphicon glyphicon-refresh'></span></div>");
    $("#resetScreenBtn").off("click").on("click",function(){
        resetAnimation();
        audioReplay();
        if(self != top)
        {
            parent.showPauseBtn();
        }
    });
    */
}
var videoPlay = function()
{
    if($("#video video").length > 0)
    {
        video.play();
    }
}
var videoPause = function()
{
    if($("#video video").length > 0)
    {
        video.pause();
    }
}
var videoStop = function()
{
    if($("#video video").length > 0)
    {
        video.pause();
        video.currentTime = 0;
    }
}
var onYouTubeIframeAPIReady = function() {
    player = new YT.Player('ytVideo', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
var onPlayerReady = function(event) {
    //document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
}
var onPlayerStateChange = function(event) {
    if(event.data == 0)
    {
        // video finish
        parent.setWhenAudioIsFinish();
        audioStop();
        audio.currentTime = 0;
        if(self != top)
        {
            parent.showPlayBtn();
        }
    }
    else if(event.data == 1)
    {
        // Video started
        pauseYTVideo = function()
        {
            player.pauseVideo();
        }
        stopYTVideo = function()
        {
            player.stopVideo();
        }
        audioStop();
        audio.currentTime = 0;
        if(self != top)
        {
            parent.showPlayBtn();
        }
    }
}
var addMenuEvent = function(elem,txt,event,bol)
{
    switch(event){
        case "mousedown":
            $(elem).mousedown(function(){
                bol = true;

                setTimeout(function(){
                    if(bol)
                    {
                        setHintBox(glossary[txt]);
                    }
                },3000);
            });
            $(elem).mouseup(function(){
                bol = false;
                $("#hintText").text("");
                $("#hintBox").hide();
            });
            break;
        case "hover":
            elem.hover(function(){
                bol = true;
                if(bol)
                {
                    setHintBox(glossary[txt]);
                }
            },function(){
                bol = false;
                $("#hintText").text("");
                $("#hintBox").hide();
            });
            break;
    }
}
var setBodyContainer = function()
{
    var headerContainerHeight = $("#headerContainer").height() ? parseInt($("#headerContainer").height()) + parseInt($("#headerContainer").css("margin-bottom")) : 0;
    var bodyContainerHeight = $("#bodyContainer").height() ? $("#bodyContainer").height() : 0;
    
    $("#bodyContainer").css({minHeight: ((winHeight - headerContainerHeight) + "px")});
}
var setWinHeightByPercent = function()
{
    $(".percentByHeight").each(function(){
        if($(window).width() > 1024 && $(this).data("desktop-height") != undefined) // Desktop
        {
            $(this).css({minHeight: ((winHeight * ($(this).data("desktop-height") * 0.01)) + "px")});
        }
        else if($(window).width() <= 1024 && $(window).width() > 767 && $(this).data("tablet-height") != undefined) // Tablet
        {
            $(this).css({minHeight: ((winHeight * ($(this).data("tablet-height") * 0.01)) + "px")});
        }
        else if($(window).width() <= 766 && $(window).width() >= 480 && $(this).data("mobile-height") != undefined) // Mobile
        {
            $(this).css({minHeight: ((winHeight * ($(this).data("mobile-height") * 0.01)) + "px")});
        }
        
        // Applicable in any size
        if($(this).data("height") != undefined)
        {
            $(this).css({minHeight: ((winHeight * ($(this).data("height") * 0.01)) + "px")});
        }
    });
}
var setSameHeight = function()
{
    $(".setSameHeight").each(function(){
        $(this).data("base");
        $(this).height($($(this).data("base")).height());
    });
    setWinHeightByPercent();
    stretchImg();
}
var stretchImg = function()
{
    $(".stretchImgContainer").each(function(){
        var imgSrc = ($(this).find("img")).attr("src");
        //var imgHeight = $(this).parent().parent().height();
        var imgHeight = $(this).parent().height();
        $(this).find("img").hide();
        $(this).attr("style",("background-image: url('" + imgSrc + "'); background-size: cover; background-position: 50% 50%; background-repeat: no-repeat; height: " + imgHeight + "px"));
    });
}
var manageManifier = function(evt)
{
    var obj = new Object();
    obj.x = 0;
    obj.y = 0;
    
    if(evt.offsetX <= ((previewElemWidth * percentMagnifierSize) / 2))
    {
        obj.x = 0;
    }
    else if(evt.offsetX >= (magnifyImgWidth - ((previewElemWidth * percentMagnifierSize) / 2)))
    {
        obj.x = (previewImgWidth - previewElemWidth) * -1;
    }
    else
    {
        obj.x = ((evt.offsetX / percentMagnifierSize) - (previewElemWidth) / 2) * -1;
    }
    
    if(evt.offsetY <= (magnifyImgHeight - (magnifyImgHeight - (previewElemHeight * percentMagnifierSize) / 2)))
    {
        obj.y = 0;
    }
    else if(evt.offsetY >= (magnifyImgHeight - ((previewElemHeight * percentMagnifierSize) / 2)))
    {
        obj.y = (previewImgHeight - previewElemHeight) * -1;
    }
    else
    {
        obj.y = ((evt.offsetY / percentMagnifierSize) - (previewElemHeight) / 2) * -1;
    }
    
    return obj;
}
var setSeeMoreBtn = function()
{
    $("#seeMoreBtn").off("click").on("click",function(){
        $("html,body").animate({scrollTop: ((($(window).scrollTop() + parent.$("#pageContent").height())  - 50) + "px")});
    });
    
    $(window).off("scroll").on("scroll",function(){
        $("#seeMoreBtn").hide();
        setTimeout(function(){
            scrollingLength = Math.round($(window).scrollTop() + $(window).height());
            docHeight = ($(document).height());
            
            if(scrollingLength <= (docHeight - (docHeight * 0.05)))
            {
                $("#seeMoreBtn").fadeIn();
            }
            else
            {
                $("#seeMoreBtn").hide();
            }
        },1000)
    });
    scrollingLength = Math.round($(window).scrollTop() + $(window).height());
    docHeight = ($(document).height());
    if(scrollingLength <= (docHeight - (docHeight * 0.05)))
    {
        $("#seeMoreBtn").fadeIn();
    }
    else
    {
        $("#seeMoreBtn").hide();
    }
}
var createCounter = function()
{
    var initTime = 10;
    if(timer)
    {
        clearInterval(timer);
    }
    timer = setInterval(function(){
        initTime = initTime - 1;
        $("#quizCounterNumber").text(initTime);
        if(initTime <= 0)
        {
            $("#quizTimeIsUp").show();
            clearInterval(timer);
        }
    }, 1000);
}
var startTimer = function(){
    time = new Date();

    if(!answered)
    {
        createCounter();
    }
}
var setupCorrectResponses = function(str)
{
    var txt = (new RegExp(/\w\) /)).test(str) ?  str.replace(/\w\) /,"") : str;
    txt = txt.trim();
    txt = txt.replace(/\s/g,"_")
    return txt;
}
var revealAnswer = function()
{
    if(answered)
    {
        if(answer == "correct")
        {
            $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-star");
            $("#iconIndicator .checkXmarkIcon").addClass("glyphicon-ok");
            $("#iconIndicator .checkXmarkIcon").css({opacity:1,backgroundColor:"#73A142"});

            $(".radioBtn .quizSelect").each(function(){
                if($(this).val() == "correct")
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-ok");
                    $(this).prev().css({opacity:1,backgroundColor:"#73A142"});
                }
            });
            $(".checkboxesBtn .quizSelect").each(function(){
                if($(this).val() == "correct")
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-ok");
                    $(this).prev().css({opacity:1,backgroundColor:"#73A142"});
                }
            });
        }
        else
        {
            $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-star");
            $("#iconIndicator .checkXmarkIcon").addClass("glyphicon-remove");
            $("#iconIndicator .checkXmarkIcon").css({opacity:1,backgroundColor:"#75160D"});

            $(".radioBtn .quizSelect").each(function(){
                if($(this).val() == "correct")
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-ok");
                    $(this).prev().css({opacity:1,backgroundColor:"#73A142"});
                }
                else
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-remove");
                    $(this).prev().css({opacity:1,backgroundColor:"#75160D"});
                }
            });
            $(".checkboxesBtn .quizSelect").each(function(){
                if($(this).val() == "correct")
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-ok");
                    $(this).prev().css({opacity:1,backgroundColor:"#73A142"});
                }
                else
                {
                    $(this).prev().removeClass("glyphicon-star");
                    $(this).prev().addClass("glyphicon-remove");
                    $(this).prev().css({opacity:1,backgroundColor:"#75160D"});
                }
            });
        }

        if($(".draggable").length > 0)
        {
            if(numCorrect == $(".droppable").length)
            {
                $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-star");
                $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-remove");
                $("#iconIndicator .checkXmarkIcon").addClass("glyphicon-ok");
                $("#iconIndicator .checkXmarkIcon").css({opacity:1,backgroundColor:"#73A142"});
            }
            else
            {
                $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-star");
                $("#iconIndicator .checkXmarkIcon").removeClass("glyphicon-ok");
                $("#iconIndicator .checkXmarkIcon").addClass("glyphicon-remove");
                $("#iconIndicator .checkXmarkIcon").css({opacity:1,backgroundColor:"#75160D"});
            }
        }

        $(".droppable").each(function(){

            $(this).next().removeClass("glyphicon-star");

            if($(this).data("result") == "correct")
            {
                $(this).next().removeClass("glyphicon-remove");
                $(this).next().addClass("glyphicon-ok");
                $(this).next().css({opacity:1,backgroundColor:"#73A142"});
            }
            else
            {
                $(this).next().removeClass("glyphicon-ok");
                $(this).next().addClass("glyphicon-remove");
                $(this).next().css({opacity:1,backgroundColor:"#75160D"});
            }
        });

        $(".dropDownSelection").each(function(){

            if($(this).val() == "true")
            {
                $(this).parent().prev().find("i").removeClass("glyphicon-remove");
                $(this).parent().prev().find("i").addClass("glyphicon-ok");
                $(this).parent().prev().find("i").css({opacity:1,backgroundColor:"#73A142"});
            }
            else
            {
                $(this).parent().prev().find("i").removeClass("glyphicon-ok");
                $(this).parent().prev().find("i").addClass("glyphicon-remove");
                $(this).parent().prev().find("i").css({opacity:1,backgroundColor:"#75160D"});
            }
        });

    }
    //$("#prevPage").hide();
}
var shuffleArray = function(a)
{
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
var shuffleAnswer= function()
{
    var arryMultiChoice = new Array();
    var arryDragAndDrop = new Array();
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if(!$("#choice").hasClass("mapQuiz"))
    {
        for(var i = 0; i < $("#choice .radioBtn").children().length; i++)
        {
            arryMultiChoice.push($($("#choice .radioBtn").children()[i]));
        }
        for(var i = 0; i < $("#choice .checkboxesBtn").children().length; i++)
        {
            arryMultiChoice.push($($("#choice .checkboxesBtn").children()[i]));
        }
        $("#choice .radioBtn").empty();
        shuffleArray(arryMultiChoice);

        for(var i = 0; i < arryMultiChoice.length; i++)
        {
            $(arryMultiChoice[i]).find("label").text((letters.charAt(i) + ") " + $(arryMultiChoice[i]).find("label").text().replace(/\w\) /,"")));
            if($("#choice .radioBtn").length > 0)
            {
                $("#choice .radioBtn").append(arryMultiChoice[i]);
            }
            else if($("#choice .checkboxesBtn").length > 0)
            {
                $("#choice .checkboxesBtn").append(arryMultiChoice[i]);
            }
        }
    }
    for(var i = 0; i < $("#dragAndDrop .draggable").children().length; i++)
    {
        arryDragAndDrop.push($("#dragAndDrop .draggable").eq(i).data("draggable"));
    }
    $("#choice .checkboxesBtn").empty();

    shuffleArray(arryDragAndDrop);

    for(var i = 0; i < arryDragAndDrop.length; i++)
    {
        for(var j = 0; j < $("#dragAndDrop .dragElemWrapper").length; j++)
        {
            if($("#dragAndDrop .dragElemWrapper").eq(j).hasClass(arryDragAndDrop[i]))
            {
                $("#dragAndDrop .dragElemWrapper").eq(j).removeClass(arryDragAndDrop[i])
            }
        }
    }
    for(var i = 0; i < $("#dragAndDrop .dragElemWrapper").length; i++)
    {
        $("#dragAndDrop .dragElemWrapper").eq(i).addClass(arryDragAndDrop[i])
    }

}
var resetQuizPage= function()
{
    answered = false;
    gainScore = false;
    doneAnswering = false;
    numCorrect = 0;

    /*$(".dropDownSelection").each(function(){
        $(this).find("option:first").attr('selected','selected');
    });*/
    $("#quizTimeIsUp").hide();
    clearInterval(timer);
    timer = null;
    createCounter();
    $("input[type=radio]").each(function(){
        $(this).attr("checked",false);
    });
    $("input[type=checkbox]").each(function(){
        $(this).attr("checked",false);
    });
    $(".draggable").each(function(){
        $(this).css({padding:"5px"});
        $(".droppable").attr("data-result","incorrect");
        $(this).appendTo(("." + $(this).data("draggable")));
    });
    $(".droppable").each(function(){
        $(this).attr("data-result","incorrect");
    });
    $(".mapQuiz .iconRadioLabel").each(function(){
        $(this).css({backgroundColor: "#E6E7E8"});
    });
}
var sliderIndicatorDot = function(sliderObj, index)
{
    $(sliderObj).find(".sliderIndicator span").each(function(){
        $(this).removeClass("active");
    });
    $(sliderObj).find(".sliderIndicator span").eq(index).addClass("active");
}