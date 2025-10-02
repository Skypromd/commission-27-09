import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface DateRangePickerProps {
  onChange: (range: { from: Date | null; to: Date | null }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleApply = () => {
    onChange({ from: startDate, to: endDate });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange({ from: null, to: null });
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText={t('datePicker.from')}
        className="w-32 rounded-md border-gray-300 shadow-sm"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText={t('datePicker.to')}
        className="w-32 rounded-md border-gray-300 shadow-sm"
      />
      <Button onClick={handleApply} size="sm">{t('apply')}</Button>
      <Button onClick={handleClear} size="sm" variant="secondary">{t('clear')}</Button>
    </div>
  );
};
