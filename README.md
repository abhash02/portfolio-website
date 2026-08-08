# 🚀 Modern AI Engineer Portfolio Website

A high-performance, visually immersive developer portfolio website built for an **AI Engineer**. Designed with modern dark glassmorphism, interactive canvas scroll animations, a custom physics-based cursor system, and a dedicated multi-category project showcase.

---

## 🌐 Live Portfolio

[View Live Portfolio](YOUR_VERCEL_URL)

---

## ✨ Key Features & Highlights

- **🎬 240-Frame Interactive Canvas Scroll Animation**: Smooth frame-by-frame canvas animation synchronized to scroll position for a dynamic 3D hero background.
- **✨ Physics-Based Glowing Cursor & Particle Trail**: Custom dual-ring cursor (`cursor.js`) with responsive lerp physics, contextual hover states, particle trail emissions, and click compression feedback.
- **⚡ Lenis Smooth Scrolling Engine**: Integrated Lenis (`lenis`) for fluid inertial scrolling across all viewports.
- **📁 Comprehensive Projects Showcase & Filter Grid**: Dedicated projects page (`projects.html`) featuring interactive category filter pills (*Machine Learning*, *Speech & Audio*, *NLP*, *Analytics*), expandable "View All Projects" banner, and detailed benchmark pop-up modals.
- **📱 Fully Responsive & Glassmorphism Design System**: Tailored dark theme UI (`#090206`) with gradient glow accents (`#ff5522`), backdrop filters, custom typography (Plus Jakarta Sans), and adaptive mobile navigation menus.
- **✉️ Interactive Contact System**: Integrated with **EmailJS** (`@emailjs/browser`) for direct, client-side contact form submissions.
- **⚡ Preloader & Performance Optimized**: High-end initialization progress bar and asset bundling via **Vite**.

---

## 🛠️ Technology Stack

### **Website Architecture**
- **Core**: HTML5, Vanilla CSS3 (Custom Design Tokens, Flexbox, CSS Grid), ES6+ JavaScript Modules
- **Animations & FX**: HTML5 Canvas API, Lenis Smooth Scroll
- **Integrations**: EmailJS Browser SDK
- **Build Tooling**: Vite

### **Featured Projects & Engineering Stack**
- **Languages**: Python, JavaScript, Java, C++, SQL
- **Frameworks & Libraries**: Flask, React, Streamlit, Scikit-learn, Pandas, NumPy, Matplotlib
- **AI & Speech**: Google Agent Development Kit (ADK), Google Gemini API, YouTube Data API v3, SpeechRecognition, Audio Signal Processing (MFCC)
- **Databases & DevOps**: MySQL, Git, GitHub

---

## 💻 Featured Showcase Projects

| Project Name | Category | Tech Stack | Status / Link |
| :--- | :--- | :--- | :--- |
| **Sentinel – Agentic AI Platform** | Agentic AI | Python, Google ADK, Gemini | [GitHub Repo](https://github.com/abhash02/sentinel-code-reviewer) |
| **AI Resume Analyzer Web App** | NLP / Flask | Python, Flask, NLP | [GitHub Repo](https://github.com/abhash02/ai-resume-analyzer) |
| **Student Performance Prediction System** | ML & React | Python, Scikit-learn, Flask, React | [GitHub Repo](https://github.com/abhash02/student-performance-prediction) |
| **AI-Powered Financial Fraud Detection** | ML & Analytics | Python, Scikit-learn, Streamlit, Pandas | [GitHub Repo](https://github.com/abhash02/AI-Financial-Fraud-Detection-System) |
| **YouTube Trend Analysis** | Data Analytics | NumPy, Pandas, Matplotlib | [GitHub Repo](https://github.com/abhash02/youtube-trend-analysis) |
| **AI-Generated Voice Detection System** | Speech / ML | Python, Scikit-learn, Signal Processing | `Available Soon` 🕒 |
| **AI-Powered Smart Assistant** | Voice Agent / NLP | Python, Speech Recognition, Gemini API | `Available Soon` 🕒 |

---

## 📂 Repository Structure

```
Portfolio Website/
├── index.html                 # Main landing page (Hero, Experience, About, Workflow, Contact)
├── projects.html              # Comprehensive projects showcase & filter grid
├── style.css                  # Core CSS design system, typography & layout styles
├── main.js                    # Main homepage controller & scroll canvas animation
├── projects.js                # Projects filter logic, expandable grid & modal handling
├── contact.js                 # EmailJS contact form handler
├── cursor.js                  # Custom cursor system & particle physics trail
├── vite.config.js             # Vite configuration file
├── package.json               # Project manifest & NPM scripts
└── project_*.png              # Project preview thumbnail images
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/abhash02/portfolio-website.git
   cd portfolio-website
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### **Development Server**
Run the local dev server with Vite:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### **Production Build**
Build optimized static bundle:
```bash
npm run build
```
To preview the compiled production build locally:
```bash
npm run preview
```

---

## 📬 Contact & Links

- **Developer**: Abhash Gupta
- **Role**: AI Engineer
- **Location**: Kanpur, Uttar Pradesh, India
- **Email**: [abhash252020@gmail.com](mailto:abhash252020@gmail.com)
- **GitHub**: [@abhash02](https://github.com/abhash02)

---

## 📄 License

This project is a personal portfolio website.
