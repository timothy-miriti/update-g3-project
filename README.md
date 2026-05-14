# MovieHub – Trailer & Watchlist Platform

MovieHub is a modern React-based movie trailer and discovery platform that allows users to explore popular movies, watch trailers, and create a personalized movie wishlist.

Built with a clean cinematic interface and responsive design, MovieHub delivers an engaging experience for movie lovers who want to discover trending films and organize what they plan to watch next.

---

# Overview

MovieHub helps users:

- Browse popular and trending movies
- Search movies by title
- Watch official movie trailers
- View detailed movie information
- Add movies to a personal wishlist
- Remove movies from their wishlist
- Organize future movies to watch

The application integrates with the TMDB (The Movie Database) API to fetch real-time movie data including posters, ratings, trailers, and descriptions.

---

# The Problem

Movie lovers often use multiple platforms to:

- Discover movies
- Watch trailers
- Track movies they want to watch

Most platforms either focus only on streaming or only on reviews without giving users a simple personalized movie tracking experience.

---

# The Solution

MovieHub provides a centralized movie experience where users can:

- Discover trending and popular films
- Watch trailers instantly
- Save movies into a personal wishlist
- Explore movie details in one place
- Enjoy a fast and responsive cinematic UI

---

# Features

## Movie Discovery

- Browse trending and popular movies
- Dynamic movie categories
- Real-time movie updates from TMDB API

---

## Search Functionality

- Search movies instantly by title
- Dynamic search rendering
- Fast UI updates using React state

---

## Trailer Viewing

- Watch official movie trailers
- Embedded trailer player
- Interactive cinematic experience

---

## Wishlist Management

Users can:

- Add movies to wishlist
- Remove movies from wishlist
- Save movies for future viewing

Wishlist data is stored using localStorage for persistence.

---

## Movie Details

View detailed information including:

- Movie title
- Release date
- Ratings
- Overview
- Genres
- Posters and backdrops

---

## Responsive Design

MovieHub is optimized for:

- Desktop
- Tablet
- Mobile devices

---

# Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend Framework |
| Vite | Build Tool |
| JavaScript | Application Logic |
| CSS | Styling |
| TMDB API | Movie Data |
| localStorage | Wishlist Persistence |

---

# React Concepts Used

- Functional Components
- useState
- useEffect
- useMemo
- useRef
- Component-Based Architecture
- Props and State Management

---

# Getting Started

## Prerequisites

Make sure you have installed:

- Node.js (v16 or higher)
- npm

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/timothy-miriti/update-g3-project.git
```

## 2. Navigate into the project folder:

```bash
cd moviehub
```

## 3. Install dependencies:

```bash
npm install
```

## 4. Start the development server:
```bash
npm run dev
```

# API Configuration
MovieHub uses the TMDB API.

Create a .env file in the root folder:

```env
VITE_TMDB_API_KEY=your_api_key
```

Access the key inside the project using:

```javascript
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
```

---

# User Stories
As a User
- I want to browse trending movies so that I can discover popular films.
- I want to search movies by title so that I can quickly find movies I like.
- I want to watch movie trailers before deciding what to watch.
- I want to add movies to my wishlist so I can save movies for later.
- I want to remove movies from my wishlist when I no longer need them.
- I want to see detailed movie information before watching.

# Future Improvements

Planned improvements include:
- User authentication
- Backend database integration
- Personalized recommendations
- Pagination and infinite scrolling
- Dark/Light mode
- Community reviews and ratings
- Better loading animations
- Unit and integration testing

# Design Philosophy
MovieHub focuses on creating a cinematic and immersive user experience through:
- Bold movie visuals
- Interactive UI elements
- Responsive layouts
- Smooth user interactions
- Clean component architecture

# Project Structure
```bash
src/
│
├── components/
├── App.jsx
├── api.js
├── main.jsx
└── styles/
```

# Challenges Faced
- Some challenges during development included:
- Managing state across multiple components
- Handling API requests efficiently
- Syncing wishlist data with localStorage
- Creating a responsive movie layout

# Learning Outcomes
This project helped improve skills in:
- React development
- API integration
- State management
- Component architecture
- Responsive design
- Local storage management

# Author
Developed by the MovieHub Team.

# License
© 2026 MovieHub Project. All rights reserved.