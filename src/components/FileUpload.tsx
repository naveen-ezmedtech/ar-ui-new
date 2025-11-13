import { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export const FileUpload = ({ onUpload, loading }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-pointer transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5'}`}>
        <FiUpload size={18} />
        <span>{loading ? 'Uploading...' : 'Upload File'}</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      </label>
      <span className="text-xs text-gray-500 font-medium text-center">CSV, XLSX, XLS</span>
    </div>
  );
};
