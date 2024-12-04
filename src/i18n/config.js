import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    resources: {
      es: {
        translation: {
          loading: 'Cargando...',
          error: 'Error al cargar los profesores:',
          teachersAvailable: 'profesores disponibles para ajustarse a tus necesidades',
          noTeachersFound: 'No se encontraron profesores con los filtros seleccionados.',
          backButton: 'Regresar',
          presentationVideo: 'Video de presentación',
          mainTitle: 'Profesores particulares online: Prueba una clase',
          filters: {
            priceRange: 'Rango de precio',
            country: 'País',
            availability: 'Disponibilidad',
            specialty: 'Especialidad',
            language: 'Idioma',
            isNative: 'Hablante nativo',
            category: 'Categoría'
          },
          countries: {
            us: 'Estados Unidos',
            es: 'España',
            mx: 'México',
            ar: 'Argentina',
            co: 'Colombia',
            cl: 'Chile',
            pe: 'Perú',
            ve: 'Venezuela',
            gb: 'Reino Unido',
            ca: 'Canadá'
          },
          days: {
            monday: 'Lunes',
            tuesday: 'Martes',
            wednesday: 'Miércoles',
            thursday: 'Jueves',
            friday: 'Viernes',
            saturday: 'Sábado',
            sunday: 'Domingo'
          },
          specialties: {
            math: 'Matemáticas',
            english: 'Inglés',
            science: 'Ciencias',
            history: 'Historia',
            literature: 'Literatura',
            physics: 'Física',
            chemistry: 'Química'
          },
          languages: {
            spanish: 'Español',
            english: 'Inglés',
            french: 'Francés',
            german: 'Alemán',
            portuguese: 'Portugués',
            italian: 'Italiano'
          }
        }
      },
      en: {
        translation: {
          loading: 'Loading...',
          error: 'Error loading teachers:',
          teachersAvailable: 'teachers available to meet your needs',
          noTeachersFound: 'No teachers found with the selected filters.',
          backButton: 'Back',
          presentationVideo: 'Presentation video',
          mainTitle: 'Online private teachers: Try a class',
          filters: {
            priceRange: 'Price range',
            country: 'Country',
            availability: 'Availability',
            specialty: 'Specialty',
            language: 'Language',
            isNative: 'Native speaker',
            category: 'Category'
          },
          countries: {
            us: 'United States',
            es: 'Spain',
            mx: 'Mexico',
            ar: 'Argentina',
            co: 'Colombia',
            cl: 'Chile',
            pe: 'Peru',
            ve: 'Venezuela',
            gb: 'United Kingdom',
            ca: 'Canada'
          },
          days: {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
          },
          specialties: {
            math: 'Mathematics',
            english: 'English',
            science: 'Science',
            history: 'History',
            literature: 'Literature',
            physics: 'Physics',
            chemistry: 'Chemistry'
          },
          languages: {
            spanish: 'Spanish',
            english: 'English',
            french: 'French',
            german: 'German',
            portuguese: 'Portuguese',
            italian: 'Italian'
          }
        }
      }
    }
  });

export default i18n;