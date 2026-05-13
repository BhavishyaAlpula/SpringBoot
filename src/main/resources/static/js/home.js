/*function openProfile() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("userDetailsPanel").style.display = "block";
    document.body.style.overflow = "hidden";
}*/

function closeUserDetails() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("userDetailsPanel").style.display = "none";
    document.body.style.overflow = "auto";
}

/*function editUser(){
		
	 const token = localStorage.getItem("token");
	 const id=document.getElementById("userId").value;
	 const username=document.getElementById("username").value;
	 const password=document.getElementById("password").value;
	 const name=document.getElementById("name").value;
	 const email=document.getElementById("email").value;
	 const phno=document.getElementById("phno").value;
	 
	 
	 
    fetch("/editUser",{
        method: "POST",
        headers: {
			"Content-Type":"application/json",
            "Authorization": "Bearer " + token
        },
        body : JSON.stringify({id,username,password,name,email,phno})
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Unauthorized");
        }
    })
    .then(html => {
         secureNavigateContent(html); 
        const userDetails=document.getElementById("userDetailsPanel");
	 	const overlay=document.getElementById("overlay");
	 	userDetails.style.display="none";
	 	overlay.style.display="none";
	 	
    })
    .catch(error => {
        alert("Session expired or unauthorized. Please login again.");
        window.location.href = "/login";
    });
}*/

/*document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Handle "Users" button click
    const usersLink = document.getElementById("usersLink");
    if (usersLink) {
        usersLink.addEventListener("click", (event) => {
            event.preventDefault();
            fetch("/getUsers?page=0&size=5", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then(res => res.text())
            .then(html => {
                 secureNavigateContent(html); 
            })
            .catch(() => {
                alert("Session expired. Please login again.");
                window.location.href = "/login";
            });
        });
    }

    // Pagination for tasks on home page
    setupPagination((page, size) => `/home?page=${page}&size=${size}`);
});*/


function logout(event){
	event.preventDefault();
	
	localStorage.removeItem("token");
	sessionStorage.removeItem('editUserData');
	window.location.href="/login";

}
``
/* For Pagination through JS without JWT
	
	document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll("#existingTable tr");
    const rowsPerPage = 5;
    const pagination = document.getElementById("pagination");

    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? "" : "none";
        });
    }

    function setupPagination() {
        const pageCount = Math.ceil(rows.length / rowsPerPage);
        pagination.innerHTML = "";

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.addEventListener("click", () => showPage(i));
            pagination.appendChild(btn);
        }

        showPage(1); // Show first page initially
    }

    if (rows.length > 0) {
        setupPagination();
    }
});*/