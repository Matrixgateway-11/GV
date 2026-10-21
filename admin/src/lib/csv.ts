import { countryName, fullDateTime } from './format';
import type { Enquiry } from './types';

const cell = (value: string | null | undefined) => {
  let text = (value ?? '').replace(/\r?\n/g, ' ');
  // Stop spreadsheet apps from treating a value as a formula. A phone number ("+49 151 …") just gets a
  // leading space, so it shows as typed; anything else starting with = + - @ gets the usual apostrophe.
  if (/^\+[\d\s().-]+$/.test(text)) text = ` ${text}`;
  else if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

/** Downloads the given enquiries as a CSV file that opens cleanly in Excel / Google Sheets. */
export function downloadEnquiriesCsv(enquiries: Enquiry[]) {
  const header = ['Received', 'Name', 'Email', 'Phone', 'Company', 'Country', 'Interested in', 'Message', 'Status', 'Notes', 'Sent from'];
  const lines = enquiries.map((enquiry) =>
    [
      fullDateTime(enquiry.created_at),
      enquiry.name,
      enquiry.email,
      enquiry.phone,
      enquiry.company,
      enquiry.country,
      enquiry.interests.join(', '),
      enquiry.message,
      enquiry.status,
      enquiry.notes,
      enquiry.ip_country ? countryName(enquiry.ip_country) : '',
    ]
      .map(cell)
      .join(','),
  );
  const blob = new Blob(['﻿' + [header.map(cell).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
