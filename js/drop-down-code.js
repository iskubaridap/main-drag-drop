var resetDropDown = function() {
    $('.drop-down-wrap .btn-reset').trigger('click');
};
var generateDropDownItems = function(obj) {
    var str = '';
    $.each(obj.dragObj.items, function(dragIndex, dragValue) {
        str += '<div class="row"><div class="col-md-12">';
        str += '<div class="drop-down-item-wrap">';
        str += '<div class="drop-down-question" data-id="' + dragValue.id + '" data-answer-value="">';
        str += '<p><span class="drop-down-response-icon glyphicon"></span>' + dragValue.text + '</p>';
        str += '<span class="drop-down-arrow glyphicon glyphicon-triangle-right"></span>';
        str += '<p class="drop-down-answer"></p>';
        str += '</div>'; // .drop-down-question
        str += '<div class="drop-down-selection-wrap"><ul>';
        $.each(obj.dropObj.items, function(dropIndex, dropValue) {
            str += '<li data-id="' + dropValue.id + '">' + dropValue.text + '</li>';
        });
        str += '</ul></div>'; // .drop-down-selection-wrap
        str += '</div>'; // .drop-down-item-wrap
        str += '</div></div>'; // .row .col-md-12
    });
    return str;
};
var generateDropDownElements = function(obj) {
    $(dropDownElement).load('../pages/drop-down.html .drop-down-wrap', function(){
        $(dropDownElement).find('.drop-down-content-wrap').empty();
        $(dropDownElement).find('.drop-down-content-wrap').append(generateDropDownItems(obj));
        addDropDownEvent();
        resetDropDown();
        setWinHeightByPercent();
    });
};

var addDropDownEvent = function() {
    var numGotAnswered = 0;
    var reset = function() {
        $('.drop-down-wrap .glyphicon-triangle-bottom').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
        $('.drop-down-wrap .drop-down-selection-wrap').hide();
    };
    $('.drop-down-wrap .drop-down-arrow').each(function() {
        $(this).off().on('click', function() {
            var mainParent = $(this).parent().parent();
            if($(this).hasClass('glyphicon-triangle-right')) {
                reset();
                $(this).removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                $('.drop-down-wrap .drop-down-selection-wrap').hide();
                mainParent.find('.drop-down-selection-wrap').slideDown('fast');
            } else {
                $(this).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                mainParent.find('.drop-down-selection-wrap').slideUp('fast');
            }
        });
    });
    $('.drop-down-wrap .drop-down-selection-wrap li').each(function() {
        $(this).off().on('click', function() {
            var mainParent = $(this).parent().parent().parent();
            var dropValue = $(this).attr('data-id');
            var dropText = $(this).text();
            var correctValue = mainParent.find('.drop-down-question').attr('data-id');
            var numDropDownItem = $('.drop-down-wrap .drop-down-item-wrap').length;
            
            reset();
            if((mainParent.find('.drop-down-question').attr('data-answer-value')).length <= 0) {
                numGotAnswered++;
            }
            mainParent.find('.drop-down-question').attr('data-answer-value', dropValue);
            mainParent.find('.drop-down-answer').show().text(dropText);
            $('.drop-down-wrap .btn-reset').show();
            if(numDropDownItem == numGotAnswered) {
               $('.drop-down-wrap .btn-submit').show();
            }
        });
    });
    $('.drop-down-wrap .btn-reset').off().on('click', function() {
        $('.drop-down-wrap .btn-reset').hide();
        $('.drop-down-wrap .btn-submit').hide();
        $('.drop-down-wrap .drop-down-question').attr('data-answer-value', '');
        $('.drop-down-wrap .drop-down-answer').text('').hide();
        $('.drop-down-wrap .drop-down-item-wrap').removeClass('correct').removeClass('incorrect');
        $('.drop-down-wrap .drop-down-response-icon').removeClass('glyphicon-ok').removeClass('glyphicon-remove');
        reset();
        numGotAnswered = 0;
    });
    $('.drop-down-wrap .btn-submit').off().on('click', function() {
        $('.drop-down-wrap .drop-down-selection-wrap li').each(function() {
            var mainParent = $(this).parent().parent().parent();
            var dropValue = mainParent.find('.drop-down-question').attr('data-answer-value');
            var dropText = $(this).text();
            var correctValue = mainParent.find('.drop-down-question').attr('data-id');
            
            mainParent.find('.drop-down-response-icon').addClass('space');
            mainParent.find('.drop-down-response-icon').removeClass('glyphicon-ok').removeClass('glyphicon-remove');
            mainParent.removeClass('correct').removeClass('incorrect');
            
            if(dropValue == correctValue) {
                mainParent.addClass('correct');
                mainParent.find('.drop-down-response-icon').addClass('glyphicon-ok');
            } else {
                mainParent.addClass('incorrect');
                mainParent.find('.drop-down-response-icon').addClass('glyphicon-remove');
            }
        });
    });
};

var initDropDown = function() {
    $('.drop-down-wrap .btn-reset').hide();
    $('.drop-down-wrap .btn-submit').hide();
    $('.drop-down-wrap .drop-down-answer').text('').hide();
    $('.drop-down-wrap .btn-reset').hide();
    $('.drop-down-wrap .btn-submit').hide();
    
    generateDropDownElements(eval($(dropDownElement).attr('data-obj')));
    addDropDownEvent();
};
initDropDown();