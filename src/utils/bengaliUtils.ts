// Utility functions for Bengali date, numbers, and formatting

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  return str.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
}

const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

export function formatBengaliDate(dateInput?: string | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  const dayName = BENGALI_DAYS[d.getDay()];
  const dayNum = toBengaliNumber(d.getDate());
  const monthName = BENGALI_MONTHS[d.getMonth()];
  const yearNum = toBengaliNumber(d.getFullYear());

  return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
}

export function formatTimeAgoBengali(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 60) {
    return 'এইমাত্র';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${toBengaliNumber(diffMin)} মিনিট আগে`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${toBengaliNumber(diffHours)} ঘণ্টা আগে`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${toBengaliNumber(diffDays)} দিন আগে`;
  }

  return formatBengaliDate(d);
}
