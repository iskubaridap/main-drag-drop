"use strict";
/*
    This is provided to override any existing functions in wrapper.js, page.js and
    quiz.js before initializing the course.
    Or just make any customize code for certain course.

    This is to maintain wrapper.js, page.js and
    quiz.js what they are and using this js file if there
    is a certain course is different from others.
 */ 
const radioCheckbox = document.querySelector('#quiz-content[data-type="true-false"]') || document.querySelector('#quiz-content[data-type="choice"]');
const dragDrop = document.querySelector('#quiz-content[data-type="matching"]');
const xlScreenSize = 1200;
const mdScreenSize = 1199;
const smScreenSize = 1023;
const xsScreenSize = 990;
const numTry = 3;
let correctDraggableAry = new Array();
document.querySelectorAll('.draggable').forEach((val, index) => {
    if(val.getAttribute('data-ans') == 'correct') {
        correctDraggableAry.push(setupCorrectResponses(val.querySelector('p').innerText));
    }
});
let tabIndex = 1;
let userNumTry = 0;
let userAnswered = false;
let setDragDropScreenReaderSelect = () => {
    tabIndex = 1;
    document.querySelectorAll('.droppable-item-wrap').forEach((val, index) => {
        const elem = val;
        const droppableElem = elem.querySelector('.droppable');
        let draggableElem;
        const pTag = elem.querySelector('.droppable-txt');
        const select = elem.querySelector('.droppable-item-aria-select') ? elem.querySelector('.droppable-item-aria-select') : document.createElement('select');
        const choiceOption = document.createElement('option');
        choiceOption.setAttribute('selected', 'selected');
        choiceOption.value = '';
        choiceOption.innerText = '-- Please choose an option --';
        pTag.setAttribute('tabindex', (tabIndex++).toString());
        select.setAttribute('tabindex', (tabIndex++).toString());
        select.classList.add('droppable-item-aria-select');
        dragdropSeriesCorrectAns.forEach((val, index) => {
            const option = document.createElement('option');
            option.value = val.attrVal;
            option.innerText = val.dragTxt;
            select.appendChild(option);
        });
        select.prepend(choiceOption);
        elem.appendChild(select);
        /* pTag.addEventListener('focus', (e) => {
            elem.querySelector('.droppable-item-aria-select').classList.add('active');
        });
        select.addEventListener('blur', (e) => {
            elem.querySelector('.droppable-item-aria-select').classList.remove('active');
            setDraggableDropped(draggableElem, droppableElem);
        });
        select.addEventListener('focus', (e) => {
            var elem = e.target;
            elem.querySelectorAll('option').forEach(val => {
                if (val.selected == true) {
                    draggableElem = document.querySelector(`.draggable[data-draggable="${val.value}"]`);
                    // setDraggableDropped(draggableElem, droppableElem);
                }
            });
        });
        select.addEventListener('change', (e) => {
            const attrVal = e.target.value;
            draggableElem = document.querySelector(`.draggable[data-draggable="${attrVal}"]`);
            // setDraggableDropped(draggableElem, droppableElem);
        }); */
        /* select.addEventListener('keydown', (e) => {
            console.log(e.key);
            if((e.key).toLowerCase() == 'enter') {
                console.log('foobar');
                setDraggableDropped(draggableElem, droppableElem);
                document.querySelectorAll('.droppable-item-aria-select').forEach(val => {
                    const elem = val as HTMLSelectElement;
                    elem.querySelectorAll('option').forEach(val => {
                        if(val.value == draggableElem.getAttribute('data-draggable')) {
                            val.remove();
                        }
                    });
                })
            }
            
        }); */
    });
    tabIndex++;
    if (document.getElementById('reset-drag-drop-btn')) {
        document.getElementById('reset-drag-drop-btn').setAttribute('tabindex', (tabIndex++).toString());
    }
};
let resetDragDrop = () => {
    const resetIcon = (icon) => {
        if (icon.classList.contains('bi-check')) {
            icon.classList.remove('bi-check');
        }
        else if (icon.classList.contains('bi-x')) {
            icon.classList.remove('bi-x');
        }
        icon.classList.add('bi-dot');
        icon.style.backgroundColor = 'var(--txt-color)';
        icon.style.opacity = '0';
    };
    document.querySelectorAll('.droppable').forEach((val, index) => {
        val.setAttribute('data-result', 'incorrect');
    });
    document.querySelectorAll('.draggable').forEach((val, index) => {
        var _a;
        val.style.padding = '5px';
        (_a = document.querySelector(`.drag-elem-wrap[data-item="${val.getAttribute('data-draggable')}"]`)) === null || _a === void 0 ? void 0 : _a.append(val);
    });
    setDragDropScreenReaderSelect();
    document.getElementById('draggable-wrap').classList.remove('finish');
    if (window.innerWidth > smScreenSize) {
        document.querySelectorAll('.droppable-item-wrap').forEach(val => {
            var _a;
            const elem = val;
            const dropResult = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-result');
            const icon = elem.querySelector('.glyphicon');
            elem.classList.remove('correct');
            elem.classList.remove('incorrect');
            resetIcon(icon);
        });
    }
    else {
        document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
            const elem = val;
            const selectElem = elem.querySelector('.quiz-dropdown-select');
            const icon = elem.querySelector('.glyphicon');
            resetIcon(icon);
            selectElem.querySelectorAll('option').forEach((valOption, valIndex) => {
                const elem = valOption;
                if((elem.value).length > 0) {
                    elem.remove();
                }
            });
            dragdropSeriesCorrectAns.forEach((val, index) => {
                const option = document.createElement('option');
                option.value = val.attrVal;
                option.innerText = val.dragTxt;
                if (val.ans == 'correct') {
                    option.setAttribute('data-result', 'correct');
                }
                else {
                    option.setAttribute('data-result', 'incorrect');
                }
                selectElem.appendChild(option);
            });
        });
        document.querySelectorAll(".quiz-dropdown-select").forEach((val, index) => {
            const elem = val;
            elem.classList.remove('correct');
            elem.classList.remove('incorrect');
            elem.addEventListener('change', (elemVal) => {
                const userSelectedVal = elemVal.target.value;
                document.querySelectorAll(".quiz-dropdown-select").forEach((val2, index2) => {
                    if(index != index2) {
                        val2.querySelectorAll('option').forEach((val3) => {
                            if(val3.getAttribute('value') == userSelectedVal) {
                                val3.remove();
                            }
                        });
                    }
                });
            });
        });
    }
    document.querySelectorAll('.submit-btns').forEach((val, index) => {
        val.classList.remove('active');
    });
    document.getElementById('quiz-submit').classList.add('active');
    if(document.getElementById('quiz-submit-2')) {
        document.getElementById('quiz-submit-2').classList.add('active');
    }
};
let getUserDragDropResponse = () => {
    let ansAry = new Array();
    if (window.innerWidth > smScreenSize) {
        document.querySelectorAll('.droppable').forEach((val, index) => {
            const dragElem = val.querySelectorAll('.draggable');
            dragElem.forEach(val => {
                ansAry.push(setupCorrectResponses(val.querySelector('p').innerText));
            });
        });
    }
    else {
        document.querySelectorAll('.quiz-dropdown-select').forEach((val, index) => {
            val.querySelectorAll('option').forEach((valOption, valIndex) => {
                const elem = valOption;
                if (elem.selected && (elem.value).length > 0) {
                    ansAry.push(setupCorrectResponses(elem.innerText));
                }
            });
        });
    }
    return ansAry.filter(item => item);
};
let showIconResultAnswer = () => {
    let qResult = false;
    const qResultIcon = document.getElementById('question-result');
    const qResponseReview = document.getElementById('quiz-response-review');
    userNumTry++;
    const changeIcon = (elem, result) => {
        if (result) {
            elem.classList.remove('bi-dot');
            elem.classList.add('bi-check');
            elem.style.backgroundColor = 'var(--yellow)';
            elem.style.color = 'var(--blue)';
        }
        else {
            elem.classList.remove('bi-dot');
            elem.classList.add('bi-x');
            elem.style.backgroundColor = 'var(--red)';
            // elem.style.backgroundColor = 'var(--yellow-dirty)';
        }
        elem.style.opacity = '1';
    };
    document.querySelectorAll('.submit-btns').forEach((val, index) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach(val => {
        val.classList.remove('active');
    });
    if (radioCheckbox) {
        qResult = quizInfo.learnerResponse == quizInfo.correctResponses;
        quizInfo.result = qResult ? 'correct' : 'incorrect';
        changeIcon(qResultIcon, qResult);
        document.querySelectorAll('.folder-img').forEach((val, index) => {
            val.classList.remove('active');
        });
        document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
            const elem = val;
            if (elem.querySelector('input').checked) {
                const inputVal = elem.querySelector('input');
                const inputParent = inputVal.parentNode;
                const labelElem = inputParent.querySelector('label');
                const icon = elem.querySelector('.glyphicon');
                if(inputVal.value == 'correct') {
                    document.getElementById('folder-check').classList.add('active');
                    document.getElementById('quiz-defend').classList.add('active');
                    labelElem.classList.add('yellow-txt');
                } else {
                    document.getElementById('folder-x').classList.add('active');
                    document.getElementById('quiz-try-again').classList.add('active');
                    labelElem.classList.add('red-txt');
                }
                changeIcon(icon, inputVal.value == 'correct');
            }
        });
        
        if(userNumTry < numTry) {
            if(qResult) {
                pageFinish = true;
                
                if (insideOfWrapper) {
                    parent.addScore();
                }
                document.getElementById('question-correct').classList.add('active');
            } else {
                document.getElementById('question-incorrect').classList.add('active');
            }
        } else {
            pageFinish = true;
            if(qResult) {
                if (insideOfWrapper) {
                    parent.addScore();
                }
                document.getElementById('question-correct').classList.add('active');
            } else {
                document.getElementById('question-incorrect').classList.add('active');
            }
            document.querySelectorAll('.submit-btns').forEach((val, index) => {
                val.classList.remove('active');
            });
            document.getElementById('quiz-defend').classList.add('active');
        }
    }
    else if (dragDrop) {
        if (window.innerWidth > smScreenSize) {
            const userIsCorrect = quizInfo.learnerResponse == quizInfo.correctResponses
            quizInfo.result = userIsCorrect ? 'correct' : 'incorrect';
            /* const userAnsAry = (quizInfo.learnerResponse).split("|");
            const quizAnsAry = (quizInfo.correctResponses).split("|");
            let userIsCorrect = false;
            for(let i = 0; i < userAnsAry.length; i++) {
                if(quizAnsAry.indexOf(userAnsAry[i]) >= 0) {
                    userIsCorrect = true;
                } else {
                    userIsCorrect = false;
                    break;
                }
            } */
            changeIcon(qResultIcon, userIsCorrect);
            // document.getElementById('reset-drag-drop-btn').style.display = 'none';
            document.querySelectorAll('.droppable-item-wrap').forEach(val => {
                var _a;
                const elem = val;
                const dropResult = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-result');
                const icon = elem.querySelector('.glyphicon');
                if(userIsCorrect) {
                    elem.classList.add('correct');
                } else {
                    elem.classList.add('incorrect');
                }
            });
            
            if(userNumTry < numTry) {
                if(userIsCorrect) {
                    pageFinish = true;
                    if (insideOfWrapper) {
                        parent.addScore();
                    }
                    document.getElementById('draggable-wrap').classList.add('finish');
                    document.getElementById('quiz-defend').classList.add('active');
                    document.getElementById('question-correct').classList.add('active');
                } else {
                    document.getElementById('quiz-try-again').classList.add('active');
                    document.getElementById('question-incorrect').classList.add('active');
                }
            } else {
                pageFinish = true;
                if(userIsCorrect) {
                    if (insideOfWrapper) {
                        parent.addScore();
                    }
                    document.getElementById('question-correct').classList.add('active');
                } else {
                    document.getElementById('question-incorrect').classList.add('active');
                }
                document.querySelectorAll('.submit-btns').forEach((val, index) => {
                    val.classList.remove('active');
                });
                document.getElementById('quiz-defend').classList.add('active');
            }
        }
        else {
            const userIsCorrect = quizInfo.learnerResponse == quizInfo.correctResponses
            quizInfo.result = userIsCorrect ? 'correct' : 'incorrect';
            /* const userAnsAry = (quizInfo.learnerResponse).split("|");
            const quizAnsAry = (quizInfo.correctResponses).split("|");
            let userIsCorrect = false;
            for(let i = 0; i < userAnsAry.length; i++) {
                if(quizAnsAry.indexOf(userAnsAry[i]) >= 0) {
                    userIsCorrect = true;
                } else {
                    userIsCorrect = false;
                    break;
                }
            } */
            changeIcon(qResultIcon, userIsCorrect);
            /* document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
                const elem = val;
                const selectElem = elem.querySelector('.quiz-dropdown-select');
                const icon = elem.querySelector('.glyphicon');
                selectElem.querySelectorAll('option').forEach((valOption, valIndex) => {
                    const elem = valOption;
                    if (elem.selected) {
                        if(elem.getAttribute('data-result') == 'correct') {
                            elem.parentNode.classList.add('correct');
                        } else {
                            elem.parentNode.classList.add('incorrect');
                        }
                        // changeIcon(icon, elem.getAttribute('data-result') == 'correct');
                    }
                });
            }); */

            if(userIsCorrect) {
                document.getElementById('quiz-defend-2').classList.add('active');
                document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
                    const elem = val;
                    const selectElem = elem.querySelector('.quiz-dropdown-select');
                    selectElem.classList.add('correct');
                });
            } else {
                document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
                    const elem = val;
                    const selectElem = elem.querySelector('.quiz-dropdown-select');
                    selectElem.classList.add('incorrect');
                });
                document.getElementById('quiz-try-again-2').classList.add('active');
            }
            if(userNumTry < numTry) {
                if(userIsCorrect) {
                    pageFinish = true;
                    if (insideOfWrapper) {
                        parent.addScore();
                    }
                    document.getElementById('question-correct').classList.add('active');
                } else {
                    document.getElementById('question-incorrect').classList.add('active');
                }
            } else {
                pageFinish = true;
                if(userIsCorrect) {
                    if (insideOfWrapper) {
                        parent.addScore();
                    }
                    document.getElementById('question-correct').classList.add('active');
                } else {
                    document.getElementById('question-incorrect').classList.add('active');
                }
                document.querySelectorAll('.submit-btns').forEach((val, index) => {
                    val.classList.remove('active');
                });
                document.getElementById('quiz-defend-2').classList.add('active');
            }
            /* if(userIsCorrect) {
                pageFinish = true;
                quizInfo.result = userIsCorrect;
                if (insideOfWrapper) {
                    parent.addScore();
                }
            } */
        }
    }
    qResultIcon.style.opacity = '1';
    /* if(document.getElementById('quiz-submit')) {
        (<any> document.getElementById('quiz-submit')).style.display = 'none';
    }
    (<any> document.getElementById('show-result-wrap')).style.display = 'none'; */
};
let getUserInputResponse = () => {
    let ansAry = new Array();
    document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
        const elem = val;
        if (elem.querySelector('input').checked) {
            ansAry.push(setupCorrectResponses(elem.querySelector('label').innerText));
        }
    });
    return ansAry.filter(item => item);
};
let setDraggableDropped = (draggableElem, droppableElem) => {
    let droppableCorrect = 0;
    const numIncorrect = 0;
    const droppableValueAry = droppableElem.getAttribute('data-droppable').split(",").map((item) => item.trim());
    if (droppableElem.childNodes.length <= 0 && draggableElem != null) {
        draggableElem.style.margin = '0';
        draggableElem.querySelector('p').style.paddingBottom = '0px';
        draggableElem.querySelector('p').style.marginBottom = '0px';
        draggableElem.style.top = '0px';
        draggableElem.style.left = '0px';
        droppableElem.append(draggableElem);
        document.getElementById('reset-drag-drop-btn').style.display = 'block';
        if (droppableElem.querySelectorAll('.draggable').length == droppableValueAry.length) {
            const dragElem = droppableElem.querySelectorAll('.draggable');
            droppableValueAry.forEach((val, index) => {
                for (let i = 0; i < dragElem.length; i++) {
                    if (dragElem[i].getAttribute('data-draggable') == val) {
                        droppableCorrect++;
                        return false;
                    }
                }
            });
            if (droppableCorrect == droppableValueAry.length) {
                droppableElem.setAttribute('data-result', 'correct');
            }
            else {
                droppableElem.setAttribute('data-result', 'incorrect');
            }
        }
        else {
            droppableElem.setAttribute('data-result', 'incorrect');
        }
        document.querySelectorAll('.droppable-item-aria-select').forEach(val => {
            const elem = val;
            elem.querySelectorAll('option').forEach(val => {
                if (val.value == draggableElem.getAttribute('data-draggable')) {
                    val.remove();
                }
            });
        });
    }
};
let addSubmitBtn = () => {};
showResponseReview = () => {};
resetQuizPage = () => {
    const resetIcon = (icon) => {
        if (icon.classList.contains('bi-check')) {
            icon.classList.remove('bi-check');
        }
        else if (icon.classList.contains('bi-x')) {
            icon.classList.remove('bi-x');
        }
        icon.classList.add('bi-dot');
        icon.style.backgroundColor = 'var(--txt-color)';
        icon.style.opacity = '0';
    };
    document.querySelectorAll('.question-txt-wrap').forEach(val => {
        val.classList.remove('active');
    });
    document.getElementById('question-start').classList.add('active');

    if (radioCheckbox) {
        document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
            const elem = val;
            const inputVal = elem.querySelector('input');
            const icon = elem.querySelector('.glyphicon');
            elem.querySelector('input').checked = false;
            elem.querySelector('label').classList.remove('green-txt');
            elem.querySelector('label').classList.remove('red-txt');
            resetIcon(icon);
        });
        document.querySelectorAll('.folder-img').forEach((val, index) => {
            val.classList.remove('active');
        });
        document.querySelectorAll('.submit-btns').forEach((val, index) => {
            val.classList.remove('active');
        });
        document.getElementById('folder-question').classList.add('active');
        document.getElementById('quiz-submit').classList.add('active');
    }
    resetIcon(document.getElementById('question-result'));
    if (dragDrop) {
        resetDragDrop();
    }
    userAnswered = false;
    quizInfo.learnerResponse = '';
    document.getElementById('quiz-response-review').innerHTML = '';
    $('#show-result-wrap').hide();
};
submitAnswer = () => {
    if (radioCheckbox) {
        document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
            const elem = val;
            if (elem.querySelector('input').checked) {
                userAnswered = true;
            }
        });
        quizInfo.learnerResponse = (getUserInputResponse()).join('|');
    } else if (dragDrop) {
        if (window.innerWidth > smScreenSize) {
            let numAns = document.querySelectorAll('#droppable-wrap .draggable').length;
            userAnswered = numAns == document.querySelectorAll('.droppable-item-wrap').length;
        } else if(((getUserDragDropResponse()).join('|')).length > 0) {
            userAnswered = true;
        }
        quizInfo.learnerResponse = (getUserDragDropResponse()).join('|');
    }
    
    if (userAnswered) {
        /* quizInfo.result = (quizInfo.learnerResponse == quizInfo.correctResponses) ? 'correct' : 'incorrect';
        if (quizInfo.learnerResponse == quizInfo.correctResponses) {
            document.getElementById('response-correct').style.display = 'block';
            document.getElementById('response-incorrect').style.display = 'none';
            if (insideOfWrapper) {
                parent.addScore();
            }
        }
        else {
            document.getElementById('response-correct').style.display = 'none';
            document.getElementById('response-incorrect').style.display = 'block';
        }
        if (insideOfWrapper) {
            parent.setCMIInteractions(Object.assign(info, quizInfo));
        }
        pageFinish = true; */
        showIconResultAnswer();
        /* $('#show-result-wrap').fadeIn(function () {
            document.querySelector('.quiz-continue-btn').focus();
        }); */
    }
    else {
        document.getElementById('quiz-response-review').innerHTML = `<p class="biggest-font">Please select an answer.</p>`;
    }
};
setPage = () => {
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
        if (iframe.getAttribute('data-type') == 'quiz' && iframe.getAttribute('data-id') != 'last-page' && !iframeWin.pageFinish) {
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
        }
    }
    iframe.classList.add('active');
    
    setVolume();
    showPageProgress();
    if (iframeWin.setPageVolume) {
        iframeWin.setPageVolume(courseVolume);
    }
    if (muteCourse) {
        iframeWin.audioMute();
    }
    if ((iframe.getAttribute('data-type') == 'quiz' && !iframeDoc.body.getAttribute('data-quiz-type')) && !iframeWin.pageFinish && iframe.getAttribute('data-id') != 'last-page') {
        submitBtn.style.display = 'none';
        setQuizIndex();
    }
    else {
        submitBtn.style.display = 'none';
    }
    iframeWin.setSeeMoreBtn();
    document.getElementById('transcript-show').innerHTML = iframeDoc.getElementById('transcript-text').innerHTML;
    // iframe.focus();
};
(_c = document.getElementById('reset-drag-drop-btn-2')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    resetDragDrop();
});
if(document.getElementById('quiz-submit')) {
    document.getElementById('quiz-submit').addEventListener('click', (evt) => {
        submitAnswer();
    });
}
if(document.getElementById('quiz-defend')) {
    document.getElementById('quiz-defend').addEventListener('click', () => {
        if (insideOfWrapper) {
            parent.nextPage();
        }
    });
}
if(document.getElementById('quiz-try-again')) {
    document.getElementById('quiz-try-again').addEventListener('click', () => {
        resetQuizPage();
    });
}
if(document.getElementById('quiz-submit-2')) {
    document.getElementById('quiz-submit-2').addEventListener('click', (evt) => {
        submitAnswer();
    });
}
if(document.getElementById('quiz-defend-2')) {
    document.getElementById('quiz-defend-2').addEventListener('click', () => {
        if (insideOfWrapper) {
            parent.nextPage();
        }
    });
}
if(document.getElementById('quiz-try-again-2')) {
    document.getElementById('quiz-try-again-2').addEventListener('click', () => {
        resetQuizPage();
    });
}