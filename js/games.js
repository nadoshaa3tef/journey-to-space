class SpaceGames {
  constructor() {
    this.init();
  }

  init() {
    // Listen for game clicks
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".sim-card");
      if (card) {
        const gameType = card.getAttribute("data-game");
        if (gameType === "memory") this.startMemoryGame();
        if (gameType === "sorting") this.startSortingGame();
      }
    });
  }

  createOverlay(title) {
    const overlay = document.createElement("div");
    overlay.className = "game-overlay";
    overlay.innerHTML = `
            <div class="game-container">
                <i class="fas fa-times close-game" id="closeGame"></i>
                <h2 style="margin-bottom: 20px; color: #00ff88;">${title}</h2>
                <div id="gameContent"></div>
            </div>
        `;
    document.body.appendChild(overlay);
    document.getElementById("closeGame").onclick = () => overlay.remove();
    return document.getElementById("gameContent");
  }

  // --- 1. Memory Match Game ---
  startMemoryGame() {
    const content = this.createOverlay("Simulator: Cosmic Memory Match");
    const icons = ["🚀", "🪐", "⭐", "☄️", "🛰️", "👽", "👨‍🚀", "🌌"];
    const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);

    content.innerHTML = `<div class="memory-grid"></div>`;
    const grid = content.querySelector(".memory-grid");

    let flipped = [];
    let matched = 0;

    cards.forEach((icon, i) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.innerHTML = `
                <div class="back">?</div>
                <div class="front">${icon}</div>
            `;
      card.onclick = () => {
        if (flipped.length < 2 && !card.classList.contains("flipped")) {
          card.classList.add("flipped");
          flipped.push({ icon, el: card });

          if (flipped.length === 2) {
            if (flipped[0].icon === flipped[1].icon) {
              matched++;
              flipped = [];
              if (matched === icons.length)
                this.handleGameWin("Memory Master", 30);
            } else {
              setTimeout(() => {
                flipped.forEach((f) => f.el.classList.remove("flipped"));
                flipped = [];
              }, 1000);
            }
          }
        }
      };
      grid.appendChild(card);
    });
  }

  // --- 2. Planet Sorting Game ---
  startSortingGame() {
    const content = this.createOverlay("Simulator: Orbital Alignment");
    const planets = [
      { id: "mercury", name: "Mercury" },
      { id: "venus", name: "Venus" },
      { id: "earth", name: "Earth" },
      { id: "mars", name: "Mars" },
      { id: "jupiter", name: "Jupiter" },
      { id: "saturn", name: "Saturn" },
      { id: "uranus", name: "Uranus" },
      { id: "neptune", name: "Neptune" },
    ];

    const shuffled = [...planets].sort(() => Math.random() - 0.5);

    content.innerHTML = `
            <div class="sorting-container">
                <p>Drag planets to their correct order from the Sun (1st to 8th)</p>
                <div class="planets-pool" id="pool">
                    ${shuffled.map((p) => `<div class="draggable-planet" draggable="true" id="${p.id}">${p.name}</div>`).join("")}
                </div>
                <div class="drop-zones" id="zones">
                    ${planets.map((_, i) => `<div class="drop-zone" data-index="${i}">${i + 1}</div>`).join("")}
                </div>
                <button class="btn" id="checkSort" style="margin-top: 20px;">Verify Alignment</button>
            </div>
        `;

    // Add Drag & Drop Logic
    const draggables = content.querySelectorAll(".draggable-planet");
    const zones = content.querySelectorAll(".drop-zone");

    draggables.forEach((d) => {
      d.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
    });

    zones.forEach((z) => {
      z.ondragover = (e) => {
        e.preventDefault();
        z.classList.add("hovered");
      };
      z.ondragleave = () => z.classList.remove("hovered");
      z.ondrop = (e) => {
        e.preventDefault();
        z.classList.remove("hovered");
        const id = e.dataTransfer.getData("text");
        const el = document.getElementById(id);

        // If zone already has a planet, move it back to pool
        if (z.children.length > 0) {
          document.getElementById("pool").appendChild(z.children[0]);
        }
        z.appendChild(el);
      };
    });

    document.getElementById("checkSort").onclick = () => {
      let correct = 0;
      zones.forEach((z, i) => {
        if (z.children.length > 0 && z.children[0].id === planets[i].id) {
          correct++;
          z.style.borderColor = "#00ff88";
        } else {
          z.style.borderColor = "#ff4d4d";
        }
      });

      if (correct === planets.length) {
        this.handleGameWin("Orbital Navigator", 40);
      } else {
        alert(
          `Alignment Error: ${correct}/${planets.length} planets correctly placed.`,
        );
      }
    };
  }

  handleGameWin(badgeName, xpGain) {
    const state = JSON.parse(localStorage.getItem("spaceAcademyState"));
    if (!state) return;

    // Check if already earned badge
    if (!state.badges.includes(badgeName)) {
      state.xp += xpGain;
      state.badges.push(badgeName);

      // Rank promotion
      if (state.xp >= 200) state.rank = "Commander";
      else if (state.xp >= 150) state.rank = "Specialist";
      else if (state.xp >= 100) state.rank = "Pilot";

      localStorage.setItem("spaceAcademyState", JSON.stringify(state));

      alert(
        `CONGRATULATIONS! You earned the "${badgeName}" badge and +${xpGain} XP!`,
      );
      location.reload();
    } else {
      alert("Simulation Complete! (XP already earned for this module)");
    }
  }
}

window.spaceGames = new SpaceGames();
