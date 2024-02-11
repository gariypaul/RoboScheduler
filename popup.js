import { getCurrentTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", async ()=>{
    const activeTab = await getCurrentTab();
    var pattern = /canvas.*\/courses\/.*\/assignments/;
    if(activeTab.url){
        if(pattern.test(activeTab.url)){
            // Create a URL object from the tab.url string
            const url = new URL(activeTab.url);
            // Split the pathname of the URL into path segments
            const pathSegments = url.pathname.split('/');
            // Course ID sits at the path segment right after the 'courses' segment (courses/{courseId}/assignments)
            const courseIDIndex = pathSegments.findIndex(segment => segment === "courses") + 1;
            // Extract the courseId
            const courseId = pathSegments[courseIDIndex];
            //get current courseAssignments from chrome storage
            chrome.storage.sync.get(currentCourse, (data)=>{
                if(data[currentCourse]){
                    const currentCourseAssignments = data[courseId];
                    

                }
                else{
                    
                }
            })
        }else{
            //not a canvas assignment page
            const extensionPage = document.getElementsByClassName("container")[0];

            extensionPage.innerHTML = '<div class = "title"> This is not a Canvas assignments page </div>' 
        }
    }
})