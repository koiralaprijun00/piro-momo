'use client'

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import LocaleSwitcher from "./LocaleSwitcher"
import NavBarShareButton from "./NavShareButton" // Import the share button component
import { useTranslations } from 'next-intl';
import { FaTwitter } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';

const Navbar = () => {
    const t = useTranslations('Translations');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        if (!isMenuOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isDropdownOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
                dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Handle escape key to close menu
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (isMenuOpen) setIsMenuOpen(false);
                if (isDropdownOpen) setIsDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isMenuOpen, isDropdownOpen]);

    // Focus management for mobile menu
    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            const firstFocusableElement = menuRef.current.querySelector('a');
            if (firstFocusableElement) {
                (firstFocusableElement as HTMLElement).focus();
            }
        }
    }, [isMenuOpen]);

    // Link classes for both desktop and mobile
    const linkClasses = "text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";

    // Main nav links (first 8 items)
    const mainNavLinks = [
        { href: "/spend", label: t('spendBinodTitle') },
        { href: "/guess-festival", label: t('games.guessFestival.title') },
        { href: "/kings-of-nepal", label: t('kingsOfNepal.title') },
        { href: "/name-districts", label: t('nameDistrictTitle') },
        { href: "/yo-ki-tyo", label: t('wouldYouRather.title') || 'Would You Rather' },
        { href: "/general-knowledge", label: t('nepalGk.titleshort') || 'Nepal GK Quiz' },
        { href: "/chineu-ta", label: t('logoQuiz.title')},
        { href: "/first-of-nepal", label: t('firstofNepalTitle') || 'Firsts of Nepal'}
    ];

    // Dropdown links (extra games)
    const dropdownLinks = [
        { href: "/mandir-chineu", label: t('games.guessTemple.title') },
        { href: "/gau-khane-katha", label: t('RiddlesGame.title')},
        { href: "/date-converter", label: t('nepaliDateConverterTitle') || 'Date Converter' },
        { href: "/life-checklist", label: t('nepalChecklist.navbarTitle') },
        { href: "https://www.nepalihawa.com", label: t('nepalihawa.title'), target: "_blank", rel: "noopener noreferrer" }
        // Add more games as needed
    ];

    // All links for mobile menu
    const allLinks = [...mainNavLinks, ...dropdownLinks];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 mt-4 ">
            <div className="container mx-auto md:px-0 px-4 py-2">
                {/* Top Row: Logo, Brand Name, Locale Switcher, Twitter Link (all screens) */}
                <div className="flex items-center justify-between">
                    {/* Left: Logo and Brand Name */}
                    <Link href="/" className="flex items-center group" aria-label="Piromomo Home">
                        <Image 
                            src="/jhol-momo.png" 
                            alt="Piromomo Logo" 
                            width={50} 
                            height={50} 
                            className="mr-2 ml-2 transform group-hover:scale-110 transition-transform duration-200" 
                            priority
                        />
                    </Link>

                    {/* Right: Locale Switcher, Twitter Link, and Hamburger (Hamburger only on mobile) */}
                    <div className="flex items-center space-x-4">
                        <LocaleSwitcher aria-label={t('switchLanguage') || 'Switch language'} />
                        <Link 
                            href="https://x.com/kastopiromomo" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="text-xl" />
                        </Link>
                        <Link 
                            href="https://www.instagram.com/kastopiromomo/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="text-xl" />
                        </Link>
                        
                        {/* Share Button Component */}
                        <NavBarShareButton />

                        {/* Hamburger menu button - visible only on mobile */}
                        <button 
                            ref={buttonRef}
                            className="md:hidden text-gray-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? (
                                <RiCloseLine className="w-6 h-6" />
                            ) : (
                                <RiMenu3Line className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center justify-start space-x-1 mt-3 xl:mt-2 xl:justify-start">
                    {/* Main nav links */}
                    {mainNavLinks.map((link, index) => (
                        <Link 
                            key={index} 
                            href={link.href} 
                            className={linkClasses}
                        >
                            {link.label}
                        </Link>
                    ))}
                    
                    {/* Dropdown for additional games */}
                    {dropdownLinks.length > 0 && (
                        <div className="relative">
                            <button
                                ref={dropdownButtonRef}
                                onClick={toggleDropdown}
                                className={`${linkClasses} flex items-center`}
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                {t('moreGames') || 'More Games'} 
                                <BiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div 
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                                >
                                    {dropdownLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                                            onClick={() => setIsDropdownOpen(false)}
                                            target={link.target}
                                            rel={link.rel}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile menu - visible only when hamburger is clicked */}
                <div 
                    id="mobile-menu"
                    ref={menuRef}
                    className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 transform transition-all duration-200 ${
                        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex flex-col space-y-1">
                            {/* Show all links in mobile menu */}
                            {allLinks.map((link, index) => (
                                <Link 
                                    key={index}
                                    href={link.href} 
                                    className={linkClasses}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar