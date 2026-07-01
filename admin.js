// ============================================
// PORTFOLIO ADMIN DASHBOARD
// ============================================

const adminForm = document.getElementById("adminProjectForm");
const projectsContainer = document.getElementById("adminProjectsContainer");

const adminStatus = document.getElementById("adminStatus");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelEdit");
const formHeading = document.getElementById("formHeading");

let editingProjectId = null;

// ============================================
// LOAD ALL PROJECTS
// ============================================

async function loadAdminProjects() {

    try {

        const response = await fetch("http://localhost:5000/api/projects");

        const result = await response.json();

        projectsContainer.innerHTML = "";

        result.data.forEach(project => {

            const technologies = project.technologies
                .map(tech => `<span>${tech}</span>`)
                .join("");

            const projectCard = document.createElement("div");

            projectCard.className = "admin-project-card";

            projectCard.innerHTML = `

                <img
                    src="${project.image || './img/project.png'}"
                    alt="${project.title}"
                >

                <div class="admin-card-content">

                    ${project.featured
                        ? `<span class="featured-badge">⭐ Featured</span>`
                        : ""
                    }

                    <h3>${project.title}</h3>

                    <p>${project.description}</p>

                    <strong>Category:</strong>

                    <p>${project.category || "Web Development"}</p>

                    <div class="tech-list">

                        ${technologies}

                    </div>

                    <div class="project-links">

                        ${
                            project.githubLink
                            ?

                            `<a href="${project.githubLink}" target="_blank">

                                <i class='bx bxl-github'></i>

                            </a>`

                            :

                            ""
                        }

                        ${
                            project.liveLink
                            ?

                            `<a href="${project.liveLink}" target="_blank">

                                <i class='bx bx-link-external'></i>

                            </a>`

                            :

                            ""
                        }

                    </div>

                    <div class="admin-actions">

                        <button
                            class="admin-edit-btn"
                            data-id="${project._id}">
                            Edit
                        </button>

                        <button
                            class="admin-delete-btn"
                            data-id="${project._id}">
                            Delete
                        </button>

                    </div>

                </div>

            `;

            // ==============================
            // EDIT BUTTON
            // ==============================

            projectCard
                .querySelector(".admin-edit-btn")
                .addEventListener("click", () => {

                    editingProjectId = project._id;

                    document.getElementById("projectId").value = project._id;

                    document.getElementById("title").value =
                        project.title;

                    document.getElementById("description").value =
                        project.description;

                    document.getElementById("technologies").value =
                        project.technologies.join(", ");

                    document.getElementById("githubLink").value =
                        project.githubLink || "";

                    document.getElementById("liveLink").value =
                        project.liveLink || "";

                    document.getElementById("image").value =
                        project.image || "";

                    document.getElementById("category").value =
                        project.category || "";

                    document.getElementById("featured").checked =
                        project.featured || false;

                    submitBtn.innerHTML =
                        "<i class='bx bx-save'></i> Update Project";

                    formHeading.textContent =
                        "Update Project";

                    cancelBtn.style.display = "block";

                    window.scrollTo({

                        top:0,

                        behavior:"smooth"

                    });

                });

            // ==============================
            // DELETE BUTTON
            // ==============================

            projectCard
                .querySelector(".admin-delete-btn")
                .addEventListener("click", () => {

                    deleteProject(project._id);

                });

            projectsContainer.appendChild(projectCard);

        });

    }

    catch(error){

        console.error(error);

    }

}

// ============================================
// RESET FORM
// ============================================

function resetForm(){

    adminForm.reset();

    editingProjectId = null;

    document.getElementById("projectId").value = "";

    submitBtn.innerHTML =
        "<i class='bx bx-plus'></i> Add Project";

    formHeading.textContent =
        "Add New Project";

    cancelBtn.style.display = "none";

}

// ============================================
// CANCEL EDIT
// ============================================

cancelBtn.addEventListener("click",resetForm);

// ============================================
// ADD / UPDATE PROJECT
// ============================================

adminForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const projectData = {

        title: document.getElementById("title").value.trim(),

        description: document.getElementById("description").value.trim(),

        technologies: document
            .getElementById("technologies")
            .value
            .split(",")
            .map(tech => tech.trim()),

        githubLink: document.getElementById("githubLink").value.trim(),

        liveLink: document.getElementById("liveLink").value.trim(),

        image: document.getElementById("image").value.trim(),

        category: document.getElementById("category").value.trim(),

        featured: document.getElementById("featured").checked

    };

    try {

        let response;

        // =============================
        // UPDATE
        // =============================

        if (editingProjectId) {

            response = await fetch(

                `http://localhost:5000/api/projects/${editingProjectId}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(projectData)

                }

            );

        }

        // =============================
        // ADD
        // =============================

        else {

            response = await fetch(

                "http://localhost:5000/api/projects",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(projectData)

                }

            );

        }

        if (!response.ok) {

            throw new Error("Failed");

        }

        adminStatus.style.color = "#00ff95";

        adminStatus.textContent = editingProjectId

            ? "Project updated successfully!"

            : "Project added successfully!";

        resetForm();

        loadAdminProjects();

    }

    catch (error) {

        console.error(error);

        adminStatus.style.color = "red";

        adminStatus.textContent = "Something went wrong.";

    }

});


// ============================================
// DELETE PROJECT
// ============================================

async function deleteProject(id) {

    const confirmDelete = confirm(

        "Are you sure you want to delete this project?"

    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(

            `http://localhost:5000/api/projects/${id}`,

            {

                method: "DELETE"

            }

        );

        if (!response.ok) {

            throw new Error("Delete Failed");

        }

        adminStatus.style.color = "#00ff95";

        adminStatus.textContent =

            "Project deleted successfully.";

        loadAdminProjects();

    }

    catch (error) {

        console.error(error);

        adminStatus.style.color = "red";

        adminStatus.textContent =

            "Unable to delete project.";

    }

}


// ============================================
// INITIAL LOAD
// ============================================

window.addEventListener("DOMContentLoaded", () => {

    loadAdminProjects();

});