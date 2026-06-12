import { fetchTransactions } from './api';

describe('fetchTransactions', () => {
  const mockData = [
    {
      transactionId: 'TXN-001',
      customerId: 'CUST-001',
      firstName: 'Alice',
      lastName: 'Johnson',
      purchaseDate: 'Mar-05-2026',
      productPurchase: 'Smart TV 55"',
      price: 120.0,
    },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches transactions from public JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchTransactions();

    expect(global.fetch).toHaveBeenCalledWith('/transactions.json');
    expect(result).toEqual(mockData);
  });

  test('throws an error when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchTransactions()).rejects.toThrow('Failed to load transactions: 404 Not Found');
  });

  test('throws an error for invalid JSON data format', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ invalid: 'data' }),
    });

    await expect(fetchTransactions()).rejects.toThrow('Invalid mock transaction data format');
  });
});
