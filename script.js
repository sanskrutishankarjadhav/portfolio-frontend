// ====== TYPED ANIMATION ======
var typed = new Typed(".text", {
    strings: [
        "Frontend Development",
        "Software Development",
        "AEM Development"
    ],
    typeSpeed: 80,
    backSpeed: 30,
    backDelay: 1200,
    loop: true
});



// ====== LOAD PROJECTS FROM BACKEND ======
async function loadProjects() {

    try {

        const response = await fetch("http://localhost:5000/api/projects");
        const result = await response.json();

        const container = document.getElementById("projectsContainer");

        if (!container) return;

        container.innerHTML = "";

        result.data.forEach((project) => {

            const projectElement = document.createElement("div");
            projectElement.classList.add("reveal");

            projectElement.innerHTML = `

                <div class="project-card">

                    <img
                        src="${project.image || "./img/project.png"}"
                        alt="${project.title}"
                        class="project-image">

                    <div class="project-title">

                        ${project.title}

                    </div>

                    <div class="project-overlay">

                        <h3>${project.title}</h3>

                        <p>${project.description}</p>

                        <div class="project-tech">

                            ${project.technologies
                                .map(tech => `<span>${tech}</span>`)
                                .join("")}

                        </div>

                        <div class="project-icons">

                            ${
                                project.githubLink
                                ? `
                                <a href="${project.githubLink}" target="_blank">
                                    <i class='bx bxl-github'></i>
                                </a>`
                                : ""
                            }

                            ${
                                project.liveLink
                                ? `
                                <a href="${project.liveLink}" target="_blank">
                                    <i class='bx bx-link-external'></i>
                                </a>`
                                : ""
                            }

                        </div>

                    </div>

                </div>

            `;

            container.appendChild(projectElement);

        });

        initReveal();

    }
    catch (error) {

        console.error("Error loading projects:", error);

    }

}



// ====== CONTACT FORM ======
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const formData = {

            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()

        };

        fetch("http://localhost:5000/api/contact", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(formData)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error("Server Error");

            }

            return response.json();

        })

        .then(() => {

            formStatus.textContent = "Message sent successfully!";
            formStatus.style.color = "#00ff95";

            contactForm.reset();

        })

        .catch(error => {

            console.error(error);

            formStatus.textContent = "Something went wrong. Please try again.";
            formStatus.style.color = "red";

        });

    });

}



// ====== ACTIVE NAV LINK ======
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {

    sections.forEach(sec => {

        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");

        if (top >= offset && top < offset + height) {

            navLinks.forEach(link => link.classList.remove("active"));

            const activeLink = document.querySelector(`header nav a[href*="${id}"]`);

            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    });

};



// ====== GO TO TOP BUTTON ======
const toTop = document.querySelector(".top");

window.addEventListener("scroll", () => {

    if (window.pageYOffset > 100) {

        toTop.classList.add("active");

    }

    else {

        toTop.classList.remove("active");

    }

});



// ====== SCROLL REVEAL ======
function initReveal() {

    const cards = document.querySelectorAll(".reveal");

    function checkScroll() {

        cards.forEach((card, index) => {

            const rect = card.getBoundingClientRect();

            if (rect.top < window.innerHeight * 0.85) {

                setTimeout(() => {

                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";

                }, index * 120);

            }

        });

    }

    checkScroll();

    window.addEventListener("scroll", checkScroll);

}



// ====== INITIAL LOAD ======
window.addEventListener("DOMContentLoaded", () => {

    loadProjects();
    initReveal();

});

