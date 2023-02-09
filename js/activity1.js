const createDropDown = () => {
    document.querySelectorAll('.drag-elem-wrap').forEach((dragElemWrap) => {
        const pElem = document.createElement('p');
        const selectElem = document.createElement('select');
        const option = document.createElement('option');
        selectElem.classList.add('quiz-dropdown-select');
        pElem.classList.add('dropdown-txt');
        pElem.innerText = dragElemWrap.querySelector('.draggable-txt').innerText;
        option.value = '';
        option.innerText = '-- Please choose an option --';
        selectElem.setAttribute('data-result', 'incorrect');
        selectElem.setAttribute('data-finished', 'false');
        selectElem.setAttribute('data-ans', dragElemWrap.querySelector('.draggable').getAttribute('data-ans'));
        selectElem.appendChild(option);

        document.querySelectorAll('.droppable-item-wrap').forEach((elem2) => {
            const option = document.createElement('option');
            option.value = elem2.querySelector('.droppable').getAttribute('data-ans');
            option.innerText = elem2.querySelector('.droppable-txt').innerText;
            selectElem.appendChild(option);
        });
        
        document.getElementById('page-activity-dropdown-wrap').appendChild(pElem);
        document.getElementById('page-activity-dropdown-wrap').appendChild(selectElem);
    });
    document.querySelectorAll(".quiz-dropdown-select").forEach((val, index) => {
        const elem = val;
        elem.addEventListener('change', (elemVal) => {
            const userSelectedVal = elemVal.target.value;
            const droppableVal = elemVal.target.getAttribute('data-ans');
            elemVal.target.setAttribute('data-result', (userSelectedVal == droppableVal ? 'correct' : 'incorrect'));
            elemVal.target.setAttribute('data-finished', 'true');
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
        val.style.margin = '5px auto';
        (_a = document.querySelector(`.drag-elem-wrap[data-item="${val.getAttribute('data-draggable')}"]`)) === null || _a === void 0 ? void 0 : _a.append(val);
        val.querySelector('.draggable-txt-wrap').classList.remove('incorrect');
        val.querySelector('.draggable-txt-wrap').classList.remove('correct');
    });
    document.querySelectorAll('.dropdown-txt').forEach(val => {
        val.remove();
    });
    document.querySelectorAll('.quiz-dropdown-select').forEach(val => {
        val.remove();
    });
    document.querySelectorAll('.quiz-try-again').forEach(val => {
        val.classList.add('active');
    });
    document.getElementById('question-start').classList.add('active');
    createDropDown();
};
const setDraggableDropped = (draggableElem, droppableElem) => {
    let droppableCorrect = 0;
    const numIncorrect = 0;
    const droppableValueAry = droppableElem.getAttribute('data-droppable').split(",").map((item) => item.trim());
    const dragAns = draggableElem.getAttribute('data-ans');
    const dropAns = droppableElem.getAttribute('data-ans');
    draggableElem.style.top = '0px';
    draggableElem.style.left = '0px';
    draggableElem.style.margin = '5px auto';
    droppableElem.append(draggableElem);
    draggableElem.setAttribute('data-finished', 'true');
    if(dragAns == dropAns) {
        draggableElem.setAttribute('data-result', 'correct');
    } else {
        draggableElem.setAttribute('data-result', 'incorrect');
    }
    document.querySelectorAll('.droppable-item-aria-select').forEach(val => {
        const elem = val;
        elem.querySelectorAll('option').forEach(val => {
            if (val.value == draggableElem.getAttribute('data-draggable')) {
                val.remove();
            }
        });
    });
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
document.getElementById('drag-drop-quiz-show-me').addEventListener('click', () => {
    resetDragDrop();
    document.querySelectorAll('.draggable').forEach((val) => {
        const ans = val.getAttribute('data-ans');
        document.querySelector(`.droppable[data-ans="${ans}"]`).append(val);
        
    });
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.quiz-next').forEach((val) => {
        val.classList.add('active');
    });
});
document.getElementById('dropdown-quiz-reset').addEventListener('click', () => {
    resetDragDrop();
});
document.getElementById('dropdown-quiz-show-me').addEventListener('click', () => {
    resetDragDrop();
    document.querySelectorAll('.draggable').forEach((val) => {
        const ans = val.getAttribute('data-ans');
        document.querySelector(`.droppable[data-ans="${ans}"]`).append(val);
        
    });
    document.querySelectorAll('.quiz-dropdown-select').forEach((elem) => {
        elem.value = elem.getAttribute('data-ans');
    });
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
});
document.querySelectorAll('.quiz-next').forEach((val, index) => {
    val.addEventListener('click', function () {
        if (insideOfWrapper) {
            parent.nextPage();
        }
    });
});
document.getElementById('drag-drop-quiz-submit').addEventListener('click', () => {
    const numCorrect = document.querySelectorAll('.draggable[data-result="correct"]').length;
    const numFinished = document.querySelectorAll('.draggable[data-finished="true"]').length;
    const numDragElems = document.querySelectorAll('.draggable').length;
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.answer-response-txt').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    if(numFinished == 0) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(numFinished < numDragElems) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-start').classList.add('active');
    } else if(numFinished == numDragElems && numCorrect == numDragElems) {
        document.querySelectorAll('.correct-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-next').forEach((val) => {
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
        document.querySelectorAll('.quiz-show-me').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.draggable[data-result="incorrect"]').forEach((val) => {
            val.querySelector('.draggable-txt-wrap').classList.add('incorrect');
        });
        document.querySelectorAll('.draggable[data-result="correct"]').forEach((val) => {
            val.querySelector('.draggable-txt-wrap').classList.add('correct');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});
document.getElementById('dropdown-quiz-submit').addEventListener('click', () => {
    const numCorrect = document.querySelectorAll('.quiz-dropdown-select[data-result="correct"]').length;
    const numFinished = document.querySelectorAll('.quiz-dropdown-select[data-finished="true"]').length;
    const numDragElems = document.querySelectorAll('.quiz-dropdown-select').length;
    document.querySelectorAll('.response-btns').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.answer-response-txt').forEach((val) => {
        val.classList.remove('active');
    });
    document.querySelectorAll('.question-txt-wrap').forEach((val) => {
        val.classList.remove('active');
    });
    if(numFinished == 0) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-no-answer').classList.add('active');
    } else if(numFinished < numDragElems) {
        document.querySelectorAll('.no-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-submit').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.getElementById('question-start').classList.add('active');
    } else if(numFinished == numDragElems && numCorrect == numDragElems) {
        document.querySelectorAll('.correct-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-next').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-dropdown-select[data-result="correct"]').forEach((val) => {
            val.classList.add('correct');
        });
        document.getElementById('question-correct').classList.add('active');
    } else {
        document.querySelectorAll('.incorrect-response').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-try-again').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-show-me').forEach((val) => {
            val.classList.add('active');
        });
        document.querySelectorAll('.quiz-dropdown-select[data-result="correct"]').forEach((val) => {
            val.classList.add('correct');
        });
        document.querySelectorAll('.quiz-dropdown-select[data-result="incorrect"]').forEach((val) => {
            val.classList.add('incorrect');
        });
        document.getElementById('question-incorrect').classList.add('active');
    }
});

createDropDown();