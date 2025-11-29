import { useRef, useEffect } from 'react';
import { getCallStatus } from '../services/api';

interface UseAutoRefreshOptions {
  activeSection: 'dashboard' | 'upload' | 'invoice-list' | 'users';
  callingInProgress: boolean;
  setCallingInProgress: (value: boolean) => void;
  setActiveCalls: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  activeCallsRef: React.MutableRefObject<Map<string, number>>;
  loadPatientData: (uploadId: number | null, silent: boolean) => Promise<void>;
  getSelectedUploadId: () => number | null;
}

export const useAutoRefresh = (options: UseAutoRefreshOptions) => {
  const {
    activeSection,
    callingInProgress,
    setCallingInProgress,
    setActiveCalls,
    activeCallsRef,
    loadPatientData,
    getSelectedUploadId,
  } = options;

  const refreshIntervalRef = useRef<number | null>(null);

  const startSmartAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (!callingInProgress) {
      return;
    }

    let count = 0;
    const maxRefreshes = 60;
    const refreshInterval = 2000;
    
    const checkAndRefresh = async () => {
      if (!callingInProgress || count >= maxRefreshes) {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
        setCallingInProgress(false);
        localStorage.removeItem('callingInProgress');
        return;
      }

      if (activeSection === 'upload') {
        const currentActiveCalls = activeCallsRef.current;
        
        if (currentActiveCalls.size > 0) {
          const phoneNumbers = Array.from(new Set(
            Array.from(currentActiveCalls.keys()).map(key => {
              const parts = key.split('|');
              return parts[0];
            })
          ));
          
          try {
            const statusResponse = await getCallStatus(phoneNumbers);
            
            if (statusResponse.success && statusResponse.statuses) {
              let hasPendingCalls = false;
              let allCallsCompleted = true;
              
              statusResponse.statuses.forEach((status) => {
                const callStatus = status.recent_call_status || status.call_status;
                if (callStatus === 'sent' || callStatus === 'pending' || !callStatus) {
                  hasPendingCalls = true;
                  allCallsCompleted = false;
                }
              });
              
              if (!hasPendingCalls && allCallsCompleted && count >= 3) {
                const currentUploadId = getSelectedUploadId();
                await loadPatientData(currentUploadId, true);
                
                if (refreshIntervalRef.current) {
                  clearInterval(refreshIntervalRef.current);
                  refreshIntervalRef.current = null;
                }
                setCallingInProgress(false);
                localStorage.removeItem('callingInProgress');
                return;
              }
              
              if (count % 5 === 0) {
                const currentUploadId = getSelectedUploadId();
                await loadPatientData(currentUploadId, true);
              }
            }
          } catch (error) {
            console.error('Failed to check call status:', error);
            if (count % 3 === 0) {
              const currentUploadId = getSelectedUploadId();
              await loadPatientData(currentUploadId, true);
            }
          }
        } else {
          const currentUploadId = getSelectedUploadId();
          await loadPatientData(currentUploadId, true);
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
          }
          setCallingInProgress(false);
          localStorage.removeItem('callingInProgress');
          return;
        }
      }
      
      count++;
      
      setActiveCalls((prevActiveCalls) => {
        const now = Date.now();
        const newActiveCalls = new Map(prevActiveCalls);
        
        prevActiveCalls.forEach((timestamp, phone) => {
          if (now - timestamp > 10 * 60 * 1000) {
            newActiveCalls.delete(phone);
          }
        });
        
        activeCallsRef.current = newActiveCalls;
        return newActiveCalls;
      });

      if (count >= maxRefreshes) {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
        setCallingInProgress(false);
        localStorage.removeItem('callingInProgress');
        setActiveCalls(new Map());
        activeCallsRef.current = new Map();
        localStorage.removeItem('activeCalls');
      }
    };
    
    refreshIntervalRef.current = window.setInterval(checkAndRefresh, refreshInterval);
    
    if (activeSection === 'upload') {
      const currentUploadId = getSelectedUploadId();
      loadPatientData(currentUploadId, true);
    }
  };

  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    setCallingInProgress(false);
    localStorage.removeItem('callingInProgress');
  };

  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    startSmartAutoRefresh,
    stopAutoRefresh,
  };
};
