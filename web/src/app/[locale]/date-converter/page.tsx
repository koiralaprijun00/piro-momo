'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import NepaliDate from 'nepali-date-converter';
import AdSenseGoogle from '../../components/AdSenseGoogle';
import { motion } from 'framer-motion';
import CustomDropdown from '../../components/ui/CustomDropdown';
import { useTranslations } from 'next-intl';

// Define interfaces
interface DateState {
  year: string;
  month: string;
  day: string;
}

interface DropdownOption {
  id: string;
  name: string;
}

interface ConversionResult {
  success: boolean;
  date?: string;
  formattedDate?: string;
  error?: string;
}

interface ConversionHistoryItem {
  id: string;
  from: string;
  to: string;
  timestamp: number;
}

// Custom hooks
function useDateConverter() {
  const t = useTranslations('Translations.dateConverter');
  
  // Constants for date ranges
  const ENGLISH_MIN_YEAR = 1943;
  const ENGLISH_MAX_YEAR = 2033;
  const NEPALI_MIN_YEAR = 2000;
  const NEPALI_MAX_YEAR = 2090;

  // Helper function to safely parse a date
  const safeParseDate = (dateStr: string): Date | null => {
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Helper function to validate date input
  const validateDateInput = (
    date: DateState,
    minYear: number,
    maxYear: number,
    isNepali: boolean
  ): { isValid: boolean; error?: string } => {
    const { year, month, day } = date;

    if (!year || !month || !day) {
      return { isValid: false, error: t('allFieldsRequired') };
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (yearNum < minYear || yearNum > maxYear) {
      return {
        isValid: false,
        error: t('dateRangeError', {
          startDate: minYear.toString(),
          endDate: maxYear.toString(),
        }),
      };
    }

    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: t('invalidDate') };
    }

    const maxDays = isNepali
      ? getDaysInMonth(yearNum, monthNum, true)
      : getDaysInMonth(yearNum, monthNum, false);
    if (dayNum < 1 || dayNum > maxDays) {
      return { isValid: false, error: t('invalidDate') };
    }

    return { isValid: true };
  };

  // Helper function to get days in a month
  const getDaysInMonth = (year: number, month: number, isNepali: boolean): number => {
    if (!year || !month) {
      return 30;
    }

    if (isNepali) {
      try {
        const nepDate = new NepaliDate(year, month - 1, 1);
        return (nepDate as any).calendarData[year][month - 1];
      } catch {
        return 30;
      }
    } else {
      return new Date(year, month, 0).getDate();
    }
  };

  // Nepali to English conversion
  const nepaliToEnglish = (nepaliDate: DateState): ConversionResult => {
    const validation = validateDateInput(nepaliDate, NEPALI_MIN_YEAR, NEPALI_MAX_YEAR, true);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const year = parseInt(nepaliDate.year);
    const month = parseInt(nepaliDate.month);
    const day = parseInt(nepaliDate.day);

    try {
      const nDate = new NepaliDate(year, month - 1, day);
      const engDate = nDate.toJsDate();

      if (!engDate || isNaN(engDate.getTime())) {
        return { success: false, error: t('invalidDate') };
      }

      const result = engDate.toISOString().split('T')[0];
      const engYear = engDate.getFullYear();

      if (engYear < ENGLISH_MIN_YEAR || engYear > ENGLISH_MAX_YEAR) {
        return {
          success: false,
          error: t('conversionRangeError', {
            startDate: `${ENGLISH_MIN_YEAR}-01-01`,
            endDate: `${ENGLISH_MAX_YEAR}-12-31`,
          })
        };
      }

      return {
        success: true,
        date: result,
        formattedDate: engDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : t('conversionError')
      };
    }
  };

  // English to Nepali conversion
  const englishToNepali = (englishDate: DateState): ConversionResult => {
    const validation = validateDateInput(englishDate, ENGLISH_MIN_YEAR, ENGLISH_MAX_YEAR, false);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const dateStr = `${englishDate.year}-${englishDate.month}-${englishDate.day}`;
    const date = safeParseDate(dateStr);

    if (!date) {
      return { success: false, error: t('invalidDate') };
    }

    try {
      const nepaliDateObj = new NepaliDate(date);
      const result = nepaliDateObj.format('YYYY-MM-DD');
      const nepaliYear = parseInt(result.split('-')[0]);

      if (nepaliYear < NEPALI_MIN_YEAR || nepaliYear > NEPALI_MAX_YEAR) {
        return {
          success: false,
          error: t('conversionRangeError', {
            startDate: `${NEPALI_MIN_YEAR}/01/01`,
            endDate: `${NEPALI_MAX_YEAR}/12/30`,
          })
        };
      }

      return {
        success: true,
        date: result,
        formattedDate: nepaliDateObj.format('DD MMMM, YYYY'),
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : t('conversionError')
      };
    }
  };

  return {
    ENGLISH_MIN_YEAR,
    ENGLISH_MAX_YEAR,
    NEPALI_MIN_YEAR,
    NEPALI_MAX_YEAR,
    getDaysInMonth,
    validateDateInput,
    nepaliToEnglish,
    englishToNepali
  };
}

// Date Selector Component
interface DateSelectorProps {
  isNepali: boolean;
  dateState: DateState;
  setDateState: React.Dispatch<React.SetStateAction<DateState>>;
  yearOptions: DropdownOption[];
  monthOptions: DropdownOption[];
  getDayOptions: () => DropdownOption[];
  t: (key: string) => string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  isNepali, 
  dateState, 
  setDateState, 
  yearOptions, 
  monthOptions, 
  getDayOptions,
  t
}) => {
  const colorScheme = isNepali ? 'red' : 'blue';
  
  return (
    <div className={`p-6 rounded-xl shadow-sm border border-${colorScheme}-100`}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium text-${colorScheme}-800 mb-2`}>
            {t('year')}
          </label>
          <CustomDropdown
            options={yearOptions}
            value={dateState.year}
            onChange={(value) =>
              setDateState((prev: DateState) => ({ ...prev, year: value.toString() }))
            }
            className="w-full"
            aria-label={t('year')}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-${colorScheme}-800 mb-2`}>
            {t('month')}
          </label>
          <CustomDropdown
            options={monthOptions}
            value={dateState.month}
            onChange={(value) =>
              setDateState((prev: DateState) => ({ ...prev, month: value.toString() }))
            }
            className="w-full"
            aria-label={t('month')}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-${colorScheme}-800 mb-2`}>
            {t('day')}
          </label>
          <CustomDropdown
            options={getDayOptions()}
            value={dateState.day}
            onChange={(value) =>
              setDateState((prev: DateState) => ({ ...prev, day: value.toString() }))
            }
            className="w-full"
            aria-label={t('day')}
          />
        </div>
      </div>
    </div>
  );
};

export default function DateConverterPage() {
  const t = useTranslations('Translations.dateConverter');
  const { 
    ENGLISH_MIN_YEAR, 
    ENGLISH_MAX_YEAR, 
    NEPALI_MIN_YEAR, 
    NEPALI_MAX_YEAR,
    getDaysInMonth,
    englishToNepali,
    nepaliToEnglish
  } = useDateConverter();

  // State
  const [englishDate, setEnglishDate] = useState<DateState>(() => {
    const today = new Date();
    return {
      year: today.getFullYear().toString(),
      month: (today.getMonth() + 1).toString().padStart(2, '0'),
      day: today.getDate().toString().padStart(2, '0'),
    };
  });

  const [nepaliDate, setNepaliDate] = useState<DateState>(() => {
    try {
      const nepaliToday = new NepaliDate();
      return {
        year: nepaliToday.getYear().toString(),
        month: (nepaliToday.getMonth() + 1).toString().padStart(2, '0'),
        day: nepaliToday.getDate().toString().padStart(2, '0'),
      };
    } catch (error) {
      console.error('Failed to get today\'s Nepali date:', error);
      return {
        year: NEPALI_MIN_YEAR.toString(),
        month: '01',
        day: '01',
      };
    }
  });

  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'toNepali' | 'toEnglish'>('toNepali');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Memoized dropdown options
  const englishYearOptions = useMemo(
    () =>
      Array.from({ length: ENGLISH_MAX_YEAR - ENGLISH_MIN_YEAR + 1 }, (_, i) => ({
        id: (ENGLISH_MIN_YEAR + i).toString(),
        name: (ENGLISH_MIN_YEAR + i).toString(),
      })),
    [ENGLISH_MIN_YEAR, ENGLISH_MAX_YEAR]
  );

  const nepaliYearOptions = useMemo(
    () =>
      Array.from({ length: NEPALI_MAX_YEAR - NEPALI_MIN_YEAR + 1 }, (_, i) => ({
        id: (NEPALI_MIN_YEAR + i).toString(),
        name: (NEPALI_MIN_YEAR + i).toString(),
      })),
    [NEPALI_MIN_YEAR, NEPALI_MAX_YEAR]
  );

  const englishMonthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const monthNum = (i + 1).toString().padStart(2, '0');
        const monthNames = [
          t('months.january'),
          t('months.february'),
          t('months.march'),
          t('months.april'),
          t('months.may'),
          t('months.june'),
          t('months.july'),
          t('months.august'),
          t('months.september'),
          t('months.october'),
          t('months.november'),
          t('months.december'),
        ];
        return {
          id: monthNum,
          name: `${monthNum} - ${monthNames[i]}`,
        };
      }),
    [t]
  );

  const nepaliMonthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const monthNum = (i + 1).toString().padStart(2, '0');
        const nepaliMonthNames = [
          t('months.baisakh'),
          t('months.jestha'),
          t('months.ashadh'),
          t('months.shrawan'),
          t('months.bhadra'),
          t('months.ashwin'),
          t('months.kartik'),
          t('months.mangsir'),
          t('months.poush'),
          t('months.magh'),
          t('months.falgun'),
          t('months.chaitra'),
        ];
        return {
          id: monthNum,
          name: `${monthNum} - ${nepaliMonthNames[i]}`,
        };
      }),
    [t]
  );

  // Get day options
  const getEnglishDayOptions = useCallback((): DropdownOption[] => {
    if (!englishDate.year || !englishDate.month) {
      return [];
    }

    const daysCount = getDaysInMonth(
      parseInt(englishDate.year),
      parseInt(englishDate.month),
      false
    );
    
    return Array.from({ length: daysCount }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return {
        id: day,
        name: day,
      };
    });
  }, [englishDate.year, englishDate.month, getDaysInMonth]);

  const getNepaliDayOptions = useCallback((): DropdownOption[] => {
    if (!nepaliDate.year || !nepaliDate.month) {
      return [];
    }

    const daysCount = getDaysInMonth(
      parseInt(nepaliDate.year),
      parseInt(nepaliDate.month),
      true
    );
    
    return Array.from({ length: daysCount }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return {
        id: day,
        name: day,
      };
    });
  }, [nepaliDate.year, nepaliDate.month, getDaysInMonth]);

  // Adjust day if it exceeds days in month
  useEffect(() => {
    if (englishDate.year && englishDate.month) {
      const daysInMonth = getDaysInMonth(
        parseInt(englishDate.year),
        parseInt(englishDate.month),
        false
      );
      
      if (parseInt(englishDate.day) > daysInMonth) {
        setEnglishDate((prev) => ({
          ...prev,
          day: daysInMonth.toString().padStart(2, '0'),
        }));
      }
    }
  }, [englishDate.year, englishDate.month, getDaysInMonth]);

  useEffect(() => {
    if (nepaliDate.year && nepaliDate.month) {
      const daysInMonth = getDaysInMonth(
        parseInt(nepaliDate.year),
        parseInt(nepaliDate.month),
        true
      );
      
      if (parseInt(nepaliDate.day) > daysInMonth) {
        setNepaliDate((prev) => ({
          ...prev,
          day: daysInMonth.toString().padStart(2, '0'),
        }));
      }
    }
  }, [nepaliDate.year, nepaliDate.month, getDaysInMonth]);

  // Clear error on tab or date change
  useEffect(() => {
    setErrorMessage(null);
  }, [activeTab, englishDate, nepaliDate]);

  // Conversion functions
  const convertToNepali = (): void => {
    setIsAnimating(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = englishToNepali(englishDate);
      
      if (result.success) {
        setConversionResult(result);
      } else {
        setErrorMessage(result.error || t('conversionError'));
      }
      
      setIsAnimating(false);
    }, 800);
  };

  const convertToEnglish = (): void => {
    setIsAnimating(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = nepaliToEnglish(nepaliDate);
      
      if (result.success) {
        setConversionResult(result);
      } else {
        setErrorMessage(result.error || t('conversionError'));
      }
      
      setIsAnimating(false);
    }, 800);
  };

  // Handle tab change with reset to default values
  const handleTabChange = (tab: 'toNepali' | 'toEnglish') => {
    setActiveTab(tab);
    setConversionResult(null);
    setErrorMessage(null);

    if (tab === 'toNepali') {
      const today = new Date();
      setEnglishDate({
        year: today.getFullYear().toString(),
        month: (today.getMonth() + 1).toString().padStart(2, '0'),
        day: today.getDate().toString().padStart(2, '0'),
      });
    } else {
      try {
        const nepaliToday = new NepaliDate();
        setNepaliDate({
          year: nepaliToday.getYear().toString(),
          month: (nepaliToday.getMonth() + 1).toString().padStart(2, '0'),
          day: nepaliToday.getDate().toString().padStart(2, '0'),
        });
      } catch (error) {
        console.error('Failed to get today\'s Nepali date:', error);
        setNepaliDate({
          year: NEPALI_MIN_YEAR.toString(),
          month: '01',
          day: '01',
        });
      }
    }
  };

  // Format date string for display
  const formatHistoryDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
          background-color: white;
          cursor: pointer;
        }

        select option {
          font-size: 16px;
          padding: 12px 16px;
          background-color: white;
          color: #1f2937;
          cursor: pointer;
          border-bottom: 1px solid #e5e7eb;
        }

        select option:hover,
        select option:focus {
          background-color: #f3f4f6 !important;
          color: #1f2937;
        }

        select option:checked {
          background-color: #e5e7eb !important;
          color: #1f2937;
          font-weight: 500;
        }

        .custom-select-container {
          position: relative;
          width: 100%;
        }

        .custom-select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 10;
        }

        select::-webkit-scrollbar {
          width: 8px;
        }

        select::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        select::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }

        select::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        @supports (scrollbar-color: #9ca3af #f3f4f6) {
          select {
            scrollbar-color: #9ca3af #f3f4f6;
            scrollbar-width: thin;
          }
        }

        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          select {
            background-color: white;
          }

          select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
          }

          select option {
            background-color: white;
            color: #1f2937;
          }
        }

        @-moz-document url-prefix() {
          select {
            background-color: white;
            text-indent: 0;
          }

          select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
          }

          select option {
            background-color: white;
            color: #1f2937;
          }
        }

        select option:checked::before {
          content: '✓';
          position: absolute;
          left: 6px;
          color: #3b82f6;
        }

        select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
        }

        select:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
          opacity: 0.7;
        }

        select option {
          padding: 8px 12px;
          margin: 2px 0;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        select option:hover {
          background-color: #f3f4f6;
          transform: translateX(2px);
        }

        select option:checked {
          background-color: #e5e7eb;
          font-weight: 500;
        }

        .date-history-item {
          transition: all 0.2s ease;
        }

        .date-history-item:hover {
          background-color: #f3f4f6;
          transform: translateX(2px);
        }
      `}</style>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="6865219846"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-blue-600 to-red-500 p-1 rounded-xl shadow-lg mb-6">
            <div className="mx-4 my-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
              <p className="mt-3 max-w-2xl text-white/90">{t('description')}</p>
            </div>

            <div className="bg-white rounded-lg p-6 md:p-8">
              <div className="flex mb-4 justify-between">
                <div className="inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => handleTabChange('toNepali')}
                    className={`px-4 py-2 text-sm rounded-md font-bold transition-all duration-200 ${
                      activeTab === 'toNepali'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={t('toNepali')}
                  >
                    {t('toNepali')}
                  </button>
                  <button
                    onClick={() => handleTabChange('toEnglish')}
                    className={`px-4 py-2 text-sm rounded-md font-bold transition-all duration-200 ${
                      activeTab === 'toEnglish'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={t('toEnglish')}
                  >
                    {t('toEnglish')}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start"
                >
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{t('error')}</p>
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              {isAnimating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-gray-100 rounded-lg text-center"
                >
                  {t('processing')}
                </motion.div>
              )}

              {conversionResult?.success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mb-6 p-4 rounded-lg border shadow-md w-fit min-w-[320px] ${
                    activeTab === 'toNepali'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base">{t('convertedDate')}:</h3>
                      <p className="text-3xl font-bold mb-2">{conversionResult.date}</p>
                      <p className="text-lg text-gray-600">{conversionResult.formattedDate}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div
                className={`space-y-6 ${
                  isAnimating ? 'opacity-50' : 'opacity-100'
                } transition-opacity duration-300`}
              >
                {activeTab === 'toNepali' && (
                  <div className="space-y-6">
                    <DateSelector 
                      isNepali={false}
                      dateState={englishDate}
                      setDateState={setEnglishDate}
                      yearOptions={englishYearOptions}
                      monthOptions={englishMonthOptions}
                      getDayOptions={getEnglishDayOptions}
                      t={t}
                    />

                    <button
                      onClick={convertToNepali}
                      disabled={isAnimating}
                      className={`w-full mt-8 py-4 px-4 rounded-xl font-medium transition duration-200 text-lg ${
                        isAnimating
                          ? 'bg-blue-400 text-white cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                      }`}
                      aria-busy={isAnimating}
                      aria-label={t('convertToNepali')}
                    >
                      {isAnimating ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('converting')}
                        </div>
                      ) : (
                        t('convert')
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'toEnglish' && (
                  <div className="space-y-6">
                    <DateSelector 
                      isNepali={true}
                      dateState={nepaliDate}
                      setDateState={setNepaliDate}
                      yearOptions={nepaliYearOptions}
                      monthOptions={nepaliMonthOptions}
                      getDayOptions={getNepaliDayOptions}
                      t={t}
                    />

                    <button
                      onClick={convertToEnglish}
                      disabled={isAnimating}
                      className={`w-full mt-8 py-4 px-4 rounded-xl font-medium transition duration-200 text-lg ${
                        isAnimating
                          ? 'bg-red-400 text-white cursor-wait'
                          : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                      }`}
                      aria-busy={isAnimating}
                      aria-label={t('convertToEnglish')}
                    >
                      {isAnimating ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('converting')}
                        </div>
                      ) : (
                        t('convert')
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="9978468343"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}