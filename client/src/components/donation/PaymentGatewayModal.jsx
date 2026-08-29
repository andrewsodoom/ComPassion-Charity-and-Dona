import React, { useState } from 'react';
import donationService from '../../services/donationService.js';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  X,
  Smartphone
} from 'lucide-react';

export const PaymentGatewayModal = ({ isOpen, onClose, donationData, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'upi' | 'netbanking' | 'paypal'
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // 'input' | 'processing' | 'approved'

  // Card State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardName, setCardName] = useState(donationData?.donorName || 'Sarah Connor');

  // UPI State
  const [upiId, setUpiId] = useState('donor@upi');

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen || !donationData) return null;

  const handlePay = async (paymentMethodName) => {
    setLoading(true);
    setStep('processing');

    try {
      // Simulate network authorization delay
      await new Promise(resolve => setTimeout(resolve, 1600));

      const payload = {
        campaignId: donationData.campaignId,
        amount: donationData.amount,
        tipAmount: donationData.tipAmount,
        currency: donationData.currency || 'INR',
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail,
        donorPhone: donationData.donorPhone,
        paymentMethod: paymentMethodName,
        isRecurring: donationData.isRecurring,
        frequency: donationData.frequency,
        isAnonymous: donationData.isAnonymous,
        dedication: donationData.dedication,
        donorMessage: donationData.donorMessage
      };

      const res = await donationService.processDonation(payload);

      if (res.success) {
        setStep('approved');
        setTimeout(() => {
          onSuccess(res.donation, res.campaign);
        }, 1000);
      }
    } catch (err) {
      alert('Payment simulation failed: ' + err.message);
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Lock size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Secure Checkout
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                  TEST / LIVE SANDBOX
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Amount to pay: <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{donationData.displayCurrency} {donationData.displayTotal?.toLocaleString()}</span>
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Processing State Overlay */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-4 my-auto">
            <Loader2 size={48} className="animate-spin text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Contacting Secure Bank Gateway...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorizing {donationData.displayCurrency} {donationData.displayTotal?.toLocaleString()} with 256-bit encryption. Do not refresh.
              </p>
            </div>
          </div>
        )}

        {/* Approved Animation */}
        {step === 'approved' && (
          <div className="p-12 text-center space-y-4 my-auto animate-in zoom-in">
            <CheckCircle2 size={56} className="text-emerald-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                Payment Authorized!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generating your official tax-exempt donation receipt...
              </p>
            </div>
          </div>
        )}

        {/* Main Payment Options */}
        {step === 'input' && (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Method Tabs */}
            <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-950/60 p-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex md:flex-col gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <CreditCard size={16} />
                <span>Card (Stripe)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <QrCode size={16} />
                <span>UPI / QR (Razorpay)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Building size={16} />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paypal')}
                className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  activeTab === 'paypal'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-md border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span className="font-extrabold text-blue-600">P</span>
                <span>PayPal Express</span>
              </button>
            </div>

            {/* Right Panel Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              {/* TAB 1: CARD (STRIPE) */}
              {activeTab === 'card' && (
                <div className="space-y-4">
                  {/* Interactive 3D Card Visual */}
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl space-y-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono tracking-widest text-slate-400">CREDIT / DEBIT</span>
                      <CreditCard size={22} className="text-blue-400" />
                    </div>
                    <div className="font-mono text-base tracking-widest text-center py-1">
                      {cardNumber}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Cardholder</div>
                        <div className="font-bold truncate max-w-[130px]">{cardName || 'SARAH CONNOR'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Expires</div>
                        <div className="font-bold">{cardExpiry}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePay('Stripe Card (Simulated)')}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Pay {donationData.displayCurrency} {donationData.displayTotal?.toLocaleString()} via Stripe</span>
                  </button>
                </div>
              )}

              {/* TAB 2: UPI / RAZORPAY */}
              {activeTab === 'upi' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 inline-block shadow-inner">
                    <QRCodeSVG
                      value={`upi://pay?pa=charity@upi&pn=ComPassion&am=${donationData.amount}&cu=INR`}
                      size={140}
                    />
                  </div>
                  <div className="text-xs text-slate-500">
                    Scan with GPay, PhonePe, Paytm, BHIM, or any UPI App
                  </div>

                  <div className="relative text-left">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Or enter UPI Virtual Payment Address (VPA)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handlePay('Razorpay UPI (Simulated)')}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Authorize Razorpay Payment ({donationData.displayCurrency} {donationData.displayTotal?.toLocaleString()})</span>
                  </button>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Your Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Chase Bank', 'Bank of America'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                          selectedBank === b
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-400 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePay(`NetBanking - ${selectedBank} (Simulated)`)}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed with {selectedBank}</span>
                  </button>
                </div>
              )}

              {/* TAB 4: PAYPAL */}
              {activeTab === 'paypal' && (
                <div className="space-y-4 text-center py-4">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                    You will be redirected to PayPal sandbox to complete this contribution safely.
                  </div>

                  <button
                    onClick={() => handlePay('PayPal Express (Simulated)')}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#ffc439] hover:bg-[#f4b82d] text-slate-900 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Check out with PayPal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGatewayModal;
