# VCGamers Pokedex App

A fullstack Pokedex application built for the VCGamers technical recruitment test using Next.js (Frontend), Express.js (Backend), MongoDB, and TypeScript.

## Features

### Pokemon List Page

- Display a list of Pokemon
- Search by Pokemon name
- Infinite scroll
- Two columns per row
- Fetch 8 Pokemon per page

### Pokemon Detail Page

- Display sprites: front, back, shiny
- Display height and weight
- Display types
- Display evolution chain
- Display moves (max 10)

## Requirement Coverage

- Next.js (Frontend)
- Express.js (Backend)
- MongoDB (data fetched and stored)
- TypeScript (Frontend + Backend)
- Data source from PokeAPI (`https://pokeapi.co/docs/v2`)
- No lodash/underscore utility library
- Reusable custom hook (`useDebounceValues`)
- Navigation library (Next App Router: `next/link`, `next/navigation`)
- Skeleton loading
- TailwindCSS
- Jotai state management

## Bonus

- Import optimization (`import type`)
- Minimized re-renders (`memo`, callback stabilization)
- Unit tests (Vitest + Testing Library)

## Tech Stack

- Frontend: Next.js 16, TailwindCSS v4, Jotai, Axios
- Backend: Express 5, MongoDB Native Driver, Axios
- Testing: Vitest, @testing-library/react

## Project Structure

- `frontend/` -> Next.js app
- `backend/` -> Express API server
- `docker-compose.yml` -> Local MongoDB container

## Prerequisites

- Node.js 20+
- npm
- Docker (recommended for local MongoDB)

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=vcg_pokedex
POKE_API_BASE_URL=https://pokeapi.co/api/v2
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4000/api
```

## How to Run

### 1) Start MongoDB

From project root:

```bash
docker compose up -d
```

### 2) Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://127.0.0.1:4000`

### 3) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## API Endpoints

- Health: `GET /api/health`
- Sync Pokemon: `POST /api/pokemon/sync?limit=8&offset=0`
- Pokemon List: `GET /api/pokemon?page=1&limit=8`
- Pokemon List + Search: `GET /api/pokemon?page=1&limit=8&search=bulba`
- Pokemon Detail: `GET /api/pokemon/:name`

## Testing

### Frontend Lint

```bash
cd frontend
npm run lint
```

### Frontend Unit Test

```bash
cd frontend
npm run test
```

### Backend API Testing

Use the Postman collection:

- `backend/vcgamers-pokedex.postman_collection.json`

## Notes

- PokeAPI height is in decimeters (displayed as meters in UI).
- PokeAPI weight is in hectograms (displayed as kilograms in UI).
