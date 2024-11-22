import React, {useState} from 'react';
import { MessageCircle, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from "react-icons/fi";
import BoxMessages from './components/boxMessages'

const Header = ({ title, showBack = true }) => {
    const navigate = useNavigate();
    const [isBoxMessageOpen, setIsBoxMessageOpen] = useState(false);

    const handleChangeInbox = ()=>{
        setIsBoxMessageOpen(!isBoxMessageOpen)
    }

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
                            <h1 className="text-purple-600 text-4xl font-semibold">Esturio</h1>
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
                            onClick={handleChangeInbox}
                        >
                            <div className="relative">
                                <svg 
                                    className="h-8 w-8 text-purple-600"
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
                            <User size={35} className='text-purple-600' strokeWidth={1.5} />
                        </button>

                    </div>
                </div>
            </div>
            <BoxMessages onClose={handleChangeInbox}  isOpen={isBoxMessageOpen} />
        </header>
    );
};

export default Header;