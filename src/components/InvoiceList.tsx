import { useEffect, useState } from 'react';
import { getFileUploadHistory, getPatientsByUploadId } from '../services/api';
import type { Patient } from '../types';
import { formatDateTime } from '../utils/timezone';
import { PatientTable } from './PatientTable';

interface FileUpload {
  id: number;
  filename: string;
  uploaded_at: string | null;
  patient_count: number;
  new_count: number;
  updated_count: number;
  error_count: number;
}

interface InvoiceListProps {
  onFileSelect?: (uploadId: number) => void;
}

export const InvoiceList = ({ onFileSelect }: InvoiceListProps) => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const response = await getFileUploadHistory();
      setUploads(response.history || []);
    } catch (error) {
      console.error('Failed to load uploads:', error);
      setUploads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const handleOpenUpload = async (uploadId: number) => {
    setSelectedUploadId(uploadId);
    setLoadingPatients(true);
    try {
      const response = await getPatientsByUploadId(uploadId);
      setPatients(response.patients || []);
      if (onFileSelect) {
        onFileSelect(uploadId);
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleBack = () => {
    setSelectedUploadId(null);
    setPatients([]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  // Show invoice list if upload is selected
  if (selectedUploadId) {
    const selectedUpload = uploads.find(u => u.id === selectedUploadId);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={handleBack}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Uploads
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedUpload?.filename || 'Invoice List'}
              </h2>
              {selectedUpload && (
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded: {formatDateTime(selectedUpload.uploaded_at)} • 
                  {selectedUpload.new_count} new • {selectedUpload.updated_count} updated
                </p>
              )}
            </div>
          </div>
        </div>
        
        {loadingPatients ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Patients</h3>
            <PatientTable 
              patients={patients} 
              loading={false}
              onViewNotes={() => {}}
              onCallPatient={() => {}}
              onViewCallHistory={() => {}}
              activeCalls={new Map()}
            />
          </div>
        )}
      </div>
    );
  }

  // Show upload list
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Uploaded CSV Files</h2>
        <button
          onClick={loadUploads}
          className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {uploads.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No files uploaded yet</p>
          <p className="text-gray-400 text-sm">Upload a CSV file to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-pointer"
              onClick={() => handleOpenUpload(upload.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{upload.filename}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Uploaded: {formatDateTime(upload.uploaded_at)}
                      {upload.uploaded_at && (
                        <span className="ml-2 text-gray-400">
                          (ID: {upload.id})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="ml-11 flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {upload.patient_count} patients
                  </span>
                  {upload.new_count > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {upload.new_count} new
                    </span>
                  )}
                  {upload.updated_count > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {upload.updated_count} updated
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenUpload(upload.id);
                }}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                View Invoices
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

