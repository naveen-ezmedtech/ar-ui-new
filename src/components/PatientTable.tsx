import type { Patient } from '../types';
import { FiEye } from 'react-icons/fi';

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onViewNotes: (patient: Patient) => void;
}

export const PatientTable = ({ patients, loading, onViewNotes }: PatientTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 font-medium text-lg">
        Loading patient data...
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
        <p className="text-gray-700 text-xl font-medium mb-2">No patient data available</p>
        <p className="text-gray-500">Upload a CSV, XLSX, or XLS file to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Phone Number</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Patient Name</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Invoice #</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Outstanding</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Aging</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Link Requested</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Link Sent</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Est. Date</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.map((patient, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-900 font-medium">{patient.phone_number}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{patient.patient_name}</td>
                <td className="px-4 py-4 text-sm text-gray-700 font-mono">{patient.invoice_number}</td>
                <td className="px-4 py-4 text-sm text-gray-900 font-semibold">{patient.price}</td>
                <td className="px-4 py-4 text-sm text-red-600 font-bold">{patient.outstanding_amount}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{patient.aging_bucket}</td>
                <td className="px-4 py-4 text-sm">
                  {patient.link_requested ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">{patient.link_requested}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm">
                  {patient.link_sent ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">{patient.link_sent}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm">
                  {patient.estimated_date ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-medium">{patient.estimated_date}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm">
                  <button
                    onClick={() => onViewNotes(patient)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-colors"
                  >
                    <FiEye size={14} />
                    View Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
