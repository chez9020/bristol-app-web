export const agendaData = {
  Viernes: {
    date: '28 Agosto',
    title: 'Viernes 28 de Agosto',
    items: [
      {
        id: 'panel_1',
        time: '19:30 - 20:10',
        description: 'Perlas clínicas para optimizar el manejo del SMD de riesgo bajo',
        speakers: ['Dr. Gabriel Barragán']
      },
      {
        id: 'panel_2',
        time: '20:10 - 20:30',
        description: 'Q&A',
        speakers: ['Dr. Gabriel Barragán']
      },
      {
        id: 'panel_3',
        time: '20:30 - 21:00',
        description: 'Actividades de entrenamiento aplicado en herramientas de Inteligencia Artificial (IA)',
        speakers: ['Carla Da Passano']
      }
    ]
  },
  Sabado: {
    date: '29 Agosto',
    title: 'Sábado 29 de Agosto',
    items: [
      {
        id: 'desayuno_sabado',
        time: '08:00 - 09:00',
        description: 'Desayuno / Entrenamiento aplicado en herramientas de Inteligencia Artificial (IA)',
        speakers: ['(Disponible desde 8:30 am)']
      },
      {
        id: 'biologia_mm',
        time: '09:00 - 09:30',
        description: 'Biología del Mieloma Múltiple',
        speakers: ['Dra. Aline Ramírez']
      },
      {
        id: 'inmunomodulacion',
        time: '09:30 - 10:00',
        description: 'Inmunomodulación y resistencia a IMiDs: implicaciones en el tratamiento del mieloma múltiple.',
        speakers: ['Dr. Ramos Peñafiel']
      },
      {
        id: 'panel_1_sabado',
        time: '10:00 - 10:40',
        description: 'Retos actuales en el diagnóstico y estratificación de riesgo en Mieloma Múltiple',
        speakers: ['Coordinador: Dr. Ramos Peñafiel', 'Panelistas: Dra. Aline Ramírez y Dr. Joaquín Martínez']
      },
      {
        id: 'qa_1_sabado',
        time: '10:40 - 11:00',
        description: 'Q&A',
        speakers: ['Coordinador: Dr. Ramos Peñafiel', 'Panelistas: Dra. Aline Ramírez y Dr. Joaquín Martínez']
      },
      {
        id: 'pausa_sabado',
        time: '11:00 - 11:20',
        description: 'Pausa académica y entrenamiento aplicado en herramientas de Inteligencia Artificial (IA)'
      },
      {
        id: 'panel_6_sabado',
        time: '11:20 - 11:50',
        description: 'Estrategias actuales para el tratamiento del mieloma múltiple de nuevo diagnóstico',
        speakers: ['Dr. Joaquín Martínez']
      },
      {
        id: 'enfermedad_minima',
        time: '11:50 - 12:20',
        description: 'Enfermedad mínima residual: impacto en decisiones terapéuticas e innovación en mieloma múltiple',
        speakers: ['Dr. Kenny Gálvez']
      },
      {
        id: 'panel_2_sabado',
        time: '12:20 - 13:00',
        description: 'Práctica clínica en México: enfoques actuales para tratar el mieloma múltiple',
        speakers: ['Coordinadora: Dra. Aline Ramírez', 'Panelistas: Dr. Ramos Peñafiel, Dr. Gabriel Barragán y Dra. Carolina García']
      },
      {
        id: 'qa_2_sabado',
        time: '13:00 - 13:20',
        description: 'Q&A',
        speakers: ['Coordinadora: Dra. Aline Ramírez', 'Panelistas: Dr. Ramos Peñafiel, Dr. Gabriel Barragán, Dra. Carolina García, Dr. Kenny Gálvez y Dr. Joaquín Martínez']
      },
      {
        id: 'comida_sabado',
        time: '13:20 - 14:30',
        description: 'Comida en restaurante casa madre / Entrenamiento aplicado en herramientas de Inteligencia Artificial (IA)'
      },
      {
        id: 'tratamiento_recaida',
        time: '14:30 - 15:00',
        description: 'Tratamiento actual del mieloma múltiple en recaída o refractario',
        speakers: ['Dr. Joaquín Martínez']
      },
      {
        id: 'panel_3_sabado',
        time: '15:00 - 15:40',
        description: 'Manejo de eventos adversos y secuenciación terapéutica en mieloma múltiple: decisiones en la práctica clínica',
        speakers: ['Coordinador: Dr. Gabriel Barragán', 'Panelistas: Dr. Kenny Gálvez, Dr. Joaquín Martínez y Dra. Carolina García']
      },
      {
        id: 'futuro_tratamiento',
        time: '15:40 - 16:10',
        description: 'Futuro del tratamiento del mieloma múltiple en recaída o refractario: pipeline y próximos pasos',
        speakers: ['Dra. Gabriela Hernández']
      },
      {
        id: 'panel_4_sabado',
        time: '16:10 - 16:30',
        title: 'Q&A',
        speakers: ['Coordinador: Dr. Gabriel Barragán', 'Panelistas: Dr. Kenny Gálvez, Dr. Joaquín Martínez, Dra. Carolina García y Dra. Gabriela Hernández']
      },
      {
        id: 'aprendizajes_sabado',
        time: '16:30 - 17:00',
        description: 'Mensajes finales: Aprendizajes clave para la práctica clínica en mieloma múltiple',
        speakers: ['Dra. Aline Ramírez']
      }
    ]
  }
};

// Flatten version for compatibility with components expecting an array
export const agendaEvents = [
  ...agendaData.Viernes.items,
  ...agendaData.Sabado.items
];
