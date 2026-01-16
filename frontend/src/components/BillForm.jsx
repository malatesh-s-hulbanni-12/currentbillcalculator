// src/components/BillForm.jsx
import React, { useState } from 'react';

const BillForm = ({ onCalculate }) => {
    const [formData, setFormData] = useState({
        rrNumber: '',
        previousReading: '',
        presentReading: '',
        meterHP: 1,
        applySubsidy: false,
        subsidyUnits: ''
    });

    // Load saved data from localStorage on component mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('currentBillFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(parsedData);
            console.log("Loaded from localStorage:", parsedData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        
        setFormData(newFormData);
        
        // Save to localStorage on every change
        localStorage.setItem('currentBillFormData', JSON.stringify(newFormData));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate readings
        const prev = parseFloat(formData.previousReading);
        const pres = parseFloat(formData.presentReading);
        
        if (pres <= prev) {
            alert('ಪ್ರಸ್ತುತ ಓದುವಿಕೆ ಹಿಂದಿನ ಓದುವಿಕೆಗಿಂತ ಹೆಚ್ಚಿರಬೇಕು!');
            return;
        }
        
        // Validate subsidy units if applied
        let subsidyUnits = 0;
        if (formData.applySubsidy) {
            subsidyUnits = parseFloat(formData.subsidyUnits) || 0;
        }
        
        // Prepare data
        const calculationData = {
            rrNumber: formData.rrNumber,
            previousReading: prev,
            presentReading: pres,
            meterHP: parseInt(formData.meterHP),
            subsidyUnits: subsidyUnits
        };
        
        console.log("Sending for calculation:", calculationData);
        
        // Pass data to parent component
        onCalculate(calculationData);
        
        // CLEAR THE FORM AFTER SUBMISSION
        const resetFormData = {
            rrNumber: '',
            previousReading: '',
            presentReading: '',
            meterHP: 1,
            applySubsidy: false,
            subsidyUnits: ''
        };
        
        setFormData(resetFormData);
        
        // Also clear from localStorage after calculation
        localStorage.removeItem('currentBillFormData');
    };

    const handleClearStorage = () => {
        localStorage.removeItem('currentBillFormData');
        setFormData({
            rrNumber: '',
            previousReading: '',
            presentReading: '',
            meterHP: 1,
            applySubsidy: false,
            subsidyUnits: ''
        });
        alert('ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ ಸ್ಪಷ್ಟವಾಗಿದೆ!');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">ಬಿಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್</h2>
            
            <form onSubmit={handleSubmit}>
                {/* RR Number */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">RR ಸಂಖ್ಯೆ</label>
                    <input
                        type="text"
                        name="rrNumber"
                        value={formData.rrNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="RR ಸಂಖ್ಯೆ ನಮೂದಿಸಿ"
                        required
                    />
                </div>

                {/* Previous Reading */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">ಹಿಂದಿನ ಓದುವಿಕೆ</label>
                    <input
                        type="number"
                        name="previousReading"
                        value={formData.previousReading}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="ಹಿಂದಿನ ಓದುವಿಕೆ"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {/* Present Reading */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">ಪ್ರಸ್ತುತ ಓದುವಿಕೆ</label>
                    <input
                        type="number"
                        name="presentReading"
                        value={formData.presentReading}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="ಪ್ರಸ್ತುತ ಓದುವಿಕೆ"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {/* Meter HP */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">ಮೀಟರ್ HP</label>
                    <select
                        name="meterHP"
                        value={formData.meterHP}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="1">1 HP</option>
                        <option value="2">2 HP</option>
                        <option value="3">3 HP</option>
                        <option value="5">5 HP</option>
                        <option value="7.5">7.5 HP</option>
                        <option value="10">10 HP</option>
                    </select>
                </div>

                {/* Subsidy Section */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <label className="flex items-center mb-3">
                        <input
                            type="checkbox"
                            name="applySubsidy"
                            checked={formData.applySubsidy}
                            onChange={handleChange}
                            className="mr-3 h-5 w-5"
                        />
                        <span className="font-semibold text-gray-700">
                            ಗೃಹ ಜೋತಿ ಸಬ್ಸಿಡಿ ಅನ್ವಯಿಸಿ
                        </span>
                    </label>
                    
                    {formData.applySubsidy && (
                        <div className="mt-3">
                            <label className="block text-gray-700 mb-2">
                                ಸಬ್ಸಿಡಿ ಘಟಕಗಳು
                            </label>
                            <input
                                type="number"
                                name="subsidyUnits"
                                value={formData.subsidyUnits}
                                onChange={handleChange}
                                className="w-full p-2 border border-yellow-300 rounded"
                                placeholder="ಸಬ್ಸಿಡಿ ಘಟಕಗಳನ್ನು ನಮೂದಿಸಿ"
                                min="0"
                                required={formData.applySubsidy}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                * ಈ ಘಟಕಗಳಿಗೆ ಸಬ್ಸಿಡಿ ಲೆಕ್ಕ ಹಾಕಲಾಗುವುದು
                            </p>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-bold mb-3"
                >
                    ಬಿಲ್ ಲೆಕ್ಕ ಹಾಕಿ
                </button>
            </form>
            
            {/* Clear Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={handleClearStorage}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                    ಡೇಟಾ ಅಳಿಸಿ
                </button>
                
                <button
                    type="button"
                    onClick={() => {
                        // Just reset form without clearing localStorage
                        setFormData({
                            rrNumber: '',
                            previousReading: '',
                            presentReading: '',
                            meterHP: 1,
                            applySubsidy: false,
                            subsidyUnits: ''
                        });
                        alert('ಫಾರ್ಮ್ ಸ್ಪಷ್ಟವಾಗಿದೆ! (ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ ಉಳಿಸಲಾಗಿದೆ)');
                    }}
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                >
                    ಫಾರ್ಮ್ ಸ್ಪಷ್ಟಗೊಳಿಸಿ
                </button>
            </div>
            
            {/* Storage Status */}
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
                <p className="font-semibold">ಲೋಕಲ್ ಸ್ಟೋರೇಜ್ ಸ್ಥಿತಿ:</p>
                <p className="text-green-600">✓ ಡೇಟಾ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ</p>
                <p className="text-gray-600 text-xs">"ಬಿಲ್ ಲೆಕ್ಕ ಹಾಕಿ" ಕ್ಲಿಕ್ ಮಾಡಿದ ನಂತರ ಫಾರ್ಮ್ ಸ್ಪಷ್ಟವಾಗುತ್ತದೆ</p>
            </div>
        </div>
    );
};

export default BillForm;