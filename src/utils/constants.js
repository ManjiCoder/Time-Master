// Holidays List
export const holidayDetails = {
  // 2024
  1706207400000: { date: '26-Jan-2024', desc: 'Republic Days' },
  1711305000000: { date: '25-Mar-2024', desc: 'Holi' },
  1712773800000: { date: '11-Apr-2024', desc: 'Ramzan Eid' },
  1714501800000: { date: '01-May-2024', desc: 'Maharashtra Day' },
  1716143400000: { date: '20-May-2024', desc: 'Election Day' },
  1723660200000: { date: '15-Aug-2024', desc: 'Independence Day' },
  1725647400000: { date: '07-Sep-2024', desc: 'Ganesh Chaturthi' },
  1727807400000: { date: '02-Oct-2024', desc: 'Mahatma Gandhi Jayanti' },
  1728671400000: { date: '12-Oct-2024', desc: 'Dussehra' },
  1730399400000: { date: '01-Nov-2024', desc: 'Diwali' },
  1735065000000: { date: '25-Dec-2024', desc: 'Christmas' },
  // 2025
  [new Date('2025-01-01').setHours(0, 0, 0, 0)]: { date: '01-Jan-2025', desc: 'New Year’s Day' },
  [new Date('2025-01-26').setHours(0, 0, 0, 0)]: { date: '26-Jan-2024', desc: 'Republic Day' },
  [new Date('2025-03-14').setHours(0, 0, 0, 0)]: { date: '14-Mar-2025', desc: 'Holi' },
  [new Date('2025-03-31').setHours(0, 0, 0, 0)]: { date: '31-Mar-2025', desc: 'Ramzan Eid' },
  [new Date('2025-05-01').setHours(0, 0, 0, 0)]: { date: '01-May-2025', desc: 'Maharashtra Day' },
  [new Date('2025-08-15').setHours(0, 0, 0, 0)]: { date: '15-Aug-2025', desc: 'Independence Day' },
  [new Date('2025-08-27').setHours(0, 0, 0, 0)]: { date: '27-Aug-2025', desc: 'Ganesh Chaturthi' },
  [new Date('2025-08-09').setHours(0, 0, 0, 0)]: { date: '09-Aug-2025', desc: 'Raksha Bandhan' },
  [new Date('2025-10-02').setHours(0, 0, 0, 0)]: { date: '02-Oct-2025', desc: 'Gandhi Jayanti' },
  [new Date('2025-10-20').setHours(0, 0, 0, 0)]: { date: '20-Oct-2025', desc: 'Diwali' },
  [new Date('2025-12-25').setHours(0, 0, 0, 0)]: { date: '25-Dec-2025', desc: 'Christmas' },
};

export const toastDuration = 1000;

// Remarks List
export const remarkObj = {
  leave: 'Leave',
  floatingLeave: 'Floating Leave',
  halfDayLeave: 'Half Day Leave',
  workFromHome: 'Work From Home',
  others: 'Others',
};
export const formatAmt = {
  style: 'currency',
  currency: 'INR',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

// For Backend
export const formTypes = Object.freeze({
  feature: 'Feature Request',
  bug: 'Bug Report',
});
