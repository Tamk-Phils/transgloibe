"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, Navigation, Globe, ChevronDown, ChevronRight, User, Mail, Clock, ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWhatsAppSettings } from "@/lib/whatsapp";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState("EN");
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { settings: waSettings, whatsappUrl } = useWhatsAppSettings();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsMobileServicesOpen(false);
        setIsServicesOpen(false);
        setIsLangOpen(false);
    }, [pathname]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const serviceItems = [
        { name: "Air Freight", desc: "Rapid global air cargo corridors", href: "/usage#air" },
        { name: "Warehouse Storage", desc: "Secure climate-controlled logistics hubs", href: "/usage#warehouse" },
        { name: "Ocean Freight", desc: "Maritime container lines & vessel booking", href: "/usage#ocean" },
        { name: "Logistics Solutions", desc: "End-to-end supply chain management", href: "/usage#logistics" },
        { name: "Road Freight", desc: "Interstate ground express transport", href: "/usage#road" },
        { name: "Rail Freight", desc: "Eco-friendly bulk rail transport", href: "/usage#rail" },
        { name: "Packaging", desc: "Industrial protective packaging", href: "/usage#packaging" },
        { name: "Cargo Insurance", desc: "Comprehensive transit risk protection", href: "/usage#insurance" },
    ];

    const languages = ["EN", "ES", "FR", "DE"];

    return (
        <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
            isScrolled 
                ? "bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md py-0" 
                : "bg-white border-b border-slate-200/80 shadow-sm"
        }`}>
            {/* Top Announcement Bar - Hidden on small mobile screens */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 px-6 border-b border-slate-800 hidden md:block">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a href="mailto:info@transglobelogistics.org" className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                            <Mail size={14} className="text-sky-400" />
                            <span>info@transglobelogistics.org</span>
                        </a>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} className="text-sky-400" />
                            <span>24/7 Satellite Global Dispatch</span>
                        </div>
                        {waSettings.enabled && waSettings.phoneNumber && waSettings.showHeader && whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[#25D366] hover:text-[#20bd5a] font-bold transition-colors"
                            >
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>WhatsApp: {waSettings.displayLabel || waSettings.phoneNumber}</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/resources" className="hover:text-sky-400 transition-colors font-medium">Our FAQs</Link>
                        <Link href="/quote" className="hover:text-sky-400 transition-colors font-semibold text-sky-400">Get a Quote</Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-6 h-18 sm:h-20 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform duration-200">
                        <Navigation size={20} className="transform rotate-45 sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                        Transglobe <span className="text-blue-600">Logistics</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link
                        href="/"
                        className={`text-sm font-bold transition-colors py-1 ${
                            pathname === "/" ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                        }`}
                    >
                        Home
                    </Link>

                    <Link
                        href="/about"
                        className={`text-sm font-bold transition-colors py-1 ${
                            pathname === "/about" ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                        }`}
                    >
                        About Us
                    </Link>

                    {/* Services Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsServicesOpen(true)}
                        onMouseLeave={() => setIsServicesOpen(false)}
                    >
                        <Link
                            href="/usage"
                            className={`flex items-center gap-1 text-sm font-bold transition-colors py-1 ${
                                pathname === "/usage" ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                            }`}
                        >
                            <span>Our Services</span>
                            <ChevronDown size={15} className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-blue-600' : ''}`} />
                        </Link>

                        {isServicesOpen && (
                            <div className="absolute left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="grid grid-cols-1 gap-1">
                                    {serviceItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="p-2.5 rounded-xl hover:bg-blue-50 transition-colors group flex items-start gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                            <div>
                                                <p className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/tracking"
                        className={`text-sm font-bold transition-colors py-1 ${
                            pathname === "/tracking" ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                        }`}
                    >
                        Real Time Tracking
                    </Link>

                    <Link
                        href="/contact"
                        className={`text-sm font-bold transition-colors py-1 ${
                            pathname === "/contact" ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                        }`}
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
                        >
                            <Globe size={14} className="text-blue-600" />
                            <span>{selectedLang}</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setSelectedLang(lang);
                                            setIsLangOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        {lang} Language
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Get a Quote Button */}
                    <Link
                        href="/quote"
                        className="bg-blue-600 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-900/20 transition-all flex items-center gap-2 group cursor-pointer"
                    >
                        <span>Get a Quote</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Client Portal */}
                    <Link
                        href="/login"
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Client Portal Login"
                    >
                        <User size={18} />
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="lg:hidden text-slate-800 p-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-all cursor-pointer shrink-0"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle Navigation Menu"
                >
                    {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Menu Drawer + Backdrop (Matching theglobalcargo mobile drawer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[-1] lg:hidden mt-[80px]"
                        />

                        {/* Slide Down Mobile Navigation Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 px-6 py-6 shadow-2xl z-[100] lg:hidden max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex flex-col gap-1.5 text-slate-900">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-extrabold py-3 px-3 rounded-xl transition-colors ${
                                        pathname === "/" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50"
                                    }`}
                                >
                                    Home
                                </Link>

                                <Link
                                    href="/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-extrabold py-3 px-3 rounded-xl transition-colors ${
                                        pathname === "/about" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50"
                                    }`}
                                >
                                    About Us
                                </Link>

                                {/* Accordion for Our Services in Mobile */}
                                <div className="border-y border-slate-100 my-1 py-1">
                                    <button
                                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                                        className="w-full flex items-center justify-between text-base font-extrabold py-3 px-3 rounded-xl hover:bg-slate-50 text-slate-900 cursor-pointer"
                                    >
                                        <span>Our Services</span>
                                        <ChevronDown size={18} className={`transition-transform duration-200 text-blue-600 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isMobileServicesOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-4 space-y-1 py-1"
                                            >
                                                {serviceItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-2 text-xs font-bold text-slate-700 py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <ChevronRight size={12} className="text-blue-600" />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/tracking"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-extrabold py-3 px-3 rounded-xl transition-colors ${
                                        pathname === "/tracking" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50"
                                    }`}
                                >
                                    Real Time Tracking
                                </Link>

                                <Link
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-extrabold py-3 px-3 rounded-xl transition-colors ${
                                        pathname === "/contact" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50"
                                    }`}
                                >
                                    Contact Us
                                </Link>

                                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
                                    {waSettings.enabled && waSettings.phoneNumber && whatsappUrl && (
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full text-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            <span>Chat on WhatsApp</span>
                                        </a>
                                    )}
                                    <Link
                                        href="/quote"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-center bg-blue-600 hover:bg-blue-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Get a Quote</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm py-3.5 rounded-xl border border-slate-200 transition-all"
                                    >
                                        Client Portal Login
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
