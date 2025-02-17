import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import style from './Navbar.module.css';
import { LogoButton } from '../UI/LogoButton';

export const Navbar = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsNavExpanded(false);
            }
        }

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);
        // Remove event listener on cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty array ensures this runs once on mount and unmount

    return (
        <nav ref={navRef} className={style.nav}>
            <div className={style.LogoButtonWrapper}>
                <LogoButton />
            </div>
            <div
                className={`${style.menuIcon} ${isNavExpanded ? style.open : ''}`}
                onClick={() => setIsNavExpanded(!isNavExpanded)}
            >
                <div className={style.bar}></div>
                <div className={style.bar}></div>
                <div className={style.bar}></div>
            </div>
            <div className={`${style.navLinks} ${isNavExpanded ? style.active : ''}`}>
                {/* <NavLink to="/" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    Home
                </NavLink> */}
                <NavLink to="/about-us" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    About Us
                </NavLink>
                <NavLink to="/cocktails" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    Cocktails
                </NavLink>
                <NavLink to="/contact" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    Contact us
                </NavLink>
                <NavLink to="/admin/login" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    Admin
                </NavLink>
                {/* <NavLink to="/login" className={style.navLink} onClick={() => setIsNavExpanded(false)}>
                    Log In
                </NavLink> */}
                {/* LOG IN FOR LATER FOR USERS */}
            </div>
        </nav>
    );
};

