document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const strengthBar = document.getElementById("strengthBar");
  const registerCard = document.getElementById("registerCard");
  const successOverlay = document.getElementById("successOverlay");
  const rocketLaunch = document.getElementById("rocketLaunch");
  const displayUserName = document.getElementById("displayUserName");

  // 1. Password Strength Meter
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length > 5) strength += 25;
    if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength += 25;
    if (val.match(/[0-9]/)) strength += 25;
    if (val.match(/[^a-zA-Z0-9]/)) strength += 25;

    strengthBar.style.width = strength + "%";

    if (strength <= 25) {
      strengthBar.style.backgroundColor = "#ff4d4d"; // Red
    } else if (strength <= 75) {
      strengthBar.style.backgroundColor = "#ffd700"; // Yellow/Gold
    } else {
      strengthBar.style.backgroundColor = "#00ff88"; // Green
    }

    validateInput(
      passwordInput,
      val.length >= 6,
      val.length === 0 ? "" : val.length < 6 ? "Too short" : "Secure enough",
    );

    if (confirmPasswordInput.value) {
      validateInput(
        confirmPasswordInput,
        confirmPasswordInput.value === val,
        "Passwords do not match",
      );
    }
  });

  // 2. Confirm Password Check
  confirmPasswordInput.addEventListener("input", () => {
    validateInput(
      confirmPasswordInput,
      confirmPasswordInput.value === passwordInput.value,
      "Passwords do not match",
    );
  });

  // 3. Real-time Validation
  usernameInput.addEventListener("input", () => {
    validateInput(
      usernameInput,
      usernameInput.value.length >= 3,
      "Name must be at least 3 characters",
    );
  });

  emailInput.addEventListener("input", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateInput(
      emailInput,
      emailRegex.test(emailInput.value),
      "Enter a valid space email",
    );
  });

  function validateInput(input, isValid, message) {
    const group = input.parentElement;
    const msgElement = group.querySelector(".validation-msg");

    if (input.value === "") {
      group.classList.remove("success", "error");
      msgElement.textContent = "";
      return;
    }

    if (isValid) {
      group.classList.add("success");
      group.classList.remove("error");
      msgElement.textContent = "Mission Ready!";
    } else {
      group.classList.add("error");
      group.classList.remove("success");
      msgElement.textContent = message;
    }
  }

  // 3. Form Submission & Animation
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Final validation check
    const hasErrors = document.querySelectorAll(".error").length > 0;
    const passwordsMatch = confirmPasswordInput.value === passwordInput.value;

    if (
      !hasErrors &&
      usernameInput.value &&
      emailInput.value &&
      passwordInput.value.length >= 6 &&
      passwordsMatch
    ) {
      // Save to LocalStorage
      localStorage.setItem("astronautName", usernameInput.value);
      displayUserName.textContent = usernameInput.value;

      // Trigger Success Sequence
      registerCard.classList.add("fade-out");

      setTimeout(() => {
        successOverlay.style.display = "flex";

        // Start the rocket lift off after 1 second
        setTimeout(() => {
          rocketLaunch.classList.add("rocket-takeoff");

          // Redirect to home after takeoff
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 2000);
        }, 1500);
      }, 500);
    }
  });
});
