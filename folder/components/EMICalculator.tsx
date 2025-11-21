'use client';

import { useState, useEffect } from 'react';
import { calculateEMI } from '@/lib/chatbot';

interface EMICalculatorProps {
  propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    const downPaymentAmount = (propertyPrice * downPayment) / 100;
    const loan = propertyPrice - downPaymentAmount;
    setLoanAmount(loan);
    const calculatedEMI = calculateEMI(loan, interestRate, tenure);
    setEmi(calculatedEMI);
  }, [propertyPrice, downPayment, interestRate, tenure]);

  const totalAmount = emi * tenure * 12;
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-bold text-primary-600 mb-2">
          ₹{propertyPrice.toLocaleString('en-IN')}
        </h3>
        <p className="text-gray-600">Property Price</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment: {downPayment}%
          </label>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={downPayment}
            onChange={(e) => setDownPayment(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Down Payment Amount: ₹{((propertyPrice * downPayment) / 100).toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate: {interestRate}% per annum
          </label>
          <input
            type="range"
            min="6"
            max="12"
            step="0.25"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>6%</span>
            <span>12%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Tenure: {tenure} years
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            value={tenure}
            onChange={(e) => setTenure(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Loan Amount:</span>
          <span className="text-xl font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Monthly EMI:</span>
          <span className="text-2xl font-bold text-primary-600">₹{emi.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Interest:</span>
          <span className="text-gray-700">₹{totalInterest.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-gray-700">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is an approximate calculation. Actual EMI may vary based on 
          bank policies, credit score, and other factors. Please consult with your bank for 
          accurate loan details.
        </p>
      </div>
    </div>
  );
}

