import { useNavigate } from 'react-router-dom';
import '../../styles/Explore.css';

export default function Explore() {
    const navigate = useNavigate();

    const exploreOptions = [
        {
            title: "Movies",
            description: "Discover thousands of movies from blockbusters to indie gems",
            icon: "fa-film",
            path: "/movies?contentType=movies&category=all&page=1",
            gradient: "linear-gradient(135deg, #ff4500, #ff6b35)"
        },
        {
            title: "TV Shows",
            description: "Explore popular series, documentaries, and exclusive content",
            icon: "fa-television",
            path: "/movies?contentType=tv&category=all&page=1", 
            gradient: "linear-gradient(135deg, #4a9eff, #0066cc)"
        },
        {
            title: "Search",
            description: "Find exactly what you're looking for with advanced search",
            icon: "fa-search",
            path: "/movies?search=",
            gradient: "linear-gradient(135deg, #28a745, #20c997)"
        }
    ];

    const handleExploreClick = (path) => {
        navigate(path);
    };

    return (
        <section className="explore">
            <div className="explore-container">
                <div className="explore-header">
                    <h2 className="explore-title">
                        Ready to Discover More?
                    </h2>
                    <p className="explore-subtitle">
                        Dive deeper into our vast collection of entertainment content
                    </p>
                </div>

                <div className="explore-grid">
                    {exploreOptions.map((option, index) => (
                        <div 
                            key={index}
                            className="explore-card"
                            onClick={() => handleExploreClick(option.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleExploreClick(option.path);
                                }
                            }}
                            aria-label={`Explore ${option.title}`}
                        >
                            <div className="explore-card-icon" style={{background: option.gradient}}>
                                <i className={`fa ${option.icon}`} aria-hidden="true"></i>
                            </div>
                            <div className="explore-card-content">
                                <h3 className="explore-card-title">{option.title}</h3>
                                <p className="explore-card-description">{option.description}</p>
                            </div>
                            <div className="explore-card-arrow">
                                <i className="fa fa-arrow-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="explore-cta">
                    <button 
                        className="explore-main-btn"
                        onClick={() => handleExploreClick('/movies')}
                        aria-label="Start exploring all content"
                    >
                        <span>Start Exploring</span>
                        <i className="fa fa-rocket" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="explore-stats">
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Movies</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">5K+</span>
                        <span className="stat-label">TV Shows</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Updated</span>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="explore-bg-element explore-bg-1"></div>
            <div className="explore-bg-element explore-bg-2"></div>
            <div className="explore-bg-element explore-bg-3"></div>
        </section>
    );
}
