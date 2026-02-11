const form = document.getElementById("contactForm");
const inputs = document.querySelectorAll("#contactForm input, #contactForm select, #contactForm textarea");

const loading = document.querySelector(".loading");
const errorState = document.querySelector(".error");
const success = document.querySelector(".success");

function resetStates() {
    document.querySelectorAll(".form-state").forEach(el => el.style.display = "none");
}

function clearErrors() {
    inputs.forEach(input => {
        input.classList.remove("input-error");
        const errorText = input.parentElement.querySelector(".error-text");
        errorText.style.display = "none";
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    resetStates();
    clearErrors();

    let hasError = false;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            input.classList.add("input-error");
            input.parentElement.querySelector(".error-text").style.display = "block";
            hasError = true;
        }
    });

    if (hasError) return;

    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        errorState.style.display = "block";
        return;
    }

    loading.style.display = "block";

    setTimeout(() => {
        loading.style.display = "none";
        success.style.display = "block";
        form.reset();
    }, 1500);
});
