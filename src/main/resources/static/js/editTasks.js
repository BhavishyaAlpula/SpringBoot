function updateTask(event){
		event.preventDefault();
		console.log("UPDATE FUNCTION CALLED");
	    const token = localStorage.getItem("token");
	    const taskId=document.getElementById("taskId").value;
	    const taskName = document.getElementById("taskName").value;
	    const description = document.getElementById("description").value;
	    const dueDate = document.getElementById("dueDate").value;
		const input=event.target;  
		
		
		fetch("/updateTask", {
	        method: "POST",
	        headers: {
	            "Content-Type": "application/json",
	            "Authorization": "Bearer "+token
	        },
	        body: JSON.stringify({taskId,taskName, description, dueDate })
	    })
		.then(response => {
	    	 if (response.ok) {
	    		 const loggedInUser = document.getElementById("userId").value;
              
        console.log("logggedInUser: "+ loggedInUser);

        const taskOwnerUserId = document.getElementById("taskOwnerUserID").value;
              
              
        console.log("TaskOwnerUserId: "+ taskOwnerUserId);

        // If taskOwnerUserId does not exist → user is editing their own task
        if (!taskOwnerUserId) {
            secureNavigate('/home');
            return;
        }

        // Condition:
        // If logged user == task owner's username → go home
        // Else → go to that user's tasks
        if (loggedInUser === taskOwnerUserId) {
            secureNavigate('/home');
        } else {
            secureNavigate(`/openTasks?userId=${taskOwnerUserId}&page=0&size=5`);
        }
	    	 }
	    	 else {
	             alert("Access Denied. Please login again.");
	    	 }
	    });
	    
	}
	
	function deleteAlert(event){
		
		event.preventDefault();
	    document.getElementById("customAlert").style.display = "flex";
	}
	
	function confirm(event){
		
		event.preventDefault();
		
		const token = localStorage.getItem("token");
	    const taskId=document.getElementById("taskId").value;
	    const redirectUrl=localStorage.getItem("redirectUrl");
	    
	    fetch("/deleteTask",{
	    	method:"POST",
	    	headers:{
	    		"Content-Type":"application/json",
	    		"Authorization":"Bearer "+token
	    	},
	    	body:JSON.stringify(taskId)
	    })
	    .then(response => {
	   	if (response.ok) {
	   	const loggedInUser = document.getElementById("userId").value;
              
        console.log("logggedInUser: "+ loggedInUser);

        const taskOwnerUserId = document.getElementById("taskOwnerUserID").value;
              
              
        console.log("TaskOwnerUserId: "+ taskOwnerUserId);

        // If taskOwnerUserId does not exist → user is editing their own task
        if (!taskOwnerUserId) {
            secureNavigate('/home');
            return;
        }

        // Condition:
        // If logged user == task owner's username → go home
        // Else → go to that user's tasks
        if (loggedInUser === taskOwnerUserId) {
            secureNavigate('/home');
        } else {
            secureNavigate(`/openTasks?userId=${taskOwnerUserId}&page=0&size=5`);
        }
	    	 }
	    	 else {
	             alert("Access Denied. Please login again.");
	    	 }
	    });
	}
	function closeAlert() {
	    const alertBox = document.getElementById("customAlert");
	    if (alertBox) {
	        alertBox.style.display = "none";
	    } else {
	        console.error("customAlert element not found");
	    }
	}
