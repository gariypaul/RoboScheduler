import { getCurrentTab } from "./utils.js";

//function to add all assignments to extension DOM
const viewAssignments = (assignmentData)=>{
    const assignemntElements = document.getElementById("assignments");
    assignemntElements.innerHTML = "";
    console.log(assignmentData);
    //if an object exists then add assignments
    if(assignmentData){
       Object.keys(assignmentData).forEach(assignmentID=>{
        const assignment = assignmentData[assignmentID];
        addNewAssignment(assignemntElements,assignment)
       })
    }else{ //if they do not exist then show that there are no assignments to show
        assignemntElements.innerHTML = '<i class="row">No assignments to show</i>';
    }
}

const addNewAssignment = (assignmentElements, assignment) =>{
    const assignmentTitleElement = document.createElement("div");
    const newAssignmentElement = document.createElement("div");

    assignmentTitleElement.textContent = assignment.title+"- Due: "+ assignment.dueDate;
    assignmentTitleElement.className = "assignment-title";

    newAssignmentElement.className = "assignment";

    newAssignmentElement.appendChild(assignmentTitleElement);
    assignmentElements.appendChild(newAssignmentElement);
}
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
            console.log(courseId);
            //get current courseAssignments from chrome storage
            chrome.storage.sync.get(courseId, (data)=>{
                if(data[courseId]){
                    //retrieve the assignments for the current course
                    const currentCourseAssignments = data[courseId];
                    //view assignments in popup
                    viewAssignments(currentCourseAssignments);
                    

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
    //event to open full page html when clicked
    const openFullPageButton = document.getElementById('openFullPage');
    openFullPageButton.addEventListener('click',()=>{
        chrome.tabs.create({'url':chrome.runtime.getURL('fullpage.html')});
    }, false);
})

document.addEventListener('DOMContentLoaded', ()=>{
    
})