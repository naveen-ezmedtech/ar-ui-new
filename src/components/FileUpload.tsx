import { useRef } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';

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
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-dashed border-blue-300 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <div className="px-8 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${loading ? 'bg-gray-100' : 'bg-green-50'} transition-colors`}>
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              ) : (
                <FiUpload className="text-green-600" size={32} />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {loading ? 'Uploading file...' : 'Upload Patient Invoice File'}
              </h3>
              <p className="text-sm text-gray-500">
                {loading ? 'Please wait while we process your file' : 'Drag and drop your file here, or click to browse'}
              </p>
            </div>

            <label className={`inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-pointer transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5'}`}>
              <FiFile size={18} />
              <span>{loading ? 'Uploading...' : 'Choose File'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">Supported formats:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">CSV</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">XLSX</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">XLS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
