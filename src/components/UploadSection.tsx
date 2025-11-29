import { FileUpload, FileSelectorDropdown, BatchCallButton, DownloadButton, PatientTable } from './';
import type { Patient } from '../types';

interface FileOption {
  id: number;
  filename: string;
  displayName: string;
  patient_count: number;
}

interface UploadSectionProps {
  availableFiles: FileOption[];
  selectedUploadId: number | null;
  patients: Patient[];
  loading: boolean;
  uploadLoading: boolean;
  callingInProgress: boolean;
  activeCalls: Map<string, number>;
  currentFile: string;
  onFileUpload: (file: File) => Promise<void>;
  onFileSelect: (uploadId: number | null) => Promise<void>;
  onBatchCall: () => void;
  onViewNotes: (patient: Patient) => void;
  onCallPatient: (patient: Patient) => void;
  onViewCallHistory: (patient: Patient) => void;
  onViewDetails: (patient: Patient) => void;
}

export const UploadSection = ({
  availableFiles,
  selectedUploadId,
  patients,
  loading,
  uploadLoading,
  callingInProgress,
  activeCalls,
  currentFile,
  onFileUpload,
  onFileSelect,
  onBatchCall,
  onViewNotes,
  onCallPatient,
  onViewCallHistory,
  onViewDetails,
}: UploadSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Section: Upload CSV */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h2>
          <FileUpload onUpload={onFileUpload} loading={uploadLoading} />
        </div>

        {/* Right Section: Patient Display Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">View Patients</h2>
          
          {/* File Selector */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
              Select CSV File
            </label>
            <FileSelectorDropdown
              options={availableFiles}
              selectedUploadId={selectedUploadId}
              onSelect={onFileSelect}
            />
          </div>

          {/* Patient Count & Actions */}
          <div className="space-y-3">
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Patients</p>
                  <p className="text-sm text-gray-900 font-medium mt-0.5">
                    {selectedUploadId 
                      ? (() => {
                          const selectedUpload = availableFiles.find(f => f.id === selectedUploadId);
                          return selectedUpload ? `From: ${selectedUpload.displayName}` : 'All Files';
                        })()
                      : 'All Files'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
                  {patients.length} patients
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <BatchCallButton 
                onClick={onBatchCall}
                disabled={patients.length === 0 || callingInProgress}
                loading={callingInProgress}
              />
              
              <DownloadButton 
                filename={selectedUploadId 
                  ? (() => {
                      const selectedUpload = availableFiles.find(f => f.id === selectedUploadId);
                      return selectedUpload?.filename || currentFile;
                    })()
                  : currentFile}
                uploadId={selectedUploadId || undefined}
                disabled={patients.length === 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Patients</h3>
        <PatientTable 
          patients={patients} 
          loading={loading} 
          onViewNotes={onViewNotes}
          onCallPatient={onCallPatient}
          onViewCallHistory={onViewCallHistory}
          onViewDetails={onViewDetails}
          activeCalls={activeCalls}
        />
      </div>
    </div>
  );
};

