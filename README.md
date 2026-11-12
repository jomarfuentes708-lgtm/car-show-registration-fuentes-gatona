# Car Show Registration System

## Overview

This project is a final output for CCDI Integrative Programming 2 focused on building a complete car show registration system. It combines a C# Vertical Slice API backend with a React frontend dashboard to manage and display car show registration data in a modern, user-friendly interface.

The backend provides structured API endpoints, business logic, and data handling, while the frontend presents a dashboard for viewing and managing records efficiently. Together, they demonstrate full-stack application development using contemporary technologies and clean architectural practices.

## Project Goals

- Manage car show registration records through a REST API
- Support structured backend operations using C# and .NET
- Provide a responsive React dashboard for system interaction
- Demonstrate teamwork and integration between API and frontend layers

## Repository Layout

```text
car-show-registration-Fuentes-Gatona/
├── Backend/                    # C# Vertical Slice API backend
├── docs/
│   └── screenshots/            # Project screenshots and supporting visuals
├── .gitignore                 # Ignore generated and local files
├── README.md                  # Project documentation
└── .
```

## Team Members and Roles

- Jomar Fuentes — Backend Developer
- Jomar Gatona — Frontend Developer

## Tech Stack

### Backend
- C#
- .NET 10
- ASP.NET Core
- Vertical Slice Architecture
- EF Core / Data Access Layer

### Frontend
- React
- Vite
- JavaScript / TypeScript
- npm

## Getting Started

### Prerequisites

Before running the project, make sure the following are installed on your machine:

- .NET 10 SDK
- Node.js 18+ and npm
- A modern browser
- Visual Studio Code or another IDE of your choice

## Running the Backend

1. Open a terminal in the project root.
2. Navigate to the backend folder:

```bash
cd Backend
```

3. Restore dependencies and build the solution:

```bash
dotnet restore
dotnet build
```

4. Run the API:

```bash
dotnet run --project Api
```

5. Open the application in a browser. The backend typically runs at:

```text
http://localhost:5205
```

If the API is configured with Scalar or Swagger support, you may also access its documentation endpoint through the generated local URL.

## Running the Frontend

1. Open a second terminal.
2. Navigate to the frontend project folder (if your frontend is in a dedicated `frontend/` directory):

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Notes

- Ensure the backend is running before using the frontend dashboard if the frontend connects to the API.
- If your frontend is located in a different directory name, update the command accordingly.
- The screenshots in `docs/screenshots/` can be used to document the project progress and final UI.

## Conclusion

The Car Show Registration System demonstrates a practical full-stack application that integrates backend and frontend development into a real-world project workflow. It highlights team collaboration, clean architecture principles, and the implementation of a functional registration system for a car show event.
