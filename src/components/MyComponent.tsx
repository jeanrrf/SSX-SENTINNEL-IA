import React, { useState } from 'react';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

const MyComponent: React.FC = () => {
  const [date, setDate] = useState(formatDateToDDMMYYYY("2025-01-26T18:26:48.208Z"));

  return (
    <input
      type="text"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  );
};

export default MyComponent;
