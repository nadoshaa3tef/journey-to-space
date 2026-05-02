# Journey To Space

An immersive educational platform dedicated to demystifying cosmic phenomena and inspiring the next generation of space explorers through interactive storytelling and high-fidelity astronomical data.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://nadoshaa3tef.github.io/journey-to-space)
[![Repository Status](https://img.shields.io/badge/Status-Active-blue)](https://github.com/nadoshaa3tef/journey-to-space)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

### Core Features 🚀

- **Modular CSS Architecture**: Utilizes a tiered styling system (global, layout, and page-specific) to ensure high maintainability and scalable design.
- **RequestAnimationFrame Animation**: Implements a high-performance count-up algorithm for the visitor counter, ensuring 60fps visual updates without blocking the main thread.
- **State Persistence Engine**: Orchestrates a hybrid data model using `localStorage` for persistent user identity and `sessionStorage` for session-scoped logic (e.g., visitor increment throttling).
- **Performance-Optimized Asset Delivery**: Strategic loading of high-resolution astronomical imagery coupled with modern font-face integration.
- **Responsive Fluid Grid**: A custom-engineered CSS layout that adapts seamlessly across mobile, tablet, and ultra-wide displays using Flexbox and Grid.

---

### Architecture & Logic 🏗️

The project is built on the principle of **Separated Concerns**, abstracting structural components from business logic to ensure a robust developer experience and ease of scalability.

#### Folder Structure

```text
├── assets/
│   ├── images/         # Optimized imagery and brand identity
│   └── videos/         # Multimedia background elements
├── css/
│   ├── pages/          # Modular, page-specific stylesheets
│   ├── global.css      # Core design tokens and variables
│   └── layout.css      # Structural framework (nav, footer, grid)
├── js/
│   └── main.js         # Core application logic and DOM orchestration
├── pages/
│   ├── planets/        # Individual planetary data modules
│   ├── black-hole.html
│   ├── galaxies.html
│   ├── register.html
│   ├── solar-system.html
│   └── white-hole.html
├── index.html          # Application entry point
└── README.md           # Project documentation
```

#### Technical Implementation Details

- **Visitor Counter Algorithm**: To prevent artificial inflation, the system checks for a `visited` flag in `sessionStorage`. If absent, it increments the `totalVisitors` in `localStorage`. The UI update is handled via a recursive `step` function inside `requestAnimationFrame`, calculating increments based on a fixed 120-frame window for consistent timing across different refresh rates.
- **Authentication Flow**: Implements a lightweight client-side "auth" system. Upon registration, the `astronautName` is persisted. The `DOMContentLoaded` handler performs a lookup and dynamically reconfigures the DOM—hiding registration links and injecting a personalized greeting—using a custom `$` selector utility for memory-efficient DOM access.

---

### Tech Stack 🛠️

| Category             | Tool                                   |
| :------------------- | :------------------------------------- |
| **Frontend**         | HTML5, JavaScript (ES6+)               |
| **Styling**          | CSS3 (Custom Variables, Flexbox, Grid) |
| **Icons**            | Font Awesome 6.4                       |
| **Typography**       | Google Fonts (Roboto, Roboto Slab)     |
| **State Management** | Web Storage API (Local & Session)      |

---

### Getting Started 🏁

#### Prerequisites

A modern web browser with JavaScript enabled (Chrome, Firefox, Safari, or Edge).

#### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/nadoshaa3tef/journey-to-space.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd journey-to-space
    ```
3.  Launch with a local server (e.g., VS Code Live Server) or open `index.html` directly in your browser.

---

_Designed and maintained by the Journey To Space Team._
