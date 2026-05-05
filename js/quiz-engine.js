const QUIZ_DATA = {
  "solar-system.html": {
    id: "solar-system",
    name: "Solar System Scout",
    questions: [
      {
        q: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        a: 1,
      },
      {
        q: "What is the largest planet in our solar system?",
        options: ["Earth", "Saturn", "Jupiter", "Neptune"],
        a: 2,
      },
      {
        q: "Which celestial body is at the center of our solar system?",
        options: ["The Moon", "The Sun", "Jupiter", "Black Hole"],
        a: 1,
      },
    ],
  },
  "black-hole.html": {
    id: "black-hole",
    name: "Event Horizon Voyager",
    questions: [
      {
        q: "What is the boundary around a black hole called?",
        options: [
          "The Outer Rim",
          "The Singularity",
          "The Event Horizon",
          "The Dark Zone",
        ],
        a: 2,
      },
      {
        q: "What happens to time near a black hole?",
        options: [
          "It stops",
          "It speeds up",
          "It slows down",
          "It flows backwards",
        ],
        a: 2,
      },
    ],
  },
  "galaxies.html": {
    id: "galaxies",
    name: "Galactic Cartographer",
    questions: [
      {
        q: "What type of galaxy is the Milky Way?",
        options: ["Elliptical", "Irregular", "Spiral", "Square"],
        a: 2,
      },
      {
        q: "What is the name of our closest neighbor galaxy?",
        options: ["Andromeda", "Orion", "Alpha Centauri", "Sombrero"],
        a: 0,
      },
    ],
  },
  "white-hole.html": {
    id: "white-hole",
    name: "Cosmic Theorist",
    questions: [
      {
        q: "What is a white hole theorized to do?",
        options: [
          "Suck in matter",
          "Eject matter and light",
          "Create stars",
          "Hide planets",
        ],
        a: 1,
      },
      {
        q: "Are white holes currently proven to exist?",
        options: [
          "Yes, we have photos",
          "No, they are theoretical",
          "Only in other galaxies",
          "NASA confirmed them",
        ],
        a: 1,
      },
    ],
  },
};

const ACADEMY_STATE_KEY = "spaceAcademyState";

class QuizEngine {
  constructor() {
    this.currentPage = window.location.pathname.split("/").pop();
    this.quizData = QUIZ_DATA[this.currentPage];
    this.currentQuestion = 0;
    this.score = 0;

    if (this.quizData) {
      this.init();
    }
  }

  init() {
    // Check if the card already exists in the HTML
    let card = document.querySelector(".mission-complete-card");

    if (!card) {
      // Create it if it doesn't exist (fallback)
      const container = document.querySelector("footer, .s-footer, .footer") || document.body;
      const trigger = document.createElement("div");
      trigger.className = "quiz-trigger-container";
      trigger.innerHTML = `
        <div class="mission-complete-card">
          <h3>Intelligence Briefing Complete</h3>
          <p>Ready to test your knowledge and earn XP?</p>
          <div class="btn">Start Skill Assessment</div>
        </div>
      `;

      if (container && container.tagName === "FOOTER") {
        container.parentNode.insertBefore(trigger, container);
      } else {
        document.body.appendChild(trigger);
      }
      card = trigger.querySelector(".mission-complete-card");
    }

    if (card) {
      card.onclick = () => this.startQuiz();
    }
  }

  startQuiz() {
    this.overlay = document.createElement("div");
    this.overlay.className = "quiz-overlay";
    this.overlay.innerHTML = `
      <div class="quiz-modal">
        <div class="quiz-header">
          <h3>Mission: ${this.quizData.name}</h3>
          <div class="progress-dots" id="quizDots"></div>
        </div>
        <div id="questionContainer"></div>
      </div>
    `;
    document.body.appendChild(this.overlay);
    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.quizData.questions[this.currentQuestion];
    const container = document.getElementById("questionContainer");
    const dots = document.getElementById("quizDots");

    dots.innerHTML = this.quizData.questions
      .map(
        (_, i) =>
          `<div class="dot ${i === this.currentQuestion ? "active" : ""} ${i < this.currentQuestion ? "done" : ""}"></div>`,
      )
      .join("");

    container.innerHTML = `
      <div class="question-text">${q.q}</div>
      <div class="options-grid">
        ${q.options
        .map(
          (opt, i) => `
          <button class="option-btn" onclick="quizEngine.handleAnswer(${i})">${opt}</button>
        `,
        )
        .join("")}
      </div>
    `;
  }

  handleAnswer(index) {
    const q = this.quizData.questions[this.currentQuestion];
    if (index === q.a) {
      this.score++;
    }

    this.currentQuestion++;
    if (this.currentQuestion < this.quizData.questions.length) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    const state = JSON.parse(localStorage.getItem(ACADEMY_STATE_KEY));
    const passed = this.score === this.quizData.questions.length;
    const container = document.getElementById("questionContainer");

    if (passed) {
      this.updateAcademyState();
    }

    const updatedState = JSON.parse(localStorage.getItem(ACADEMY_STATE_KEY));
    const isGraduated =
      updatedState && updatedState.missionsCompleted.length === 4;

    container.innerHTML = `
      <div class="results-container">
        <i class="fas ${passed ? "fa-check-circle success-icon" : "fa-times-circle error-icon"}"></i>
        <h2>${passed ? "Mission Accomplished!" : "Mission Failed"}</h2>
        <p>Score: ${this.score}/${this.quizData.questions.length}</p>
        <p>${passed ? (isGraduated ? "CONGRATULATIONS! You have completed all missions and graduated from the Academy!" : "You earned 50 XP and a new badge!") : "Review the briefing and try again."}</p>
        <button class="btn" onclick="window.location.href='../index.html'">${passed ? (isGraduated ? "Claim My Certificate" : "Return to Base") : "Retry Mission"}</button>
      </div>
    `;
  }

  updateAcademyState() {
    const state = JSON.parse(localStorage.getItem(ACADEMY_STATE_KEY));
    if (!state) return;

    if (!state.missionsCompleted.includes(this.quizData.id)) {
      state.missionsCompleted.push(this.quizData.id);
      state.xp += 50;
      state.badges.push(this.quizData.name);

      // Rank promotion logic
      if (state.xp >= 200) state.rank = "Commander";
      else if (state.xp >= 150) state.rank = "Specialist";
      else if (state.xp >= 100) state.rank = "Pilot";

      localStorage.setItem(ACADEMY_STATE_KEY, JSON.stringify(state));
    }
  }
}

window.quizEngine = new QuizEngine();
