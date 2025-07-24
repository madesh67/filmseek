import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './Components/Homepage';
import Movies from './Components/MovieSearch';
import MovieDetails from './Components/MovieDetails';

export default function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie-details/:type/:id" element={<MovieDetails />} />
    </Routes>
    </BrowserRouter>
  )
}