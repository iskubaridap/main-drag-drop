"use strict";
var _a, _b, _c;
// this is to prevent to execute in wrapper.js
if ((window.location.href).search('/pages') > 0) {
    var info = {
        id: '',
        file: '',
        title: '',
        description: '',
        company: '',
        companyLogo: '',
        courseName: '',
        lastUpdated: '',
    };
    var insideOfWrapper = self != top;
    var userReset = false;
    var pageFinish = false;
    var showPlayBtn = () => { };
    let seriesOfImagesIndex = 0;
    const hideElemOpacity = 0;
    const audio = document.getElementById('audio');
    if (!document.getElementById('page-info')) {
        alert('Please provide "Page Info"');
    }
    if (!document.getElementById('transcript-text-wrapper')) {
        alert('Please provide "Transcript Text"');
    }
    else {
        const transcriptContainer = document.createElement('div');
        transcriptContainer.id = 'transcript';
        transcriptContainer.classList.add('container-fluid');
        document.body.appendChild(transcriptContainer);
        transcriptContainer.innerHTML = `
            <div class="row">
                <div class="col-lg-6 col-lg-push-3 col-md-6 col-md-push-3 col-sm-6 col-sm-push-3" id="transcript-box">
                    <button id="transcript-close-btn" class="btn blue-close-btn" type="button">X</span></button>
                    <div id="transcript-show"></div>
                </div>
            </div>
        `;
        const transcriptText = document.getElementById('transcript-text');
        const transcriptShow = document.getElementById('transcript-show');
        const transcriptCloseBtn = document.getElementById('transcript-close-btn');
        if (transcriptText) {
            transcriptShow.innerHTML = transcriptText.innerHTML;
        }
        transcriptCloseBtn === null || transcriptCloseBtn === void 0 ? void 0 : transcriptCloseBtn.addEventListener('click', (e) => {
            hideTranscipt();
        });
    }
    if (audio) {
        const pageWrap = document.createElement('div');
        pageWrap.id = 'page-ready-wrap';
        document.body.appendChild(pageWrap);
        pageWrap.innerHTML = `
            <div id="page-ready">
                <div id="audio-play-btn">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>
        `;
        showPlayBtn = () => {
            pageWrap.style.display = 'block';
        };
        document.getElementById('audio-play-btn').addEventListener('click', () => {
            audioPlay();
            if (insideOfWrapper) {
                if (!parent.courseGated) {
                    parent.enableNextBtn();
                }
            }
            if (pageWrap.style.display != 'none') {
                pageWrap.style.display = 'none';
            }
        });
    }
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.id = 'see-more-btn';
    seeMoreBtn.type = 'button';
    seeMoreBtn.innerHTML = `See More...`;
    document.body.appendChild(seeMoreBtn);
    var showTranscipt = () => {
        $("#transcript").fadeIn('fast');
        if (insideOfWrapper) {
            parent.ccOpen = true;
        }
    };
    var hideTranscipt = () => {
        $("#transcript").fadeOut("fast");
        if (insideOfWrapper) {
            parent.ccOpen = false;
        }
    };
    var stopAudio = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };
    var setPageVolume = (vol) => {
        if (insideOfWrapper && vol) {
            if (audio) {
                audio.volume = vol;
            }
        }
    };
    var audioFinish = () => {
        pageFinish = true;
        stopAudio();
        if (insideOfWrapper) {
            if (parent.courseGated) {
                parent.enableNextBtn();
            }
        }
    };
    var audioReplay = () => {
        pageReset();
    };
    var resetAnimation = () => {
        seriesOfImagesIndex = 0;
        document.querySelectorAll('.hide-element').forEach((val, index) => {
            const elem = val;
            if (elem.classList.contains('dont-display')) {
                $(elem).animate({ display: 'none' });
            }
            else if (elem.classList.contains('hide-element')) {
                $(elem).animate({ opacity: (hideElemOpacity.toString()) });
            }
        });
        document.querySelectorAll('.add-animation').forEach((val, index) => {
            const elem = val;
            const aniDataEntry = elem.getAttribute('data-animation');
            const aniDataExit = elem.getAttribute('data-animation-exit');
            const aniEntry = aniDataEntry ? aniDataEntry : 'fadeIn';
            const aniExit = aniDataExit ? aniDataExit : 'fadeOut';
            elem.classList.remove(aniEntry);
            elem.classList.remove(aniExit);
        });
        document.querySelectorAll('.animate-images').forEach((val, index) => {
            const elem = val;
            const imgContainer = elem.querySelector('.img-container');
            const imgAry = elem.querySelectorAll('.series-of-images img');
            const imgTarget = imgAry[seriesOfImagesIndex];
            const setDataValue = (attr) => {
                const data = imgTarget.getAttribute(attr);
                const val = data ? data : '';
                imgContainer.setAttribute(attr, val);
            };
            imgContainer.src = imgContainer.getAttribute('data-default');
            setDataValue('data-time');
            setDataValue('data-animation');
            setDataValue('alt');
            setDataValue('title');
        });
    };
    var playAnimation = () => {
        if (insideOfWrapper) {
            parent.showPageProgress();
        }
        const removeAniEvent = (elem, altAni) => {
            const removeAniClass = function () {
                const aniData = elem.getAttribute('data-animation');
                const ani = aniData ? aniData : altAni;
                console.log(ani);
                elem.classList.remove(ani);
            };
            // console.log(altAni)
            elem.addEventListener('webkitAnimationEnd', removeAniClass);
            elem.addEventListener('webkitAnimationEnd', removeAniClass);
            elem.addEventListener('mozAnimationEnd', removeAniClass);
            elem.addEventListener('oanimationend', removeAniClass);
            elem.addEventListener('animationend', removeAniClass);
        };
        const getElemTiming = (elem, time) => {
            const dataTime = elem.getAttribute(time);
            const aniTime = parseFloat(dataTime ? dataTime : '0');
            return dataTime ? audio.currentTime >= aniTime && audio.currentTime <= (aniTime + 0.5) : false;
        };
        document.querySelectorAll('.next-fade-in').forEach((val, index) => {
            const elem = val;
            if (getElemTiming(elem, 'data-time')) {
                if (elem.classList.contains('dont-display')) {
                    $(elem).fadeIn();
                }
                else if (elem.classList.contains('hide-element')) {
                    $(elem).animate({ opacity: 1 });
                }
            }
        });
        document.querySelectorAll('.add-animation').forEach((val, index) => {
            const elem = val;
            const aniDataEntry = elem.getAttribute('data-animation');
            const aniDataExit = elem.getAttribute('data-animation-exit');
            const aniEntry = aniDataEntry ? aniDataEntry : 'fadeIn';
            const aniExit = aniDataExit ? aniDataExit : 'fadeOut';
            if (getElemTiming(elem, 'data-time')) {
                elem.classList.add(aniEntry);
                $(elem).animate({ opacity: 1 });
            }
            // reserve code...seem like this only works in fadeIn and fadeOut. going back to this...
            /* if(getElemTiming(elem, 'data-time-exit')) {
                removeAniEvent(elem, aniEntry);
                elem.classList.add(aniExit);
            } */
        });
        document.querySelectorAll('.animate-images').forEach((val, index) => {
            const elem = val;
            const imgContainer = elem.querySelector('.img-container');
            const imgAry = elem.querySelectorAll('.series-of-images img');
            const imgTarget = imgAry[seriesOfImagesIndex];
            const dataAni = imgContainer.getAttribute('data-animation');
            const imgPath = '';
            const origAni = dataAni ? dataAni : '';
            const setDataValue = (attr) => {
                const data = imgTarget.getAttribute(attr);
                const val = data ? data : '';
                if (val.length > 0) {
                    imgContainer.setAttribute(attr, val);
                }
            };
            setDataValue('data-time');
            setDataValue('data-animation');
            setDataValue('alt');
            setDataValue('title');
            if (getElemTiming(imgContainer, 'data-time')) {
                const aniDataEntry = elem.getAttribute('data-animation');
                const aniEntry = aniDataEntry ? aniDataEntry : '';
                imgContainer.style.opacity = '0';
                imgContainer.src = imgTarget.src;
                setTimeout(() => {
                    if (origAni.length > 0) {
                        imgContainer.classList.remove(origAni);
                    }
                    if (aniEntry.length > 0) {
                        imgContainer.classList.add(aniEntry);
                    }
                }, 500);
                if (seriesOfImagesIndex < (imgAry.length - 1)) {
                    seriesOfImagesIndex++;
                }
                imgContainer.style.opacity = '1';
            }
        });
    };
    var pageLoadAudio = () => {
        if (audio) {
            const audioSourceFirst = audio.querySelector('source');
            const audioSourceArray = audio.querySelectorAll('source');
            // reserve code
            // const audioSourcePath = insideOfWrapper ? `../${(<any> parent).audioPath}${audioSourceFirst.getAttribute('data-path')}` : `../../media/audio/${audioSourceFirst.getAttribute('data-path')}`;
            // audioSourceFirst?.setAttribute('src', audioSourcePath);
            audio.load();
        }
    };
    var pageSet = () => {
        // reserve code
        if (insideOfWrapper) {
            parent.showPageProgress();
        }
    };
    var audioMute = () => {
        if (audio) {
            audio.muted = true;
        }
    };
    var audioUnmute = () => {
        if (audio) {
            audio.muted = false;
        }
    };
    var audioPause = () => {
        if (audio) {
            audio.pause();
        }
    };
    var audioPlay = () => {
        if (audio) {
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    playAnimation();
                })
                    .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                    stopAudio();
                    showPlayBtn();
                    if (insideOfWrapper) {
                        // parent.disableNextBtn();
                    }
                });
            }
        }
    };
    var pageReset = () => {
        stopAudio();
        resetAnimation();
        userReset = true;
    };
    var setSeeMoreBtn = () => {
        var _a;
        let isScrolling;
        const seeMoreBtn = () => {
            const docHeight = document.documentElement.scrollHeight;
            const scrollingLength = window.scrollY + window.innerHeight;
            if (scrollingLength < docHeight) {
                $("#see-more-btn").fadeIn();
            }
            else {
                $("#see-more-btn").hide();
            }
        };
        window.addEventListener('scroll', (e) => {
            $("#see-more-btn").hide();
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function () {
                seeMoreBtn();
            }, 500);
        });
        (_a = document.getElementById('see-more-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            $("html,body").animate({ scrollTop: (((window.scrollY + window.innerHeight) - 50) + "px") });
        });
        seeMoreBtn();
    };
    var initPage = () => {
        if (insideOfWrapper) {
            const wrapper = parent;
            if (wrapper.playPageAudio) {
                audioPlay();
            }
        }
        else {
            if (audio) {
                audioPlay();
            }
        }
        setSeeMoreBtn();
    };
    audio === null || audio === void 0 ? void 0 : audio.addEventListener("timeupdate", playAnimation);
    audio === null || audio === void 0 ? void 0 : audio.addEventListener("ended", function () {
        pageFinish = true;
        if (insideOfWrapper) {
            parent.showPageProgress();
            parent.showPlayBtn();
        }
    });
    document.querySelectorAll('.dont-display').forEach(val => {
        const elem = val;
        elem.style.display = 'none';
    });
    document.querySelectorAll('.hide-element').forEach(val => {
        const elem = val;
        elem.style.opacity = hideElemOpacity.toString();
    });
    document.querySelectorAll('.add-animation').forEach((val, index) => {
        const elem = val;
        elem.classList.add('wow');
    });
    document.querySelectorAll('.video-btn').forEach((val, index) => {
        val.addEventListener('click', function (e) {
            const video = val.getAttribute('data-file') || '';
            audioPause();
            if (insideOfWrapper) {
                parent.showVideoModal(video);
            }
        });
    });
    document.querySelectorAll('.next-btn').forEach((val, index) => {
        val.addEventListener('click', function () {
            if (insideOfWrapper) {
                parent.nextPage();
            }
        });
    });
    (_a = document.getElementById('retake-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        if (insideOfWrapper) {
            parent.retakeCourse();
        }
    });
    (_b = document.getElementById('review-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        if (insideOfWrapper) {
            parent.gotoFistQuizPage();
        }
    });
    (_c = document.getElementById('close-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        if (insideOfWrapper) {
            parent.closeCourse();
        }
    });
    /* document.getElementById('reset-page')?.addEventListener('click', () => {
        pageReset();
        audioPlay();
    }); */
    document.querySelectorAll('.series-of-images').forEach(val => {
        val.style.display = ' none';
    });
    if (insideOfWrapper) {
        // if this page is inside of the wrapper
    }
    else {
        // if this page is NOT inside of the wrapper
        pageSet();
        initPage();
        setPageVolume();
    }
    pageLoadAudio();
}
