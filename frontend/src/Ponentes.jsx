import React from 'react';
import './Agenda.css';
import './Ponentes.css';

const BIO_CARDIOLOGIA = [
  'Doctor en Medicina por la Universidad de El Salvador, Especialista en Medicina Interna y Cardiología, con alta especialidad en Imagen Cardíaca por el Instituto Nacional de Cardiología Ignacio Chávez.',
  'Maestría y Doctorado en Ciencias Médicas por la Universidad Nacional Autónoma de México y Máster en Cardiopatías Hereditarias.',
  'Jefe del Departamento de Consulta Externa y Coordinador de las Clínicas de Miocardiopatías, Aorta y Amiloidosis, así como del equipo multidisciplinario de Miocardiopatía Hipertrófica obstructiva en el Instituto Nacional de Cardiología Ignacio Chávez.',
  'Jefe de Investigación y coordinador de imagen cardiovascular en el Hospital Español de México.',
  'Miembro del Sistema Nacional de Investigadores (CONACYT), Fellow del American College of Cardiology y de la European Society of Cardiology.',
  'Editor y profesor de posgrado, pregrado y formación en enfermería.',
].join('\n');

const PONENTES = [
  { id: 1, nombre: 'Dr. Cristian Ramos Peñafiel', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_cristian_ramos.png', biografia_larga: BIO_CARDIOLOGIA },
  { id: 2, nombre: 'Dra. Aline Guillermina Ramirez', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_aline_ramirez.png', biografia_larga: [
    'Hematóloga adscrita al Servicio de Hematología del Hospital de Especialidades "Dr. Antonio Fraga Mouret" del Centro Médico Nacional La Raza, IMSS.',
    'Su práctica clínica e investigación se centran en las gammapatías monoclonales y el mieloma multiple, liderado proyectos de investigación, participado en colaboraciones nacionales e internacionales y publicando en colaboración con COMMIMEX EL Consenso Mexicano de Mieloma Múltiple 2026.',
    'Asimismo, impulsa iniciativas de educación médica continua y coordina el primer Diplomado en Gammapatías Monoclonales con validez oficial en México.',
  ].join('\n') },
  { id: 3, nombre: 'Dra. Carolina Garcia Castillo', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_carolina_garcia.png', biografia_larga: [
    'Hematóloga egresada de la Universidad Nacional Autónoma de México, con formación de especialidad en el Centro Médico Nacional La Raza. Actualmente desarrolla su práctica profesional en el Hospital Central Militar y cuenta con una destacada trayectoria asistencial, académica y de liderazgo dentro de la hematología mexicana.',
    'Se ha desempeñado como Jefa del Servicio de Hematología del Hospital Central Militar y la coordinación del programa de trasplante de células progenitoras hematopoyéticas de la Secretaría de la Defensa Nacional, así como investigadora clínica en diversas áreas de la hematología como el Mieloma Múltiple.',
  ].join('\n') },
  { id: 4, nombre: 'Dr. Gabriel Barragan', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_gabriel_barragan.png', biografia_larga: [
    'Médico internista y hematólogo, egresado del Hospital General de México "Dr. Eduardo Liceaga".',
    'Actualmente se desempeña como médico especialista en el Hospital Regional de Alta Especialidad de Oaxaca y es profesor titular de la Especialidad de Hematología en el HRAEO avalado por la UNAM.',
    'Cuenta con una destacada trayectoria asistencial, académica y de investigación, con diversas publicaciones y presentaciones científicas en congresos nacionales e internacionales.',
  ].join('\n') },
  { id: 5, nombre: 'Dr. Joaquin Martinez Lopez', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_joaquin_martinez.png', biografia_larga: [
    'Hematólogo y Jefe del Servicio de Hematología y Hemoterapia del Hospital Universitario 12 de Octubre de Madrid y Catedrático de Hematología en la Universidad Complutense de Madrid.',
    'Es reconocido internacionalmente por sus contribuciones en mieloma múltiple, neoplasias mieloproliferativas y terapias celulares avanzadas. Ha liderado numerosos estudios clínicos y programas de investigación traslacional, con una destacada producción científica que incluye cientos de publicaciones en revistas de alto impacto y una amplia participación en congresos internacionales.',
    'Su trabajo se ha centrado en el desarrollo de nuevas estrategias terapéuticas, biomarcadores pronósticos y medicina de precisión para pacientes con enfermedades hematológicas. Actualmente es considerado una de las principales referencias europeas en el abordaje del mieloma múltiple.',
  ].join('\n') },
  { id: 6, nombre: 'Dr. Kenny Mauricio Gálvez Cárdenas', puesto: 'HEMATOLOGÍA', foto: '/assets/ponente_kenny_galvez.png', biografia_larga: BIO_CARDIOLOGIA },
  { id: 7, nombre: 'Dra. Gabriela Hernández Rivera', puesto: 'Hematóloga', foto: '/assets/ponente_gabriela_hernandez.png', biografia_larga: 'Egresada de la Universidad Nacional Autónoma de México como médico y especialista en medicina interna y hematología por el Instituto Nacional de Ciencias Médicas y Nutrición Salvador Zubirán, Especialista en trasplante de células hepatopoyéticas por el Hospital San Louis en Paris, Francia y actualmente Directora médica global para Iberdomide en BMS Suiza.' },
  { id: 8, nombre: 'Carla Iliana Da Passano', puesto: 'Omnichannel Specialist para BMS Mexico', foto: '/assets/ponente_carla_da_passano.jpeg', biografia_larga: '' },
];

function Ponentes({ onBack, onBiografia }) {
  const ponentes = PONENTES;

  return (
    <div className="ponentes-speakers-container animate-fade-in">
      <header className="agenda-header">
        <div className="agenda-header-text">
          <h1>Ponentes</h1>
          <div className="agenda-subtitle">
            <span className="material-icons-round">event</span>
            <span>BLOOD 2026</span>
          </div>
        </div>
        <img src="/assets/icon_notification_bell.png" alt="" className="agenda-header-bell" />
        <div className="back-btn-circle" onClick={onBack}>
          <span className="material-icons-round" style={{ color: 'white' }}>chevron_left</span>
        </div>
      </header>

      <div className="ponentes-intro">
        <h2>Conoce a nuestros ponentes</h2>
        <p>Descubre a los expertos que darán vida al evento. Explora su especialidad, trayectoria y experiencia profesional.</p>
      </div>

      <div className="ponentes-speakers-grid">
        {ponentes.map(p => (
          <div className="ponente-speaker-card" key={p.id}>
            <div className="ponente-photo-wrap">
              <img src={p.foto} alt={p.nombre} className="ponente-photo" />
            </div>
            <h3 className="ponente-name">{p.nombre}</h3>
            <button className="btn-conoce-mas" onClick={() => onBiografia(p)}>
              Conoce más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ponentes;
