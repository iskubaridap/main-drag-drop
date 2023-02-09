$(function(){
    function reviewSideChange(front) {
        if (front) {
            $(this).find('.flashcard').closest('.flashcard').children('.side_a').toggleClass("dontDisplay");
            $(this).find('.flashcard').closest('.flashcard').children('.side_b').toggleClass("dontDisplay");
            $(this).closest('.fc_group').children('.reviewOptions').toggleClass("dontDisplay");
        } else {
            $(this).find('.flashcard').closest('.flashcard').children('.side_a').toggleClass("dontDisplay");
            $(this).find('.flashcard').closest('.flashcard').children('.side_b').toggleClass("dontDisplay");
            $(this).closest('.fc_group').children('.reviewOptions').toggleClass("dontDisplay");
        }
    }
    
    $('.fc_group').off().on("click",function () {
        $(this).rotate3Di(
            'toggle',
            300,
            {
                sideChange: reviewSideChange
            }
        );
    });
});