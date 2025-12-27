import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
const ToastContext = createContext();
export const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const icons = {
        success: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    };
    return (
        <div className="relative flex items-center w-full max-w-sm p-4 mb-4 text-gray-100 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border-l-4 border-transparent overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-cyan-500/10 animate-slide-in-right group"
            style={{ borderLeftColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6' }}
        >
            {/* Glossy sheen effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
            {/* Icon Container */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                    type === 'error' ? 'bg-red-500/20 text-red-400' :
                        type === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                }`}>
                {icons[type] || icons.info}
            </div>
            {/* Content */}
            <div className="ml-4 flex-1">
                <p className="font-bold tracking-wide uppercase text-gray-400 text-xs mb-0.5">
                    {type}
                </p>
                <p className="text-sm font-medium leading-tight text-white">{message}</p>
            </div>
            {/* Close Button */}
            <button
                type="button"
                className="ml-4 -mx-1.5 -my-1.5 text-gray-400 hover:text-white rounded-lg focus:ring-2 focus:ring-gray-600 p-1.5 inline-flex h-8 w-8 transition-colors"
                onClick={onClose}
            >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-50 animate-progress"
                style={{ color: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6' }}
            />
        </div>
    );
};
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-3">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};