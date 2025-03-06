import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    // Get parameters from the URL query string
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || 100); // Default limit to 100
    
    // Read the manga data file
    const filePath = path.join(process.cwd(), 'mangas.json');
    const mangaData = await fs.readFile(filePath, 'utf-8');
    
    // Parse the JSON data
    const allMangas = JSON.parse(mangaData);
    
    // If there's a search query, search across all pages
    if (query) {
      // Flatten all manga arrays into a single array
      const flattenedMangas = allMangas.flat();
      
      // Filter based on search query
      const filteredMangas = flattenedMangas.filter(manga => 
        manga.title.toLowerCase().includes(query.toLowerCase()) || 
        (manga.genres && manga.genres.some(genre => 
          genre.toLowerCase().includes(query.toLowerCase())
        ))
      );
      
      // Limit results to the specified number
      const limitedResults = filteredMangas.slice(0, limit);
      
      // Return limited results along with total count for UI feedback
      return NextResponse.json({
        results: limitedResults,
        total: filteredMangas.length,
        limited: filteredMangas.length > limit
      });
    }
    
    // If no search query, just return the requested page
    const pageIndex = parseInt(page) - 1;
    if (pageIndex >= 0 && pageIndex < allMangas.length) {
      return NextResponse.json(allMangas[pageIndex]);
    } else {
      return NextResponse.json(allMangas[0]);
    }
  } catch (error) {
    console.error('Error fetching manga data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manga data' },
      { status: 500 }
    );
  }
}