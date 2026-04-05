# LIBERO Italia - Premium Football Boots Landing Page

## Architecture and Workflow

LIBERO is a high-fidelity, interactive full-stack web application designed to demonstrate premium e-commerce concepts. 

### Tech Stack
-   **Frontend**: React (v19) + Vite. Uses GSAP for smooth scroll-triggered animations and @react-three/fiber/drei (Three.js) for high-performance 3D rendering of the boot canvas.
-   **Backend**: Node.js + Express.js
-   **Database**: SQLite with Prisma ORM for efficient, typed queries.
-   **CI/CD**: GitHub Actions pipeline for automated builds and testing, with Dependabot configured for dependency updates.

### Design Decisions
-   **3D Interactive Elements**: Instead of static images, we integrated a full WebGL 3D boot model to create a much more immersive experience that drives engagement.
-   **Idempotent Scripts**: Setup scripts ensure you don't corrupt the environment if you run them multiple times.
-   **Component Reusability**: All parts of the UI (Hero, Promos, Reviews) are structured as functionally cohesive components.

### Challenges
- Integrating React 19's new concurrent features with Three.js state management.
- Ensuring the 3D model loads seamlessly without blocking the main browser thread.
- Resolving dependency conflicts with legacy peer dependencies (`@testing-library/react` vs React 19).

## Instructions

1. Use SQLITE3 for database storage implementation
2. Use Prisma for ORM
3. Implement at least one full CRUD RESTful API
4. Deploy it on Render for backend and vercel for frontend
5. Resolve CORS issue if needed after deployment

## Scripts
-   `npm run dev`: Runs both front-end and back-end concurrently.
-   `npm run test` or `npm run lint` for tests and linting.
