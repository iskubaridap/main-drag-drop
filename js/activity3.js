const createDropDown = (elemAry) => {
    elemAry.forEach((elem) => {
        const orderedList = document.createElement('ol');
        const selectElem = document.createElement('select');
        const option = document.createElement('option');
        orderedList.classList.add('droppable-txt', 'large-font');
        selectElem.setAttribute('data-droppable', elem.querySelector('.droppable').getAttribute('data-droppable'));
        selectElem.classList.add('quiz-dropdown-select');
        selectElem.setAttribute('data-result', 'incorrect');
        selectElem.setAttribute('data-finished', 'false');
        option.value = '';
        option.innerText = '-- Please choose an option --';
        selectElem.appendChild(option);
        document.querySelectorAll('.draggable').forEach((elem2) => {
            const option = document.createElement('option');
            option.value = elem2.getAttribute('data-draggable');
            option.innerText = elem2.querySelector('.draggable-item-label').innerText;
            selectElem.appendChild(option);
        });
        elem.querySelector('.droppable-txt').querySelectorAll('li').forEach(val => {
            const listTag = document.createElement('li');
            listTag.innerHTML = val.innerHTML;
            orderedList.appendChild(listTag);
        });
        document.getElementById('page-activity-dropdown-wrap').appendChild(orderedList);
        document.getElementById('page-activity-dropdown-wrap').appendChild(selectElem);
    });
    document.querySelectorAll(".quiz-dropdown-select").forEach((val, index) => {
        const elem = val;
        elem.addEventListener('change', (elemVal) => {
            const userSelectedVal = elemVal.target.value;
            const droppableVal = elemVal.target.getAttribute('data-droppable');
            elemVal.target.setAttribute('data-result', (userSelectedVal == droppableVal ? 'correct' : 'incorrect'));
            elemVal.target.setAttribute('data-finished', 'true');
            console.log(userSelectedVal, droppableVal)
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
    document.getElementById('page-activity-dropdown-wrap').innerHTML = '';
    createDropDown(document.querySelectorAll('.droppable-item-wrap'));
};
const setDraggableDropped = (draggableElem, droppableElem) => {
    let droppableCorrect = 0;
    const numIncorrect = 0;
    const droppableValueAry = droppableElem.getAttribute('data-droppable');
    const draggableValueAry = draggableElem.getAttribute('data-draggable');
    draggableElem.style.top = '0px';
    draggableElem.style.left = '0px';
    droppableElem.append(draggableElem);
    droppableElem.setAttribute('data-finished', 'true');
    if(draggableValueAry == droppableValueAry) {
        droppableElem.setAttribute('data-result', 'correct');
    } else {
        droppableElem.setAttribute('data-result', 'incorrect');
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
    let numAns = 0;
    let numCorrect = 0;
    document.querySelectorAll('.droppable').forEach((val) => {
        if(val.getAttribute('data-finished') == 'true') {
            numAns++;
        }
        if(val.getAttribute('data-result') == 'correct') {
            numCorrect++;
        }
    });
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    if(numAns == 0) {
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(numAns == numCorrect) {
        document.getElementById('question-correct').classList.add('active');
    } else {
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});
document.getElementById('dropdown-quiz-submit').addEventListener('click', () => {
    let numAns = 0;
    let numCorrect = 0;
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.quiz-dropdown-select').forEach((val) => {
        if(val.getAttribute('data-finished') == 'true') {
            numAns++;
        }
        if(val.getAttribute('data-result') == 'correct') {
            numCorrect++;
        }
    });
    if(numAns == 0) {
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(numAns == document.querySelectorAll('.quiz-dropdown-select').length &&
              numAns == numCorrect) {
        document.getElementById('question-correct').classList.add('active');
    } else {
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});

createDropDown(document.querySelectorAll('.droppable-item-wrap'));