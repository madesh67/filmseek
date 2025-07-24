import React from 'react';
import '../../styles/MovieSearch/PageNav.css';

function PageNav({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5 
}) {
  
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="page-nav">
      {/* Previous Button */}
      <button 
        className={`page-nav-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      {/* First Page */}
      {visiblePages[0] > 1 && (
        <>
          <button 
            className="page-nav-btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {showLeftEllipsis && <span className="ellipsis">...</span>}
        </>
      )}

      {/* Visible Page Numbers */}
      {visiblePages.map(page => (
        <button
          key={page}
          className={`page-nav-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {showRightEllipsis && <span className="ellipsis">...</span>}
          <button 
            className="page-nav-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button 
        className={`page-nav-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
}

export default PageNav;
