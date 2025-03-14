# Employee Management System (EMS)

This project is a **React + Vite** application designed for Employee Management. It provides a modern and efficient frontend with 3D elements using **Three.js**, animations with **Framer Motion**, and styling via **Tailwind CSS** and **Material UI**.

## Features

- **Fast Development**: Uses Vite for fast HMR and build optimizations.
- **3D Graphics**: Integrated with `three.js` for interactive 3D elements.
- **Animations**: Powered by `framer-motion` for smooth UI animations.
- **Routing**: Uses `react-router-dom` for navigation.
- **Data Visualization**: `Recharts` is used for visualizing employee and task-related data.
- **Styling**: `Tailwind CSS` and `Material UI` for a sleek and responsive UI.
- **Role-Based Access Control (RBAC)**: Implemented with **Context API**.
- **Task Management**: Team leads can assign tasks, and employees can mark them as completed.

## Installation

To set up and run the project locally, follow these steps:

### 1. Clone the Repository

git clone https://github.com/yourusername/ems.git
cd ems

### 2. Install Dependencies

npm install

### 3. Start the Development Server

npm run dev

This will start the Vite development server. Open `http://localhost:5173/` in your browser to view the app.

## Available Scripts

- **`npm run dev`** - Starts the development server.
- **`npm run build`** - Builds the project for production.
- **`npm run preview`** - Serves the built project.
- **`npm run lint`** - Runs ESLint to check for code issues.

## Expanding the ESLint Configuration

If you are developing a production application, we recommend using TypeScript and enabling type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Dependencies

The following packages are required for the application to work properly:

### **Main Dependencies**

{
"@emotion/react": "^11.14.0",
"@emotion/styled": "^11.14.0",
"@mui/icons-material": "^6.4.7",
"@mui/material": "^6.4.7",
"@react-three/fiber": "^9.1.0",
"@tailwindcss/vite": "^4.0.14",
"framer-motion": "^12.5.0",
"react": "^19.0.0",
"react-dom": "^19.0.0",
"react-icons": "^5.5.0",
"react-router-dom": "^7.3.0",
"recharts": "^2.15.1",
"tailwindcss": "^4.0.14",
"three": "^0.174.0"
}

### **Dev Dependencies**

{
"@eslint/js": "^9.21.0",
"@types/react": "^19.0.10",
"@types/react-dom": "^19.0.4",
"@vitejs/plugin-react": "^4.3.4",
"eslint": "^9.21.0",
"eslint-plugin-react-hooks": "^5.1.0",
"eslint-plugin-react-refresh": "^0.4.19",
"globals": "^15.15.0",
"vite": "^6.2.0"
}

## License

This project is licensed under the MIT License. Feel free to modify and use it for your own purposes.

---

Happy coding! 🚀
