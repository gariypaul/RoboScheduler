//add event listener to check for new tab updates
chrome.tabs.onUpdated.addListener((tabId,tab)=>{
    //regex pattern to check if the page is an assignment page to a canvas course and not another page outside canvas or within canvas
    var pattern = /canvas.*\/courses\/.*\/assignments/;
    //check if there is a url and if the url matches the regex pattern 
    if (tab.url && pattern.test(tab.url)){

        //split the url into path segments 
        const pathSegments = tab.url.pathname.split('/');
        //course Id sits at the path segment right after the courses segment courses/{courseid}/assignments
        const courseIDIndex = pathSegments.findIndex(segment => segment==="courses")+1;
        //courseid
        const courseId = pathSegments[courseIDIndex];
        //send course ID data over Chrome API
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            courseID: courseId,
        });
    }

})