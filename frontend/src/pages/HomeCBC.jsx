import React, { useState, useEffect, useRef } from 'react';
import styles from './HomeCBC.module.css';
import { Text } from '../UI/Typography';
import { Link } from 'react-router-dom';
import lottie from 'lottie-web';

export const HomeCBC = () => {
    const [featuredCocktails, setFeaturedCocktails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const animationContainer = useRef(null);
    const featuredIds = ['659ffaa600633fc348dba096', '65a10d2388f0635f92631580', '65a0a9464c154a29ccb2c897', '659ffc6700633fc348dba0cb', '659ffa2400633fc348dba090', '659ffa2c00633fc348dba093'];

    useEffect(() => {
        const anim = lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/Animation - 1705760771667.json'
        });

        return () => anim.destroy();
    }, []);

    useEffect(() => {

        setIsLoading(true);
        let loadingTimeout = setTimeout(() => {
            setShowLoadingIndicator(true);
        }, 3000);

        fetch('https://cbc-uvko.onrender.com/cocktails')
            .then(response => response.json())
            .then(data => {
                clearTimeout(loadingTimeout);
                const selectedCocktails = data.filter(cocktail => featuredIds.includes(cocktail._id));
                setFeaturedCocktails(selectedCocktails);
                setIsLoading(false); // Data fetched, stop loading
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                clearTimeout(loadingTimeout);
            });
    }, []);

    return (
        <div className={styles.wrapper}>
            {isLoading && showLoadingIndicator && (
                <div>
                    <div ref={animationContainer} className={styles.lottieContainer}></div>
                    <Text type="H3" className={styles.h3Load}>PLEASE WAIT WHILE LOADING PAGE</Text>
                </div>
            )}
            {!isLoading && (
                <>
                    <Text type="H1" className={styles.h1}>OUR CURRENT FAVOURITES</Text>
                    <div className={styles.gridContainer}>
                        {featuredCocktails.map(cocktail => (
                            <Link to={`/cocktail/${cocktail._id}`} key={cocktail._id} className={styles.cocktailLink}>
                                <div>
                                    {cocktail.imageUrl && (
                                        <img src={cocktail.imageUrl} alt={cocktail.name} className={styles.cocktailImage} />
                                    )}
                                    {cocktail.name && <Text type="H4" className={styles.h3}>{cocktail.name}</Text>}
                                    <Text type="SbodyText" className={styles.SbodyText}>⏲️: {cocktail.prepTime} | 🌟: {cocktail.strength}</Text>
                                    <Text type="SbodyText" className={styles.SbodyText}>⚡: {cocktail.strength} | 🏷️ : {cocktail.tags.join(', ')}</Text>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );


}
