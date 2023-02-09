"use strict";
var _a, _b, _c;
if ((window.location.href).search('/pages') > 0 && document.body.getAttribute('data-page-type') == 'quiz') {
    insideOfWrapper = self != top;
    pageFinish = false;
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
    // (“true-false”, “choice”, “fill-in”, “matching”, “performance”, “sequencing”, “likert”, “numeric”, WO)
    var quizCountID = insideOfWrapper ? parent.getInteractionsCount() : '0';
    var quizInfo = {
        num: quizCountID,
        type: document.getElementById('quiz-content') ? (_a = document.getElementById('quiz-content')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-type') : 'true-false',
        objectives: info.id,
        correctResponses: '',
        weighting: insideOfWrapper ? parent.getInteractionWeighting(quizCountID) : 1,
        learnerResponse: '',
        result: ''
    };
    const quizContent = document.getElementById('quiz-content');
    const radioCheckbox = document.querySelector('#quiz-content[data-type="true-false"]') || document.querySelector('#quiz-content[data-type="choice"]');
    const dragDrop = document.querySelector('#quiz-content[data-type="matching"]');
    const divRow = document.createElement('div');
    const regularQuiz = document.body.getAttribute('data-quiz-type') ? false : true;
    const xlScreenSize = 1200;
    const mdScreenSize = 1199;
    const smScreenSize = 1023;
    const xsScreenSize = 990;
    let keys = [];
    let downShiftTabKey = false;
    let tabIndex = 1;
    let dragdropSeriesCorrectAns;
    let userAnswered = false;
    const shuffleArray = (a) => {
        let j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    };
    var shuffleQuizAnswer = () => {
        let arryMultiChoice;
        let arryDragAndDrop;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const emptyElem = (elem) => {
            while (elem.firstChild) {
                elem.firstChild.remove();
            }
        };
        if (document.querySelector('#quiz-content[data-type="choice"]')) {
            arryMultiChoice = Array.from(document.querySelectorAll('#quiz-content .question-choice-wrap'));
            if (document.querySelector('#quiz-content .checkbox-btn')) {
                emptyElem(document.querySelector('#quiz-content .checkbox-btn'));
            }
            if (document.querySelector('#quiz-content .radio-btn')) {
                emptyElem(document.querySelector('#quiz-content .radio-btn'));
            }
            shuffleArray(arryMultiChoice);
            arryMultiChoice.forEach((val, index) => {
                const elem = val;
                const label = elem.querySelector('label');
                const txt = label.innerText;
                label.innerText = letters.charAt(index) + ')' + txt.replace(/\w\) /, "");
                if (document.querySelector('#quiz-content .checkbox-btn')) {
                    document.querySelector('#quiz-content .checkbox-btn').appendChild(elem);
                }
                if (document.querySelector('#quiz-content .radio-btn')) {
                    document.querySelector('#quiz-content .radio-btn').appendChild(elem);
                }
            });
        }
        if (document.querySelector('#quiz-content[data-type="matching"]')) {
            arryDragAndDrop = Array.from(document.querySelectorAll('#quiz-content .drag-elem-wrap'));
            emptyElem(document.querySelector('#quiz-content #draggable-wrap'));
            shuffleArray(arryDragAndDrop);
            arryDragAndDrop.forEach((val, index) => {
                document.querySelector('#quiz-content #draggable-wrap').appendChild(val);
            });
        }
    };
    var resetQuizPage = () => {
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
        if (radioCheckbox) {
            document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
                const elem = val;
                const inputVal = elem.querySelector('input');
                const icon = elem.querySelector('.glyphicon');
                elem.querySelector('input').checked = false;
                resetIcon(icon);
            });
        }
        resetIcon(document.getElementById('question-result'));
        if (dragDrop) {
            resetDragDrop();
            if (window.innerWidth > smScreenSize) {
                document.getElementById('reset-drag-drop-btn').style.display = 'none';
                document.querySelectorAll('.droppable-item-wrap').forEach(val => {
                    var _a;
                    const elem = val;
                    const dropResult = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-result');
                    const icon = elem.querySelector('.glyphicon');
                    resetIcon(icon);
                });
            }
            else {
                document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
                    const elem = val;
                    const selectElem = elem.querySelector('.quiz-dropdown-select');
                    const icon = elem.querySelector('.glyphicon');
                    selectElem.querySelectorAll('option').forEach((valOption, valIndex) => {
                        const elem = valOption;
                        resetIcon(icon);
                    });
                });
            }
        }
        userAnswered = false;
        quizInfo.learnerResponse = '';
        document.getElementById('quiz-response-review').innerHTML = '';
        $('#show-result-wrap').hide();
        if (document.getElementById('quiz-submit')) {
            document.getElementById('quiz-submit').style.display = 'inline';
        }
    };
    var setupCorrectResponses = (str) => {
        var txt = (new RegExp(/\w\) /)).test(str) ? str.replace(/\w\) /, "") : str.toLowerCase();
        txt = txt.trim();
        txt = txt.replace(/\s/g, "_");
        return txt;
    };
    const getInputCorrectResponses = () => {
        return Array.from(document.querySelectorAll('.question-choice-wrap')).map(val => {
            const elem = val;
            if (elem.querySelector('input[value="correct"]')) {
                return setupCorrectResponses(elem.querySelector('label').innerText);
            }
        }).filter(item => item);
    };
    const getDragDropCorrectResponses = () => {
        return Array.from(document.querySelectorAll('.droppable-item-wrap')).map(val => {
            var _a;
            const elem = val;
            const draggableItem = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-droppable');
            const draggableElem = document.querySelector(`.draggable[data-draggable="${draggableItem}"]`);
            return setupCorrectResponses(draggableElem.querySelector('p').innerText);
        }).filter(item => item);
    };
    const getUserInputResponse = () => {
        let ansAry = new Array();
        document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
            const elem = val;
            if (elem.querySelector('input').checked) {
                ansAry.push(setupCorrectResponses(elem.querySelector('label').innerText));
            }
        });
        return ansAry.filter(item => item);
    };
    const getUserDragDropResponse = () => {
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
                    if (elem.selected) {
                        ansAry.push(setupCorrectResponses(elem.innerText));
                    }
                });
            });
        }
        return ansAry.filter(item => item);
    };
    const setDraggableDropped = (draggableElem, droppableElem) => {
        let droppableCorrect = 0;
        const numIncorrect = 0;
        const droppableValueAry = droppableElem.getAttribute('data-droppable').split(",").map((item) => item.trim());
        if (droppableElem.childNodes.length <= 0 && draggableElem != null) {
            draggableElem.style.margin = '2px';
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
    const setDragDropScreenReaderSelect = () => {
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
            pTag.addEventListener('focus', (e) => {
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
            });
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
        document.getElementById('reset-drag-drop-btn').setAttribute('tabindex', (tabIndex++).toString());
    };
    const resetDragDrop = () => {
        document.querySelectorAll('.droppable').forEach((val, index) => {
            val.setAttribute('data-result', 'incorrect');
        });
        document.querySelectorAll('.draggable').forEach((val, index) => {
            var _a;
            val.style.padding = '5px';
            (_a = document.querySelector(`.drag-elem-wrap[data-item="${val.getAttribute('data-draggable')}"]`)) === null || _a === void 0 ? void 0 : _a.append(val);
        });
        setDragDropScreenReaderSelect();
    };
    var submitAnswer = () => {
        if (radioCheckbox) {
            document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
                const elem = val;
                if (elem.querySelector('input').checked) {
                    userAnswered = true;
                }
            });
            quizInfo.learnerResponse = (getUserInputResponse()).join('|');
        }
        else if (dragDrop) {
            if (window.innerWidth > smScreenSize) {
                let numAns = document.querySelectorAll('#droppable-wrap .draggable').length;
                userAnswered = numAns == document.querySelectorAll('.drag-elem-wrap').length;
            }
            else {
                userAnswered = true;
            }
            quizInfo.learnerResponse = (getUserDragDropResponse()).join('|');
        }
        if (userAnswered) {
            quizInfo.result = (quizInfo.learnerResponse == quizInfo.correctResponses) ? 'correct' : 'incorrect';
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
            pageFinish = true;
            showIconResultAnswer();
            $('#show-result-wrap').fadeIn(function () {
                document.querySelector('.quiz-continue-btn').focus();
            });
        }
        else {
            document.getElementById('quiz-response-review').innerHTML = `<p class="biggest-font">Please select an answer.</p>`;
        }
    };
    const addSubmitBtn = () => {
        const qContent = document.getElementById('quiz-content');
        const rowElem = document.createElement('div');
        rowElem.classList.add('row', 'justify-content-center');
        rowElem.innerHTML = `
            <div class="col-md-12 text-center">
                <button id="quiz-submit" class="btn blue" type="button" tabindex="${tabIndex++}">Submit</button>
            </div>
        `;
        qContent.appendChild(rowElem);
        document.getElementById('quiz-submit').addEventListener('click', () => {
            submitAnswer();
        });
    };
    var showResponseReview = () => {
        var _a, _b;
        const qResponseReview = document.getElementById('quiz-response-review');
        $('#show-result-wrap').fadeOut();
        if (quizInfo.learnerResponse == quizInfo.correctResponses) {
            qResponseReview.innerHTML = document.getElementById('response-correct').innerHTML;
        }
        else {
            qResponseReview.innerHTML = document.getElementById('response-incorrect').innerHTML;
        }
        (_a = qResponseReview.querySelector('.click-next-btn-txt')) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = qResponseReview.querySelector('.quiz-continue-btn-wrap')) === null || _b === void 0 ? void 0 : _b.remove();
    };
    const showIconResultAnswer = () => {
        const qResult = quizInfo.learnerResponse == quizInfo.correctResponses;
        const qResultIcon = document.getElementById('question-result');
        const qResponseReview = document.getElementById('quiz-response-review');
        const changeIcon = (elem, result) => {
            if (result) {
                elem.classList.remove('bi-dot');
                elem.classList.add('bi-check');
                elem.style.backgroundColor = 'var(--green)';
            }
            else {
                elem.classList.remove('bi-dot');
                elem.classList.add('bi-x');
                elem.style.backgroundColor = '#a30000';
                // elem.style.backgroundColor = 'var(--yellow-dirty)';
            }
            elem.style.opacity = '1';
        };
        changeIcon(qResultIcon, qResult);
        qResultIcon.style.opacity = '1';
        if (radioCheckbox) {
            document.querySelectorAll('.question-choice-wrap').forEach((val, index) => {
                const elem = val;
                if (elem.querySelector('input').checked) {
                    const inputVal = elem.querySelector('input');
                    const icon = elem.querySelector('.glyphicon');
                    changeIcon(icon, inputVal.value == 'correct');
                }
            });
        }
        else if (dragDrop) {
            if (window.innerWidth > smScreenSize) {
                document.getElementById('reset-drag-drop-btn').style.display = 'none';
                document.querySelectorAll('.droppable-item-wrap').forEach(val => {
                    var _a;
                    const elem = val;
                    const dropResult = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-result');
                    const icon = elem.querySelector('.glyphicon');
                    changeIcon(icon, dropResult == 'correct');
                });
            }
            else {
                document.querySelectorAll('.quiz-dropdown-item-wrap').forEach((val, index) => {
                    const elem = val;
                    const selectElem = elem.querySelector('.quiz-dropdown-select');
                    const icon = elem.querySelector('.glyphicon');
                    selectElem.querySelectorAll('option').forEach((valOption, valIndex) => {
                        const elem = valOption;
                        if (elem.selected) {
                            changeIcon(icon, elem.getAttribute('data-result') == 'correct');
                        }
                    });
                });
            }
        }
        /* if(document.getElementById('quiz-submit')) {
            (<any> document.getElementById('quiz-submit')).style.display = 'none';
        }
        (<any> document.getElementById('show-result-wrap')).style.display = 'none'; */
    };
    if (radioCheckbox) {
        quizInfo.correctResponses = (getInputCorrectResponses()).join('|');
    }
    if (dragDrop) {
        const dropdownUI = document.createElement('div');
        dragdropSeriesCorrectAns = Array.from(document.querySelectorAll('.droppable-item-wrap')).map(val => {
            var _a;
            const elem = val;
            const draggableItem = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-droppable');
            const draggableElem = document.querySelector(`.draggable[data-draggable="${draggableItem}"]`);
            return { attrVal: draggableItem, dragTxt: draggableElem.querySelector('p').innerText };
        });
        // reserve code...
        // const dragWrapMaxHeight = Math.max(...(Array.from(document.querySelectorAll('.drag-elem-wrap')).map((val:any) => (<any> val).offsetHeight) as any));
        /* document.querySelectorAll('.drag-elem-wrap').forEach(val => {
            (val as HTMLDivElement).style.height = `${dragWrapMaxHeight + 20}px`;
        }); */
        setDragDropScreenReaderSelect();
        quizInfo.correctResponses = (getDragDropCorrectResponses()).join('|');
        $(".draggable").draggable({
            zIndex: 50,
            revert: true
        });
        $(".droppable").droppable({
            drop: function (event, ui) {
                const draggableElem = ui.draggable[0];
                const droppableElem = event.target;
                setDraggableDropped(draggableElem, droppableElem);
            }
        });
        // adding dropdown option for small screens
        dropdownUI.id = 'quiz-dropdown-section';
        dropdownUI.classList.add('d-sm-block', 'd-md-none', 'd-lg-none');
        tabIndex = 1;
        document.querySelectorAll('.droppable-item-wrap').forEach((val, index) => {
            var _a;
            const elem = val;
            const draggableItem = (_a = elem.querySelector('.droppable')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-droppable');
            const draggableElem = document.querySelector(`.draggable[data-draggable="${draggableItem}"]`);
            const droppableTxt = elem.querySelector('.droppable-txt').innerText;
            const row = document.createElement('div');
            const colDropdownItemWrap = document.createElement('div');
            const label = document.createElement('label');
            const icon = document.createElement('i');
            const selectWrap = document.createElement('div');
            const selectArw = document.createElement('div');
            const selectArwIcn = document.createElement('i');
            const selectElem = document.createElement('select');
            const choiceOption = document.createElement('option');
            choiceOption.setAttribute('selected', 'selected');
            choiceOption.value = '';
            choiceOption.innerText = '-- Please choose an option --';
            row.classList.add('row', 'justify-content-center');
            colDropdownItemWrap.classList.add('col-sm-10', 'col-xs-10', 'col-sm-push-1', 'col-xs-push-1', 'quiz-dropdown-item-wrap');
            label.classList.add('large-font', 'standard-label-width', 'quiz-dropdown-label');
            icon.classList.add('glyphicon', 'bi-dot', 'check-x-mark-icon-dd');
            selectWrap.classList.add('quiz-select-wrap');
            selectArw.classList.add('quiz-select-arw');
            selectArwIcn.classList.add('glyphicon', 'chevron-down');
            selectElem.classList.add('quiz-dropdown-select');
            label.setAttribute('tabindex', (tabIndex++).toString());
            selectElem.setAttribute('tabindex', (tabIndex++).toString());
            dragdropSeriesCorrectAns.forEach((val, index) => {
                const option = document.createElement('option');
                option.value = val.attrVal;
                option.innerText = val.dragTxt;
                if (draggableItem == val.attrVal) {
                    option.setAttribute('data-result', 'correct');
                }
                else {
                    option.setAttribute('data-result', 'incorrect');
                }
                if (index == 0) {
                    option.selected = true;
                }
                selectElem.appendChild(option);
            });
            selectElem.prepend(choiceOption);
            selectWrap.appendChild(selectElem);
            selectArw.appendChild(selectArwIcn);
            label.innerText = droppableTxt;
            label.appendChild(icon);
            colDropdownItemWrap.appendChild(label);
            selectWrap.appendChild(selectArw);
            colDropdownItemWrap.appendChild(selectWrap);
            row.appendChild(colDropdownItemWrap);
            dropdownUI.appendChild(row);
        });
        quizContent.appendChild(dropdownUI);
    }
    if (regularQuiz) {
        // adding a quiz response 
        divRow.classList.add('row', 'justify-content-center');
        divRow.innerHTML = `
            <div class="col-lg-6 col-lg-push-3 col-md-6 col-md-push-3 col-sm-8 col-sm-push-2">
                <div id="quiz-response-review" class="text-center"></div>
            </div>
        `;
        if (quizContent) {
            quizContent.appendChild(divRow);
        }
    }
    document.querySelectorAll('.quiz-Select').forEach((val, index) => {
        const elem = val;
        elem.addEventListener('focus', function () {
            elem.parentElement.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        elem.addEventListener('focusout', function () {
            elem.parentElement.removeAttribute('style');
        });
    });
    if (document.querySelector('#quiz-content .question-choice-wrap')) {
        document.querySelectorAll('#quiz-content .question-choice-wrap')[1].addEventListener('keydown', function (evt) {
            if (insideOfWrapper && !downShiftTabKey) {
                parent.focusSubmitBtn();
            }
        });
    }
    if (document.getElementById('reset-drag-drop-btn')) {
        document.getElementById('reset-drag-drop-btn').addEventListener('keydown', function (e) {
            if (insideOfWrapper && !downShiftTabKey) {
                parent.focusSubmitBtn();
            }
        });
    }
    (_b = document.getElementById('show-result-close-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        showResponseReview();
    });
    document.querySelectorAll('.quiz-continue-btn').forEach((val, index) => {
        val.addEventListener('click', () => {
            if (insideOfWrapper) {
                parent.nextPage();
            }
            else {
                // showIconResultAnswer();
                resetQuizPage();
            }
        });
    });
    (_c = document.getElementById('reset-drag-drop-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        resetDragDrop();
    });
    document.addEventListener('keydown', function (evt) {
        keys[evt.keyCode] = true;
        if (keys[16] && keys[9]) {
            downShiftTabKey = true;
        }
        else {
            downShiftTabKey = false;
        }
    });
    document.addEventListener('keyup', function (evt) {
        const keyProperties = Object.keys(keys);
        keyProperties.forEach((val, index) => {
            if (val == evt.keyCode) {
                keys[evt.keyCode] = false;
            }
        });
        // keys[(<any> evt).keyCode] = false;
    });
    if (!document.querySelector('.page-info-txt[data-info="score"]')) {
        alert('Please provide "Score"');
    }
    if (insideOfWrapper) {
    }
    else {
        if (regularQuiz) {
            addSubmitBtn();
        }
    }
}
