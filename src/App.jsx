import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Components/Homepage';
import Movies from './Components/MovieSearch';
import MovieDetails from './Components/MovieDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie-details/:type/:id" element={<MovieDetails />} />
        {/* Add catch-all route for unmatched paths */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
