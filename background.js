// Add event listener to check for new tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Ensure the changeInfo.status is 'complete' to make sure the page is fully loaded
    if (changeInfo.status === 'complete' && tab.url) {
        // Regex pattern to check if the page is an assignment page to a canvas course and not another page outside canvas or within canvas
        var pattern = /canvas.*\/courses\/.*\/assignments/;
        // Check if the URL matches the regex pattern
        if (pattern.test(tab.url)) {
            // Create a URL object from the tab.url string
            const url = new URL(tab.url);
            // Split the pathname of the URL into path segments
            const pathSegments = url.pathname.split('/');
            // Course ID sits at the path segment right after the 'courses' segment (courses/{courseId}/assignments)
            const courseIDIndex = pathSegments.findIndex(segment => segment === "courses") + 1;
            // Extract the courseId
            const courseId = pathSegments[courseIDIndex];
            // Send course ID data over Chrome API
            console.log(courseId);
            chrome.tabs.sendMessage(tabId, {
                type: "NEW",
                courseID: courseId,
            });
        }
    }
});
