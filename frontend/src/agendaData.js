export const agendaData = {
  Jueves: {
    date: '16 Abril',
    title: 'Jueves 16 de Abril',
    items: [
      {
        id: 'bienvenida_jueves',
        time: '18:00 - 18:10',
        title: 'Bienvenida'
      },
      {
        id: 'retos_diagnosticos',
        time: '18:10 - 19:10',
        title: 'Retos Diagnosticos de MCHo:',
        description: 'Desde la clínica hasta la imagen',
        speakers: ['Dr. Enrique Berrios', 'Dra. Julieta Morales']
      },
      {
        id: 'mch_obstructiva_1',
        time: '19:10 - 19:40',
        title: 'MCH Obstructiva:',
        description: 'Limitaciones del tratamiento convencional y retos en la práctica clínica',
        speakers: ['Dr. Adrián Fernández']
      },
      {
        id: 'break_jueves',
        time: '19:40 - 19:55',
        title: 'Break'
      },
      {
        id: 'mch_obstructiva_2',
        time: '19:55 - 20:55',
        title: 'MCH Obstructiva:',
        description: 'Evolución del tratamiento farmacológico hasta terapias dirigidas. “CENA”',
        speakers: ['Dr. Enrique Berrios']
      }
    ]
  },
  Viernes: {
    date: '17 Abril',
    title: 'Viernes 17 de Abril',
    items: [
      {
        id: 'desayuno_viernes',
        time: '8:00 - 09:00',
        title: 'Desayuno'
      },
      {
        id: 'inhibicion_miosina',
        time: '9:00 - 10:00',
        title: 'La Inhibición de la miosina cardíaca:',
        description: 'Rompiendo paradigmas en el tratamiento de MCHo',
        speakers: ['Dr. Roberto Barriales']
      },
      {
        id: 'evidencia_clinica',
        time: '10:00 - 10:45',
        title: 'De la evidencia clínica de largo plazo hacia datos del mundo real',
        speakers: ['Dr. Adrián Fernández']
      },
      {
        id: 'panel_discusion',
        time: '10:45 - 11:15',
        title: 'Panel de discusión',
        speakers: ['Dr. Roberto Barriales', 'Dr. Adrián Fernández', 'Dr. Guillermo Antonio Llamas']
      },
      {
        id: 'break_viernes',
        time: '11:15 - 11:30',
        title: 'Break'
      },
      {
        id: 'ruta_diagnostico',
        time: '11:30 - 12:45',
        title: 'La Ruta del diagnóstico:',
        description: 'Resolución Casos Clínicos',
        speakers: ['Dra. Zuilma Vázquez', 'Dra. Jennifer Armenta', 'Dra. Julieta Morales']
      },
      {
        id: 'closing_remarks',
        time: '12:45 - 13:00',
        title: 'Closing Remarks',
        speakers: ['Dr. Guillermo Antonio Llamas']
      },
      {
        id: 'cierre_evento',
        time: '13:00 - 13:15',
        title: 'Cierre evento'
      },
      {
        id: 'encuesta_salida',
        time: '13:00 - 13:15',
        title: 'Encuesta Salida'
      },
      {
        id: 'comida_viernes',
        time: '13:15 - 14:15',
        title: 'Comida'
      }
    ]
  }
};

// Flatten version for compatibility with components expecting an array
export const agendaEvents = [
  ...agendaData.Jueves.items,
  ...agendaData.Viernes.items
];
