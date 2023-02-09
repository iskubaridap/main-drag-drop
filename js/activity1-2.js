const createDropDown = (elemAry) => {
    for(let i = 0; i < document.querySelectorAll('.draggable').length; i++) {
        const selectElem = document.createElement('select');
        const option = document.createElement('option');
        selectElem.classList.add('quiz-dropdown-select');
        selectElem.setAttribute('data-finished', 'false');
        selectElem.setAttribute('data-result', 'incorrect');
        option.value = '';
        option.innerText = '-- Please choose an option --';
        selectElem.appendChild(option);
        elemAry.forEach((elem) => {
            const option = document.createElement('option');
            option.value = elem.querySelector('.droppable').getAttribute('data-droppable');
            option.setAttribute('data-ans', elem.querySelector('.droppable').getAttribute('data-ans'));
            option.innerText = elem.querySelector('.droppable-txt').innerText;
            selectElem.appendChild(option);
        });
        document.getElementById('page-activity-dropdown-wrap').appendChild(selectElem);
    }
    document.querySelectorAll(".quiz-dropdown-select").forEach((val, index) => {
        const elem = val;
        elem.addEventListener('change', (elemVal) => {
            const userSelectedVal = elemVal.target.value;
            const selectedOptionTagIndex = elemVal.target.selectedIndex;
            elemVal.target.setAttribute('data-finished', 'true');
            elemVal.target.setAttribute('data-result', elemVal.target.querySelectorAll('option')[selectedOptionTagIndex].getAttribute('data-ans'));
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
};
const resetDragDrop = () => {
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.answer-response-txt').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.quiz-submit').forEach((val) => {
        val.classList.add('active');
    });
    document.querySelectorAll('.droppable').forEach((val, index) => {
        val.setAttribute('data-result', 'incorrect');
    });
    document.querySelectorAll('.draggable').forEach((val, index) => {
        var _a;
        val.style.margin = '0';
        (_a = document.querySelector(`.drag-elem-wrap[data-item="${val.getAttribute('data-draggable')}"]`)) === null || _a === void 0 ? void 0 : _a.append(val);
    });
    document.querySelectorAll('.quiz-dropdown-select').forEach(val => {
        val.remove();
    });
    document.getElementById('question-start').classList.add('active');
    createDropDown(document.querySelectorAll('.droppable-item-wrap'));
};
const setDraggableDropped = (draggableElem, droppableElem) => {
    let droppableCorrect = 0;
    const numIncorrect = 0;
    const dragElemResult = draggableElem.getAttribute('data-ans');
    const dropElemResult = droppableElem.getAttribute('data-ans');
    const dragDropResult = dragElemResult == dropElemResult;
    // const droppableValueAry = droppableElem.getAttribute('data-droppable').split(",").map((item) => item.trim());
    if (droppableElem.childNodes.length <= 0 && draggableElem != null) {
        draggableElem.style.top = '0px';
        draggableElem.style.left = '0px';
        droppableElem.append(draggableElem);
        /* if (droppableElem.querySelectorAll('.draggable').length == droppableValueAry.length) {
            const dragElem = droppableElem.querySelectorAll('.draggable');
            droppableValueAry.forEach((val, index) => {
                for (let i = 0; i < dragElem.length; i++) {
                    if (dragElem[i].getAttribute('data-ans') == 'correct') {
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
        } */
        if(dragDropResult) {
            droppableElem.setAttribute('data-result', 'correct');
        } else {
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
document.querySelectorAll('.quiz-try-again').forEach((val) => {
    val.addEventListener('click', () => {
        resetDragDrop();
    });
});
document.getElementById('drag-drop-quiz-submit').addEventListener('click', () => {
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.answer-response-txt').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    console.log(document.querySelectorAll('.droppable[data-result="correct"]').length);
    if(document.querySelectorAll('#page-activity-droppable-wrap .draggable').length == 0) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(document.querySelectorAll('.droppable[data-result="correct"]').length == document.querySelectorAll('.draggable').length) {
        document.querySelectorAll('.correct-response').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-correct').classList.add('active');
    } else {
        document.querySelectorAll('.incorrect-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});
document.getElementById('dropdown-quiz-submit').addEventListener('click', () => {
    let numAns = 0;
    let numCorrect = 0;
    const dropdownSelect = document.querySelectorAll('.quiz-dropdown-select');
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.answer-response-txt').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    dropdownSelect.forEach((val) => {
        if(val.getAttribute('data-finished') == 'true') {
            numAns++;
        }
        if(val.getAttribute('data-result') == 'correct') {
            numCorrect++;
        }
    });
    console.log(numCorrect);
    if(numAns == 0) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(numAns == numCorrect) {
        document.querySelectorAll('.correct-response').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-correct').classList.add('active');
    } else {
        document.querySelectorAll('.incorrect-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});

createDropDown(document.querySelectorAll('.droppable-item-wrap'));