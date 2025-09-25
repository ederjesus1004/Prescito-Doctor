import React from 'react';

const PaymentModal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 py-6 sm:p-6">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-md mx-auto">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                    >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    <div className="text-center">
                        <p className="mb-4 text-sm sm:text-base">Se ha abierto una nueva ventana para procesar tu pago.</p>
                        <p className="text-xs sm:text-sm text-gray-500">Si la ventana no se abrió automáticamente, haz clic en el botón de abajo.</p>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal; 