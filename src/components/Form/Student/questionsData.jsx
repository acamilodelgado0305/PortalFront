// questionsData.js
import {
  BookOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  SignatureOutlined
} from "@ant-design/icons";

export const questions = [
  {
    id: 1,
    question: "¿Qué quieres aprender?",
    options: [
      {
        text: "Idiomas",
        svg: (<BookOutlined />),
        suboptions: [
          { text: "Inglés" },
          { text: "Español" },
          { text: "Francés" },
          { text: "Alemán" },
          { text: "Mandarín" },
          { text: "Italiano" },
          { text: "Portugués" },
          { text: "Ruso" },
          { text: "Árabe" },
          { text: "Japonés" },
          { text: "Coreano" },
          { text: "Holandés" },
          { text: "Sueco" },
          { text: "Noruego" },
          { text: "Finlandés" },
          { text: "Griego" },
          { text: "Turco" },
          { text: "Hebreo" },
          { text: "Húngaro" },
          { text: "Checo" }
        ]

      },
      {
        text: "Arte",
        svg: (<SignatureOutlined />),
        suboptions: [
          { text: "Pintura" },
          { text: "Escultura" },
          { text: "Música" },
          { text: "Teatro" }
        ]
      },
      {
        text: "Matemáticas",
        svg: (<CalculatorOutlined />),
        suboptions: [
          { text: "Álgebra" },
          { text: "Geometría" },
          { text: "Cálculo" },
          { text: "Estadística" }
        ]
      },
      {
        text: "Ciencias Naturales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Física" },
          { text: "Química" },
          { text: "Biología" }
        ]
      },
      {
        text: "Ciencias Sociales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Historia" },
          { text: "Psicología" },
          { text: "Sociología" }
        ]
      },
      {
        text: "Ciencia y Tecnología",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Ingeniería" },
          { text: "Astronomía" },
          { text: "Ciencias de la Computación" }
        ]
      },
      {
        text: "Lenguajes de Programación",
        svg: (<BookOutlined />),
        suboptions: [
          { text: "JavaScript" },
          { text: "Python" },
          { text: "Java" },
          { text: "C++" }
        ]
      },
      {
        text: "Negocios",
        svg: (<CalculatorOutlined />),
        suboptions: [
          { text: "Finanzas" },
          { text: "Gestión" },
          { text: "Marketing" }
        ]
      },
      {
        text: "Salud",
        svg: (<CalculatorOutlined />),
        suboptions: [
          { text: "Nutrición" },
          { text: "Fisioterapia" },
          { text: "Salud Mental" }
        ]
      },
      {
        text: "Otro (especificar)",
        svg: (<SignatureOutlined />),
        input: true, // Agregar un campo de entrada
        placeholder: "Especifica tu opción aquí" // Placeholder para el input
      }

    ],
  },
  {
    id: 2,
    question: "¿Cuál es tu nivel de inglés?",
    options: [
      { text: "Soy principiante" },
      { text: "Conozco lo básico" },
      { text: "Puedo conversar" },
      { text: "Me desenvuelvo con soltura en la mayoría de las conversaciones" },
    ],
  },
  {
    id: 3,
    question: "¿Buscas un acento o cultura concretos?",
    options: [
      { text: "Canadá" },
      { text: "España" },
      { text: "Estados Unidos" },
      { text: "Reino Unido" },
      { text: "República Dominicana" },
    ],
  },
  {
    id: 4,
    question: "¿Algún interés en concreto?",
    options: [
      { text: "Inglés estadounidense" },
      { text: "Inglés de negocios" },
      { text: "Inglés conversacional" },
      { text: "BEC" },
      { text: "Inglés para niños" },
    ],
  },
  {
    id: 5,
    question: "¿Cuándo te vienen bien las clases?",
    options: [
      { text: "Mañanas" },
      { text: "Tardes" },
      { text: "Noches" },
      { text: "Fines de semana" },
      { text: "Horario flexible" },
    ],
  },
  {
    id: 6,
    question: "¿Cuál es tu presupuesto para una clase?",
    type: "slider",
    min: 1,
    max: 40,
    step: 1,
    unit: "US$",
  },
];
