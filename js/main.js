const $ = (id) => document.getElementById(id);
const nav = $("navlink");

const showMenu = () => nav && (nav.style.right = "0");
const hideMenu = () => nav && (nav.style.right = "-200px");

document.addEventListener("DOMContentLoaded", () => {
  // --- User Registration Greeting ---
  const user = localStorage.getItem("astronautName");
  const greet = $("userGreeting");

  if (user && greet) {
    greet.innerHTML = `
            <span style="color:#b38bff; font-weight:bold; margin-right:15px;">Welcome, ${user}!</span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
        `;

    $("logoutBtn").onclick = () => {
      localStorage.removeItem("astronautName");
      location.reload();
    };

    document.querySelectorAll("#navItems a").forEach((link) => {
      if (link.textContent === "REGISTER")
        link.parentElement.style.display = "none";
    });
  }

  // --- Visitor Counter Logic ---
  const countEl = $("count");
  if (countEl) {
    let visitors = localStorage.getItem("totalVisitors") || 1240;

    if (!sessionStorage.getItem("visited")) {
      visitors = +visitors + 1;
      localStorage.setItem("totalVisitors", visitors);
      sessionStorage.setItem("visited", 1);
    }

    let curr = 0;
    const target = +visitors;
    const step = () => {
      curr += target / 120; // Approximately 2 seconds at 60fps
      if (curr < target) {
        countEl.innerText = Math.ceil(curr).toLocaleString();
        requestAnimationFrame(step);
      } else {
        countEl.innerText = target.toLocaleString();
      }
    };
    step();
  }
});
