import React, { useState, useEffect } from 'react';
import { MessageCircle, User, LogOut, HelpCircle, Globe, DollarSign, UserSearch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BoxMessages from '../StandardMessages/BoxMessages';
import { FaChartBar } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
const ICON_SIZE = 28; // Tamaño estandarizado para todos los iconos

// Traducciones
const translations = {
    es: {
        logout: 'Salir',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        help: 'Ayuda',
        messages: 'Mensajes',
        profile: 'Perfil'
    },
    en: {
        logout: 'Logout',
        login: 'Login',
        register: 'Sign up',
        help: 'Help',
        messages: 'Messages',
        profile: 'Profile'
    },
    pt: {
        logout: 'Sair',
        login: 'Entrar',
        register: 'Cadastrar',
        help: 'Ajuda',
        messages: 'Mensagens',
        profile: 'Perfil'
    }
};

const Header = ({ title, showBack = true }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('es');
    const [currentCurrency, setCurrentCurrency] = useState('COP');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
    const [isOpenMessageBox, setIsOpenMessageBox] = useState(false);

    const {handleDashboard, dashboard}= useAuth()

    const t = (key) => translations[currentLanguage]?.[key] || translations['en'][key];

    const languages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Português' }
    ];

    const currencies = [
        { code: 'COP', symbol: '$', name: 'Peso Colombiano' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
        { code: 'BRL', symbol: 'R$', name: 'Real Brasileño' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
       detectUserLocation(); 
    }, []);

    const detectUserLocation = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const languageMap = {
                'AR':'es',
                'CO': 'es',
                'US': 'en',
                'BR': 'pt',
            };
            
            const currencyMap = {
                'AR':'ARS',
                'CO': 'COP',
                'US': 'USD',
                'BR': 'BRL',
            };

            setCurrentLanguage(languageMap[data.country_code] || 'en');
            setCurrentCurrency(currencyMap[data.country_code] || 'USD');
            
        } catch (error) {
            console.error('Error detecting location:', error);
            setCurrentLanguage('en');
            setCurrentCurrency('USD');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    const handleLanguageChange = (langCode) => {
        setCurrentLanguage(langCode);
        setShowLanguageMenu(false);
    };

    const handleCurrencyChange = (currencyCode) => {
        setCurrentCurrency(currencyCode);
        setShowCurrencyMenu(false);
    };

    const toggleStandardMessagesBox = () =>{
        setIsOpenMessageBox(!isOpenMessageBox)
    }
    
    const changeDashboard = () => {
        handleDashboard(dashboard !== "results"? "teachers":"results")
    }
    useEffect(() => {
        window.addEventListener("openBoxMessage",toggleStandardMessagesBox);
      return () => {
        window.removeEventListener("openBoxMessage", toggleStandardMessagesBox);
     };
     }, []);
    return (
        <div className="border-b border-gray-200 shadow-sm">
            <header className="bg-white sticky top-0 z-50">
                <div className="w-full px-1 md:px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo y título */}
                        <div className="flex items-center justify-between w-full">
                            <Link to="/" className="flex items-center">
                                <h1 className="text-purple-600 text-xl md:text-4xl font-semibold">Esturio</h1>
                            </Link>
                            <div className="pt-8 w-full flex items-end justify-center">
                                {title && (
                                    <span className="hidden md:block text-black text-5xl text-bold">
                                        {title}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Navigation Icons and Settings */}
                        <div className="flex items-center md:gap-4">
                            {/*dashboard*/}
                            {    isAuthenticated?
                               (
                                dashboard == "teachers"?
                                <Link
                                to={"/dashboard"}
                                onClick={() => changeDashboard()}
                                >
                                  <div className='flex p-2 items-center gap-2 hover:border rounded cursor-pointer hover:bg-gray-100'>
                                    <FaChartBar className='text-purple-600'/>
                                    <p>Dashboard</p>
                                  </div>
                                </Link>
                                :
                                <Link
                                to={"/results"}
                                onClick={() => changeDashboard()}
                                >
                                  <div className='flex p-2 items-center gap-2 hover:border rounded cursor-pointer hover:bg-gray-100'>
                                    <UserSearch className='text-purple-600'/>
                                    <p>profesores</p>
                                  </div>
                                </Link>

                               )
                                :
                                null
                            }
                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                    className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center gap-1"
                                    aria-label={t('language')}
                                >
                                    <Globe size={ICON_SIZE} className="text-purple-600 w-[22px] md:w-max" strokeWidth={1.5}/>
                                    <span className="text-xs md:text-sm font-medium text-gray-600">{currentLanguage.toUpperCase()}</span>
                                </button>

                                {showLanguageMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Currency Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                                    className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center gap-1"
                                    aria-label="currency"
                                >
                                    <DollarSign size={ICON_SIZE} className="text-purple-600 w-[22px] md:w-max" strokeWidth={1.5} />
                                    <span className="text-xs md:text-sm font-medium text-gray-600">{currentCurrency}</span>
                                </button>

                                {showCurrencyMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                        {currencies.map((currency) => (
                                            <button
                                                key={currency.code}
                                                onClick={() => handleCurrencyChange(currency.code)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                            >
                                                {currency.symbol} {currency.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Help Button */}
                            <Link
                                to="/help"
                                className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                aria-label={t('help')}
                            >
                                <HelpCircle size={ICON_SIZE} className="text-purple-600 w-[22px] md:w-max" strokeWidth={1.5} />
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {/* Mensajes Button */}
                                    <button
                                        className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        aria-label={t('messages')}
                                        onClick={toggleStandardMessagesBox }
                                    >
                                        <MessageCircle size={ICON_SIZE} className="text-purple-600 w-[22px] md:w-max" strokeWidth={1.5} />
                                    </button>

                                    {/* User Profile */}
                                    <button
                                        className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        aria-label={t('profile')}
                                    >
                                        <User size={ICON_SIZE} className="text-purple-600 w-[22px] md:w-max" strokeWidth={1.5} />
                                    </button>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-1 md:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-purple-600"
                                        aria-label={t('logout')}
                                    >
                                        <LogOut className='w-[22px] md:w-max' size={ICON_SIZE} strokeWidth={1.5} />
                                        <span className="font-medium">{t('logout')}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="w-max md:w-[8em] px-1 md:px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="w-max px-1 md:px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
          {isAuthenticated &&  <BoxMessages onClose={toggleStandardMessagesBox} isOpen={isOpenMessageBox}/> }
        </div>
    );
};

export default Header;