// src/utils/billCalculator.js

export const calculateBill = (prevReading, presentReading, meterHP, subsidyUnits) => {
    // Calculate total units consumed
    const totalUnits = presentReading - prevReading;
    
    // ====== 1. FULL BILL CALCULATION (ALL UNITS) ======
    const fixedRate = 145;
    const energyRate = 5.80;
    const fppcaRate = -0.50;
    const pgSurchargeRate = 0.36;
    const taxRate = 9;
    
    // Calculate full bill for ALL units
    const fixedCharges = meterHP * fixedRate;
    const energyCharges = totalUnits * energyRate;
    const fppcaCharges = totalUnits * fppcaRate;
    const pgSurcharge = totalUnits * pgSurchargeRate;
    const taxOnEnergy = (energyCharges / 100) * taxRate;
    const totalTax = taxOnEnergy + pgSurcharge;
    
    // Full bill total
    const fullBillAmount = fixedCharges + energyCharges + fppcaCharges + totalTax;
    
    // ====== 2. SUBSIDY CALCULATION (USER ENTERED SUBSIDY UNITS) ======
    let subsidyDetails = null;
    let finalAmount = fullBillAmount;
    
    // ALWAYS calculate subsidy if user entered any subsidy units (even 0 or negative)
    const userSubsidyUnits = subsidyUnits || 0;
    
    if (userSubsidyUnits > 0) {
        // Different rates for subsidy calculation
        const subsidyEnergyRate = 5.80;
        const subsidyFppcaRate = -0.50;
        
        // Calculate subsidy for user entered units (CAN BE MORE THAN CONSUMPTION)
        const subsidyFixedCharges = meterHP * fixedRate; // Same fixed rate
        const subsidyEnergyCharges = userSubsidyUnits * subsidyEnergyRate;
        const subsidyFppca = userSubsidyUnits * subsidyFppcaRate;
        const subsidyPgSurcharge = userSubsidyUnits * pgSurchargeRate;
        const subsidyTaxOnEnergy = (subsidyEnergyCharges / 100) * taxRate;
        const subsidyTotalTax = subsidyTaxOnEnergy + subsidyPgSurcharge;
        
        // Total subsidy amount (to be deducted)
        const subsidyTotal = subsidyFixedCharges + subsidyEnergyCharges + 
                           subsidyFppca + subsidyTotalTax;
        
        // Final amount = Full bill - Subsidy
        finalAmount = fullBillAmount - subsidyTotal;
        
        // If final amount is negative, set to 0
        if (finalAmount < 0) finalAmount = 0;
        
        // Calculate how much subsidy was actually used
        const actualSubsidyUsed = Math.min(subsidyTotal, fullBillAmount);
        
        subsidyDetails = {
            userEnteredUnits: userSubsidyUnits, // What user entered
            eligibleUnits: userSubsidyUnits, // Same as user entered (no restriction)
            remainingUnits: totalUnits - userSubsidyUnits, // Can be negative
            subsidyFixedCharges,
            subsidyEnergyCharges,
            subsidyFppca,
            subsidyPgSurcharge,
            subsidyTaxOnEnergy,
            subsidyTotalTax,
            subsidyTotal,
            actualSubsidyUsed,
            // Rates used for subsidy
            energyRate: subsidyEnergyRate,
            fppcaRate: subsidyFppcaRate
        };
    }
    
    return {
        // Basic info
        totalUnits,
        meterHP,
        hasSubsidy: userSubsidyUnits > 0, // True if user entered any subsidy units
        subsidyUnits: userSubsidyUnits, // What user actually entered
        
        // Full bill details
        fixedCharges,
        energyCharges,
        fppcaCharges,
        pgSurcharge,
        taxOnEnergy,
        totalTax,
        fullBillAmount,
        
        // Subsidy details
        subsidyDetails,
        subsidyAmount: subsidyDetails ? subsidyDetails.subsidyTotal : 0,
        finalAmount,
        
        // Rates for display
        rates: {
            fixedRate,
            energyRate,
            fppcaRate,
            pgSurchargeRate,
            taxRate,
            subsidyEnergyRate: 5.90,
            subsidyFppcaRate: 0.09
        }
    };
};
