var shuffleDragDropAry = function(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
var resetDragDrop = function() {
    $('.drag-drop-wrap .btn-reset').trigger('click');
    $('.drag-drop-wrap .btn-reset').hide();
    $('.drag-drop-wrap .btn-submit').hide();
};
var generateDroppableItemContents = function(obj) {
    var str = '';
    str = '<div class="drag-drop-table"><div>';
    str += '<div class="droppable-red-wrap"><div class="draggable-droppable-item-wrap semi-transparent"><div class="drop-item" data-id="' + obj.id + '" data-answer-value=""></div></div></div>';
    str += '<div class="bg-light-gray"><p class="large-font droppable-text">' + obj.text + '</p></div>';
    str += '</div></div>';
    return str;
};
var generateDraggableItemContents = function(index, obj) {
    var str = '';
    str = '<div class="drag-drop-table"><div>';
    str += '<div><p class="large-font draggable-text">' + obj.text + '</p></div>';
    str += '<div>';
    str += '<div class="draggable-droppable-item-wrap" data-id="' + obj.id + '">';
    str += '<div class="drag-item draggable-droppable-item blue" data-id="' + obj.id + '"><span class="draggable-item-index">' + index + '</span></div>';
    str += '</div>';
    str += '</div>';
    str += '</div></div>';
    return str;
};
var generateDroppableItems = function(ary) {
    var str = '';
    $.each((shuffleDragDrop ? shuffleDragDropAry(ary) : ary) , function(index, value) {
        str += generateDroppableItemContents(value);
    });
    return str;
};
var generateDraggableItems = function(ary) {
    var str = '';
    $.each((shuffleDragDrop ? shuffleDragDropAry(ary) : ary), function(index, value) {
        str += generateDraggableItemContents((index +1 ), value);
    });
    return str;
};
var generateDragDropElements = function(obj) {
    $(dragDropElement).load('../pages/drag-drop.html .drag-drop-wrap', function(){
        $(dragDropElement).find('.draggable-wrap').empty();
        $(dragDropElement).find('.droppable-wrap').empty();
        $(dragDropElement).find('.draggable-wrap').append(generateDraggableItems(obj.dragObj.items));
        $(dragDropElement).find('.droppable-wrap').append(generateDroppableItems(obj.dropObj.items));
        addDragDropEvent();
        resetDragDrop();
        setWinHeightByPercent();
    });
};
var addDragDropEvent = function() {
    $('.drag-drop-wrap .drag-item').draggable({
        zIndex: 50,
        revert: true
    });
    $(".drag-drop-wrap .drop-item").droppable({
        drop: function(event,ui){
            var draggableObj = ui.draggable;
            var numDragItems = $('.drag-item').length;
            var numDragItemsInDroppableElems = 0;
            var droppableElem = this;
            $(droppableElem).attr('data-answer-value', $(draggableObj).attr('data-id'));
            $(ui.draggable).detach().css({top: 0,left: 0}).appendTo($(this));
            numDragItemsInDroppableElems = $('.droppable-wrap .drag-item').length;
            $('.btn-reset').show();
            if(numDragItems == numDragItemsInDroppableElems) {
                $('.btn-submit').show();
            }
        }
    });
    $('.drag-drop-wrap .btn-reset').off().on('click', function() {
        $('.drag-drop-wrap .drag-item').each(function(){
            $('.drag-drop-wrap .drop-item').attr('data-answer-value','');
            $(this).appendTo(('.draggable-wrap .draggable-droppable-item-wrap[data-id="' + $(this).attr("data-id") + '"]'));
            $(this).removeClass('green').removeClass('red').addClass('blue');
        });
        $('.drag-drop-wrap .btn-reset').hide();
        $('.drag-drop-wrap .btn-submit').hide();
    });
    $('.drag-drop-wrap .btn-submit').off().on('click', function() {
        $('.drag-drop-wrap .drop-item').each(function() {
            var dropID = $(this).attr('data-id');
            var dragID = $(this).attr('data-answer-value');
            var dragObj = $(this).find('.drag-item');
            if(dropID == dragID) {
                dragObj.removeClass('blue').addClass('green');
            } else {
                dragObj.removeClass('blue').addClass('red');
            }
        });
    });
};
var initDragDrop = function() {
    $('.drag-drop-wrap .btn-reset').hide();
    $('.drag-drop-wrap .btn-submit').hide();
    
    generateDragDropElements(eval($(dragDropElement).attr('data-obj')));
    addDragDropEvent();
};
initDragDrop();