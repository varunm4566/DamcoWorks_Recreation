/**
 * Generic CSV export from headers + rows arrays
 * @param {string[]} headers
 * @param {Array<Array>} rows
 * @param {string} filename
 */
export function exportCsv(headers, rows, filename = 'export.csv') {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export array of customer objects to CSV and trigger browser download
 * @param {Array} customers - array of customer row objects
 * @param {string} currency - 'usd' or 'inr'
 */
export function exportCustomersCsv(customers, currency = 'usd') {
  const salesKey = currency === 'usd' ? 'booked_sales_usd' : 'booked_sales_inr';
  const revenueKey = currency === 'usd' ? 'revenue_usd' : 'revenue_inr';

  const headers = [
    'Customer', 'Status', 'Booked Sales', 'Revenue', 'Tier', 'CSAT Score',
    'Sales Owner', 'Client Partner', 'CP Ownership', 'Incentive Eligibility',
    'Industry', 'Referenceable',
  ];

  const rows = customers.map((customer) => [
    customer.name,
    customer.status,
    customer[salesKey],
    customer[revenueKey],
    customer.tier || '',
    customer.csat_score || '',
    customer.sales_owner || '',
    customer.client_partner || '',
    customer.cp_ownership ? 'Yes' : 'No',
    customer.incentive_eligibility ? 'Yes' : 'No',
    customer.industry || '',
    customer.referenceable ? 'Yes' : 'No',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
