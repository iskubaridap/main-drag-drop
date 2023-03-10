nextPage = function()
{
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#transcript").hide();
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audioStop();
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.currentTime = 0;
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#audio source").each(function(){
            if($(this).attr("data-default") != undefined)
            {
                $(this).attr("src", audioPath + $(this).attr("data-default"));
            }
        });
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.audio.load();
    }
    if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo == "function")
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.stopYTVideo();
    }
    if($("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#video").length > 0)
    {
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$("#videoModal").modal("hide");
        $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.videoStop();
    }

    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.$(".audioPlayer").each(function(){
        $(this).each(function(){
            if($(this).find("source").attr("src") != undefined)
            {
                $(this)[0].pause();
            }
        });
    });
    
    wrapperObj.currentPage += 1;

    if(repeatCourse || coursePass)
    {
        quizPageIndex = (quizPageIndex < (quizes.length - 1)) ? (quizPageIndex + 1) : quizPageIndex;
        $.each(pages,function(index,val){
            if(val.pageName == quizes[quizPageIndex])
            {
                wrapperObj.currentPage = index;
                return false;
            }
        });
    }

    for(var i = 0; i < quizes.length; i++)
    {
        if(pages[wrapperObj.currentPage].pageName == quizes[i])
        {
            if(typeof $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer == "function")
            {
                $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.startTimer();
            }
        }
    }
    $("#pageContent .page").eq(wrapperObj.currentPage)[0].contentWindow.setSeeMoreBtn();
    setPage();
    showProperAudioBtn();
}