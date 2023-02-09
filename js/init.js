"use strict";
if ((window.location.href).search('/pages') < 0) {
    var init = (json) => {
        // check if the course is in SCORM or in development
        if (SCORM && !courseStart) {
            initScorm(json);
        }
        else {
            loadPages(json);
        }
    };
    init(settings);
}
