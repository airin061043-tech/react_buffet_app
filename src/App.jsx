import React, { useState, useEffect } from 'react';

/**
 * โลโก้ร้าน "แซ่บโอชา หมูกระทะ" แบบ SVG ในตัว
 */
const MookataLogo = () => (
  <div className="flex flex-col items-center justify-center my-3 select-none">
    <svg
      width="84"
      height="68"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="แซ่บโอชา หมูกระทะ โลโก้"
      className="drop-shadow-sm"
    >
      {/* เปลวไฟด้านหลังกระทะ */}
      <path
        d="M44 34C41 26 46 18 49 14C49 20 53 22 54 17C57 11 62 8 61 16C64 13 68 15 67 21C71 18 76 22 73 30C71 34 66 36 60 36C52 36 46 36 44 34Z"
        fill="#EA580C"
      />
      <path
        d="M49 34C48 28 52 23 54 20C54 24 57 25 58 21C60 18 63 20 62 25C65 23 68 26 66 31C64 34 61 35 58 35C53 35 50 35 49 34Z"
        fill="#FACC15"
      />

      {/* ตะเกียบ */}
      <line x1="28" y1="16" x2="55" y2="33" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="33" y1="11" x2="58" y2="31" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />

      {/* โดมกระทะหมูกระทะ */}
      <path
        d="M36 39C36 29 84 29 84 39H36Z"
        fill="#374151"
        stroke="#1F2937"
        strokeWidth="2"
      />
      {/* ร่องย่างบนกระทะ */}
      <line x1="48" y1="32" x2="46" y2="37" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="31" x2="60" y2="37" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="32" x2="74" y2="37" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />

      {/* ขอบกระทะและหูจับ */}
      <path
        d="M27 38C25 38 23 40 24 42L29 44H91L96 42C97 40 95 38 93 38H27Z"
        fill="#1F2937"
      />
      <path
        d="M32 44L38 53H82L88 44H32Z"
        fill="#4B5563"
      />

      {/* ป้ายชื่อร้าน */}
      <rect x="18" y="49" width="84" height="22" rx="6" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
      <text
        x="60"
        y="64"
        textAnchor="middle"
        fill="#C2410C"
        fontSize="14"
        fontWeight="700"
        style={{ fontFamily: "'Prompt', sans-serif" }}
      >
        แซ่บโอชา
      </text>
      <text
        x="60"
        y="83"
        textAnchor="middle"
        fill="#7C2D12"
        fontSize="10"
        fontWeight="600"
        style={{ fontFamily: "'Prompt', sans-serif" }}
      >
        หมูกระทะ
      </text>
    </svg>
  </div>
);

/**
 * แอปพลิเคชันคำนวณค่าอาหารบุฟเฟต์ (Buffet Calculator)
 */
export default function App() {
  // ราคาต่อหน่วย
  const ADULT_PRICE = 299;
  const CHILD_PRICE = 89;
  const REFILL_PRICE = 29;
  const WATER_PRICE = 10;
  const SODA_PRICE = 25;

  // โหลดฟอนต์ Prompt & Inter และ Tailwind CSS CDN อัตโนมัติสำหรับโปรเจกต์ Vite
  useEffect(() => {
    if (!document.getElementById('google-fonts-prompt-inter')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'google-fonts-prompt-inter';
      fontLink.rel = 'stylesheet';
      fontLink.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(fontLink);
    }

    if (!document.getElementById('tailwind-cdn-script') && !window.tailwind) {
      const twScript = document.createElement('script');
      twScript.id = 'tailwind-cdn-script';
      twScript.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(twScript);
    }
  }, []);

  // State สำหรับเก็บค่าจากฟอร์ม
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [drinkType, setDrinkType] = useState('refill'); // 'refill' | 'bottle'
  const [waterQty, setWaterQty] = useState('');
  const [sodaQty, setSodaQty] = useState('');
  const [discountRate, setDiscountRate] = useState('0'); // '0' | '0.10' | '0.15' | '0.20'

  // State สำหรับการตรวจสอบความถูกต้อง (Validation) และสรุปยอด
  const [errors, setErrors] = useState({});
  const [formAlert, setFormAlert] = useState('');
  const [summary, setSummary] = useState({
    adultCount: 0,
    childCount: 0,
    foodTotal: 0,
    discountAmount: 0,
    foodAfterDiscount: 0,
    drinkTotal: 0,
    grandTotal: 0,
    isCalculated: false,
  });

  // จัดรูปแบบตัวเลขทศนิยม 2 ตำแหน่ง
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // สลับประเภทเครื่องดื่ม (หากเลือกน้ำรีฟิล ให้ล้างค่าและปิดช่องน้ำเปล่า/น้ำอัดลม)
  const handleDrinkTypeChange = (type) => {
    setDrinkType(type);
    if (type === 'refill') {
      setWaterQty('');
      setSodaQty('');
      setErrors((prev) => {
        const next = { ...prev };
        delete next.waterQty;
        delete next.sodaQty;
        return next;
      });
    }
  };

  // ตรวจสอบความถูกต้องของข้อมูลและคำนวณราคา
  const handleCalculate = (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    let alertMessage = '';

    const trimmedAdults = adults.trim();
    const trimmedChildren = children.trim();

    // ตรวจสอบกรณีไม่กรอกทั้งผู้ใหญ่และเด็ก
    if (trimmedAdults === '' && trimmedChildren === '') {
      alertMessage = 'กรุณาป้อนจำนวนผู้ใหญ่ หรือจำนวนเด็ก (ตั้งแต่ 0 ขึ้นไป)';
      newErrors.adults = 'กรุณาระบุจำนวนผู้ใหญ่หรือเด็ก';
      newErrors.children = 'กรุณาระบุจำนวนผู้ใหญ่หรือเด็ก';
      setErrors(newErrors);
      setFormAlert(alertMessage);
      return;
    }

    const parsedAdults = trimmedAdults === '' ? 0 : Number(trimmedAdults);
    const parsedChildren = trimmedChildren === '' ? 0 : Number(trimmedChildren);

    // ตรวจสอบจำนวนผู้ใหญ่ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
    if (
      trimmedAdults !== '' &&
      (Number.isNaN(parsedAdults) || parsedAdults < 0 || !Number.isInteger(parsedAdults))
    ) {
      newErrors.adults = 'จำนวนผู้ใหญ่ต้องเป็นตัวเลขจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
    }

    // ตรวจสอบจำนวนเด็กต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป
    if (
      trimmedChildren !== '' &&
      (Number.isNaN(parsedChildren) || parsedChildren < 0 || !Number.isInteger(parsedChildren))
    ) {
      newErrors.children = 'จำนวนเด็กต้องเป็นตัวเลขจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
    }

    // ต้องมีผู้เข้าทานอย่างน้อย 1 คน (ผู้ใหญ่หรือเด็ก)
    if (!newErrors.adults && !newErrors.children && parsedAdults + parsedChildren === 0) {
      alertMessage = 'กรุณาระบุจำนวนผู้ใหญ่ หรือจำนวนเด็กอย่างน้อย 1 คนเพื่อคำนวณค่าอาหาร';
      newErrors.adults = 'จำนวนรวมต้องมากกว่า 0 คน';
      newErrors.children = 'จำนวนรวมต้องมากกว่า 0 คน';
    }

    // ตรวจสอบจำนวนเครื่องดื่มแบบขวด
    let parsedWater = 0;
    let parsedSoda = 0;

    if (drinkType === 'bottle') {
      const trimmedWater = waterQty.trim();
      const trimmedSoda = sodaQty.trim();

      parsedWater = trimmedWater === '' ? 0 : Number(trimmedWater);
      parsedSoda = trimmedSoda === '' ? 0 : Number(trimmedSoda);

      if (
        trimmedWater !== '' &&
        (Number.isNaN(parsedWater) || parsedWater < 0 || !Number.isInteger(parsedWater))
      ) {
        newErrors.waterQty = 'จำนวนน้ำเปล่าต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป';
      }

      if (
        trimmedSoda !== '' &&
        (Number.isNaN(parsedSoda) || parsedSoda < 0 || !Number.isInteger(parsedSoda))
      ) {
        newErrors.sodaQty = 'จำนวนน้ำอัดลมต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormAlert(alertMessage || 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบช่องที่แจ้งเตือนด้านล่าง');
      return;
    }

    setErrors({});
    setFormAlert('');

    // 1. คำนวณค่าอาหารรวม
    const adultFoodCost = parsedAdults * ADULT_PRICE;
    const childFoodCost = parsedChildren * CHILD_PRICE;
    const totalFoodCost = adultFoodCost + childFoodCost;

    // 2. คำนวณส่วนลด (ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม)
    const rate = parseFloat(discountRate) || 0;
    const discountAmount = totalFoodCost * rate;
    const foodAfterDiscount = totalFoodCost - discountAmount;

    // 3. คำนวณค่าเครื่องดื่ม
    let totalDrinkCost = 0;
    if (drinkType === 'refill') {
      totalDrinkCost = (parsedAdults + parsedChildren) * REFILL_PRICE;
    } else {
      totalDrinkCost = parsedWater * WATER_PRICE + parsedSoda * SODA_PRICE;
    }

    // 4. ยอดชำระสุทธิ
    const grandTotal = foodAfterDiscount + totalDrinkCost;

    setSummary({
      adultCount: parsedAdults,
      childCount: parsedChildren,
      foodTotal: totalFoodCost,
      discountAmount,
      foodAfterDiscount,
      drinkTotal: totalDrinkCost,
      grandTotal,
      isCalculated: true,
    });
  };

  // รีเซ็ตค่าทั้งหมดกลับสู่สภาพเริ่มต้น
  const handleReset = () => {
    setAdults('');
    setChildren('');
    setDrinkType('refill');
    setWaterQty('');
    setSodaQty('');
    setDiscountRate('0');
    setErrors({});
    setFormAlert('');
    setSummary({
      adultCount: 0,
      childCount: 0,
      foodTotal: 0,
      discountAmount: 0,
      foodAfterDiscount: 0,
      drinkTotal: 0,
      grandTotal: 0,
      isCalculated: false,
    });
  };

  const isBottleDisabled = drinkType === 'refill';

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:py-10 flex items-start sm:items-center justify-center font-['Prompt','Inter',sans-serif] text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap');
        
        html, body, #root {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          display: block;
          font-family: 'Prompt', 'Inter', sans-serif;
        }

        .font-num {
          font-family: 'Inter', 'Prompt', sans-serif;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* การ์ดหลัก */}
      <main className="w-full max-w-110 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6 sm:p-8 transition-all">
        {/* ส่วนหัว */}
        <header className="text-center mb-4">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 font-['Inter','Prompt',sans-serif]">
            Buffet Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-normal">
            คำนวณค่าอาหารบุฟเฟต์
          </p>

          <MookataLogo />
        </header>

        {/* แจ้งเตือนเมื่อกรอกข้อมูลไม่ถูกต้อง */}
        {formAlert && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3 text-xs sm:text-sm text-red-700"
          >
            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{formAlert}</span>
          </div>
        )}

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleCalculate} noValidate className="space-y-4">
          {/* จำนวนผู้ใหญ่ */}
          <div>
            <label
              htmlFor="adults-input"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              จำนวนผู้ใหญ่ <span className="text-slate-600">(คนละ 299 บาท)</span>
            </label>
            <input
              id="adults-input"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={adults}
              onChange={(e) => {
                setAdults(e.target.value);
                if (errors.adults) {
                  setErrors((prev) => ({ ...prev, adults: undefined }));
                  setFormAlert('');
                }
              }}
              placeholder="ระบุจำนวนผู้ใหญ่"
              className={`w-full h-11 px-3.5 rounded-lg border text-sm font-num transition-colors outline-none bg-white placeholder:text-slate-300 ${
                errors.adults
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
              }`}
            />
            {errors.adults && (
              <p className="mt-1 text-xs text-red-600">{errors.adults}</p>
            )}
          </div>

          {/* จำนวนเด็ก */}
          <div>
            <label
              htmlFor="children-input"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              จำนวนเด็ก <span className="text-slate-600">(คนละ 89 บาท)</span>
            </label>
            <input
              id="children-input"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={children}
              onChange={(e) => {
                setChildren(e.target.value);
                if (errors.children) {
                  setErrors((prev) => ({ ...prev, children: undefined }));
                  setFormAlert('');
                }
              }}
              placeholder="ระบุจำนวนเด็ก"
              className={`w-full h-11 px-3.5 rounded-lg border text-sm font-num transition-colors outline-none bg-white placeholder:text-slate-300 ${
                errors.children
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
              }`}
            />
            {errors.children && (
              <p className="mt-1 text-xs text-red-600">{errors.children}</p>
            )}
          </div>

          {/* กรอบเลือกเครื่องดื่ม */}
          <fieldset className="relative rounded-xl border border-slate-200 p-4 pt-3 mt-5 space-y-3.5">
            <legend className="px-2 text-xs font-medium text-slate-600">
              เครื่องดื่ม
            </legend>

            {/* ตัวเลือกที่ 1: น้ำรีฟิล */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none py-0.5">
              <input
                type="radio"
                name="drinkType"
                value="refill"
                checked={drinkType === 'refill'}
                onChange={() => handleDrinkTypeChange('refill')}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                น้ำรีฟิล คนละ 29 บาท (ผู้ใหญ่และเด็ก)
              </span>
            </label>

            {/* ตัวเลือกที่ 2: เครื่องดื่มแบบขวด */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none py-0.5">
              <input
                type="radio"
                name="drinkType"
                value="bottle"
                checked={drinkType === 'bottle'}
                onChange={() => handleDrinkTypeChange('bottle')}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-800">
                เครื่องดื่มแบบขวด
              </span>
            </label>

            {/* ช่องป้อนจำนวนน้ำเปล่า */}
            <div className="pt-0.5">
              <label
                htmlFor="water-input"
                className={`block text-xs sm:text-sm mb-1.5 transition-colors ${
                  isBottleDisabled ? 'text-slate-500' : 'text-slate-700 font-medium'
                }`}
              >
                น้ำเปล่า (ขวดละ 10 บาท)
              </label>
              <input
                id="water-input"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                disabled={isBottleDisabled}
                value={waterQty}
                onChange={(e) => {
                  setWaterQty(e.target.value);
                  if (errors.waterQty) {
                    setErrors((prev) => ({ ...prev, waterQty: undefined }));
                  }
                }}
                placeholder={isBottleDisabled ? '' : 'ระบุจำนวนขวด (ถ้ามี)'}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm font-num transition-all outline-none ${
                  isBottleDisabled
                    ? 'bg-slate-200/80 border-slate-200 text-slate-400 cursor-not-allowed'
                    : errors.waterQty
                    ? 'bg-white border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.waterQty && (
                <p className="mt-1 text-xs text-red-600">{errors.waterQty}</p>
              )}
            </div>

            {/* ช่องป้อนจำนวนน้ำอัดลม */}
            <div>
              <label
                htmlFor="soda-input"
                className={`block text-xs sm:text-sm mb-1.5 transition-colors ${
                  isBottleDisabled ? 'text-slate-500' : 'text-slate-700 font-medium'
                }`}
              >
                น้ำอัดลม (ขวดละ 25 บาท)
              </label>
              <input
                id="soda-input"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                disabled={isBottleDisabled}
                value={sodaQty}
                onChange={(e) => {
                  setSodaQty(e.target.value);
                  if (errors.sodaQty) {
                    setErrors((prev) => ({ ...prev, sodaQty: undefined }));
                  }
                }}
                placeholder={isBottleDisabled ? '' : 'ระบุจำนวนขวด (ถ้ามี)'}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm font-num transition-all outline-none ${
                  isBottleDisabled
                    ? 'bg-slate-200/80 border-slate-200 text-slate-400 cursor-not-allowed'
                    : errors.sodaQty
                    ? 'bg-white border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.sodaQty && (
                <p className="mt-1 text-xs text-red-600">{errors.sodaQty}</p>
              )}
            </div>
          </fieldset>

          {/* บัตรส่วนลด */}
          <div className="pt-1">
            <label
              htmlFor="discount-select"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              บัตรส่วนลด
            </label>
            <div className="relative">
              <select
                id="discount-select"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-full h-11 px-3.5 pr-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none cursor-pointer"
              >
                <option value="0">ไม่มีส่วนลด</option>
                <option value="0.10">ส่วนลด 10%</option>
                <option value="0.15">ส่วนลด 15%</option>
                <option value="0.20">ส่วนลด 20%</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม
            </p>
          </div>

          {/* ปุ่มคำนวณ และ รีเซ็ต */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="h-11 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="8.01" y2="10" />
                <line x1="12" y1="10" x2="12.01" y2="10" />
                <line x1="16" y1="10" x2="16.01" y2="10" />
                <line x1="8" y1="14" x2="8.01" y2="14" />
                <line x1="12" y1="14" x2="12.01" y2="14" />
                <line x1="16" y1="14" x2="16.01" y2="14" />
                <line x1="8" y1="18" x2="8.01" y2="18" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
                <line x1="16" y1="18" x2="16.01" y2="18" />
              </svg>
              <span>คำนวณ</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-11 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
              </svg>
              <span>รีเซ็ต</span>
            </button>
          </div>
        </form>

        {/* กล่องแสดงยอดชำระทั้งหมด */}
        <section
          aria-live="polite"
          className="mt-5 rounded-xl bg-[#F3F4FA] border border-indigo-100/80 px-4 py-4 text-center transition-all"
        >
          <div className="text-sm sm:text-base font-medium text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
            <span>ยอดชำระทั้งหมด:</span>
            <span className="text-xl sm:text-2xl font-bold text-[#4338CA] font-num">
              {formatCurrency(summary.grandTotal)}
            </span>
            <span>บาท</span>
          </div>

          {summary.isCalculated && (
            <div className="mt-3 pt-3 border-t border-indigo-200/60 text-left text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1 text-indigo-700 font-medium mb-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h8M8 15h5" />
                </svg>
                <span>รายละเอียดการคำนวณ</span>
              </div>
              <div className="flex justify-between">
                <span>
                  ค่าอาหารรวม ({summary.adultCount} ผู้ใหญ่, {summary.childCount} เด็ก)
                </span>
                <span className="font-num font-medium text-slate-700">
                  {formatCurrency(summary.foodTotal)} บาท
                </span>
              </div>
              {summary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>ส่วนลดค่าอาหาร ({Math.round(parseFloat(discountRate) * 100)}%)</span>
                  <span className="font-num font-medium">
                    -{formatCurrency(summary.discountAmount)} บาท
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>
                  ค่าเครื่องดื่ม ({drinkType === 'refill' ? 'น้ำรีฟิล' : 'แบบขวด'})
                </span>
                <span className="font-num font-medium text-slate-700">
                  {formatCurrency(summary.drinkTotal)} บาท
                </span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}