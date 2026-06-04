# StreamHub — YouTube-inspired React Video App

A modern, responsive React application built as a YouTube-inspired video streaming experience.

## 🚀 Overview

StreamHub is a portfolio-ready front-end project that demonstrates:
- YouTube Data API v3 integration/Rapid API Integration
- responsive video feed and category chips
- sticky left sidebar navigation
- video playback with React Player
- infinite scroll and loading states
- search and suggestion-based video browsing

## 🌟 Features

- **Home feed** with trending and topic-based categories
- **Video detail page** with embedded playback
- **Related video suggestions** for richer browsing
- **Responsive layout** for desktop and mobile
- **Tailwind CSS styling** for a polished UI
- **React Context API** for application-wide state

## 🧠 Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React Player
- React Icons
- Create React App

## ⚙️ Installation

From the `youtube_clone` directory:

```bash
npm install
```

Create a `.env` file in `youtube_clone` and add your API key:

```env
REACT_APP_YOUTUBE_API_KEY=your_api_key_here
```

Then run:

```bash
npm start
```

Open `http://localhost:3000` in your browser.

## 📦 Available Scripts

- `npm start` — start the development server
- `npm run build` — build the app for production
- `npm test` — run tests
- `npm run eject` — eject Create React App config (one-way)

## 🗂️ Project Structure

- `src/App.jsx` — app routing and layout
- `src/context/contextApi.js` — global state for categories, search results, and loading
- `src/utils/api.js` — YouTube API helper and normalization logic
- `src/components/Feed.jsx` — home feed with category chips
- `src/components/VideoDetails.jsx` — video playback and related suggestions
- `src/components/LeftNav.jsx` — YouTube-like sidebar navigation
- `src/utils/constants.js` — sidebar and feed category definitions

## 💡 Notes

- The app uses `REACT_APP_YOUTUBE_API_KEY` for YouTube API requests.
- Set up a Google Cloud Console credential and enable the YouTube Data API v3.
- If videos do not load, verify your API key and quota status.

## 🔧 Recommended Enhancements

- add search history and user preferences
- support authentication and watch later lists
- improve error handling for API quota issues
- add dark/light theme toggle

## ✅ Conclusion

This project is a sleek YouTube-style React app built for learning, portfolio showcase, and extension into a full streaming platform.

Enjoy exploring and customizing StreamHub!