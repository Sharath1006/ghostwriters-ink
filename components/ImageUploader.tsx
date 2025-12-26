
import React from 'react';

interface Props {
  onImageSelect: (base64: string) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<Props> = ({ onImageSelect, disabled }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      <div className="border-2 border-dashed border-slate-700 group-hover:border-amber-500/50 rounded-xl p-12 transition-all flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-image text-slate-500 group-hover:text-amber-500 text-2xl"></i>
        </div>
        <p className="text-slate-300 font-medium">Click or drag an image to start</p>
        <p className="text-slate-500 text-sm mt-1">PNG, JPG or WebP (Max 5MB)</p>
      </div>
    </div>
  );
};
