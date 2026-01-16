// src/components/BillDisplay.jsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BillDisplay = ({ billData, formData }) => {
    if (!billData) return null;

    const billRef = useRef();
    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const hasSubsidy = billData.hasSubsidy && billData.subsidyUnits > 0;

    // Function to download bill as PDF
    const downloadBillAsPDF = async () => {
        try {
            const element = billRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            
            // Generate filename with RR number and date
            const date = new Date().toISOString().split('T')[0];
            const fileName = `Electricity_Bill_${formData.rrNumber || 'Bill'}_${date}.pdf`;
            
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('ಬಿಲ್ ಡೌನ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ! ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
        }
    };

    // Function to download bill as PNG image
    const downloadBillAsImage = async () => {
        try {
            const element = billRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            
            const date = new Date().toISOString().split('T')[0];
            link.download = `Electricity_Bill_${formData.rrNumber || 'Bill'}_${date}.png`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('ಬಿಲ್ ಡೌನ್ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ! ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
        }
    };

    return (
        <div>
            {/* Bill content - wrapped in ref for capturing */}
            <div ref={billRef} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-3">
                    ವಿದ್ಯುತ್ ಬಿಲ್
                </h2>
                
                {/* Customer Info */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-bold text-gray-700">RR ಸಂಖ್ಯೆ:</p>
                            <p className="text-lg">{formData.rrNumber}</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-700">ಮೀಟರ್ HP:</p>
                            <p className="text-lg">{formData.meterHP} HP</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-700">ಸಬ್ಸಿಡಿ:</p>
                            <p className={`text-lg ${hasSubsidy ? 'text-green-600 font-bold' : 'text-red-600'}`}>
                                {hasSubsidy ? 'ಹೌದು ✅' : 'ಇಲ್ಲ ❌'}
                            </p>
                        </div>
                        {hasSubsidy && (
                            <div>
                                <p className="font-bold text-gray-700">ಸಬ್ಸಿಡಿ ಘಟಕಗಳು:</p>
                                <p className="text-lg font-bold text-green-700">{billData.subsidyUnits}</p>
                            </div>
                        )}
                    </div>
                    {/* Date and time stamp for the bill */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                            ಬಿಲ್ ದಿನಾಂಕ: {new Date().toLocaleDateString('kn-IN')}
                        </p>
                        <p className="text-sm text-gray-600">
                            ಸಮಯ: {new Date().toLocaleTimeString('kn-IN')}
                        </p>
                    </div>
                </div>

                {/* Units Info */}
                <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gray-100 rounded">
                            <p className="font-semibold">ಹಿಂದಿನ ಓದುವಿಕೆ</p>
                            <p className="text-xl">{formData.previousReading}</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded">
                            <p className="font-semibold">ಪ್ರಸ್ತುತ ಓದುವಿಕೆ</p>
                            <p className="text-xl">{formData.presentReading}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded">
                            <p className="font-semibold">ಒಟ್ಟು ಘಟಕಗಳು</p>
                            <p className="text-2xl font-bold">{billData.totalUnits}</p>
                        </div>
                    </div>
                </div>

                {/* ====== SECTION 1: FULL BILL CALCULATION ====== */}
                <div className="mb-8 border-2 border-blue-400 rounded-lg">
                    <div className="bg-blue-100 p-4">
                        <h3 className="font-bold text-xl text-blue-800">
                            ೧. ಪೂರ್ಣ ಬಿಲ್ ಲೆಕ್ಕಾಚಾರ (ಎಲ್ಲಾ {billData.totalUnits} ಘಟಕಗಳಿಗೆ)
                        </h3>
                        <p className="text-blue-600">Full Bill Calculation (For All {billData.totalUnits} Units)</p>
                    </div>
                    <div className="p-4">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">ಸ್ಥಿರ ಶುಲ್ಕಗಳು</p>
                                    <p className="text-sm text-gray-600">{formData.meterHP} HP × ₹{billData.rates.fixedRate}</p>
                                </div>
                                <p className="font-bold">{formatCurrency(billData.fixedCharges)}</p>
                            </div>
                            
                            <div className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">ಇಂಧನ ಶುಲ್ಕಗಳು</p>
                                    <p className="text-sm text-gray-600">{billData.totalUnits} units × ₹{billData.rates.energyRate}</p>
                                </div>
                                <p className="font-bold">{formatCurrency(billData.energyCharges)}</p>
                            </div>
                            
                            <div className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">FPPCA ಶುಲ್ಕಗಳು</p>
                                    <p className="text-sm text-gray-600">{billData.totalUnits} units × ₹{billData.rates.fppcaRate}</p>
                                </div>
                                <p className="font-bold">{formatCurrency(billData.fppcaCharges)}</p>
                            </div>
                            
                            <div className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">ತೆರಿಗೆ @ {billData.rates.taxRate}%</p>
                                    <p className="text-sm text-gray-600">{billData.energyCharges.toFixed(2)} × {billData.rates.taxRate}%</p>
                                </div>
                                <p className="font-bold">{formatCurrency(billData.taxOnEnergy)}</p>
                            </div>
                            
                            <div className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="font-medium">ಪಿ & ಜಿ ಸರ್ಚಾರ್ಜ್</p>
                                    <p className="text-sm text-gray-600">{billData.totalUnits} units × ₹{billData.rates.pgSurchargeRate}</p>
                                </div>
                                <p className="font-bold">{formatCurrency(billData.pgSurcharge)}</p>
                            </div>
                            
                            <div className="flex justify-between pt-4 bg-blue-50 p-3 rounded">
                                <div>
                                    <p className="font-bold text-lg">ಪೂರ್ಣ ಬಿಲ್ ಮೊತ್ತ</p>
                                    <p className="text-gray-600">Full Bill Amount</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-700">
                                    {formatCurrency(billData.fullBillAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====== SECTION 2: SUBSIDY CALCULATION ====== */}
                {hasSubsidy && billData.subsidyDetails && (
                    <div className="mb-8 border-2 border-green-400 rounded-lg">
                        <div className="bg-green-100 p-4">
                            <h3 className="font-bold text-xl text-green-800">
                                ೨. ಗೃಹ ಜೋತಿ ಸಬ್ಸಿಡಿ ಲೆಕ್ಕಾಚಾರ
                            </h3>
                            <p className="text-green-600">
                                Gruhajoti Subsidy Calculation (User Entered: {billData.subsidyUnits} units)
                            </p>
                            
                            {/* Show warning if subsidy units exceed consumption */}
                            {billData.subsidyUnits > billData.totalUnits && (
                                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                                    <p className="text-yellow-800 font-semibold">
                                        ⚠️ ಗಮನಿಸಿ: ಸಬ್ಸಿಡಿ ಘಟಕಗಳು ({billData.subsidyUnits}) ಉಪಭೋಗಕ್ಕಿಂತ ({billData.totalUnits}) ಹೆಚ್ಚಿವೆ
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                        ಎಲ್ಲಾ ಸಬ್ಸಿಡಿ ಅನ್ವಯಿಸಲಾಗುವುದು, ಋಣಾತ್ಮಕ ಮೊತ್ತವಿದ್ದರೆ ₹0.00 ತೋರಿಸಲಾಗುವುದು
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="mb-4 p-3 bg-green-50 rounded text-center">
                                <p className="font-bold">ಬಳಕೆದಾರ ನಮೂದಿಸಿದ ಸಬ್ಸಿಡಿ ಘಟಕಗಳು: {billData.subsidyUnits}</p>
                                <p className="text-sm text-gray-600">User Entered Subsidy Units</p>
                                
                                {/* Show remaining units (can be negative) */}
                                <div className="mt-2">
                                    <p className="font-semibold">
                                        ಶೇಷ ಘಟಕಗಳು: 
                                        <span className={billData.subsidyDetails.remainingUnits < 0 ? 'text-red-600 ml-1' : 'text-green-600 ml-1'}>
                                            {billData.subsidyDetails.remainingUnits}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {billData.subsidyDetails.remainingUnits < 0 
                                            ? '(ಋಣಾತ್ಮಕ - ಸಬ್ಸಿಡಿ ಉಪಭೋಗಕ್ಕಿಂತ ಹೆಚ್ಚು)' 
                                            : '(ಧನಾತ್ಮಕ)'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">ಸ್ಥಿರ ಶುಲ್ಕಗಳು</p>
                                        <p className="text-sm text-gray-600">{formData.meterHP} HP × ₹{billData.rates.fixedRate}</p>
                                    </div>
                                    <p>{formatCurrency(billData.subsidyDetails.subsidyFixedCharges)}</p>
                                </div>
                                
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">ಇಂಧನ ಶುಲ್ಕಗಳು</p>
                                        <p className="text-sm text-gray-600">{billData.subsidyUnits} units × ₹{billData.rates.subsidyEnergyRate}</p>
                                    </div>
                                    <p>{formatCurrency(billData.subsidyDetails.subsidyEnergyCharges)}</p>
                                </div>
                                
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">FPPCA ಶುಲ್ಕಗಳು</p>
                                        <p className="text-sm text-gray-600">{billData.subsidyUnits} units × ₹{billData.rates.subsidyFppcaRate}</p>
                                    </div>
                                    <p>{formatCurrency(billData.subsidyDetails.subsidyFppca)}</p>
                                </div>
                                
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">ತೆರಿಗೆ @ {billData.rates.taxRate}%</p>
                                        <p className="text-sm text-gray-600">{billData.subsidyDetails.subsidyEnergyCharges.toFixed(2)} × {billData.rates.taxRate}%</p>
                                    </div>
                                    <p>{formatCurrency(billData.subsidyDetails.subsidyTaxOnEnergy)}</p>
                                </div>
                                
                                <div className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">ಪಿ & ಜಿ ಸರ್ಚಾರ್ಜ್</p>
                                        <p className="text-sm text-gray-600">{billData.subsidyUnits} units × ₹{billData.rates.pgSurchargeRate}</p>
                                    </div>
                                    <p>{formatCurrency(billData.subsidyDetails.subsidyPgSurcharge)}</p>
                                </div>
                                
                                <div className="flex justify-between pt-4 bg-green-50 p-3 rounded">
                                    <div>
                                        <p className="font-bold text-lg">ಒಟ್ಟು ಸಬ್ಸಿಡಿ ಮೊತ್ತ</p>
                                        <p className="text-gray-600">Total Subsidy Amount</p>
                                    </div>
                                    <p className="text-xl font-bold text-green-600">
                                        - {formatCurrency(billData.subsidyDetails.subsidyTotal)}
                                    </p>
                                </div>
                                
                                {/* Show actual subsidy used if it's less than calculated */}
                                {billData.subsidyDetails.actualSubsidyUsed && billData.subsidyDetails.actualSubsidyUsed < billData.subsidyDetails.subsidyTotal && (
                                    <div className="p-3 bg-blue-50 rounded border border-blue-300">
                                        <p className="font-semibold text-blue-800">
                                            💡 ನಿಜವಾದ ಸಬ್ಸಿಡಿ ಅನ್ವಯ: {formatCurrency(billData.subsidyDetails.actualSubsidyUsed)}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            (ಪೂರ್ಣ ಬಿಲ್ ₹{billData.fullBillAmount.toFixed(2)} ಕ್ಕಿಂತ ಹೆಚ್ಚು ಸಬ್ಸಿಡಿ ಅನ್ವಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== SECTION 3: FINAL AMOUNT ====== */}
                <div className="border-4 border-purple-500 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="bg-purple-600 p-5 text-center">
                        <h3 className="font-bold text-2xl text-white">೩. ಅಂತಿಮ ಲೆಕ್ಕಾಚಾರ</h3>
                        <p className="text-purple-200">Final Calculation</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6 text-center">
                            <div>
                                <p className="text-gray-600 mb-1">ಪೂರ್ಣ ಬಿಲ್ ಮೊತ್ತ</p>
                                <p className="text-xl">{formatCurrency(billData.fullBillAmount)}</p>
                            </div>
                            
                            {hasSubsidy && (
                                <div>
                                    <p className="text-gray-600 mb-1">ಗೃಹ ಜೋತಿ ಸಬ್ಸಿಡಿ ಕಡಿತ</p>
                                    <p className="text-xl text-red-600">- {formatCurrency(billData.subsidyAmount)}</p>
                                </div>
                            )}
                            
                            <div className="border-t border-purple-300 pt-6">
                                <p className="text-gray-600 mb-2">ಪಾವತಿಸಬೇಕಾದ ಒಟ್ಟು ಮೊತ್ತ</p>
                                <p className="text-4xl font-bold text-purple-700">
                                    {formatCurrency(billData.finalAmount)}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    {billData.finalAmount === 0 ? 
                                        "🎉 ಸಂಪೂರ್ಣ ರಿಯಾಯಿತಿ ಪಡೆಯಲಾಗಿದೆ (ಬಿಲ್ ₹0.00)" : 
                                        "Total Amount Payable"}
                                </p>
                                
                                {/* Show if subsidy exceeded bill amount */}
                                {hasSubsidy && billData.finalAmount === 0 && billData.fullBillAmount > 0 && (
                                    <div className="mt-2 p-2 bg-green-100 rounded">
                                        <p className="text-green-800 text-sm">
                                            ✅ ಸಬ್ಸಿಡಿ (₹{billData.subsidyAmount.toFixed(2)}) ಪೂರ್ಣ ಬಿಲ್ (₹{billData.fullBillAmount.toFixed(2)}) ಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Calculation Formula */}
                        <div className="mt-6 p-4 bg-white rounded-lg border">
                            <p className="font-bold text-gray-700 mb-2">ಲೆಕ್ಕಾಚಾರ ಸೂತ್ರ:</p>
                            <p className="text-gray-600">
                                {hasSubsidy ? 
                                    `ಪೂರ್ಣ ಬಿಲ್ (₹${billData.fullBillAmount.toFixed(2)}) - ಸಬ್ಸಿಡಿ (₹${billData.subsidyAmount.toFixed(2)}) = ₹${billData.finalAmount.toFixed(2)}` : 
                                    `ಪೂರ್ಣ ಬಿಲ್ = ₹${billData.finalAmount.toFixed(2)}`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-8 p-6 bg-gray-100 rounded-xl">
                    <h4 className="font-bold text-xl mb-4 text-gray-800">ಸಾರಾಂಶ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <p className="font-bold text-gray-700">ಒಟ್ಟು ಘಟಕಗಳು</p>
                            <p className="text-2xl">{billData.totalUnits}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow text-center">
                            <p className="font-bold text-gray-700">ಪೂರ್ಣ ಬಿಲ್</p>
                            <p className="text-2xl">{formatCurrency(billData.fullBillAmount)}</p>
                        </div>
                        
                        <div className={`p-4 rounded-lg shadow text-center ${hasSubsidy ? 'bg-green-100 border border-green-300' : 'bg-white'}`}>
                            <p className="font-bold text-gray-700">ಅಂತಿಮ ಮೊತ್ತ</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(billData.finalAmount)}
                                {billData.finalAmount === 0 && hasSubsidy && 
                                    <span className="block text-sm text-green-600 mt-1">ಸಂಪೂರ್ಣ ರಿಯಾಯಿತಿ ✓</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Buttons Section - OUTSIDE the bill content div */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-xl mb-4 text-blue-800 text-center">
                    ಬಿಲ್ ಡೌನ್ಲೋಡ್ ಮಾಡಿ
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    ನಿಮ್ಮ ವಿದ್ಯುತ್ ಬಿಲ್ ಅನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಉಳಿಸಿಕೊಳ್ಳಿ
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={downloadBillAsPDF}
                        className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-bold">PDF ಬಿಲ್ ಡೌನ್ಲೋಡ್ ಮಾಡಿ</span>
                    </button>
                    
                    <button
                        onClick={downloadBillAsImage}
                        className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-bold">ಇಮೇಜ್ ಬಿಲ್ ಡೌನ್ಲೋಡ್ ಮಾಡಿ</span>
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        📄 ಫೈಲ್ ಹೆಸರು: <span className="font-semibold">Electricity_Bill_{formData.rrNumber || 'Bill'}_{new Date().toISOString().split('T')[0]}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        PDF ಅಥವಾ ಚಿತ್ರವಾಗಿ ಡೌನ್ಲೋಡ್ ಮಾಡಿ (ಮೊಬೈಲ್/ಲ್ಯಾಪ್ಟಾಪ್)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BillDisplay;