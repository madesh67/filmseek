import { Navigate } from 'react-router-dom';
import '../../styles/Explore.css';

export default function Explore(){

    return (
        <section className="explore">
            <div className="explore-description">
                <p>Explore more Movies, Tv Shows, and Search more movies and tv shows.</p>
            </div>
            <div className="explore-btn">
                <a href="/movies">
                    <button>Explore</button>
                </a>
            </div>
        </section>
    )
}