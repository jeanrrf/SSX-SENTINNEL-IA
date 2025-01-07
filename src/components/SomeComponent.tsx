import React, { useEffect, useCallback } from 'react';

const SomeComponent: React.FC = () => {
  const updateReports = useCallback(() => {
    // ...existing code...
  }, []);

  useEffect(() => {
    updateReports();
  }, [updateReports]);

  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
};

export default SomeComponent;
