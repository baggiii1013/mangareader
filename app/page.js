'use client'
import TiltedCard from "@/components/ui/TitledCard";
import { useState, useEffect } from "react";

export default function Home() {
  const [page, setPage] = useState(1);
  const [mangas, setMangas] = useState([]);
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsLimited, setResultsLimited] = useState(false);
  
  const SEARCH_LIMIT = 100; // Maximum number of search results to display

  // Fetch manga data
  useEffect(() => {
    async function fetchManga() {
      try {
        setLoading(true);
        
        let url = `/api/manga?page=${page}`;
        if (isSearching && searchQuery.trim()) {
          url = `/api/manga?query=${encodeURIComponent(searchQuery.trim())}&limit=${SEARCH_LIMIT}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch manga data');
        
        const data = await response.json();
        
        if (isSearching && data.results) {
          // Handle search results with metadata
          setMangas(data.results);
          setFilteredMangas(data.results);
          setTotalResults(data.total);
          setResultsLimited(data.limited);
        } else {
          // Handle standard paginated data
          const processedData = Array.isArray(data[0]) ? data.flat() : data;
          setMangas(processedData);
          setFilteredMangas(processedData);
          setTotalResults(processedData.length);
          setResultsLimited(false);
        }
      } catch (error) {
        console.error('Error fetching manga data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchManga();
  }, [page, isSearching, searchQuery]);

  // Handle search with debounce
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Set a new timeout to delay the search
    if (query.trim()) {
      const timeout = setTimeout(() => {
        setIsSearching(true);
      }, 500); // 500ms debounce
      setSearchTimeout(timeout);
    } else {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setTotalResults(0);
    setResultsLimited(false);
  };

  // Navigation functions
  const handleNextPage = () => {
    if (!isSearching) {
      setPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (!isSearching) {
      setPage(prev => Math.max(prev - 1, 1));
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading manga data...</div>;

  return (
    <div className="px-4 py-8">
      {/* Header with search bar */}
      <div className="mb-10 flex flex-col items-center">
        
        {/* Search bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by title or genre..."
            className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              <span className="text-xl font-semibold">×</span>
            </button>
          )}
        </div>
        
        {/* Search results count */}
        {searchQuery && (
          <div className="mt-2 text-gray-300 text-sm">
            {resultsLimited 
              ? `Showing top ${filteredMangas.length} of ${totalResults} mangas found`
              : `Found ${totalResults} ${totalResults === 1 ? 'manga' : 'mangas'}`}
          </div>
        )}
      </div>

      {/* Manga grid */}
      <div className="">
        {filteredMangas.length === 0 ? (
          <div className="text-white text-center py-10">
            {isSearching 
              ? `No mangas found matching "${searchQuery}"`
              : "No mangas available for this page"}
          </div>
        ) : (
          <div className="mx-4 md:mx-10 flex flex-wrap gap-[85px] justify-center">
            {filteredMangas.map((manga, index) => (
              <TiltedCard
                key={index}
                imageSrc={manga.cover_url}
                altText={manga.title}
                title={manga.title}
                captionText={manga.title}
                genres={manga.genres || []} 
                containerHeight="600px"
                containerWidth="300px"
                imageHeight="500px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                // overlayContent={
                //   <p className="tilted-card-demo-text m-3">{manga.title}</p>
                // }
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination controls (only shown when not searching) */}
      {!isSearching && (
        <div className="flex justify-center mt-8 mb-8 gap-4">
          <button 
            onClick={handlePrevPage} 
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous Page
          </button>
          <span className="px-4 py-2 text-white">Page {page}</span>
          <button 
            onClick={handleNextPage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next Page
          </button>
        </div>
      )}
      
      {/* Message when results are limited */}
      {resultsLimited && (
        <div className="text-center mt-4 text-gray-400 text-sm">
          <p>Showing top {SEARCH_LIMIT} results. Try refining your search for more specific results.</p>
        </div>
      )}
    </div>
  );
}