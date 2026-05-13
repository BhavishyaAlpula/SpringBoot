/*console.log("users.js loaded");

document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".openTasksBtn");
    
    if (!btn) return;

    const token = localStorage.getItem("token");
    const userId = btn.getAttribute("data-userid");

    const res  = await fetch(`/openTasks?userId=${userId}&page=0&size=5`, {
        headers: { Authorization: "Bearer " + token }
    });

    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, "text/html");

    document.querySelector("#mainContent").innerHTML =
        doc.querySelector("#mainContent").innerHTML;
});*/