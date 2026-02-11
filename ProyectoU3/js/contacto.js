const form = document.getElementById("contactForm");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const mensaje = document.getElementById("mensaje");

const loading = document.querySelector(".form-loading");
const error = document.querySelector(".form-error");
const success = document.querySelector(".form-success");
const empty = document.querySelector(".form-empty");

function resetStates() {
    document.querySelectorAll(".form-state").forEach(el => el.style.display = "none");
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    resetStates();

    if (!nombre.value || !email.value || !mensaje.value) {
        empty.style.display = "block";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value)) {
        error.style.display = "block";
        return;
    }

    loading.style.display = "block";

    setTimeout(() => {
        loading.style.display = "none";
        success.style.display = "block";
        form.reset();
    }, 1500);
});
