(()=>{
    //set the current courseId number
    let currentCourse = "";
    //data structure to hold assignments scanned 
    const courseAssignments = {}

    //receive the message from background.js
    chrome.runtime.onMessage.addListener((obj,sender,response)=>{
        const {type,value,courseID} = obj;
        console.log(URLSearchParams)
        if(type === "NEW"){
            currentCourse = courseID;
            newCourseOpened();
        }
    });

    //function on logic to follow when a valid assignments page is opened
    const newCourseOpened = ()=>{
        //check if there are assignments listed by checking the element class that holds assignment list
        const assignmentExists = document.getElementsByClassName("assignment_group");
        //get the elements that hold assignment information
        scrapeAssignments();

        if(assignmentExists){
            //logic to scrape information of all assignments

        }
        else{
            //logic to set popup to warn that no assignments exist
        }
    }
   
    //function to scrape for all assignment details in the page
   const scrapeAssignments = ()=>{
    //get all nodes that are in the class .ig-info which holds the assignment information on canvas
    const assignments = document.querySelectorAll(".ig-info");
    
    //for each node perform operations to take element values that hold information we need about assignments
    assignments.forEach(assignment =>{
        //get the assignment attribute href from the title. Holds assignmentID
        const url = assignment.querySelector(".ig-title").getAttribute('href');
        //find the match to the regex that has the course and extract course and assignment IDs
        const match = url.match(/courses\/(\d+)\/assignments\/(\d+)/);
        // if a match is found in URL (data check)
        if(match){
            //extract courseID
            const courseId = match[1];
            //extract assignmentId
            const assignmentId = match[2];
            //extract assingment info using parseAssignmentInfo function which return info dictionary
            const assignmentInfo  = parseAssignmentInfo(assignment);

            //check if the course has been added to data dictonary 
            if(!courseAssignments[courseId]){
                courseAssignments[courseId] = {};
            }
            //add the assignment to the dictionary with a dictonary for its own id (this is to make sure we can access assignment info in constant time with hashing)
            courseAssignments[courseId][assignmentId] = assignmentInfo;
        }
    })

   }

   //function to parse assignment element from webpage with logic to do extraction of necessary information
   const parseAssignmentInfo = (assignmentElement) => {
        //this extracts the assignment title 
        const titleElement = assignmentElement.querySelector("ig-title");
        const title = titleElement.textContent.trim();
        const url = titleElement.getAttribute("href");

        //Extracting the due date
        const dueDateElement = assignmentElement.querySelector(".assignment-date-due span");
        //if no due date set no due date
        const dueDate = dueDateElement ? dueDateElement.textContent.trim() : "No due date";

        //Extracting the score information
        const scoreElement = assignmentElement.querySelector(".js-score .score-display");
        //extract the maximum score for the assignment. Ignore any grade already set 
        const score = scoreElement ? scoreElement.textContent.trim().split("/")[1] : "No score";

        //TODO: check what happens when the due date has not been set or score set

        return {
            title,
            url,
            dueDate,
            score
        };
   }

    
})