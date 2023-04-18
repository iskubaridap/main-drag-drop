$(document).ready(function(){
    winWidth = $(window).width();
    dropItemMade = false;
    // $('#resource-info-wrap').show();
    $("#resource-info-close-btn").off("click").on("click",function(){
        $("#resource-info-wrap").fadeOut("fast");
    });
    $('.drop-item-info').each(function(){
        var str = '';
        var resources = $(this).parent().find('.drop-item-info');
        
        $("#resource-info").empty().html($(this).attr('data-resource-data'));
        $("#resource-info-wrap").slideToggle("fast");
    });
    $('.drag-item-info').each(function(){
        var str = '';
        var resources = $(this).parent().find('.drag-item-info');
        
        $(this).off().on('click', function(){
            $("#resource-info").empty().html($(this).attr('data-text'));
            $("#resource-info-wrap").fadeIn("fast");
        });
    });
    $('.reset-drag-drop-btn, .reset-drag-drop-btn-2').off().on('click', function(){
        winWidth = $(window).width();
        
        $('.drag-item-info-resources').slideUp('fast');
        $('.drop-item-info-resources').slideUp('fast');
        
        $('.drag-item').each(function(){
            $(this).find('.submit-response-drag').removeClass('correct').removeClass('incorrect');
            $(this).attr('style','');
            //$(this).appendTo(('.drag-item-wrap[data-icon="' + $(this).attr("data-icon") + '"]'));
            $(this).appendTo(('.drag-item-wrap[data-icon="' + $(this).attr("data-icon") + '"] .drag-holder'));
            if($(this).hasClass('red-border'))
            {
                $(this).removeClass('red-border').addClass('gray-border');
            }
        });
        $('.drop-item').each(function(){
            $(this).find('.submit-response-drop').removeClass('missing');
            if($(this).hasClass('no-border'))
            {
                $(this).removeClass('no-border').addClass('red-border');
            }
        });
        
        setSelectElem();
        
        /* if(winWidth < 766)
        {
            $('.drop-select-wrap').show();
            $('.drop-items-wrap').hide();
        }
        else if(winWidth >= 766)
        {
            $('.drop-select-wrap').hide();
            $('.drop-items-wrap').show();
        } */
    });
    $(".drag-item").draggable({
        zIndex: 50,
        revert: true
    });
    $(".drop-item").droppable({
        drop: function(event,ui){
            var draggableObj = ui.draggable;
            var droppableElem = this;
            
            if($(this).find('.drag-item').length <= 0)
            {
                $(draggableObj).detach().css({top: 0,left: 0, position: 'absolute'}).appendTo(droppableElem);
                $(droppableElem).removeClass('red-border').addClass('no-border');
                $(draggableObj).removeClass('gray-border').addClass('red-border');
            }
            $('.drag-item-info-resources').slideUp('fast');
            $('.drop-item-info-resources').slideUp('fast');
        }
    });
    $('.submit-drag-drop-btn, .submit-drag-drop-btn-2').off().on('click', function(){
        $('.next-page-btn-2').css({display: 'inline-block'});
        checkAnswer();
    });
    
    function checkAnswer()
    {
        var dropValue = '';
        var numOfCorrect = 0;
        var numOfMissed = 0;
        var dragValue = '';
        var dragObj = null;
        var incorrectMsg = '';
        var oneCorrectMsg = '';
        var correctMsg = '';
        
        $('.drop-item').each(function(index, value){
            dragObj = null;
            dropValue = $(this).attr('data-value');
            if($(this).find('.drag-item').length > 0)
            {
                dragObj = $(this).find('.drag-item').eq(0);
                dragValue = dragObj.attr('data-value');
                
                if(incorrectMsg.length == '')
                {
                    incorrectMsg = dragObj.find('.submit-response-drag').attr('data-incorrect');
                }
                if(oneCorrectMsg.length == '')
                {
                    oneCorrectMsg = dragObj.find('.submit-response-drag').attr('data-one-correct');
                }
                if(correctMsg.length == '')
                {
                    correctMsg = dragObj.find('.submit-response-drag').attr('data-both-correct');
                }
                if(dropValue == dragValue)
                {
                    numOfCorrect++;
                    dragObj.find('.submit-response-drag').addClass('correct');
                }
                else
                {
                    dragObj.find('.submit-response-drag').addClass('incorrect');
                }
            }
            else if($(this).find('.drag-item').length <= 0)
            {
                numOfMissed++;
                $(this).find('.submit-response-drop').addClass('missing');
            }
        });
        
        //$('.drop-select-wrap').hide();
        //$('.drop-items-wrap').show();
        
        if(self != top)
        {
            stopAudio();
            /* $("#audio source").each(function(){
                if(numOfCorrect == 2)
                {
                    $(this).attr("src",parent.audioPath + $(this).attr("data-both-correct"));
                }
                else if(numOfCorrect == 1)
                {
                    $(this).attr("src",parent.audioPath + $(this).attr("data-one-correct"));
                }
                else if(numOfCorrect == 0)
                {
                    $(this).attr("src",parent.audioPath + $(this).attr("data-incorrect"));
                }
            }); */
            audioPlay();
        }
        $('.submit-response-drag.correct').off().on('click', function(){
            $("#resource-info").empty().html('<p class="biggest-font text-center">Correct!</p><p>' + $(this).attr('data-both-correct') + '</p>');
            $("#resource-info-wrap").fadeIn("fast");
        });
        $('.submit-response-drag.incorrect').off().on('click', function(){
            $("#resource-info").empty().html('<p class="biggest-font text-center">Incorrect!</p><p>' + $(this).attr('data-incorrect') + '</p>');
            $("#resource-info-wrap").fadeIn("fast");
        });
        $('.submit-response-drop.missing').off().on('click', function(){
            $("#resource-info").empty().html('<p class="biggest-font text-center">Missing something?</p><p>' + $(this).attr('data-missing') + '</p>');
            $("#resource-info-wrap").fadeIn("fast");
        });
        if(numOfCorrect == 0) {
            $("#resource-info").empty().html('<p class="biggest-font text-center">Incorrect!</p><p>' + incorrectMsg + '</p>');
        } else if(numOfCorrect < $('.drop-item[data-value="correct"]').length) {
            $("#resource-info").empty().html('<p class="biggest-font text-center">Incorrect!</p><p>' + oneCorrectMsg + '</p>');
        } else if(numOfCorrect == $('.drop-item[data-value="correct"]').length) {
            $("#resource-info").empty().html('<p class="biggest-font text-center">Correct!</p><p>' + correctMsg + '</p>');
        }
        $("#resource-info-wrap").fadeIn("fast");
    }
    function setSelectElem() {
        $('.drop-select-wrap').empty();
        $('.drop-item').each(function(index, value){
            if($('.drop-select-wrap').children().length < $('.drag-item-wrap').children().length) {
                var dropObj = $(this);
                str = '<select class="drag-select">';
                str += '<option value="" readisabled selected>Select you answer</option>';
                $('.drag-item').each(function(index2, value2){
                    str += '<option value="' + $(this).attr('data-value') + ' - ' + $(this).attr('data-icon') + '">' + $(this).find('.drag-item-text').text() + '</option>';
                });
                str += '</select>'
                $('.drop-select-wrap').append(str);


                $('.drop-select-wrap select').each(function(index2, value2){
                    $(this).off().on('change', function(){
                        var dragObj = null;
                        var draggableObj = null;
                        var droppableElem = null;
                        var val = ($(this).val()).split(' - ')[0];
                        var icon = ($(this).val()).split(' - ')[1];

                        $('.drag-item').each(function(index3, value3){
                            if($(this).attr('data-icon') == icon) {
                                draggableObj = $(this);
                                dragObj = value3;

                                $('.drop-select-wrap select option').each(function(index4, value4){
                                    if($(this).prop("selected") == false && (($(this).val()).split(' - ')[1]) == icon)
                                    {
                                        $(this).remove();
                                    }
                                });
                                $('.drop-item').each(function(index, value){
                                    droppableElem = this;

                                    if($(this).find('.drag-item').length <= 0) {
                                        $(draggableObj).detach().css({top: 0,left: 0, position: 'absolute'}).appendTo(droppableElem);
                                        $(this).css({display: 'inline-block'});
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                    });
                });
            }
        });
    }
    function checkWindowSize(winSize)
    {
        var str = '';
        
        if(winSize < 766)
        {
            //console.log(winSize + ' - ' + winSize < 766);
            //$('.drop-select-wrap').show();
            //$('.drop-items-wrap').hide();
            dropItemMade = true;
            $('.drop-item-text').hide();
            setSelectElem();
        }
        else if(winSize >= 766)
        {
            //console.log(winSize + ' - ' + winSize >= 766);
            //$('.drop-select-wrap').hide();
            //$('.drop-items-wrap').show();
            dropItemMade = false;
            $('.drop-item-text').show();
        }
    }
    $(window).resize(function(){
        winWidth = $(window).width();
        //dropItemMade = false;
        checkWindowSize(winWidth)
    });
    checkWindowSize($(window).width())
});