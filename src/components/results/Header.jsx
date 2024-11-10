import React from 'react';
import { MessageCircle, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
                            <h1 className="text-[#1500F4] text-2xl font-bold">Esturio</h1>
                        </Link>
                        <div className='pt-8 w-full flex items-end justify-center'>
                            {title && (
                                <span className="hidden md:block text-black text-3xl">
                                    {title}
                                </span>
                            )}

                        </div>

                    </div>

                    {/* Iconos de navegación */}
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="Mensajes"
                        >
                            <div className="relative">
                                <MessageCircle className="h-6 w-6 text-[#1500F4]" />

                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                    1
                                </span>
                            </div>
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            aria-label="Perfil"
                        >
                            <User className="h-7 w-7 text-[#1500F4]" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;