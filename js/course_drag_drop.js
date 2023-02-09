var dragDropNum = 0;
var cageBottom = false;
var cageReady = true;

function playAudio(audioPath)
{
    audioStop();
    $('#audio source').eq(0).attr("src",'');
    $('#audio source').eq(0).attr("src",(parent.audioPath + audioPath));
    audio.load();
    var playPromise = audio.play();
    playPromise.then(_ => {
        audio.pause();
        audio.play();
    })
    .catch(error => {
        audio.pause();
        audio.play();
    });
    //audioPlay();
    parent.showPauseBtn();
}
function reset()
{
    dragDropNum = 0;
    cageBottom = false;
    cageReady = true;
    $('.next-page-row, .click-appear-text').hide();
    $('.reset-drag-btn').trigger('click');
    $('.drag-item').show();
    $('#drag-drop-btn').hide();
}
$("#resource-info-close-btn").off("click").on("click",function(){
    audioStop();
    $("#resource-info-wrap").fadeOut();
});
$('.reset-drag-btn').off().on('click', function(){
    $('#continue-btn').trigger('click');
    $('.draggable-text').each(function(){
        $(this).removeClass('selected');
        $(this).removeClass('gray-text');
    });
    $('.drag-item').css({opacity: 1});
});
$('#continue-btn').off().on('click', function(){
    cageBottom = true;
    $('#drop-message').slideUp();
    $('.drop-item').find('img').attr('src', '../img/img-cage.svg');
    $('.drop-item').animate({top: '20px'},'slow',function(){
        cageBottom = false;
        cageReady = true;
    });
    $('.draggable-text').each(function(){
        if($(this).hasClass('selected'))
        {
            $(this).removeClass('selected').addClass('gray-text');
        }
    });
    audioStop();
});
$('.click-appear-icon').each(function(){
    $(this).off().on('click', function(){
        playAudio($(this).attr('data-audio'));
        $(this).parent().find('.click-appear-text').fadeIn('fast');
    });
});
$(".drag-item").draggable({
    zIndex: 50,
    revert: true
});

$(".drop-item").droppable({
    drop: function(event,ui){
        var dragItems = $(".drag-item").length;
        var dragItemsInDroppableElems = 0;
        var draggableObj = ui.draggable;
        var droppableElem = this;
        
        //if(cageBottom == false)
        if(cageReady == true)
        {
            cageReady = false;
            $(draggableObj).css({opacity: 0});
            dragDropNum = dragDropNum + 1;
            $(droppableElem).find('img').attr('src', '../img/img-cage-dropped.svg');
            if(($(draggableObj).attr('data-title').toLocaleLowerCase()).search('good trap') >= 0)
            {
                $(droppableElem).animate({top: ((parseInt($('.droppable-wrap').css('height').replace('px','')) - ($('.drop-item').height()) - parseInt($('.drop-item').css('top').replace('px',''))) + 'px')}, 'slow',function(){
                    cageBottom = true;
                });
            }

            $('#drop-message-notice').html($(draggableObj).attr('data-title'));
            $('#drop-message-text').html($(draggableObj).attr('data-content'));
            $('#drop-message').slideDown();

            playAudio($(draggableObj).attr('data-audio'));

            $(draggableObj).parent().parent().parent().find('.draggable-text').addClass('selected');

            if(dragDropNum == dragItems)
            {
                $('#drag-drop-btn').fadeIn();
            }
        }
    }
});
// $('.droppable-wrap').height($('.draggable-section').parent().height());
// $(window).resize(function(){
//     $('.droppable-wrap').height($('.draggable-section').parent().height());
// });