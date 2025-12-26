
import React from 'react';

interface Props {
  onImageSelect: (base64: string) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<Props> = ({ onImageSelect, disabled }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="relative group cursor-pointer">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      <div className={`border-2 border-dashed rounded-xl p-12 transition-all flex flex-col items-center justify-center backdrop-blur-sm ${isDragging
        ? 'border-amber-500 bg-slate-900/80 scale-[1.02]'
        : 'border-slate-700 group-hover:border-amber-500/50 bg-slate-900/50'
        }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${isDragging ? 'bg-amber-500/20 scale-110' : 'bg-slate-800 Group-hover:scale-110'
          }`}>
          <i className={`fa-solid fa-image text-2xl ${isDragging ? 'text-amber-500' : 'text-slate-500 group-hover:text-amber-500'
            }`}></i>
        </div>
        <p className={`font-medium ${isDragging ? 'text-amber-500' : 'text-slate-300'}`}>
          {isDragging ? 'Drop it like it\'s hot!' : 'Click or drag an image to start'}
        </p>
        <p className="text-slate-500 text-sm mt-1">PNG, JPG or WebP (Max 5MB)</p>
      </div>
    </div>
  );
};
