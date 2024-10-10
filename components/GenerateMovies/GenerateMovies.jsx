'use client';
import { useState, useEffect } from 'react';
import { movies } from '@/util/KnightsofOdessa';
import styles from './GenerateMovies.module.css';

function GenerateMovies({ startYear, endYear }) {
  const [moviesByYearAndRating, setMoviesByYearAndRating] = useState({});

  useEffect(() => {
    setMoviesByYearAndRating(generateMoviesInRange(startYear, endYear));
  }, [startYear, endYear]);

  const generateMoviesInRange = (start, end) => {
    const filteredMovies = movies.filter(
      (movie) =>
        movie.year >= start && movie.year <= end && Number(movie.rating) >= 5, // Filter out ratings below 5
    );

    const groupedMovies = filteredMovies.reduce((acc, movie) => {
      if (!acc[movie.year]) {
        acc[movie.year] = {};
      }
      if (!acc[movie.year][movie.rating]) {
        acc[movie.year][movie.rating] = [];
      }
      acc[movie.year][movie.rating].push(movie);
      return acc;
    }, {});

    // Sort movie titles within each year and rating group
    Object.values(groupedMovies).forEach((yearGroup) => {
      Object.keys(yearGroup)
        .sort((a, b) => Number(b) - Number(a)) // Convert strings to numbers for proper comparison
        .forEach((rating) => {
          yearGroup[rating].sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
        });
    });

    return groupedMovies;
  };

  return (
    <>
      {Object.entries(moviesByYearAndRating).map(([year, yearGroup]) => (
        <div key={year} className={styles.yearCard}>
          <p className={styles.movieYear}>{year}</p>
          {Object.entries(yearGroup)
            .sort(([ratingA], [ratingB]) => Number(ratingB) - Number(ratingA)) // Convert ratings to numbers
            .map(([rating, ratingGroup]) => (
              <div key={rating}>
                {ratingGroup.map((movie) => (
                  <p
                    key={movie.title} // Use movie title as key if no unique id is available
                    className={styles.movieTitle}
                    style={{
                      color:
                        movie.rating === '5'
                          ? '#4f4f4f'
                          : movie.rating === '6'
                          ? '#cc33cc'
                          : movie.rating === '7'
                          ? '#3366ff'
                          : movie.rating === '8'
                          ? '#33cc00'
                          : movie.rating === '9'
                          ? '#ff6600'
                          : movie.rating === '10'
                          ? '#cc0000'
                          : 'inherit',
                    }}
                  >
                    {movie.title}
                  </p>
                ))}
              </div>
            ))}
        </div>
      ))}
    </>
  );
}

export default GenerateMovies;
