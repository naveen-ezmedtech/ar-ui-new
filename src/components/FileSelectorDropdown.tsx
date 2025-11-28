import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

interface FileOption {
  id: number;
  filename: string;
  displayName: string;
  uploaded_at: string | null;
  patient_count: number;
}

interface FileSelectorDropdownProps {
  options: FileOption[];
  selectedUploadId: number | null;
  onSelect: (uploadId: number | null) => void;
  disabled?: boolean;
}

export const FileSelectorDropdown = ({ 
  options, 
  selectedUploadId, 
  onSelect,
  disabled = false 
}: FileSelectorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        buttonRef.current?.contains(target) ||
        buttonRef.current === target
      ) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const selectedOption = selectedUploadId 
    ? options.find(opt => opt.id === selectedUploadId)
    : null;

  const displayText = selectedOption 
    ? selectedOption.displayName 
    : 'All Patients (All Files)';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
          text-sm text-gray-900 font-medium 
          flex items-center justify-between
          transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
            : 'hover:border-teal-500 hover:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
          }
        `}
      >
        <span className="truncate flex-1 text-left">{displayText}</span>
        <FiChevronDown 
          className={`ml-2 h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div 
          className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* All Patients Option */}
          <button
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            className={`
              w-full text-left px-4 py-3 text-sm transition-colors
              flex items-center justify-between
              ${selectedUploadId === null
                ? 'bg-teal-50 text-teal-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span>All Patients (All Files)</span>
            {selectedUploadId === null && (
              <FiCheck className="h-5 w-5 text-teal-600" />
            )}
          </button>

          {/* Divider */}
          {options.length > 0 && (
            <div className="border-t border-gray-200 my-1" />
          )}

          {/* File Options */}
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-3 text-sm transition-colors
                flex items-center justify-between
                ${selectedUploadId === option.id
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="truncate">{option.displayName}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {option.patient_count} patient{option.patient_count !== 1 ? 's' : ''}
                </div>
              </div>
              {selectedUploadId === option.id && (
                <FiCheck className="h-5 w-5 text-teal-600 ml-2 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

