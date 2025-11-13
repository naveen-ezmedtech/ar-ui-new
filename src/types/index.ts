export interface Patient {
  phone_number: string;
  patient_name: string;
  invoice_number: string;
  price: string;
  outstanding_amount: string;
  aging_bucket: string;
  notes: string;
  link_requested?: string;
  link_sent?: string;
  estimated_date?: string;
}

export interface CSVFile {
  filename: string;
  size: number;
  last_modified: string;
  patient_count: number;
}

export interface BatchCallResult {
  success: boolean;
  message: string;
  results: {
    total_attempted: number;
    successful: number;
    failed: number;
    calls: Array<{
      patient_name: string;
      phone_number: string;
      outstanding_amount: string;
      timestamp: string;
      success: boolean;
      conversation_id?: string;
    }>;
  };
}

export interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}
