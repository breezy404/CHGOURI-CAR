import React, { useRef } from 'react';

export default function OTPInput({ length = 6, value, onChange }) {
  const inputs = useRef([]);

  const valueArr = value.padEnd(length, '').split('').slice(0, length);

  const handleChange = (e, index) => {
    let val = e.target.value;
    if (/[^0-9]/.test(val)) return;
    
    val = val.slice(-1);
    
    const newArr = [...valueArr];
    newArr[index] = val;
    onChange(newArr.join(''));

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!valueArr[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        // Prevent default to avoid deleting the previous char immediately in some browsers,
        // but we want the user to press backspace again to delete it, which is standard behavior.
      } else {
        const newArr = [...valueArr];
        newArr[index] = '';
        onChange(newArr.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={valueArr[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          placeholder="-"
          className="w-12 h-14 text-center bg-slate-50 border border-slate-200 rounded-xl text-xl font-black text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-300"
        />
      ))}
    </div>
  );
}
