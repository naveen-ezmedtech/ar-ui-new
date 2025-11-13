import { FiX, FiFileText } from 'react-icons/fi';

interface NotesModalProps {
  isOpen: boolean;
  patientName: string;
  notes: string;
  onClose: () => void;
}

export const NotesModal = ({ isOpen, patientName, notes, onClose }: NotesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-fadeIn">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiFileText className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Call Summary</h3>
                <p className="text-sm text-gray-600">{patientName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="text-gray-500" size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {notes && notes.trim() ? (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {notes}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FiFileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>No notes available for this patient yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

