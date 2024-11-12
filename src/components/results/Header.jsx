import React from 'react';
import { MessageCircle, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from "react-icons/fi";

const Header = ({ title, showBack = true }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="w-full px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y título */}
                    <div className="flex items-center justify-between w-full">
                        <Link to="/" className="flex items-center">
                            <h1 className="text-[#1500F4] text-3xl font-semibold">Esturio</h1>
                        </Link>
                        <div className='pt-8 w-full flex items-end justify-center'>
                            {title && (
                                <span className="hidden md:block text-black text-5xl text-bold">
                                    {title}
                                </span>
                            )}

                        </div>

                    </div>

                    {/* Iconos de navegación */}
                    <div className="flex items-center">
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="Mensajes"
                        >
                            <div className="relative">
                                <svg
                                    className="h-6 w-6 text-[#1500F4]"
                                    viewBox="0 0 29.3 29.3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeWidth="1.4295"
                                        strokeMiterlimit="10"
                                        fill="none"
                                        d="M20.864,22.1l3.87-0.016 c2.01,0,3.64-1.644,3.64-3.673V5.099c0-2.028-1.63-3.673-3.64-3.673H4.566c-2.01,0-3.64,1.644-3.64,3.673v13.313 c0,2.028,1.63,3.673,3.64,3.673h11.979"
                                    />
                                    <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4295"
                                        strokeMiterlimit="10"
                                        points="15.985,21.765 18.714,27.459 21.453,21.687"
                                    />
                                    <line
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4295"
                                        strokeMiterlimit="10"
                                        x1="3.871"
                                        y1="6.491"
                                        x2="24.015"
                                        y2="6.491"
                                    />
                                    <line
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4295"
                                        strokeMiterlimit="10"
                                        x1="4.107"
                                        y1="10.791"
                                        x2="24.251"
                                        y2="10.791"
                                    />
                                    <line
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4295"
                                        strokeMiterlimit="10"
                                        x1="4.501"
                                        y1="15.587"
                                        x2="13.336"
                                        y2="15.606"
                                    />
                                </svg>

                            </div>
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="Perfil"
                        >
                            <User size={30} color='#1500F4' strokeWidth={1.5} />
                        </button>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;