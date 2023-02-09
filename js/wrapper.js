"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
const SCORM = (typeof SCORM2004_Initialize === "function");
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
var courseGated;
let company;
let companyLogo;
let courseName;
let retrieveNumOfAttempt;
let retrieveScore;
let shuffleAnswer;
let setSCORMcompleteAtTheLastPage;
let passingGrade;
let maxScore;
let minScore;
var pages = [];
var spagePages = [];
var courseVolume = 0;
var pdfPath = "./pdf/";
var audioPath = "../media/audio/";
var videoPath = "./media/video/";
var ccOpen = false;
var playPageAudio = true;
var muteCourse = false;
let videoPlayed = '';
let quizes = [];
let coursePass = false;
let quizPageIndex = 0;
let quizNames = null;
let pageNames = null;
let totalQuestions = 10;
let scorePercent = 0;
let student = "";
let courseStart = false;
let pageProgress = 0;
let scaledScore = 0;
let processedUnload = false;
let startTimeStamp = null;
let numOfAttempt = 1;
let repeatCourse = false;
let suspendData = null;
let wrapperObj = {
    student: student,
    currentPage: 0,
    score: 0,
    pageProgress: 0,
    numOfAttempt: numOfAttempt,
};
var initScorm = (json) => {
    // keeping this "if" statement for future use
    if (SCORM && !courseStart) {
        SCORM2004_Initialize();
        startTimeStamp = new Date();
        // let continueCourse = null;
        let completionStatus = SCORM2004_GetStatus();
        suspendData = SCORM2004_GetDataChunk() ? JSON.parse(SCORM2004_GetDataChunk()) : wrapperObj;
        /* if (completionStatus == null) {
            // set it to 4 (LESSON_STATUS_INCOMPLETE) rather than 6 (LESSON_STATUS_NOT_ATTEMPTED)
            SCORM2004_SetObjectiveStatus(SCORM2004_FindObjectiveIndexFromID(json.objectiveID), 4)
        } */
        wrapperObj.student = SCORM2004_GetStudentName();
        if (retrieveScore) {
            wrapperObj.score = SCORM2004_GetScore() ? SCORM2004_GetScore() : 0;
        }
        else {
            wrapperObj.score = 0;
        }
        if (retrieveNumOfAttempt) {
            numOfAttempt = suspendData.numOfAttempt >= 3 ? 3 : suspendData.numOfAttempt;
            wrapperObj.numOfAttempt = suspendData.numOfAttempt;
        }
        scaledScore = wrapperObj.score / maxScore;
        SCORM2004_SetScore(0, json.maxScore, json.minScore);
        // const courseName = document.getElementById('course-name-txt') as HTMLElement;
        // courseName.innerText = json.courseName;
        if (parseInt(SCORM2004_GetBookmark()) > 0) {
            loadResumeRestart(json);
        }
        else {
            loadPages(json);
        }
    }
};
var loadResumeRestart = (json) => {
    let continueCourse = confirm("Would you like to continue on where you left?");
    const pagesAry = ((document.getElementById('page-names').innerText).split(',')).map((val) => { return val.trim(); });
    if (continueCourse) {
        const page = parseInt(SCORM2004_GetBookmark());
        if (page == (pagesAry.length - 1)) {
            wrapperObj.currentPage = (pagesAry.length - 1);
        }
        else if (page >= 1 && page < pagesAry.length) {
            wrapperObj.currentPage = 1;
        }
        else if (page <= 0) {
            wrapperObj.currentPage = 1;
        }
        else {
            // just giving a fallback
            wrapperObj.currentPage = 1;
        }
        loadPages(json);
    }
    else {
        wrapperObj.currentPage = 0;
        loadPages(json);
    }
    // reserve code...
    /* const resumeRestartWrap = document.getElementById('resume-restart-wrap') as HTMLElement;
    const loader = document.getElementById('content-loader') as HTMLElement;
    loader.classList.add('d-none');
    resumeRestartWrap.classList.remove('d-none');

    // the user choose to resume the course
    (document.getElementById('resume-btn') as HTMLElement).addEventListener('click', () => {
        const page = parseInt(SCORM2004_GetBookmark());
        if(page == (json.pages.length - 1)) {
            wrapperObj.currentPage = (json.pages.length - 1);
        } else if(page >= 1 && page < json.pages.length) {
            wrapperObj.currentPage = 1;
        } else if(page <= 0) {
            wrapperObj.currentPage = 1;
        } else {
            // just giving a fallback
            wrapperObj.currentPage = 1;
        }
        loadPages(json);
        loader.classList.remove('d-none');
        resumeRestartWrap.classList.add('d-none');
    });

    // the user choose to restart the course
    (document.getElementById('restart-btn') as HTMLElement).addEventListener('click', () => {
        wrapperObj.currentPage = 0;
        loadPages(json);
        loader.classList.remove('d-none');
        resumeRestartWrap.classList.add('d-none');
    }); */
};
var lastPageInfo = () => {
    // reserve code...
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    if (iframe.getAttribute('data-id') == 'last-page') {
        scorePercent = Math.round((wrapperObj.score / maxScore) * 100);
        if (iframeDoc.getElementById('scored'))
            iframeDoc.getElementById('scored').innerText = (wrapperObj.score).toString();
        if (iframeDoc.getElementById('accuracy'))
            iframeDoc.getElementById('accuracy').innerText = `${scorePercent}%`;
        if (iframeDoc.getElementById('attempts'))
            iframeDoc.getElementById('attempts').innerText = (numOfAttempt).toString();
        if (iframeDoc.getElementById('fail-notification'))
            iframeDoc.getElementById('fail-notification').classList.add('d-none');
        if (iframeDoc.getElementById('pass-notification'))
            iframeDoc.getElementById('pass-notification').classList.add('d-none');
        if (iframeDoc.getElementById('retake-btn'))
            iframeDoc.getElementById('retake-btn').classList.add('d-none');
        if (iframeDoc.getElementById('review-btn'))
            iframeDoc.getElementById('review-btn').classList.add('d-none');
    }
    if (scorePercent >= passingGrade) {
        coursePass = true;
        if (iframeDoc.getElementById('pass-notification'))
            iframeDoc.getElementById('pass-notification').classList.remove('d-none');
        if (iframeDoc.getElementById('review-btn'))
            iframeDoc.getElementById('review-btn').classList.remove('d-none');
    }
    else {
        if (iframeDoc.getElementById('fail-notification'))
            iframeDoc.getElementById('fail-notification').classList.remove('d-none');
        if (numOfAttempt <= 2) {
            if (iframeDoc.getElementById('retake-btn'))
                iframeDoc.getElementById('retake-btn').classList.remove('d-none');
        }
    }
};
var setLastPage = () => {
    lastPageInfo();
    setSCORMcomplete();
};
var retakeCourse = () => {
    wrapperObj.score = 0;
    numOfAttempt = numOfAttempt >= 3 ? 3 : (numOfAttempt + 1);
    wrapperObj.numOfAttempt = numOfAttempt;
    repeatCourse = true;
    quizPageIndex = 0;
    pages.forEach((val, index) => {
        const iframe = document.querySelectorAll('#page-content .page')[index];
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        const audio = iframeDoc.getElementById('audio');
        iframeWin.pageFinish = false;
        iframeWin.audioPlayed = false;
        iframeWin.resetAnimation();
        iframeWin.stopAudio();
        if (iframe.getAttribute('data-type') == 'quiz' && iframe.getAttribute('data-id') !== 'last-page') {
            iframeWin.resetQuizPage();
            if (shuffleAnswer) {
                iframeWin.shuffleQuizAnswer();
            }
        }
    });
    gotoFistQuizPage();
};
var gotoFistQuizPage = () => {
    quizPageIndex = 0;
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].pageName == quizes[quizPageIndex].pageName) {
            wrapperObj.currentPage = i;
            break;
        }
    }
    setPageWhenGettingOut();
    setPage();
};
var addScore = () => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    wrapperObj.score += iframeDoc.querySelector('.page-info-txt[data-info="score"]') ? parseFloat((iframeDoc.querySelector('.page-info-txt[data-info="score"]').innerText).trim()) : 0;
    wrapperObj.score = wrapperObj.score >= 99 ? 100 : Math.round(wrapperObj.score);
    if (SCORM && courseStart) {
        SCORM2004_SetScore(wrapperObj.score, maxScore, minScore);
    }
};
var doUnload = (strExitType = 'suspend') => {
    // don't call this function twice
    if (processedUnload == true) {
        return;
    }
    processedUnload = true;
    //record the session time
    var endTimeStamp = new Date();
    var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
    SCORM2004_CallSetValue("cmi.exit", strExitType.toUpperCase());
    SCORM2004_CallSetValue("adl.nav.request", "exitAll");
    SCORM2004_SaveTime(totalMilliseconds);
    SCORM2004_CallTerminate();
};
var closeCourse = (strExitType = 'suspend') => {
    setSCORMcomplete();
    if (SCORM && courseStart) {
        doUnload(strExitType);
    }
};
var setSCORMvalues = () => {
    if (SCORM && courseStart) {
        SCORM2004_SetDataChunk(JSON.stringify(wrapperObj));
    }
};
var setSCORMcomplete = () => {
    if (SCORM && courseStart) {
        wrapperObj.pageProgress = (pageProgress / pages.length * 100);
        setSCORMvalues();
        if (setSCORMcompleteAtTheLastPage) {
            SCORM2004_SetPassed();
        }
        else if (wrapperObj.score >= passingGrade) {
            SCORM2004_SetPassed();
        }
        else {
            // SCORM2004_SetFailed();
            WriteToDebug("In SCORM2004_SetFailed");
            SCORM2004_CallSetValue("cmi.success_status", SCORM2004_FAILED);
            SCORM2004_CallSetValue("cmi.completion_status", SCORM2004_INCOMPLETE);
        }
    }
};
var setCMIInteractions = (settings) => {
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
    if (SCORM) {
        // keeping this for now
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".id"), obj.id);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".type"), obj.type);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".objectives.0.id"), obj.objectives);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".timestamp"), obj.timestamp);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".correct_responses.0.pattern"), obj.correctResponses);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".weighting"), obj.weighting);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".learner_response"), obj.learnerResponse);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".result"), obj.result);
        //SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".latency"),obj.latency);
        SCORM2004_CallSetValue(("cmi.interactions." + obj.num + ".description"), obj.description);
    }
};
var getInteractionsCount = () => {
    var num = 0;
    if (SCORM) {
        num = SCORM2004_CallGetValue("cmi.interactions._count");
    }
    return num;
};
var setCMIInteractionsLatency = (count, response, result, time) => {
    if (SCORM) {
        // keeping this for now
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".learner_response"), response);
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".result"), result);
        SCORM2004_CallSetValue(("cmi.interactions." + count + ".latency"), ConvertMilliSecondsIntoSCORM2004Time(time));
    }
};
var getInteractionWeighting = (strInteractionID) => {
    if (SCORM) {
        SCORM2004_GetInteractionWeighting(strInteractionID);
    }
};
var setPageWhenGettingOut = () => {
    const currentPage = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const contentWindow = currentPage.contentWindow;
    // reserve code...
    /* if(typeof currentPageContentWindow.pageReset === 'function') {
        // use this is you want to reset the page and start from the start everytime you get back to it
        currentPageContentWindow.pageReset();
    } */
    if (typeof contentWindow.audioPause === 'function') {
        contentWindow.audioPause();
    }
    if (currentPage.getAttribute('data-type') == 'quiz' && contentWindow.pageFinish && wrapperObj.currentPage != (pages.length - 1)) {
        contentWindow.showResponseReview();
    }
    Array.prototype.forEach.call((document.querySelectorAll('#page-content .page')), function (el, i) {
        const iframe = el;
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        if (iframe.classList.contains('active')) {
            iframe.classList.remove('active');
        }
    });
};
var showPlayBtn = () => {
    document.getElementById('pause-btn').parentNode.classList.add('d-none');
    document.getElementById('play-btn').parentNode.classList.remove('d-none');
};
var showPauseBtn = () => {
    document.getElementById('pause-btn').parentNode.classList.remove('d-none');
    document.getElementById('play-btn').parentNode.classList.add('d-none');
};
var nextPage = () => {
    if (courseStart) {
        const iframePages = document.querySelectorAll('#page-content .page');
        const currentPage = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const currentPageContentWindow = currentPage.contentWindow;
        let jumpToPage = () => {
            // reserve code..
        };
        setPageWhenGettingOut();
        wrapperObj.currentPage += 1;
        jumpToPage();
        setPage();
        currentPage.focus();
    }
};
var prevPage = () => {
    if (courseStart) {
        const iframePages = document.querySelectorAll('#page-content .page');
        const currentPage = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const currentPageContentWindow = currentPage.contentWindow;
        let jumpToPage = () => {
            // reserve code..
        };
        setPageWhenGettingOut();
        wrapperObj.currentPage -= 1;
        jumpToPage();
        setPage();
        currentPage.focus();
    }
};
var showCertainPage = (id) => {
    const currentPage = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const currentPageContentWindow = currentPage.contentWindow;
    setPageWhenGettingOut();
    pages.forEach((element, index) => {
        if (element.pageName == id) {
            wrapperObj.currentPage = index;
            return false;
        }
    });
    setPage();
};
var setVolume = () => {
    // reserve code
    /* const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage] as HTMLIFrameElement;
    const iframeWin = (<any>iframe.contentWindow);
    const volumeIcon = document.getElementById('header-footer-icon') as HTMLElement;
    const volumeSlider = (document.getElementById('volume-slider') as HTMLInputElement);
    let setVolumeIcon = (value:number) => {
        if(value <= 0) {
            if(volumeIcon.classList.contains('bi-volume-down-fill')) {
                volumeIcon.classList.remove('bi-volume-down-fill');
            } else if(volumeIcon.classList.contains('bi-volume-up-fill')) {
                volumeIcon.classList.remove('bi-volume-up-fill');
            }
            volumeIcon.classList.add('bi-volume-off-fill');
        } else if (value > 0 && value <= 25) {
            if(volumeIcon.classList.contains('bi-volume-off-fill')) {
                volumeIcon.classList.remove('bi-volume-off-fill');
            } else if(volumeIcon.classList.contains('bi-volume-up-fill')) {
                volumeIcon.classList.remove('bi-volume-up-fill');
            }
            volumeIcon.classList.add('bi-volume-down-fill');
        } else if(value >= 75) {
            if(volumeIcon.classList.contains('bi-volume-off-fill')) {
                volumeIcon.classList.remove('bi-volume-off-fill');
            } else if(volumeIcon.classList.contains('bi-volume-down-fill')) {
                volumeIcon.classList.remove('bi-volume-down-fill');
            }
            volumeIcon.classList.add('bi-volume-up-fill');
        }
    };
    volumeSlider.style.background = `linear-gradient(to right, #8db305 0%, #8db305 ${volumeSlider.value} %, #cccccc ${volumeSlider.value}%, #cccccc 100%)`;
    volumeSlider.oninput = (e:Event | any) => {
        let elem = e.target;
        let value = (elem.value - elem.min) / (elem.max - elem.min);
        courseVolume = value;
        elem.style.background = `linear-gradient(to right, #8db305 0%, #8db305 ${(value * 100)}%, #cccccc ${(value * 100)}%, #cccccc 100%)`;
        setVolumeIcon(Math.round((courseVolume * 100)));
        if(iframeWin.setPageVolume) {
            iframeWin.setPageVolume(courseVolume);
        }
      };
    setVolumeIcon(Math.round(parseInt(volumeSlider.value))); */
};
var disablePrevBtn = () => {
    if (prevBtn.classList.contains('active')) {
        prevBtn.classList.remove('active');
        prevBtn.setAttribute('aria-hidden', 'true');
        prevBtn.setAttribute('disabled', 'true');
    }
    prevBtn.removeEventListener('click', prevPage);
};
var enablePrevBtn = () => {
    if (!prevBtn.classList.contains('active') && courseStart) {
        prevBtn.classList.add('active');
        prevBtn.setAttribute('aria-hidden', 'false');
        prevBtn.removeAttribute('disabled');
    }
    prevBtn.removeEventListener('click', prevPage);
    prevBtn.addEventListener('click', prevPage);
};
var disableNextBtn = () => {
    if (nextBtn.classList.contains('active')) {
        nextBtn.classList.remove('active');
        nextBtn.setAttribute('aria-hidden', 'true');
        nextBtn.setAttribute('disabled', 'true');
    }
    nextBtn.removeEventListener('click', nextPage);
};
var enableNextBtn = () => {
    if (!nextBtn.classList.contains('active') && courseStart) {
        nextBtn.classList.add('active');
        nextBtn.setAttribute('aria-hidden', 'false');
        nextBtn.removeAttribute('disabled');
    }
    nextBtn.removeEventListener('click', nextPage);
    nextBtn.addEventListener('click', nextPage);
};
var resetScreen = () => {
    var _a, _b;
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    const audioBar = document.getElementById('audio-bar');
    if (iframeWin.pageReset) {
        iframeWin.pageReset();
    }
    audioBar.value = '0';
    if ((_b = (_a = document.getElementById('play-btn')) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList.contains('d-none')) {
        showPauseBtn();
        iframeWin.audioPlay();
    }
};
var showPageProgress = () => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    const pageAudio = iframeDoc.getElementById('audio');
    const resetBtn = document.getElementById('reset-screen-btn');
    const playBtn = document.getElementById('play-btn');
    const muteBtn = document.getElementById('mute-btn');
    const audioBar = document.getElementById('audio-bar');
    let timeProgress = pageAudio ? ((pageAudio.currentTime / pageAudio.duration) * 100) : 0;
    const setResetScreenEvent = () => {
        resetBtn.removeEventListener('click', resetScreen);
        resetBtn.addEventListener('click', resetScreen);
        if (courseGated && wrapperObj.currentPage < (pages.length - 1)) {
            enableNextBtn();
        }
    };
    if (!pageAudio) {
        setResetScreenEvent();
        resetBtn.setAttribute('disabled', 'disabled');
        playBtn.setAttribute('disabled', 'disabled');
        muteBtn.setAttribute('disabled', 'disabled');
        audioBar.value = '0';
        resetBtn.removeEventListener('click', resetScreen);
    }
    else {
        if (timeProgress == -1 || timeProgress == undefined) {
            timeProgress = 0;
        }
        audioBar.value = `${timeProgress}`;
        resetBtn.removeAttribute('disabled');
        playBtn.removeAttribute('disabled');
        muteBtn.removeAttribute('disabled');
        setResetScreenEvent();
    }
    /* if(iframeWin.pageFinish && !iframeWin.userReset) {
        setResetScreenEvent();
        resetBtn.style.opacity = '1';
        // audioBar.style.width = '100%';
        audioBar.value = '100';
    } else if(iframe.getAttribute('data-type') == 'quiz' && !pageAudio) {
        setResetScreenEvent();
        resetBtn.style.opacity = '0.25';
        // audioBar.style.width = '0%';
        audioBar.value = '0';
    } else {
        if(timeProgress == -1 || timeProgress == undefined)
        {
            timeProgress = 0;
        }
        // audioBar.style.width = `${timeProgress}%`;
        audioBar.value = `${timeProgress}`;
        if(!iframeWin.pageFinish) {
            resetBtn.style.opacity = '0.25';
            resetBtn.removeEventListener('click', resetScreen);
        }
    } */
};
var setQuizIndex = () => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeDoc = iframe.contentDocument;
    const quizIndex = quizes.findIndex(pg => pg.pageName === pages[wrapperObj.currentPage].pageName) + 1;
    const quizTotalPages = quizes.length - 1;
    if (iframeDoc.getElementById('quiz-index')) {
        iframeDoc.getElementById('quiz-index').innerHTML = `${quizIndex} of ${quizTotalPages}`;
    }
};
var showVideoModal = (vidFile) => {
    const myModal = new bootstrap.Modal(document.getElementById('video-modal'));
    const video = document.getElementById('wrapper-video');
    if (videoPlayed != vidFile) {
        video.pause();
        video.currentTime = 0;
        video.src = videoPath + vidFile;
        video.load();
        videoPlayed = vidFile;
    }
    video.disablePictureInPicture = true;
    document.getElementById('footer-controls-wrap').classList.remove('active');
    document.getElementById('prev-next-btn').classList.remove('active');
    document.getElementById('page-indicator').classList.remove('active');
    myModal.show();
    video.addEventListener('canplay', ()=> {
        video.play();
    })
};
var setPage = () => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const submitBtn = document.getElementById('wrapper-submit-btn');
    const pageIndicatorTxt = document.getElementById('page-indicator-txt');
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    if (SCORM && courseStart) {
        SCORM2004_SetBookmark((wrapperObj.currentPage).toString());
        setSCORMvalues();
    }
    if (iframeWin.initPage) {
        if (pages[wrapperObj.currentPage].opened) {
            showPlayBtn();
        }
        else {
            pages[wrapperObj.currentPage].opened = true;
            if (wrapperObj.currentPage > 0) {
                iframeWin.initPage();
            }
            if (playPageAudio && iframeDoc.getElementById('audio')) {
                showPauseBtn();
            }
            else if (!playPageAudio && iframeDoc.getElementById('audio')) {
                showPlayBtn();
            }
            else {
                if (iframe.getAttribute('data-type') == 'page') {
                    iframeWin.pageFinish = true;
                }
                showPlayBtn();
            }
        }
    }
    wrapperObj.pageProgress = Math.round(((pages.filter(page => page.opened == true)).length / pages.length) * 100);
    document.getElementById('progress-bar').style.width = `${Math.round(((pages.filter(page => page.opened == true)).length / pages.length) * 100)}%`;
    pageIndicatorTxt.innerHTML = `${(wrapperObj.currentPage + 1)}/${pages.length}`;
    if (courseStart) {
        if (wrapperObj.currentPage == (pages.length - 1)) {
            disableNextBtn();
            enablePrevBtn();
            setLastPage();
        } else if (wrapperObj.currentPage == 0) {
            disablePrevBtn();
            enableNextBtn();
        }
        else if (wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && !courseGated) {
            enablePrevBtn();
            enableNextBtn();
        }
        /* if (iframe.getAttribute('data-type') == 'quiz' && iframe.getAttribute('data-id') != 'last-page' && !iframeWin.pageFinish) {
            disableNextBtn();
            enablePrevBtn();
        }
        else if (wrapperObj.currentPage == 0 && courseGated && !iframeWin.pageFinish) {
            disablePrevBtn();
            disableNextBtn();
        }
        else if (wrapperObj.currentPage == 0 && courseGated && iframeWin.pageFinish ||
            wrapperObj.currentPage == 0 && !courseGated && !iframeWin.pageFinish ||
            wrapperObj.currentPage == 0 && !courseGated && iframeWin.pageFinish) {
            disablePrevBtn();
            enableNextBtn();
        }
        else if (wrapperObj.currentPage == (pages.length - 1)) {
            disableNextBtn();
            enablePrevBtn();
            setLastPage();
        }
        else if (wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && !courseGated) {
            enablePrevBtn();
            enableNextBtn();
        }
        else if (wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && courseGated && !iframeWin.pageFinish) {
            disableNextBtn();
            enablePrevBtn();
        }
        else if (wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && courseGated && iframeWin.pageFinish ||
            wrapperObj.currentPage > 0 && wrapperObj.currentPage < (pages.length - 1) && !courseGated && !iframeWin.pageFinish) {
            enablePrevBtn();
            enableNextBtn();
        } */
    }
    // (document.getElementById('unmute-btn') as HTMLDivElement).classList.add('d-none');
    // (document.getElementById('mute-btn') as HTMLDivElement).classList.remove('d-none');
    iframe.classList.add('active');
    /* if(ccOpen) {
        iframeDoc.getElementById('transcript').style.display = 'block';
    } else {
        iframeDoc.getElementById('transcript').style.display = 'none';
    } */
    setVolume();
    showPageProgress();
    if (iframeWin.setPageVolume) {
        iframeWin.setPageVolume(courseVolume);
    }
    if (muteCourse) {
        iframeWin.audioMute();
    }
    if ((iframe.getAttribute('data-type') == 'quiz' && !iframeDoc.body.getAttribute('data-quiz-type')) && !iframeWin.pageFinish && iframe.getAttribute('data-id') != 'last-page') {
        submitBtn.style.display = 'inline';
        setQuizIndex();
    }
    else {
        submitBtn.style.display = 'none';
    }
    iframeWin.setSeeMoreBtn();
    document.getElementById('transcript-show').innerHTML = iframeDoc.getElementById('transcript-text').innerHTML;
    // iframe.focus();
};
var loadPages = (json) => {
    const contentElem = document.getElementById('page-content');
    const pagesAry = ((document.getElementById('page-names').innerText).split(',')).map((val) => { return val.trim(); });
    const quizesAry = ((document.getElementById('quiz-pages').innerText).split(',')).map((val) => { return val.trim(); });
    let totalPages = 0;
    let pagesLoaded = 0;
    let allPagesLoaded = () => {
        var _a, _b;
        const courseLoaderWrap = document.getElementById('course-loader-wrap');
        const startCourse = () => {
            var _a, _b;
            const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
            const iframeWin = iframe.contentWindow;
            const iframeDoc = iframe.contentDocument;
            courseStart = true;
            document.getElementById('course-loader').style.display = 'none';
            document.querySelectorAll('.nav-footer-elems').forEach(val => {
                val.classList.add('active');
            });
            if (iframeDoc.getElementById('page-ready-wrap')) {
                iframeDoc.getElementById('page-ready-wrap').style.display = 'none';
            }
            if (playPageAudio && iframeDoc.getElementById('audio')) {
                showPauseBtn();
            }
            else if (!playPageAudio && iframeDoc.getElementById('audio')) {
                showPlayBtn();
            }
            if (iframeWin.initPage) {
                iframeWin.initPage();
                if (!courseGated) {
                    enableNextBtn();
                }
            }
            (_a = document.getElementById('page-content-wrap')) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'false');
            (_b = document.getElementById('audio-bar')) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-hidden', 'false');
            document.querySelectorAll('.control-btn-item').forEach((val) => {
                const elem = val;
                elem.setAttribute('aria-hidden', 'false');
            });
            disablePrevBtn();
            // iframe.focus();
        };
        courseLoaderWrap.innerHTML = `
            <div>
                <div id="dont-use-browser-nav">
                    <div id="dont-use-browser-nav-arrows">
                        <i aria-hidden="true" id="dont-use-browser-nav-left-arw" class="glyphicon bi-caret-up-fill biggest-font"></i>
                        <i aria-hidden="true" id="dont-use-browser-nav-right-arw" class="glyphicon bi-caret-up-fill biggest-font"></i>
                    </div>
                    <p aria-label="Do not use browser navigation controls" class="biggest-font">Do not use browser navigation controls</p>
                    <p aria-label="Recommended browsers: Edge or Chrome" class="biggest-font" style="font-weight: unset">Recommended browesers: Edge or Chrome</p>
                </div>
                <button id='start-with-audio' class="btn white click-here-to-start-btn" aria-label="click here to start with audio" type="button" tagindex="1">Click here to Start</button>
                <!-- <button id='start-without-audio' class="btn white click-here-to-start-btn" aria-label="click here to start without audio" type="button" tagindex="1">Click here to Start without Audio</button> -->
            </div>
            `;
        (_a = document.getElementById('start-with-audio')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            playPageAudio = true;
            document.getElementById('wrapper-transcript').style.display = "none";
            startCourse();
        });
        (_b = document.getElementById('start-without-audio')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
            playPageAudio = false;
            document.getElementById('wrapper-transcript').style.display = "block";
            startCourse();
        });
        setPage();
    };
    let generatePage = (name, index, type) => {
        let iframeElem = document.createElement('iframe');
        iframeElem.src = `./pages/${name}.html`;
        iframeElem.setAttribute('data-type', type);
        iframeElem.setAttribute('data-id', name);
        iframeElem.setAttribute('frameBorder', '0');
        iframeElem.setAttribute('title', `page ${index}`);
        iframeElem.setAttribute('aria-label', `page ${index}`);
        iframeElem.setAttribute('tabindex', `14`);
        iframeElem.className = 'page';
        contentElem.appendChild(iframeElem);
        contentElem.querySelectorAll('.page')[index].addEventListener('load', (e) => {
            var elem = e.target;
            var iframeWin = elem.contentWindow;
            var iframeBody = elem.contentDocument;
            pagesLoaded++;
            iframeWin.info.id = name;
            iframeWin.info.objectiveID = name;
            iframeWin.info.file = `./${name}.html`;
            iframeWin.info.title = iframeBody.querySelector('.page-info-txt[data-info="title"]') ? iframeBody.querySelector('.page-info-txt[data-info="title"]').innerText : name + ' title';
            iframeWin.info.description = iframeBody.querySelector('.page-info-txt[data-info="desc"]') ? iframeBody.querySelector('.page-info-txt[data-info="desc"]').innerText : name + ' description';
            iframeWin.info.company = company;
            iframeWin.info.companyLogo = companyLogo;
            iframeWin.info.courseName = courseName;
            if (iframeWin.setPageVolume) {
                iframeWin.setPageVolume();
            }
            if (iframeWin.pageSet) {
                iframeWin.pageSet();
            }
            if (pagesLoaded == totalPages) {
                allPagesLoaded();
            }
        });
    };
    let setPageForAry = (val, type) => {
        const page = {
            pageName: val,
            opened: false
        };
        if (type == 'specialPage') {
            spagePages.push(page);
        }
        else if (type == 'quiz') {
            quizes.push(page);
        }
        else {
            pages.push(page);
        }
    };
    company = json.company;
    companyLogo = json.companyLogo;
    courseName = json.courseName;
    courseGated = json.courseGated;
    retrieveNumOfAttempt = json.retrieveNumOfAttempt;
    retrieveScore = json.retrieveScore;
    shuffleAnswer = json.shuffleAnswer;
    setSCORMcompleteAtTheLastPage = json.setSCORMcompleteAtTheLastPage;
    passingGrade = json.passingGrade;
    maxScore = json.maxScore;
    minScore = json.minScore;
    pagesAry.forEach((val) => {
        if (val.length > 0)
            setPageForAry(val, 'page');
    });
    quizesAry.forEach((val) => {
        if (val.length > 0)
            setPageForAry(val, 'quiz');
    });
    totalPages = pages.length;
    pages.forEach((val, index) => {
        const qz = quizes.findIndex(pg => pg.pageName === val.pageName);
        const spg = spagePages.findIndex(pg => pg.pageName === val.pageName);
        if (qz >= 0) {
            generatePage(val.pageName, index, 'quiz');
        }
        else if (spg >= 0) {
            generatePage(val.pageName, index, 'specialPage');
        }
        else {
            generatePage(val.pageName, index, 'page');
        }
    });
};
var addAudioPosition = (num) => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    console.log(wrapperObj.currentPage, iframe);
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc.getElementById('audio')) {
        const audio = iframeDoc.getElementById('audio');
        const totalAudio = audio.duration;
        if ((audio.currentTime + num) < totalAudio) {
            iframeWin.audioPause();
            audio.currentTime += num;
            iframeWin.audioPlay();
            showPageProgress();
        }
    }
};
var subtractAudioPosition = (num) => {
    const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc.getElementById('audio')) {
        const audio = iframeDoc.getElementById('audio');
        const totalAudio = audio.duration;
        if ((audio.currentTime - num) > 0) {
            iframeWin.audioPause();
            audio.currentTime -= num;
            iframeWin.audioPlay();
            showPageProgress();
        }
    }
};
var focusSubmitBtn = () => {
    setTimeout(function () {
        var _a;
        (_a = document.getElementById('wrapper-submit-btn')) === null || _a === void 0 ? void 0 : _a.focus();
    }, 500);
};
if ((window.location.href).search('/pages') <= 0) {
    (_a = document.getElementById('audio-bar-container')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (evt) {
        var _a;
        const _this = this;
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        const elemWidth = (evt.target.getBoundingClientRect()).width;
        const cursorPositionPercentage = evt.offsetX / elemWidth;
        if (iframeDoc.getElementById('audio')) {
            const audio = iframeDoc.getElementById('audio');
            const totalAudio = audio.duration;
            iframeWin.audioPause();
            audio.currentTime = totalAudio * cursorPositionPercentage;
            if ((_a = document.getElementById('play-btn')) === null || _a === void 0 ? void 0 : _a.classList.contains('d-none')) {
                iframeWin.audioPlay();
            }
            showPageProgress();
        }
    });
    (_b = document.getElementById('wrapper-submit-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        const _this = this;
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc.getElementById('quiz-content')) {
            iframeWin.submitAnswer();
            if (iframeWin.pageFinish) {
                _this.style.display = 'none';
            }
        }
        if (courseGated && iframeWin.pageFinish) {
            enableNextBtn();
        }
    });
    (_c = document.getElementById('play-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc.getElementById('audio')) {
            iframeWin.audioPlay();
            playPageAudio = true;
            this.parentNode.classList.add('d-none');
            document.getElementById('pause-btn').parentNode.classList.remove('d-none');
        }
    });
    (_d = document.getElementById('pause-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc.getElementById('audio')) {
            iframeWin.audioPause();
            playPageAudio = false;
            this.parentNode.classList.add('d-none');
            document.getElementById('play-btn').parentNode.classList.remove('d-none');
        }
    });
    (_e = document.getElementById('mute-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        if (iframeWin.audioMute) {
            iframeWin.audioMute();
        }
        this.parentNode.classList.add('d-none');
        muteCourse = true;
        document.getElementById('wrapper-transcript').style.display = 'block';
        document.getElementById('unmute-btn').parentNode.classList.remove('d-none');
    });
    (_f = document.getElementById('unmute-btn')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        if (iframeWin.audioUnmute) {
            iframeWin.audioUnmute();
        }
        this.parentNode.classList.add('d-none');
        muteCourse = false;
        document.getElementById('mute-btn').parentNode.classList.remove('d-none');
    });
    (_g = document.getElementById('closed-caption-btn')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        /* if(iframeWin.showTranscipt) {
            iframeWin.showTranscipt();
        } */
        if (document.getElementById('wrapper-transcript').style.display == 'none') {
            $('#wrapper-transcript').fadeIn('fast');
        }
        else {
            document.getElementById('closed-caption-btn').blur();
            $('#wrapper-transcript').fadeOut('fast');
        }
    });
    (_h = document.getElementById('transcript-close-btn')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', function () {
        $('#wrapper-transcript').fadeOut('fast');
    });
    (_j = document.getElementById('audio-icon-btn')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', function () {
        $("#controls-btn").slideToggle("fast");
    });
    (_k = document.getElementById('index-btn')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', function () {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const submitBtn = document.getElementById('wrapper-submit-btn');
        const myModal = new bootstrap.Modal(document.getElementById('nav-overlay'));
        if (iframe.getAttribute('data-type') == 'quiz' && !iframeWin.pageFinish && iframe.getAttribute('data-id') != 'last-page') {
            submitBtn.style.display = 'none';
        }
        document.getElementById('footer-controls-wrap').classList.remove('active');
        document.getElementById('prev-next-btn').classList.remove('active');
        document.getElementById('page-indicator').classList.remove('active');
        myModal.show();
    });
    (_l = document.getElementById('nav-overlay')) === null || _l === void 0 ? void 0 : _l.addEventListener('hidden.bs.modal', function (e) {
        const iframe = document.querySelectorAll('#page-content .page')[wrapperObj.currentPage];
        const iframeWin = iframe.contentWindow;
        const submitBtn = document.getElementById('wrapper-submit-btn');
        if (iframe.getAttribute('data-type') == 'quiz' && !iframeWin.pageFinish && iframe.getAttribute('data-id') != 'last-page') {
            submitBtn.style.display = 'inline';
        }
        document.getElementById('footer-controls-wrap').classList.add('active');
        document.getElementById('prev-next-btn').classList.add('active');
        document.getElementById('page-indicator').classList.add('active');
    });
    (_m = document.getElementById('video-modal')) === null || _m === void 0 ? void 0 : _m.addEventListener('hidden.bs.modal', function (e) {
        const video = document.getElementById('wrapper-video');
        video.pause();
        document.getElementById('footer-controls-wrap').classList.add('active');
        document.getElementById('prev-next-btn').classList.add('active');
        document.getElementById('page-indicator').classList.add('active');
    });
    (_o = document.getElementById('video-modal')) === null || _o === void 0 ? void 0 : _o.addEventListener('hidden.bs.modal', function (e) {
        console.log('video modal closed');
        document.getElementById('footer-controls-wrap').classList.add('active');
        document.getElementById('prev-next-btn').classList.add('active');
        document.getElementById('page-indicator').classList.add('active');
    });
    (_p = document.querySelectorAll('.main-menu-link')) === null || _p === void 0 ? void 0 : _p.forEach((val, index) => {
        const elem = val;
        const myModal = new bootstrap.Modal(document.getElementById('nav-overlay'));
        elem.addEventListener('click', function () {
            const page = elem.getAttribute('data-page');
            showCertainPage(page);
            myModal.hide();
        });
    });
    document.addEventListener('keydown', function (evt) {
        const num = 1;
        const key = (evt.key).toLowerCase();
        switch (key) {
            case 'arrowright':
                addAudioPosition(num);
                break;
            case 'arrowleft':
                subtractAudioPosition(num);
                break;
        }
    });
}
