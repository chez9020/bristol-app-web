const CODIGOS = {
  'MEXICO': 'MEX',
  'AIFA': 'NLU',
  'QUERETARO': 'QRO',
  'MONTERREY': 'MTY',
  'GUADALAJARA': 'GDL',
  'VERACRUZ': 'VER',
  'LEON': 'BJX',
  'PUEBLA': 'PBC',
  'OAXACA': 'OAX',
  'SAN LUIS POTOSI': 'SLP',
  'MEDELLIN': 'MDE',
  'BOGOTA': 'BOG',
  'PARIS': 'CDG',
  'MADRID': 'MAD',
};

export const cityCode = (ruta) => {
  const dest = ruta.split(' - ')[1];
  return CODIGOS[dest] || dest.slice(0, 3);
};

// Salidas y pick ups confirmados por el cliente (PICK UPS SALIDAS BLOOD.xlsx).
export const VUELOS = [
  { dia: '29', vuelo: 'AM 547', ruta: 'CANCUN - MEXICO', sale: '17:30', pickup: '15:00' },
  { dia: '29', vuelo: 'AF 651', ruta: 'CANCUN - PARIS', sale: '20:15', pickup: '16:15' },

  { dia: '30', vuelo: 'VB 2102', ruta: 'CANCUN - VERACRUZ', sale: '06:00', pickup: '04:00' },
  { dia: '30', vuelo: 'AM 515', ruta: 'CANCUN - MEXICO', sale: '09:10', pickup: '06:40' },
  { dia: '30', vuelo: 'VB 2164', ruta: 'CANCUN - MONTERREY', sale: '10:10', pickup: '07:40' },
  { dia: '30', vuelo: 'Y4 1049', ruta: 'CANCUN - GUADALAJARA', sale: '10:40', pickup: '08:05' },
  { dia: '30', vuelo: 'VB 2278', ruta: 'CANCUN - AIFA', sale: '10:40', pickup: '08:10' },
  { dia: '30', vuelo: 'AV 269', ruta: 'CANCUN - MEDELLIN', sale: '12:35', pickup: '08:30' },
  { dia: '30', vuelo: 'Y4 3500', ruta: 'CANCUN - LEON', sale: '11:16', pickup: '08:45' },
  { dia: '30', vuelo: 'AM 523', ruta: 'CANCUN - MEXICO', sale: '11:21', pickup: '08:45' },
  { dia: '30', vuelo: 'Y4 3552', ruta: 'CANCUN - PUEBLA', sale: '11:46', pickup: '09:15' },
  { dia: '30', vuelo: 'Y4 3598', ruta: 'CANCUN - OAXACA', sale: '12:51', pickup: '10:00' },
  { dia: '30', vuelo: 'Y4 1055', ruta: 'CANCUN - GUADALAJARA', sale: '12:49', pickup: '10:20' },
  { dia: '30', vuelo: 'Y4 3598', ruta: 'CANCUN - OAXACA', sale: '12:51', pickup: '10:20' },
  { dia: '30', vuelo: 'VB 2062', ruta: 'CANCUN - QUERETARO', sale: '13:45', pickup: '11:15' },
  { dia: '30', vuelo: 'AM 535', ruta: 'CANCUN - MEXICO', sale: '14:30', pickup: '12:00' },
  { dia: '30', vuelo: 'AV 69', ruta: 'CANCUN - BOGOTA', sale: '16:50', pickup: '12:50' },
  { dia: '30', vuelo: 'Y4 3588', ruta: 'CANCUN - SAN LUIS POTOSI', sale: '17:45', pickup: '15:15' },
  { dia: '30', vuelo: 'AM 551', ruta: 'CANCUN - MEXICO', sale: '18:30', pickup: '16:00' },
  { dia: '30', vuelo: 'UX 64', ruta: 'CANCUN - MADRID', sale: '20:40', pickup: '16:40' },
  { dia: '30', vuelo: 'AM 555', ruta: 'CANCUN - MEXICO', sale: '19:38', pickup: '17:10' },
];
