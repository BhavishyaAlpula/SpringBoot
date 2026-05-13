console.log("utilityFunction.js loaded");
document.addEventListener("DOMContentLoaded", () => {

    // Check if we need to add a task row after reload
    if (sessionStorage.getItem("addTaskAfterLoad") === "true") {
        sessionStorage.removeItem("addTaskAfterLoad");
        addTaskRow();
    }
});
function openProfile() {
    console.log("openProfile called");
    document.getElementById("userDetailsPanel").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    cacheUserDetailsFromPanel();
}

function closeUserDetails() {
    document.getElementById("userDetailsPanel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

window.openProfile = openProfile;
window.closeUserDetails = closeUserDetails;

function cacheUserDetailsFromPanel() {
  const pick = (id) => {
    const el = document.getElementById(id);
    return el && typeof el.value === 'string' ? el.value : null;
  };

  const user = {
    id:    pick("userId"),
    username: pick("username"),
    name:  pick("name"),
    email: pick("email"),
    phno:  pick("phno")
  };

  // ❗ Don’t overwrite good data if panel DOM is missing/empty
  if (!user.username || !user.email) {
    console.warn("[cache] Missing key fields, NOT overwriting editUserData:", user);
    return;
  }

  sessionStorage.setItem("editUserData", JSON.stringify(user));
  console.log("[cache] stored editUserData =", user);
}
function editUser() {
	
	document.getElementById("userDetailsPanel").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    secureNavigate('/editUser');
}
// ==========================
// Secure Navigation Function
// ==========================
function secureNavigateContent(html) {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const doc = new DOMParser().parseFromString(html, "text/html");
    
	doc.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
	        const href = link.getAttribute("href");
	        if (!document.querySelector(`link[href="${href}"]`)) {
	            const newLink = document.createElement("link");
	            newLink.rel = "stylesheet";
	            newLink.href = href;
	            document.head.appendChild(newLink);
	        }
	    });

    const fetchedContent =
        doc.querySelector("#pageContent") ||
        doc.querySelector("#mainContent") ||
        doc.body;

    container.innerHTML = fetchedContent.innerHTML;
}
function secureNavigate(url, callback) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "/login";
    return;
  }

  fetch(url, {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(async (response) => {
    if (response.ok) return response.text();
    const txt = await response.text().catch(() => "");
    throw new Error("Access Denied");
  })
  .then(html => {
    const container = document.getElementById("mainContent");
    if (!container) {
      console.error("mainContent container not found!");
      return;
    }

    let content = html;
    if (html.includes("<html")) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const fetchedContent =
        doc.querySelector("#pageContent") ||
        doc.querySelector("#mainContent") ||
        doc.body;

      content = fetchedContent ? fetchedContent.innerHTML : "";
      if (doc.title) document.title = doc.title;
    }

	container.innerHTML = content;
	// ---------- Load scripts inside fetched HTML ----------
	const tempDc = new DOMParser().parseFromString(html, "text/html");
	const scriptTags = tempDc.querySelectorAll("script");
	
	scriptTags.forEach(script => {
	    const newScript = document.createElement("script");
	
	    if (script.src) {
	        // External JS file (editTasks.js, home.js, etc.)
	        newScript.src = script.src;
	    } else {
	        // Inline JS inside the page
	        newScript.textContent = script.textContent;
	    }
	
	    document.body.appendChild(newScript);
	});
	// ----------- PAGE-SPECIFIC CSS LOADER -----------
	const tempHead = new DOMParser().parseFromString(html, "text/html");
	const newCssLinks = tempHead.querySelectorAll('link[rel="stylesheet"]');
	
	// 1) Remove old page CSS (keep shared)
	document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
	  const href = link.getAttribute("href") || "";
	 if (!href.includes("common") &&!href.includes("bootstrap") &&!href.includes("base")) 
	 {
	    link.remove();
	 }
	});
	
	// 2) Add CSS from the fetched page (avoid duplicates)
	newCssLinks.forEach(link => {
	  const href = link.getAttribute("href") || "";
	  if (!href) return;
	  if (!document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
	    const css = document.createElement("link");
	    css.rel = "stylesheet";
	    css.href = href;
	    document.head.appendChild(css);
	  }
	});

	
	if (sessionStorage.getItem("addTaskAfterLoad") === "true") {
	        sessionStorage.removeItem("addTaskAfterLoad");
	        addTaskRow();
	    }

    // re-init pagination (idempotent)
    setupPagination();

    if (callback) callback();
  })
  .catch(() => {
    alert("Access Denied. Please login again.");
    window.location.href = "/login";
  });
}

// ==========================
// Show Add Task Function
// ==========================
function showAddTask() {
    // Stop duplicate row
    if (document.getElementById("taskName")) return;

    const pagination = document.querySelector(".pagination");

    // EMPTY TASKS CASE
    if (!pagination) {
        const taskTable = document.getElementById("taskTable");
        const taskBody = document.getElementById("taskBody");

        taskTable.style.display = "table";
        document.getElementById("noTasks").style.display = "none";

        addTaskRow(); 
        return;
    }

    // NORMAL CASE (tasks exist)
    const totalPages = parseInt(pagination.getAttribute("data-total-pages"));
    const currentPage = parseInt(pagination.getAttribute("data-current-page"));
    const pageSize = parseInt(pagination.getAttribute("data-page-size")) || 5;

    if (currentPage !== totalPages - 1) {
        sessionStorage.setItem("addTaskAfterLoad", "true");

        const base = pagination.getAttribute("data-endpoint-prefix");
        const sep = base.includes("?") ? "&" : "?";

        secureNavigate(`${base}${sep}page=${totalPages - 1}&size=${pageSize}`);
        return;
    }

    addTaskRow();
}


function addTaskRow() {
    // If tasks exist → existingTable will be present
    const existingTable = document.getElementById("existingTable");

    // If tasks DO NOT exist → use taskBody inside hidden table
    const emptyTableBody = document.getElementById("taskBody");

    let target;

    if (existingTable) {
        target = existingTable; // normal case
    } else if (emptyTableBody) {
        // show empty table and hide "No tasks available"
        document.getElementById("taskTable").style.display = "table";
        const noTasks = document.getElementById("noTasks");
        if (noTasks) noTasks.style.display = "none";

        target = emptyTableBody; // empty list case
    } else {
        return; // nothing to insert into
    }

    const newRowHTML = `
        <tr>
            <td></td>
            <td><input type="text" id="taskName" placeholder="Task Name" required /></td>
            <td><input type="text" id="description" placeholder="Description" required /></td>
            <td><input type="date" id="dueDate" required /></td>
            <td><button id="save" onclick="saveTask(event)">Save</button></td>
        </tr>
    `;

    target.insertAdjacentHTML("beforeend", newRowHTML);
}

// ==========================
// Save Task Function
// ==========================
function saveTask(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const taskName = document.getElementById("taskName").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const taskOwnerUserId = document.getElementById("usersUserId").value|| document.getElementById("userId").value;
    console.log(taskOwnerUserId);

    fetch(`/addTask?userId=${taskOwnerUserId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ taskName, description, dueDate})
    })
    .then(response => {
        if (response.ok) {
            alert("Task saved successfully!");
             const loggedInUser = document.getElementById("userId").value;
              
        console.log("logggedInUser: "+ loggedInUser);

        const taskOwnerUserId = document.getElementById("usersUserId").value;
              
              
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
        } else {
            alert("Access Denied. Please login again.");
            window.location.href = "/login";
        }
    })
    .catch(error => {
        console.error("Error saving task:", error);
        alert("Session expired. Please login again.");
        window.location.href = "/login";
    });
}


// ================== Edit Task ====================

document.addEventListener("click", (e) => {
    if (e.target.id === "backToTasksLink") {

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
});

// ==========================
// Pagination Setup Function
// ==========================
// ==========================
// Pagination (global, idempotent)
// ==========================
// ==========================
// Pagination (global, delegated, attaches once)
// ==========================
function setupPagination(/* no params needed */) {
  if (window.__paginationHandlerAttached) return;
  window.__paginationHandlerAttached = true;

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".page-link");
    if (!link) return;

    const ul = link.closest(".pagination");
    if (!ul) return;

    const totalPages = parseInt(ul.getAttribute("data-total-pages")) || 1;
    const currentPage = parseInt(ul.getAttribute("data-current-page")) || 0;
    const base = ul.getAttribute("data-endpoint-prefix") || "";
    const pageSize = parseInt(ul.getAttribute("data-page-size")) || 5;

    if (!base) {
      console.error("Missing data-endpoint-prefix on .pagination");
      return;
    }

    // Decide target page
    const pageAttr = link.getAttribute("data-page");
    let targetPage = currentPage;
    if (pageAttr === "prev") targetPage = currentPage - 1;
    else if (pageAttr === "next") targetPage = currentPage + 1;
    else targetPage = parseInt(pageAttr);

    if (isNaN(targetPage) || targetPage < 0 || targetPage >= totalPages) return;

    // Build endpoint and navigate securely (Authorization header is added by secureNavigate)
   const sep = base.includes("?") ? "&" : "?";
	const endpoint = `${base}${sep}page=${targetPage}&size=${pageSize}`;

    secureNavigate(endpoint);
    e.preventDefault();
  });
}


/*function openEditForm(taskId) {
    const token = localStorage.getItem("token");
   const redirectUrl=document.body.getAttribute("data-redirect-url");
   localStorage.setItem("redirectUrl",redirectUrl);

    fetch("/editTasks", {
        method: "POST",
        headers: {
			"Content-Type":"application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(taskId)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Unauthorized");
        }
    })
   
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })*/
/*function openEditForm(taskId) {
    const token = localStorage.getItem("token");

    fetch("/editTasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(taskId)
    })
    .then(response => response.text())
    .then(html => {
        secureNavigateContent(html);  
    })
    .catch(error => {
        alert("Session expired or unauthorized. Please login again.");
        window.location.href = "/login";
    });
}*/
/*document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".openTasksBtn");
    if (!btn) return;

    const token = localStorage.getItem("token");
    const userId = btn.getAttribute("data-userid");

    const res = await fetch(`/openTasks?userId=${userId}&page=0&size=5`, {
        headers: { Authorization: "Bearer " + token }
    });

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    document.querySelector("#mainContent").innerHTML =
        doc.querySelector("#mainContent").innerHTML;
});
*/

(function clearOnFreshLoad() {
if (location.pathname === '/login') {
    sessionStorage.clear();
  }
})();
