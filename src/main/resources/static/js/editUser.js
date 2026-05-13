// If you use inline onclick="updateUser(event)" on the page:
function updateUser(event) {
  event.preventDefault();
  // ...your existing fetch to update user...
}
window.updateUser = updateUser; // expose to inline handler if needed



let editedFields = {
    username: false,
    password: false,
    name: false,
    email: false,
    phno: false
};

// Track changes
document.getElementById("username").addEventListener("input", () => editedFields.username = true);
document.getElementById("password").addEventListener("input", () => editedFields.password = true);
document.getElementById("name").addEventListener("input", () => editedFields.name = true);
document.getElementById("email").addEventListener("input", () => editedFields.email = true);
document.getElementById("phno").addEventListener("input", () => editedFields.phno = true);

function updateUser(event) {
	
	event.preventDefault();
	
	const token=localStorage.getItem("token");
    const userId = document.getElementById("userId").value;
    const payload = {};

    if (editedFields.username) {
        payload.username = document.getElementById("username").value;
    }
    if (editedFields.password) {
        payload.password = document.getElementById("password").value;
    }
    if (editedFields.name) {
        payload.name = document.getElementById("name").value;
    }
    if (editedFields.email) {
        payload.email = document.getElementById("email").value;
    }
    if (editedFields.phno) {
        payload.phno = document.getElementById("phno").value;
    }

    fetch(`/updateUser?userId=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(payload)
    })
    
	.then(async response => {
        const text = await response.text(); // Read response body
        if (response.ok) {
            alert(text || "User updated successfully!");
            window.location.href = "/login"; 
        } else {
            throw new Error(text || "Update failed");
        }
    })

    .catch(error => {
        alert("Error updating user: " + error.message);
    });
}

function deleteAlert(event){
	
	event.preventDefault();
	 document.getElementById("customAlert").style.display = "flex";
}

function confirm(event){
	
	event.preventDefault();
	
	const token = localStorage.getItem("token");
    const userId=document.getElementById("userId").value;
    
    fetch("/deleteUser",{
    	method:"POST",
    	headers:{
    		"Content-Type":"application/json",
    		"Authorization":"Bearer "+token
    	},
    	body:JSON.stringify(userId)
    })
    .then(response => {
    	 if (response.ok) {
    		 window.location.href="/login";
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
