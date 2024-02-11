let allAssignmentsData = {}; // This object will hold all the assignment data

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve all assignments from storage
    chrome.storage.sync.get(null, function(data) {
        allAssignmentsData = data;
        const coursesContainer = document.getElementById('coursesContainer');

        // Iterate over each course
        for (const [courseId, assignments] of Object.entries(data)) {
            // Create a card for each course
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `<h2>Course: ${courseId}</h2>`;

            // Create a list for the assignments
            const assignmentsList = document.createElement('ul');
            assignmentsList.className = 'assignments-list';

            // Iterate over each assignment
            for (const [assignmentId, assignmentInfo] of Object.entries(assignments)) {
                const assignmentItem = document.createElement('li');
                assignmentItem.className = 'assignment-item';
                assignmentItem.innerHTML = `
                    <h3>${assignmentInfo.title}</h3>
                    <p>Due Date: ${assignmentInfo.dueDate}</p>
                    <p>Score: ${assignmentInfo.score}</p>
                `;
                assignmentsList.appendChild(assignmentItem);
            }

            courseCard.appendChild(assignmentsList);
            coursesContainer.appendChild(courseCard);
        }
    });

    document.getElementById('getRecommendations').addEventListener('click', function() {
        // Construct a user message with all assignment titles and due dates
        const assignmentDescriptions = Object.values(allAssignmentsData).map(courseAssignments => {
            return Object.values(courseAssignments).map(assignment => {
                return `Title: ${assignment.title}, Due Date: ${assignment.dueDate}`;
            }).join('; ');
        }).join('; ');

        const promptMessage = "This is a list of all the assignments I have and deadlines, using good scheduling habits how can I create a good schedule for them?";

        // Construct the messages array for the POST request
        const messages = [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: promptMessage },
            { role: 'user', content: assignmentDescriptions }
        ];
    
        // Send the data to the LLM
        fetch('https://llm-app-delicate-art-cd19.gariypaul.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                promptType: 'chat',
                messages: messages
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Use the response data to start the typewriter effect
            typeWrite(data.response.response);
        })
        .catch((error) => console.error('Error:', error));
    });
});
const typeWrite = (text) => {
    let index = 0;
    const llmResponse = document.getElementById('llmResponse');
    llmResponse.innerHTML = "";
  
    const timer = setInterval(() => {
      llmResponse.innerHTML += text.charAt(index);
      index++;
      if (index === text.length) {
        clearInterval(timer);
      }
    }, 100); // The speed of typewriting, in milliseconds
};

// fetch('https://llm-app-delicate-art-cd19.gariypaul.workers.dev/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     promptType: 'chat',
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: 'Who won the world series in 2020?' }
//     ]
//   }),
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch((error) => console.error('Error:', error));
