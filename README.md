# 🇿🇦 Lekker Bites — Cloud-Native QSR Web Platform

Lekker Bites is a highly stylized, mobile-first Quick Service Restaurant (QSR) ordering system paired with a synchronized Enterprise Executive Telemetry Dashboard. Specifically built to serve iconic South African fast-food street staples (such as Bunny Chows, Shwammas, Vetkoeks, regional pizzas, and classic desserts), this platform bridges the gap between high-fidelity consumer-facing experiences and complex real-time administrative operations.

Designed as an engineering showcase, Lekker Bites features a dual-layout interface: a custom physical-device wrapper wrapping the consumer's high-fidelity checkout flow on one side, and an industrial-grade enterprise ERP system tracking deep analytic aggregates and simulation parameters on the other.

---

## 📸 Application Showcases & UI Portfolios

> *Recruiter Note: The following placeholder sections represent live application states. Once you clone the repository or spin up the preview container, you can capture and insert high-fidelity media here.*

### 📱 1. Consumer Mobile Experience
`[ INSERT CUSTOMER SHOPPING & CHECKOUT SCREENSHOTS HERE ]`
*A mobile-first viewport displaying glassmorphism menu cards, localized topping customization drawers, digital cart summary, and Durban-inspired warm color architecture.*

### 📊 2. Real-Time Executive Analytics
`[ INSERT EXECUTIVE DASHBOARD & RECHARTS SCREENSHOTS HERE ]`
*Interactive analytics dashboard visualizing live revenue velocity (AreaChart), kitchen efficiency rating under load stress (LineChart), and dynamic stock levels across cuisine categories (Cell-mapped BarChart).*

### 🚚 3. Transactional Tracking & Digital Receipts
`[ INSERT ORDER TRACKING & PRINT RECEIPT SCREENSHOTS HERE ]`
*Visualizing the state-machine progress from "Placed" through "Delivered," accompanied by local Pretoria address delivery routing and tactile thermal receipt layouts.*

---

## 🛠️ System Design & Architecture

The application is structured around a **decoupled, event-synchronized client-admin topology**:

```
                                  +----------------------------+
                                  |   State & Context Engine   |
                                  |    (React Context / Hooks) |
                                  +--------------+-------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +-------------+-------------+                       +-------------+-------------+
         |    Consumer Viewport      |                       |    Executive Telemetry    |
         |    (PhoneFrame Container) |                       |     (ERP Dashboard)       |
         +-------------+-------------+                       +-------------+-------------+
                       |                                                   |
                       v                                                   v
         - Authenticate with Firebase          - Inject Interactive Stressors (Rain/Deadlock)
         - Customize Toppings & Add to Cart    - Track Hourly Financial Velocity Area Curves
         - Simulate PayFast / Yoco Gateways    - Assess Live Category Stock via Cell BarCharts
         - Watch State-Machine Progress        - Trigger Optimize-Algorithms to boost score
```

### 1. Unified State Engine & Bidirectional Simulation Reaction
- **Stiffness to Stressors**: Unlike static mock dashboards, Lekker Bites reacts instantly to operational environment metrics controlled on the dashboard. 
- **Reactive Chain**: 
  1. Increasing **customer demand multipliers** immediately spikes the hourly revenue estimation curve in real-time.
  2. Changing the **weather condition to 'rain'** triggers computed delivery traffic delays, directly inflating the "Delayed" segment in order throughput.
  3. Inducting a **kitchen queue bottleneck or artificial deadlock** instantly degrades the system's "Kitchen Efficiency Rating" from a baseline of ~88% down to a critically low ~25%, triggering animated red alerts and visual warning overlays across both panels.
  4. Engaging the **automated optimizer algorithm** injects compensatory efficiency offsets to restore stable kitchen processing scores.

### 2. Hybrid Persistence Engine (Offline-First + Cloud-Ready)
- **Local Sandbox Synchronization**: All system metrics, customized food items, user contexts, and delivery configurations are synchronized against local storage structures. This safeguards state continuity across hot-reloading.
- **Enterprise Integrations**: The codebase is engineered with structural modularity, importing native `@google/genai` models alongside fully initialized **Google Firestore database & Firebase Authentication** adapters, protected by solid security boundaries.

### 3. Desktop-First Density with Mobile-First Execution
- Built on responsive, container-fluid breakpoints (`sm:`, `md:`, `lg:`, `xl:`), the system leverages the rich real estate of ultra-wide desktop monitors to lay out both viewpoints side-by-side, while adaptively collapsing into dedicated tab structures on smaller screens to ensure premium touch responsiveness (minimum 44px hit bounds).

---

## ⚙️ Frameworks, Libraries & Tools Used

### 🎨 Layer 1: Core Interface and Structure
- **React 18 & TypeScript**: Full compilation type-safety utilizing clean, strictly-named modular typescript interfaces (`/src/types.ts`) mapping domain records (e.g., `MenuItem`, `CartItem`, `Order`, `LoyaltyRewards`).
- **Vite Setup**: Instant, highly optimized build-step generation using a streamlined bundler to deliver ultra-fast local development and compiled static assets in `/dist`.

### 💅 Layer 2: Design Language & Aesthetics
- **Tailwind CSS**: Engineered with tailored variables. The design is built to escape generic UI presets—crafting a deep slate background combined with custom translucent glassmorphism overlays (`backdrop-blur-md`), orange/amber/purple neon shadows, and clean margins.
- **Lucide Icons**: Leveraged across all buttons, status badges, and tab headers to provide sleek, SVG-backed glyph indicators.

### 📈 Layer 3: Visual Intelligence & Telemetry
- **Recharts (D3-backed UI engines)**:
  - **Financial Velocity**: Represented through custom-filled `AreaChart` elements featuring double linear color gradient overlays to indicate standard revenue trends compared with forecasted goal targets.
  - **Kitchen Health**: Tracked using a smooth, responsive `LineChart` monitoring variable stress metrics against a static Orange target guideline.
  - **Throughput Rate**: A complex `BarChart` stacking completed, in-progress, and delayed counts.
  - **Stock Distribution**: A custom-mapped categoric `BarChart` dynamically filtering stock levels to render individual items in amber or red if categories drop below low-inventory parameters (utilizing a custom `<Cell>` loop to adaptively alter visual fill colors).

### 🔒 Layer 4: Configuration Security & Cloud Rules
- **Firebase Core Adapters**: Database connection endpoints structured via helper modules (`src/firebase.ts`) to enable rapid connection to authentication and document collection services.
- **Rules Protection**: Production-grade `firestore.rules` containing read/write protection bounds aligned with Firestore blueprints.

---

## 🔒 Security & Safe-Release Strategy
The repository strictly respects cloud-safe development standards. The following files contain active keys, API links, or environment secrets, and are **completely barred** from ever entering GitHub or public version control via a hardcoded `.gitignore` schema:
1. `firebase-applet-config.json` — Protected Firebase connection tokens and workspace secrets.
2. `.env*` (including `.env.local`, `.env.development`, and `.env.production`) — Environment variables used to proxy external endpoints.
3. `*credentials*.json` & `*service-account*.json` — Encrypted service account credentials.

---

## 🚀 How to Run locally

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
1. Clone the repository and navigate into the project directory:
   ```bash
   cd lekker-bites
   ```
2. Install the system dependencies:
   ```bash
   npm install
   ```
3. Run the fast-reload development server:
   ```bash
   npm run dev
   ```
4. Access the application on [http://localhost:3000](http://localhost:3000).

### Build & Deploy
To compile the highly optimized client bundle:
```bash
npm run build
```
This produces ready-to-serve files in the `/dist` directory.
