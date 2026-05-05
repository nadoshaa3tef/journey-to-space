const $ = (id) => document.getElementById(id);
const nav = $("navlink");

const showMenu = () => nav && (nav.style.right = "0");
const hideMenu = () => nav && (nav.style.right = "-200px");

const ACADEMY_STATE_KEY = "spaceAcademyState";

const initAcademyState = () => {
  let state = JSON.parse(localStorage.getItem(ACADEMY_STATE_KEY));
  if (!state) {
    state = {
      rank: "Cadet",
      xp: 0,
      missionsCompleted: [],
      badges: [],
    };
    localStorage.setItem(ACADEMY_STATE_KEY, JSON.stringify(state));
  }
  return state;
};

const getRankIcon = (rank) => {
  const icons = {
    Cadet: "fa-user-astronaut",
    Pilot: "fa-shuttle-space",
    Specialist: "fa-microscope",
    Commander: "fa-crown",
  };
  return icons[rank] || "fa-user-astronaut";
};

const renderDashboard = (state) => {
  const dashboard = $("academyDashboard");
  if (!dashboard) return;

  const totalMissions = 4;
  const completedCount = state.missionsCompleted.length;
  const progress = (completedCount / totalMissions) * 100;
  const isGraduated = completedCount === totalMissions;

  dashboard.innerHTML = `
    <div class="dashboard-card">
      <div class="user-info">
        <div class="rank-badge">
          <i class="fas ${getRankIcon(state.rank)}"></i>
          <span>${state.rank}</span>
        </div>
        <div class="xp-bar-container">
          <div class="xp-label">XP: ${state.xp}</div>
          <div class="xp-bar">
            <div class="xp-progress" style="width: ${progress}%"></div>
          </div>
        </div>
      </div>
      <div class="mission-stats">
        <div class="stat">
          <span class="stat-value">${completedCount}/${totalMissions}</span>
          <span class="stat-label">Missions Completed</span>
        </div>
        <div class="stat">
          <span class="stat-value">${state.badges.length}</span>
          <span class="stat-label">Badges Earned</span>
        </div>
      </div>
      ${isGraduated
      ? `
        <button class="claim-cert-btn" id="claimCertBtn">
          <i class="fas fa-certificate"></i> CLAIM GRADUATION CERTIFICATE
        </button>
      `
      : ""
    }
    </div>
  `;

  if (isGraduated) {
    $("claimCertBtn").onclick = () => showCertificate(state);
  }

  // Update mission cards status
  document.querySelectorAll(".card").forEach((card) => {
    const missionId = card.getAttribute("data-mission");
    const tag = card.querySelector(".mission-status-tag");
    const btn = card.querySelector(".btn");

    if (state.missionsCompleted.includes(missionId)) {
      card.classList.add("mission-completed");
      if (tag) {
        tag.innerHTML = '<i class="fas fa-check-circle"></i> MISSION COMPLETED';
        tag.style.background = "#00ff88";
        tag.style.color = "#000";
      }
      if (btn) {
        btn.innerHTML = "Review Again";
        btn.style.borderColor = "#00ff88";
        btn.style.color = "#00ff88";
      }
    }
  });
};

const showCertificate = (state) => {
  const userName = localStorage.getItem("astronautName") || "Elite Explorer";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const overlay = document.createElement("div");
  overlay.className = "cert-overlay";
  overlay.innerHTML = `
    <div class="cert-container">
      <i class="fas fa-times cert-close" id="closeCert"></i>
      <div class="certificate">
        <div class="cert-header">
          <h1>JOURNEY TO SPACE</h1>
          <p>DIPLOMA OF COSMIC EXCELLENCE</p>
        </div>
        <div class="cert-body">
          <p>This is to certify that</p>
          <div class="cert-name">${userName}</div>
          <p class="cert-text">
            Has successfully completed all specialized training modules and 
            demonstrated exceptional knowledge in celestial mechanics, 
            galactic cartography, and cosmic phenomena.
          </p>
        </div>
        <div class="cert-footer">
          <div class="signature">
            Academy Commander
            <br>
            <span style="font-size: 10px; font-family: sans-serif;">STATION ALPHA-9</span>
          </div>
          <div class="seal">
            <i class="fas fa-rocket"></i>
          </div>
          <div class="signature">
            Date: ${date}
            <br>
            <span style="font-size: 10px; font-family: sans-serif;">EARTH TIME-SYNC</span>
          </div>
        </div>
      </div>
      <div class="cert-actions">
        <button class="btn" onclick="window.print()">
          <i class="fas fa-print"></i> Print Certificate
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  $("closeCert").onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const state = initAcademyState();
  const user = localStorage.getItem("astronautName");
  const greet = $("userGreeting");

  if (user && greet) {
    greet.innerHTML = `
            <span class="greeting-text">
              <i class="fas ${getRankIcon(state.rank)}" style="margin-right: 8px;"></i>
              ${state.rank} ${user}
            </span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
        `;

    $("logoutBtn").onclick = () => {
      localStorage.removeItem("astronautName");
      localStorage.removeItem(ACADEMY_STATE_KEY);
      location.reload();
    };

    document.querySelectorAll("#navItems a").forEach((link) => {
      if (link.textContent === "REGISTER")
        link.parentElement.style.display = "none";
    });
  }

  // Render dashboard if on homepage
  renderDashboard(state);

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
      curr += target / 120;
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
