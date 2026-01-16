// src/App.jsx
import React, { useState } from 'react';
import BillForm from './components/BillForm';
import BillDisplay from './components/BillDisplay';
import { calculateBill } from './utils/billCalculator';
import './index.css';

const App = () => {
    const [billData, setBillData] = useState(null);
    const [formData, setFormData] = useState(null);

    const handleCalculate = (data) => {
        console.log("App: Calculating bill for:", data);
        setFormData(data);
        
        const calculatedBill = calculateBill(
            data.previousReading,
            data.presentReading,
            data.meterHP,
            data.subsidyUnits || 0
        );
        
        console.log("App: Calculated bill:", calculatedBill);
        setBillData(calculatedBill);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        ಕರೆಂಟ್ ಬಿಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್
                    </h1>
                    <p className="text-gray-600 mt-2">
                        ಗೃಹ ಜೋತಿ ಸಬ್ಸಿಡಿಯೊಂದಿಗೆ ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಲೆಕ್ಕ ಹಾಕಿ
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Form */}
                    <div>
                        <BillForm onCalculate={handleCalculate} />
                        <div className="mt-6 p-4 bg-white rounded-lg shadow">
                            <h3 className="font-bold mb-2">ಸೂಚನೆಗಳು:</h3>
                            <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li>ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ನಿಖರವಾಗಿ ನಮೂದಿಸಿ</li>
                                <li>ಸಬ್ಸಿಡಿ ಅಗತ್ಯವಿದ್ದರೆ ಬಾಕ್ಸ್ ಗುರುತಿಸಿ</li>
                                <li>ಸಬ್ಸಿಡಿ ಘಟಕಗಳನ್ನು ನಮೂದಿಸಿ</li>
                                <li>ಡೇಟಾ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಲ್ಪಡುತ್ತದೆ</li>
                            </ol>
                        </div>
                    </div>

                    {/* Right Column: Bill Display */}
                    <div>
                        {billData && formData ? (
                            <BillDisplay billData={billData} formData={formData} />
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <div className="text-5xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold mb-2">ಬಿಲ್ ಪೂರ್ವವೀಕ್ಷಣೆ</h3>
                                <p className="text-gray-500">
                                    ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು "ಬಿಲ್ ಲೆಕ್ಕ ಹಾಕಿ" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ
                                </p>
                                <p className="text-sm text-gray-400 mt-4">
                                    ಸಬ್ಸಿಡಿ ಘಟಕಗಳು ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ನಲ್ಲಿ ಉಳಿಸಲ್ಪಡುತ್ತವೆ
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-4 bg-white rounded-lg shadow text-center text-sm text-gray-600">
                    <p>ಗೃಹ ಜೋತಿ ಸಬ್ಸಿಡಿ: ಸಬ್ಸಿಡಿ ಘಟಕಗಳಿಗೆ ಮಾತ್ರ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ</p>
                    <p className="mt-1">ಲೆಕ್ಕಾಚಾರ: ಪೂರ್ಣ ಬಿಲ್ - ಸಬ್ಸಿಡಿ = ಅಂತಿಮ ಮೊತ್ತ</p>
                </div>
            </div>
        </div>
    );
};

export default App;