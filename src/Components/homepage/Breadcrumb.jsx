// Create a new file: components/Breadcrumb/Breadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Breadcrumb.css';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    const breadcrumbNameMap = {
        'movies': 'Movies',
        'tv-shows': 'TV Shows',
        'movie-details': 'Movie Details',
        'search': 'Search Results',
        'popular': 'Popular',
        'top_rated': 'Top Rated',
        'upcoming': 'Upcoming',
        'now_playing': 'Now Playing'
    };

    if (pathnames.length === 0) return null;

    return (
        <nav className="breadcrumb-container" aria-label="Breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        Home
                    </Link>
                </li>
                {pathnames.map((pathname, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = breadcrumbNameMap[pathname] || pathname.replace('-', ' ');

                    return (
                        <li key={pathname} className="breadcrumb-item">
                            <span className="breadcrumb-separator" aria-hidden="true">
                                <i className="fa fa-chevron-right"></i>
                            </span>
                            {isLast ? (
                                <span className="breadcrumb-current" aria-current="page">
                                    {displayName}
                                </span>
                            ) : (
                                <Link to={routeTo} className="breadcrumb-link">
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
