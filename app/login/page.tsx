'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userType: 'KID' // Default to PARENT
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [characterPosition, setCharacterPosition] = useState('-100%');
    const [showChatBubble, setShowChatBubble] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const userTypes = [
        { value: 'PARENT', label: 'Parent' },
        { value: 'KID', label: 'Kid' }
    ];

    const messages = {
        PARENT: [
            "Welcome back ...",
            "I'm here to help you access your account.",
            "Enter your credentials to continue supporting your child's journey.",
            "Let's get you logged in"
        ],
        KID: [
            "Welcome back ...",
            "Ready to continue your adventure?",
            "Enter your credentials to play and learn.",
            "Let's get you logged in"
        ]
    };

    // Animate character entrance
    useEffect(() => {
        const characterTimer = setTimeout(() => {
            setCharacterPosition('0%');
        }, 1000);

        return () => clearTimeout(characterTimer);
    }, []);

    // After character enters, show chat bubble and start typing messages
    useEffect(() => {
        if (characterPosition === '0%') {
            const bubbleTimer = setTimeout(() => {
                setShowChatBubble(true);
                typeMessage(0);
            }, 800);
            return () => clearTimeout(bubbleTimer);
        }
    }, [characterPosition, formData.userType]);

    // Typing function
    const typeMessage = (index: number) => {
        const currentMessages = messages[formData.userType as keyof typeof messages];
        if (index >= currentMessages.length) return;

        const currentMsg = currentMessages[index];
        let i = 0;
        setCurrentMessage('');

        const typingInterval = setInterval(() => {
            setCurrentMessage(currentMsg.substring(0, i + 1));
            i++;

            if (i === currentMsg.length) {
                clearInterval(typingInterval);

                // Wait before typing next message
                setTimeout(() => {
                    typeMessage(index + 1);
                }, 2000);
            }
        }, 50);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUserTypeChange = (userType: string) => {
        setFormData({
            ...formData,
            userType
        });
        setShowDropdown(false);
        // Reset and restart messages for the new user type
        setShowChatBubble(false);
        setTimeout(() => {
            setShowChatBubble(true);
            typeMessage(0);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { userType, ...loginData } = formData;

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful. Redirecting...');
                // Store the token if available
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userid', data.userId);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                setTimeout(() => {
                    // Redirect based on user role if available
                    if (data.user && data.user.role) {
                        if (data.user.role === 'PARENT') {
                            router.push('/parent-tools');
                        } else if (data.user.role === 'KID') {
                            router.push('/');
                        } else {
                            router.push('/dashboard');
                        }
                    } else {
                        // Fallback to the selected user type
                        if (formData.userType === 'PARENT') {
                            router.push('/parent-tools');
                        } else {
                            router.push('/');
                        }
                    }
                }, 2000);
                setIsError(false);
                setFormData({
                    username: '',
                    password: '',
                    userType: formData.userType
                });
            } else {
                setMessage(data.message || 'Login failed. Please check your credentials.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedUserType = userTypes.find(type => type.value === formData.userType);

    return (
        <div className="min-h-screen flex flex-col justify-center p-4 bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url('/assets/hero-background.jpg')` }}>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/70 z-0"></div>

            <Head>
                <title>Login</title>
                <meta name="description" content="Login to your account" />
            </Head>

            {/* Sound toggle */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="bg-card/80 hover:bg-card rounded-full p-2 border border-gray-600"
                >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center">
                {/* Left side - Character and chat bubble */}
                <div className="w-full md:w-2/5 mb-8 md:mb-0 relative">
                    <div
                        className="transition-all duration-1000 ease-out translate-y-40 -translate-x-10"
                        style={{ transform: `translateX(${characterPosition})` }}
                    >
                        <img
                            src="/assets/ecohero-character-right-look.png"
                            alt="Friendly guide character"
                            className="w-full mx-auto"
                        />
                    </div>
                </div>


                {/* Right side - Login form */}
                <div className="w-full md:w-3/5">
                    <motion.div
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-6 text-white">
                            Login to Your Account
                        </h2>
                        <p className="text-center mb-8 text-gray-200">
                            Welcome back. Please enter your credentials.
                        </p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* User Type Selector */}
                            <div>
                                <label htmlFor="user-type" className="block text-sm font-medium text-gray-200 mb-2">
                                    I am a
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 mr-2" />
                                            <span>{selectedUserType?.label}</span>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                                            {userTypes.map((type) => (
                                                <div
                                                    key={type.value}
                                                    onClick={() => handleUserTypeChange(type.value)}
                                                    className={`px-4 py-3 cursor-pointer flex items-center ${formData.userType === type.value
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-200 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    {type.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                                    Username
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </span>
                                    ) : 'Login'}
                                </button>
                            </div>

                            <div className="text-center text-sm text-gray-300">
                                Don't have an account?{' '}
                                <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
                                    Register here
                                </Link>
                            </div>

                            {message && (
                                <motion.div
                                    className={`rounded-lg p-4 ${isError ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className={`text-center ${isError ? 'text-red-200' : 'text-green-200'}`}>
                                        {message}
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}