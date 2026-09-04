/* =========================================================
   BLACKPEPPER INFOSERVICES
   Interactive Frontend Features
   ========================================================= */


/* ================= MOBILE NAVIGATION ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-link, .nav-button").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= SCROLL PROGRESS ================= */

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        (scrollTop / documentHeight) * 100;

    progressBar.style.width = `${progress}%`;

});


/* ================= ACTIVE NAVIGATION ================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentId = entry.target.id;

                navLinks.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${currentId}`
                    ) {
                        link.classList.add("active");
                    }

                });

            }

        });

    },

    {
        threshold: 0.25
    }

);

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* ================= S.M.A.C. INTERACTION ================= */

const smacData = {

    social: {

        number: "01",

        title: "Social",

        subtitle: "Connect. Engage. Grow.",

        description:
            "Digital experiences that help businesses communicate effectively, engage audiences and build meaningful online relationships."

    },

    mobility: {

        number: "02",

        title: "Mobility",

        subtitle: "Connect from anywhere.",

        description:
            "Mobile-focused experiences designed to keep customers and businesses connected through accessible and convenient digital solutions."

    },

    analytics: {

        number: "03",

        title: "Analytics",

        subtitle: "Understand. Measure. Improve.",

        description:
            "Data-driven approaches that help transform digital activity into useful insights for better decisions and continuous improvement."

    },

    cloud: {

        number: "04",

        title: "Cloud",

        subtitle: "Scale with confidence.",

        description:
            "Cloud-oriented solutions designed around flexibility, reliability and the ability to adapt as digital requirements grow."

    }

};


const smacTabs = document.querySelectorAll(".smac-tab");

const smacNumber = document.getElementById("smacNumber");
const smacTitle = document.getElementById("smacTitle");
const smacSubtitle = document.getElementById("smacSubtitle");
const smacDescription = document.getElementById("smacDescription");


smacTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        smacTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const selected = tab.dataset.tab;

        const data = smacData[selected];

        smacNumber.textContent = data.number;

        smacTitle.textContent = data.title;

        smacSubtitle.textContent = data.subtitle;

        smacDescription.textContent = data.description;

    });

});


/* ================= SERVICE EXPLORER ================= */

const serviceData = {

    aws: {

        title: "AWS Consulting & Migration",

        icon: "fab fa-aws",

        description:
            "Cloud-focused assistance for organizations looking to improve the way their digital workloads are structured, managed and scaled.",

        features: [
            "Cloud planning and architecture thinking",
            "Migration-oriented digital workflows",
            "Scalability and reliability considerations"
        ]

    },

    mobile: {

        title: "Mobile Apps",

        icon: "fas fa-mobile-screen-button",

        description:
            "Mobile experiences designed to provide convenient access to digital services while maintaining a clear and intuitive user journey.",

        features: [
            "Mobile-first user experiences",
            "Responsive interface thinking",
            "User-focused interaction design"
        ]

    },

    web: {

        title: "Web Apps",

        icon: "fas fa-laptop-code",

        description:
            "Interactive web applications combining useful functionality with clean interfaces and accessible digital experiences.",

        features: [
            "Responsive web interfaces",
            "Interactive components",
            "User-focused layouts"
        ]

    },

    ecommerce: {

        title: "Ecommerce Website",

        icon: "fas fa-cart-shopping",

        description:
            "Online shopping experiences designed to make product discovery, navigation and customer interaction simple and engaging.",

        features: [
            "Product-focused interfaces",
            "Clear navigation structures",
            "Customer-oriented experiences"
        ]

    },

    wordpress: {

        title: "WordPress Website",

        icon: "fab fa-wordpress",

        description:
            "Professional content-driven websites that combine flexible presentation with straightforward content management.",

        features: [
            "Content-focused layouts",
            "Responsive presentation",
            "Flexible website structures"
        ]

    },

    hosting: {

        title: "Scalable Cloud Website Hosting",

        icon: "fas fa-server",

        description:
            "Hosting approaches designed to support dependable website performance while allowing infrastructure to adapt to changing requirements.",

        features: [
            "Performance considerations",
            "Scalability planning",
            "Reliable digital delivery"
        ]

    },

    seo: {

        title: "SEO & Social Media Marketing",

        icon: "fas fa-chart-line",

        description:
            "Digital visibility strategies focused on helping organizations improve discoverability, engagement and online communication.",

        features: [
            "Search visibility planning",
            "Digital audience engagement",
            "Online brand presence"
        ]

    },

    crm: {

        title: "Lead Generation & CRM",

        icon: "fas fa-filter-circle-dollar",

        description:
            "Digital workflows that support lead collection, organization and meaningful customer relationship management.",

        features: [
            "Lead-focused user journeys",
            "Customer information organization",
            "Conversion-oriented experiences"
        ]

    },

    messaging: {

        title: "Email & SMS Push",

        icon: "fas fa-envelope-open-text",

        description:
            "Communication-oriented digital experiences designed to help businesses deliver timely information to their audiences.",

        features: [
            "Direct communication channels",
            "Timely customer messaging",
            "Audience engagement workflows"
        ]

    }

};


const serviceModal =
    document.getElementById("serviceModal");

const serviceModalTitle =
    document.getElementById("serviceModalTitle");

const serviceModalDescription =
    document.getElementById("serviceModalDescription");

const serviceModalIcon =
    document.getElementById("serviceModalIcon");

const serviceFeatures =
    document.getElementById("serviceFeatures");


document.querySelectorAll(".service-card").forEach(card => {

    card.addEventListener("click", () => {

        const service =
            serviceData[card.dataset.service];

        serviceModalTitle.textContent =
            service.title;

        serviceModalDescription.textContent =
            service.description;

        serviceModalIcon.innerHTML =
            `<i class="${service.icon}"></i>`;

        serviceFeatures.innerHTML =
            service.features
                .map(feature => `
                    <div class="modal-feature">
                        <i class="fas fa-check"></i>
                        ${feature}
                    </div>
                `)
                .join("");

        serviceModal.classList.add("show");

        document.body.style.overflow = "hidden";

    });

});


/* ================= SERVICE SEARCH ================= */

const serviceSearch = document.getElementById("serviceSearch");

if (serviceSearch) {

    serviceSearch.addEventListener("input", () => {

        const query = serviceSearch.value.trim().toLowerCase();

        document.querySelectorAll('.service-card').forEach(card => {

            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';

            const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';

            const key = (card.dataset.service || '').toLowerCase();

            const match = !query || title.includes(query) || desc.includes(query) || key.includes(query);

            card.style.display = match ? '' : 'none';

        });

    });

}

/* Persist search in URL and initialize from query param */

function applyServiceFilter(query) {

    const q = (query || '').trim().toLowerCase();

    document.querySelectorAll('.service-card').forEach(card => {

        const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';

        const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';

        const key = (card.dataset.service || '').toLowerCase();

        const match = !q || title.includes(q) || desc.includes(q) || key.includes(q);

        card.style.display = match ? '' : 'none';

    });

}

if (serviceSearch) {

    const params = new URLSearchParams(window.location.search);

    const initial = params.get('q') || '';

    if (initial) {

        serviceSearch.value = initial;

        applyServiceFilter(initial);

    }

    serviceSearch.addEventListener('input', () => {

        const query = serviceSearch.value.trim();

        applyServiceFilter(query);

        const p = new URLSearchParams(window.location.search);

        if (query) {

            p.set('q', query);

            history.replaceState(null, '', `${location.pathname}?${p.toString()}`);

        } else {

            p.delete('q');

            const newUrl = p.toString() ? `${location.pathname}?${p.toString()}` : location.pathname;

            history.replaceState(null, '', newUrl);

        }

    });

}


/* ================= FAQ INTERACTION ================= */

document.querySelectorAll('.faq-item').forEach(item => {

    const btn = item.querySelector('.faq-question');

    btn.addEventListener('click', () => {

        const open = item.classList.contains('open');

        // close all
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

        if (!open) item.classList.add('open');

    });

});


/* ================= PRODUCT SHOWCASE ================= */

const productData = {

    vidfy: {

        title: "Vidfy",

        icon: "fas fa-play",

        description:
            "A video-oriented digital product concept designed around content delivery, discovery and digital viewing experiences."

    },

    vbc: {

        title: "VBC",

        icon: "fas fa-photo-film",

        description:
            "A media management product concept focused on organizing and working with digital content efficiently."

    },

    cdnflash: {

        title: "CDNFlash",

        icon: "fas fa-bolt",

        description:
            "A digital image optimization concept designed to support efficient image resizing and delivery."

    },

    graphshape: {

        title: "Graphshape",

        icon: "fas fa-chart-pie",

        description:
            "An analytics-focused product concept for interpreting video and event-related digital information."

    }

};


const productModal =
    document.getElementById("productModal");

const productModalTitle =
    document.getElementById("productModalTitle");

const productModalDescription =
    document.getElementById("productModalDescription");

const productModalIcon =
    document.getElementById("productModalIcon");


document.querySelectorAll(".product-card").forEach(card => {

    card.addEventListener("click", () => {

        const product =
            productData[card.dataset.product];

        productModalTitle.textContent =
            product.title;

        productModalDescription.textContent =
            product.description;

        productModalIcon.innerHTML =
            `<i class="${product.icon}"></i>`;

        productModal.classList.add("show");

        document.body.style.overflow = "hidden";

    });

});


/* ================= CLOSE MODALS ================= */

function closeModal(modal) {

    modal.classList.remove("show");

    document.body.style.overflow = "";

}


document
    .getElementById("closeServiceModal")
    .addEventListener("click", () => {
        closeModal(serviceModal);
    });


document
    .getElementById("closeProductModal")
    .addEventListener("click", () => {
        closeModal(productModal);
    });


/* Click outside modal */

[serviceModal, productModal].forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            closeModal(modal);

        }

    });

});


/* Escape key */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeModal(serviceModal);

        closeModal(productModal);

    }

});


/* ================= PARTNER HIGHLIGHT ================= */

const partnerCards =
    document.querySelectorAll(".partner-card");

const partnerMessage =
    document.getElementById("partnerMessage");


const partnerMessages = {

    AWS:
        "AWS partnership highlights cloud-focused technology capabilities.",

    Google:
        "Google partnership represents access to a broad digital technology ecosystem.",

    Microsoft:
        "Microsoft partnership supports technology and software-oriented capabilities.",

    IBM:
        "IBM partnership adds another layer to the technology ecosystem.",

    Verisign:
        "Verisign represents digital security and online trust capabilities.",

    "The Planet":
        "The Planet represents hosting and infrastructure-oriented capabilities.",

    Orange:
        "Orange represents connectivity and communication technology.",

    GoDaddy:
        "GoDaddy represents website, hosting and domain-related services."

};


partnerCards.forEach(card => {

    card.addEventListener("click", () => {

        partnerCards.forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        const partner =
            card.dataset.partner;

        partnerMessage.textContent =
            partnerMessages[partner];

    });

});


/* ================= TESTIMONIAL CAROUSEL ================= */

const testimonials = [

    {

        text:
            "Digital solutions become more valuable when usability, technology and business objectives are considered together.",

        name:
            "Business-first approach",

        role:
            "Digital Strategy"

    },

    {

        text:
            "Modern web experiences should make complex technology easier to understand, navigate and use.",

        name:
            "User-focused thinking",

        role:
            "UI / UX Experience"

    },

    {

        text:
            "Scalable digital solutions provide businesses with the flexibility to adapt as their requirements change.",

        name:
            "Scalable solutions",

        role:
            "Technology & Growth"

    }

];


let currentTestimonial = 0;


const testimonialText =
    document.getElementById("testimonialText");

const testimonialName =
    document.getElementById("testimonialName");

const testimonialRole =
    document.getElementById("testimonialRole");

const carouselDots =
    document.getElementById("carouselDots");


function renderDots() {

    carouselDots.innerHTML = "";

    testimonials.forEach((_, index) => {

        const dot =
            document.createElement("button");

        dot.classList.add("carousel-dot");

        if (index === currentTestimonial) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {

            currentTestimonial = index;

            updateTestimonial();

        });

        carouselDots.appendChild(dot);

    });

}


function updateTestimonial() {

    const data =
        testimonials[currentTestimonial];

    testimonialText.style.opacity = "0";

    setTimeout(() => {

        testimonialText.textContent =
            data.text;

        testimonialName.textContent =
            data.name;

        testimonialRole.textContent =
            data.role;

        testimonialText.style.opacity = "1";

    }, 150);

    renderDots();

}


document
    .getElementById("nextTestimonial")
    .addEventListener("click", () => {

        currentTestimonial++;

        if (
            currentTestimonial >=
            testimonials.length
        ) {
            currentTestimonial = 0;
        }

        updateTestimonial();

    });


document
    .getElementById("prevTestimonial")
    .addEventListener("click", () => {

        currentTestimonial--;

        if (currentTestimonial < 0) {

            currentTestimonial =
                testimonials.length - 1;

        }

        updateTestimonial();

    });


/* Automatic carousel */

let carouselInterval =
    setInterval(() => {

        currentTestimonial++;

        if (
            currentTestimonial >=
            testimonials.length
        ) {
            currentTestimonial = 0;
        }

        updateTestimonial();

    }, 5000);


/* ================= CONTACT FORM ================= */

const contactForm =
    document.getElementById("contactForm");

const formSuccess =
    document.getElementById("formSuccess");


function showError(input, message) {

    const group =
        input.closest(".form-group");

    const error =
        group.querySelector(".error-message");

    group.classList.add("invalid");

    error.textContent = message;

}


function clearError(input) {

    const group =
        input.closest(".form-group");

    const error =
        group.querySelector(".error-message");

    group.classList.remove("invalid");

    error.textContent = "";

}


function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function validatePhone(phone) {

    return /^[0-9+\-\s()]{8,}$/
        .test(phone);

}


contactForm.addEventListener("submit", event => {

    event.preventDefault();

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const message =
        document.getElementById("message");


    let valid = true;


    /* Name */

    if (name.value.trim().length < 2) {

        showError(
            name,
            "Please enter your name."
        );

        valid = false;

    } else {

        clearError(name);

    }


    /* Email */

    if (!validateEmail(email.value.trim())) {

        showError(
            email,
            "Please enter a valid email address."
        );

        valid = false;

    } else {

        clearError(email);

    }


    /* Phone */

    if (!validatePhone(phone.value.trim())) {

        showError(
            phone,
            "Please enter a valid phone number."
        );

        valid = false;

    } else {

        clearError(phone);

    }


    /* Message */

    if (message.value.trim().length < 10) {

        showError(
            message,
            "Please enter at least 10 characters."
        );

        valid = false;

    } else {

        clearError(message);

    }


    /* Success */

    if (valid) {

        formSuccess.classList.add("show");

        contactForm.reset();

        setTimeout(() => {

            formSuccess.classList.remove("show");

        }, 5000);

    }

});


/* ================= YEAR ================= */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();