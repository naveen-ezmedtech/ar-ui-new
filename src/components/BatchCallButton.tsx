import { FiPhone } from 'react-icons/fi';

interface BatchCallButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const BatchCallButton = ({ onClick, disabled, loading }: BatchCallButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold transition-all ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <FiPhone size={18} />
      <span>{loading ? 'Calling...' : 'Start Calls'}</span>
    </button>
  );
};
