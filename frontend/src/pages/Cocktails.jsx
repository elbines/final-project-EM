import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cocktails.module.css';
import { Text } from '../UI/Typography';
import { StyledButton } from '../UI/StyledButton';
import lottie from 'lottie-web';

export const Cocktails = () => {
    const [cocktails, setCocktails] = useState([]);
    const [displayedCocktails, setDisplayedCocktails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [itemsToDisplay, setItemsToDisplay] = useState(6);
    const [totalCocktails, setTotalCocktails] = useState(0);
    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
        console.log("Selected filter:", e.target.value);
    };
    const filters = {
        'Liquor': ['Gin', 'Vodka', 'Tequila', 'Rum', 'Whiskey'],
        'Color': ['Red', 'Blue', 'Green', 'Yellow', 'Clear'],
        'Occasion': ['Christmas', 'Summer', 'New Year', 'Halloween'],
        'FlavorProfile': ['Sweet', 'Bitter', 'Sour', 'Spicy']
    };

    const [isLoading, setIsLoading] = useState(true);
    const animationContainer = useRef(null);

    useEffect(() => {
        setIsLoading(true); // Start loading
        // Load the Lottie animation from the public URL path
        const anim = lottie.loadAnimation({
            container: animationContainer.current, // The DOM element to host the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/Animation - 1705760771667.json' // The path to the JSON file
        });

        return () => anim.destroy(); // Cleanup the animation on component unmount
    }, []);

    useEffect(() => {
        let query = '';
        if (searchTerm) {
            query += `search=${encodeURIComponent(searchTerm)}`;
        }
        if (selectedFilter) {
            const [category, value] = selectedFilter.split(':');
            query += (query ? '&' : '') + `${category.toLowerCase()}=${encodeURIComponent(value)}`;
        }

        setIsLoading(true); // Set loading to true before fetching data

        fetch(`https://cbc-uvko.onrender.com/cocktails${query ? '?' + query : ''}`)
            .then(response => response.json())
            .then(data => {
                setCocktails(data);
                setDisplayedCocktails(data.slice(0, itemsToDisplay));
                setTotalCocktails(data.length);
                setIsLoading(false); // Set loading to false after data is received
            })
            .catch(error => {
                console.error('Error fetching cocktails:', error);
                setIsLoading(false); // Also set loading to false if there's an error
            });

        // Dependencies for useEffect. If any of these values change, the effect will rerun
    }, [searchTerm, selectedFilter, itemsToDisplay]);


    const loadMoreCocktails = () => {
        setItemsToDisplay(prev => prev + 6); //show 6 more for each new "load more"
    };

    return (
        <div className={styles.wrapper}>
            {/* Lottie animation container */}
            {isLoading ? (
                <div>
                    <div ref={animationContainer} className={styles.lottieContainer}></div>
                    <Text type="H3" className={styles.h3Load}>PLEASE WAIT WHILE LOADING RECIPES</Text>
                </div>) : (
                <>
                    {/* Search Input */}
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search for cocktails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Dropdown */}
                    <div className={styles.dropdowns}>
                        <select
                            value={selectedFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select Filter</option>
                            {Object.entries(filters).map(([category, values]) => (
                                <optgroup label={category} key={category}>
                                    {values.map(value => (
                                        <option key={value} value={`${category}:${value}`}>{value}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <Text type="H1" className={styles.h1}>EXPLORE OUR COCKTAILS</Text>
                </>
            )}

            {/* Grid Container */}
            {!isLoading && (
                <div className={styles.gridContainer}>
                    {displayedCocktails.map(cocktail => (
                        // Wrap each cocktail with Link, clickable
                        <Link to={`/cocktail/${cocktail._id}`} key={cocktail._id} className={styles.cocktailLink}>
                            <div>
                                {cocktail.imageUrl && (
                                    <img src={cocktail.imageUrl} alt={cocktail.name} className={styles.cocktailImage} />
                                )}
                                {cocktail.name && <Text type="H3" className={styles.h3}>{cocktail.name}</Text>}
                                <Text type="SbodyText" className={styles.SbodyText}>⏲️: {cocktail.prepTime} | 🌟: {cocktail.difficulty}</Text>
                                <Text type="SbodyText" className={styles.SbodyText}>⚡: {cocktail.strength} | 🏷️ : {cocktail.tags.join(', ')}</Text>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Load more button */}
            {!isLoading && displayedCocktails.length < totalCocktails && (
                <div className={styles.loadMoreButtonContainer}>
                    <StyledButton onClick={loadMoreCocktails}>
                        <p>EXPLORE MORE</p>
                        <p>COCKTAILS</p>
                    </StyledButton>
                </div>
            )}
        </div>
    );
};









/* SETTING UP ZUSTAND, LOADING 6 AT A TIME NOT WORKING YET */

// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './Cocktails.module.css';
// import { Text } from '../UI/Typography';
// import { StyledButton } from '../UI/StyledButton';
// import { useNavigate } from 'react-router-dom';
// import useExploreRecipesStore from '../stores/exploreRecipesStore';

// export const Cocktails = () => {
//     const navigate = useNavigate();
//     const {
//         displayedCocktails,
//         loadMoreCocktails,
//         totalCocktails,
//         searchTerm,
//         setSearchTerm,
//         selectedFilter,
//         setSelectedFilter,
//         fetchCocktails
//     } = useExploreRecipesStore();

//     useEffect(() => {
//         fetchCocktails(searchTerm, selectedFilter);

//         // Scroll restoration
//         const timer = setTimeout(() => {
//             const savedPosition = sessionStorage.getItem('scrollPosition');
//             if (savedPosition !== null) {
//                 window.scrollTo(0, parseInt(savedPosition, 10));
//                 sessionStorage.removeItem('scrollPosition');
//             }
//         }, 0);
//         return () => clearTimeout(timer); // Clear timeout on component unmount
//     }, [searchTerm, selectedFilter]);


//     // Handle filter change
//     const handleFilterChange = (e) => {
//         setSelectedFilter(e.target.value);
//     };

//     // Handle cocktail click
//     const handleCocktailClick = (id) => {
//         sessionStorage.setItem('scrollPosition', window.scrollY);
//         navigate(`/cocktail/${id}`);
//     };

//     // Filter options
//     const filters = {
//         'Liquor': ['Gin', 'Vodka', 'Tequila', 'Rum', 'Whiskey'],
//         'Color': ['Red', 'Blue', 'Green', 'Yellow', 'Clear'],
//         'Occasion': ['Christmas', 'Summer', 'New Year', 'Halloween'],
//         'FlavorProfile': ['Sweet', 'Bitter', 'Sour', 'Spicy']
//     };

//     return (
//         <div className={styles.wrapper}>
//             {/* Search Input */}
//             <div className={styles.searchContainer}>
//                 <input
//                     type="text"
//                     placeholder="Search for cocktails..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>

//             {/* Dropdown */}
//             <div className={styles.dropdowns}>
//                 <select
//                     value={selectedFilter}
//                     onChange={handleFilterChange}
//                 >
//                     <option value="">Select Filter</option>
//                     {Object.entries(filters).map(([category, values]) => (
//                         <optgroup label={category} key={category}>
//                             {values.map(value => (
//                                 <option key={value} value={`${category}:${value}`}>{value}</option>
//                             ))}
//                         </optgroup>
//                     ))}
//                 </select>
//             </div>

//             <Text type="H1" className={styles.h1}>EXPLORE OUR COCKTAILS</Text>
//             <div className={styles.gridContainer}>
//                 {displayedCocktails.map(cocktail => (
//                     <div onClick={() => handleCocktailClick(cocktail._id)} key={cocktail._id} className={styles.cocktailLink}>
//                         <div>
//                             {cocktail.imageUrl && (
//                                 <img src={cocktail.imageUrl} alt={cocktail.name} className={styles.cocktailImage} />
//                             )}
//                             {cocktail.name && <Text type="H3" className={styles.h3}>{cocktail.name}</Text>}
//                             <Text type="SbodyText" className={styles.SbodyText}>⏲️: {cocktail.prepTime} | 🌟: {cocktail.difficulty}</Text>
//                             <Text type="SbodyText" className={styles.SbodyText}>⚡: {cocktail.strength} | 🏷️ : {cocktail.tags.join(', ')}</Text>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Load More Button */}
//             {displayedCocktails.length < totalCocktails && (
//                 <div className={styles.loadMoreButtonContainer}>
//                     <StyledButton onClick={loadMoreCocktails}>
//                         Load More
//                     </StyledButton>
//                 </div>
//             )}
//         </div>
//     );
// };
