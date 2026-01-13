// Mock analytics data - 30 items
export const analyticsData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    id: `analytics-${i + 1}`,
    date: date.toISOString().split('T')[0],
    metric: ['repairs', 'revenue', 'customers', 'satisfaction'][i % 4],
    value: Math.floor(Math.random() * 1000) + 100,
    change_percent: Math.round((Math.random() * 40 - 20) * 10) / 10,
  };
});

// Repair status types
export type RepairStatus = 
  | 'pending_shipment'
  | 'in_transit'
  | 'received'
  | 'diagnosing'
  | 'awaiting_approval'
  | 'in_repair'
  | 'completed'
  | 'shipped_back'
  | 'delivered';

export const repairStatusLabels: Record<RepairStatus, string> = {
  pending_shipment: 'Oczekuje na wysyłkę',
  in_transit: 'W transporcie',
  received: 'Odebrano w serwisie',
  diagnosing: 'W diagnozie',
  awaiting_approval: 'Oczekuje na akceptację',
  in_repair: 'W naprawie',
  completed: 'Naprawa zakończona',
  shipped_back: 'Wysłano do klienta',
  delivered: 'Dostarczono',
};

// Mock repairs data
export const mockRepairs = [
  {
    id: 'REP-2025-001',
    deviceType: 'Laptop',
    brand: 'Dell',
    model: 'XPS 15',
    problemDescription: 'Laptop nie włącza się po zalaniu kawą. Przed zalaniem działał normalnie.',
    status: 'in_repair' as RepairStatus,
    createdAt: '2025-01-03T10:30:00Z',
    estimatedCost: 850,
    approvedCost: 850,
    trackingNumber: 'INP123456789',
  },
  {
    id: 'REP-2025-002',
    deviceType: 'PC',
    brand: 'Custom',
    model: 'Gaming PC',
    problemDescription: 'Karta graficzna RTX 3080 przegrzewa się i powoduje wyłączenia podczas gier.',
    status: 'awaiting_approval' as RepairStatus,
    createdAt: '2025-01-05T14:15:00Z',
    estimatedCost: 450,
    approvedCost: null,
    trackingNumber: 'INP987654321',
  },
  {
    id: 'REP-2025-003',
    deviceType: 'Laptop',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    problemDescription: 'Uszkodzona klawiatura - niektóre klawisze nie reagują.',
    status: 'completed' as RepairStatus,
    createdAt: '2024-12-28T09:00:00Z',
    estimatedCost: 320,
    approvedCost: 320,
    trackingNumber: 'DPD456789123',
  },
];

// Mock cost estimate items
export const mockCostEstimate = {
  repairId: 'REP-2025-002',
  items: [
    { name: 'Diagnostyka zaawansowana', price: 100, quantity: 1 },
    { name: 'Wymiana pasty termoprzewodzącej', price: 80, quantity: 1 },
    { name: 'Pasta termoprzewodząca premium', price: 45, quantity: 1 },
    { name: 'Czyszczenie układu chłodzenia', price: 75, quantity: 1 },
    { name: 'Wymiana padów termicznych', price: 150, quantity: 1 },
  ],
  laborCost: 0,
  totalCost: 450,
  warranty: '12 miesięcy',
  estimatedTime: '2-3 dni robocze',
};

// Mock paczkomaty locations
export const mockPaczkomaty = [
  { id: 'WAW01A', address: 'ul. Marszałkowska 100, Warszawa', city: 'Warszawa' },
  { id: 'WAW02B', address: 'ul. Puławska 45, Warszawa', city: 'Warszawa' },
  { id: 'KRK01A', address: 'ul. Długa 12, Kraków', city: 'Kraków' },
  { id: 'WRO01C', address: 'ul. Świdnicka 8, Wrocław', city: 'Wrocław' },
  { id: 'POZ01A', address: 'ul. Półwiejska 32, Poznań', city: 'Poznań' },
];

// Mock user data
export const mockUser = {
  id: 'user-1',
  email: 'jan.kowalski@email.com',
  firstName: 'Jan',
  lastName: 'Kowalski',
  phone: '+48 123 456 789',
  address: {
    street: 'ul. Przykładowa 15/3',
    city: 'Warszawa',
    postalCode: '00-001',
  },
};

// Dashboard stats
export const dashboardStats = [
  { label: 'Aktywne naprawy', value: 2, change: 0, icon: 'Wrench' },
  { label: 'Zakończone', value: 15, change: 3, icon: 'CheckCircle' },
  { label: 'Oczekujące', value: 1, change: -1, icon: 'Clock' },
  { label: 'Wydatki (PLN)', value: 2450, change: 12, icon: 'CreditCard' },
];
