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
          { text: "Checo" },
          { text: "Polaco" },
          { text: "Danés" },
          { text: "Islandés" },
          { text: "Tailandés" },
          { text: "Vietnamita" },
          { text: "Indonesio" },
          { text: "Malayo" },
          { text: "Tagalo" },
          { text: "Hindi" },
          { text: "Bengalí" },
          { text: "Punjabi" },
          { text: "Ucraniano" },
          { text: "Serbio" },
          { text: "Croata" },
          { text: "Eslovaco" },
          { text: "Esloveno" },
          { text: "Letón" },
          { text: "Lituano" },
          { text: "Estonio" },
          { text: "Georgiano" },
          { text: "Armenio" },
          { text: "Tamil" },
          { text: "Telugu" },
          { text: "Persa" },
          { text: "Kazajo" },
          { text: "Uzbeco" },
          { text: "Romaní" }
        ]
      },

      {
        text: "Arte",
        svg: (<SignatureOutlined />),
        suboptions: [
          { text: "Pintura" },
          { text: "Escultura" },
          { text: "Arquitectura" },
          { text: "Música" },
          { text: "Poesía/Literatura" },
          { text: "Danza" },
          { text: "Artes Escénicas" }
        ]
      },

      {
        text: "Matemáticas",
        svg: (<CalculatorOutlined />),
        suboptions: [
          { text: "Aritmética" },
          { text: "Álgebra" },
          { text: "Geometría" },
          { text: "Trigonometría" },
          { text: "Cálculo" },
          { text: "Probabilidad y Estadística" },
          { text: "Teoría de Números" },
          { text: "Topología" }
        ]
      }
      ,
      {
        text: "Ciencias Naturales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Ciencia Natural" },
          { text: "Ciencia Física" },
          { text: "Física" },
          { text: "Química" },
          { text: "Astronomía" }
        ]
      }
      ,
      {
        text: "Ciencias Sociales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Arqueología" },
          { text: "Historia" },
          { text: "Geografía" },
          { text: "Derecho" },
          { text: "Lingüística" },
          { text: "Psicología" },
          { text: "Ciencia Política" },
          { text: "Antropología" },
          { text: "Economía" },
          { text: "Sociología" },
          { text: "Psicología Social" }
        ]
      },

      {
        text: "Tecnología",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Tecnología" },
          { text: "Desarrollo Web" },
          { text: "Diseño Gráfico" },
          { text: "Ciencia de Datos y Analítica" },
          { text: "Inteligencia Artificial y Aprendizaje Automático" },
          { text: "Ciberseguridad" },
          { text: "Desarrollo Web y Móvil" },
          { text: "Negocios" },
          { text: "Marketing Digital" },
          { text: "SEO" },
          { text: "Excel" },
          { text: "Power BI" },
          { text: "Finanzas y Contabilidad" },
          { text: "Coaching Online" }
        ]
      },
      {
        text: "Otro (especificar)",
        svg: (<SignatureOutlined />),
        input: true, // Agregar un campo de entrada
        placeholder: "Especifica tu opción aquí" // Placeholder para el input
      }

    ]
  },{
    id: 2,
    question: "¿Cuál es tu nivel de conocimiento actual?",
    options: [
      { text: "Soy principiante" },
      { text: "Conozco lo básico" },
      { text: "Me desenvuelvo con soltura en esta disiplina" },
    ],
  },  {
    id: 3,
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
    id: 4,
    question: "¿Cuál es tu presupuesto para una clase?",
    type: "slider",
    min: 1,
    max: 40,
    step: 1,
    unit: "US$",
  }] // para que tenga el mismo proporcion .length la barra de progreso

// Idiomas.suboptions ingles
  export const questionsEnglish = [   {
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
          { text: "Checo" },
          { text: "Polaco" },
          { text: "Danés" },
          { text: "Islandés" },
          { text: "Tailandés" },
          { text: "Vietnamita" },
          { text: "Indonesio" },
          { text: "Malayo" },
          { text: "Tagalo" },
          { text: "Hindi" },
          { text: "Bengalí" },
          { text: "Punjabi" },
          { text: "Ucraniano" },
          { text: "Serbio" },
          { text: "Croata" },
          { text: "Eslovaco" },
          { text: "Esloveno" },
          { text: "Letón" },
          { text: "Lituano" },
          { text: "Estonio" },
          { text: "Georgiano" },
          { text: "Armenio" },
          { text: "Tamil" },
          { text: "Telugu" },
          { text: "Persa" },
          { text: "Kazajo" },
          { text: "Uzbeco" },
          { text: "Romaní" }
        ]
      },

      {
        text: "Arte",
        svg: (<SignatureOutlined />),
        suboptions: [
          { text: "Pintura" },
          { text: "Escultura" },
          { text: "Arquitectura" },
          { text: "Música" },
          { text: "Poesía/Literatura" },
          { text: "Danza" },
          { text: "Artes Escénicas" }
        ]
      },

      {
        text: "Matemáticas",
        svg: (<CalculatorOutlined />),
        suboptions: [
          { text: "Aritmética" },
          { text: "Álgebra" },
          { text: "Geometría" },
          { text: "Trigonometría" },
          { text: "Cálculo" },
          { text: "Probabilidad y Estadística" },
          { text: "Teoría de Números" },
          { text: "Topología" }
        ]
      }
      ,
      {
        text: "Ciencias Naturales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Ciencia Natural" },
          { text: "Ciencia Física" },
          { text: "Física" },
          { text: "Química" },
          { text: "Astronomía" }
        ]
      }
      ,
      {
        text: "Ciencias Sociales",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Arqueología" },
          { text: "Historia" },
          { text: "Geografía" },
          { text: "Derecho" },
          { text: "Lingüística" },
          { text: "Psicología" },
          { text: "Ciencia Política" },
          { text: "Antropología" },
          { text: "Economía" },
          { text: "Sociología" },
          { text: "Psicología Social" }
        ]
      },

      {
        text: "Tecnología",
        svg: (<ExperimentOutlined />),
        suboptions: [
          { text: "Tecnología" },
          { text: "Desarrollo Web" },
          { text: "Diseño Gráfico" },
          { text: "Ciencia de Datos y Analítica" },
          { text: "Inteligencia Artificial y Aprendizaje Automático" },
          { text: "Ciberseguridad" },
          { text: "Desarrollo Web y Móvil" },
          { text: "Negocios" },
          { text: "Marketing Digital" },
          { text: "SEO" },
          { text: "Excel" },
          { text: "Power BI" },
          { text: "Finanzas y Contabilidad" },
          { text: "Coaching Online" }
        ]
      },
      {
        text: "Otro (especificar)",
        svg: (<SignatureOutlined />),
        input: true, // Agregar un campo de entrada
        placeholder: "Especifica tu opción aquí" // Placeholder para el input
      }

    ]
  }, {
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
  }
]
// Idiomas
  export const questionLanguajes = [
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
            { text: "Checo" },
            { text: "Polaco" },
            { text: "Danés" },
            { text: "Islandés" },
            { text: "Tailandés" },
            { text: "Vietnamita" },
            { text: "Indonesio" },
            { text: "Malayo" },
            { text: "Tagalo" },
            { text: "Hindi" },
            { text: "Bengalí" },
            { text: "Punjabi" },
            { text: "Ucraniano" },
            { text: "Serbio" },
            { text: "Croata" },
            { text: "Eslovaco" },
            { text: "Esloveno" },
            { text: "Letón" },
            { text: "Lituano" },
            { text: "Estonio" },
            { text: "Georgiano" },
            { text: "Armenio" },
            { text: "Tamil" },
            { text: "Telugu" },
            { text: "Persa" },
            { text: "Kazajo" },
            { text: "Uzbeco" },
            { text: "Romaní" }
          ]
        },
  
        {
          text: "Arte",
          svg: (<SignatureOutlined />),
          suboptions: [
            { text: "Pintura" },
            { text: "Escultura" },
            { text: "Arquitectura" },
            { text: "Música" },
            { text: "Poesía/Literatura" },
            { text: "Danza" },
            { text: "Artes Escénicas" }
          ]
        },
  
        {
          text: "Matemáticas",
          svg: (<CalculatorOutlined />),
          suboptions: [
            { text: "Aritmética" },
            { text: "Álgebra" },
            { text: "Geometría" },
            { text: "Trigonometría" },
            { text: "Cálculo" },
            { text: "Probabilidad y Estadística" },
            { text: "Teoría de Números" },
            { text: "Topología" }
          ]
        }
        ,
        {
          text: "Ciencias Naturales",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Ciencia Natural" },
            { text: "Ciencia Física" },
            { text: "Física" },
            { text: "Química" },
            { text: "Astronomía" }
          ]
        }
        ,
        {
          text: "Ciencias Sociales",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Arqueología" },
            { text: "Historia" },
            { text: "Geografía" },
            { text: "Derecho" },
            { text: "Lingüística" },
            { text: "Psicología" },
            { text: "Ciencia Política" },
            { text: "Antropología" },
            { text: "Economía" },
            { text: "Sociología" },
            { text: "Psicología Social" }
          ]
        },
  
        {
          text: "Tecnología",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Tecnología" },
            { text: "Desarrollo Web" },
            { text: "Diseño Gráfico" },
            { text: "Ciencia de Datos y Analítica" },
            { text: "Inteligencia Artificial y Aprendizaje Automático" },
            { text: "Ciberseguridad" },
            { text: "Desarrollo Web y Móvil" },
            { text: "Negocios" },
            { text: "Marketing Digital" },
            { text: "SEO" },
            { text: "Excel" },
            { text: "Power BI" },
            { text: "Finanzas y Contabilidad" },
            { text: "Coaching Online" }
          ]
        },
        {
          text: "Otro (especificar)",
          svg: (<SignatureOutlined />),
          input: true, // Agregar un campo de entrada
          placeholder: "Especifica tu opción aquí" // Placeholder para el input
        }
  
      ]
    }, {
      id: 2,
      question: "¿Cuál es tu nivel actual con el lenguaje?",
      options: [
        { text: "Soy principiante" },
        { text: "Conozco lo básico" },
        { text: "Puedo conversar" },
        { text: "Me desenvuelvo con soltura en la mayoría de las conversaciones" },
      ],
    },   {
      id: 3,
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
      id: 4,
      question: "¿Cuál es tu presupuesto para una clase?",
      type: "slider",
      min: 1,
      max: 40,
      step: 1,
      unit: "US$",
    }
    
  ]

  export const questionOther = [
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
            { text: "Checo" },
            { text: "Polaco" },
            { text: "Danés" },
            { text: "Islandés" },
            { text: "Tailandés" },
            { text: "Vietnamita" },
            { text: "Indonesio" },
            { text: "Malayo" },
            { text: "Tagalo" },
            { text: "Hindi" },
            { text: "Bengalí" },
            { text: "Punjabi" },
            { text: "Ucraniano" },
            { text: "Serbio" },
            { text: "Croata" },
            { text: "Eslovaco" },
            { text: "Esloveno" },
            { text: "Letón" },
            { text: "Lituano" },
            { text: "Estonio" },
            { text: "Georgiano" },
            { text: "Armenio" },
            { text: "Tamil" },
            { text: "Telugu" },
            { text: "Persa" },
            { text: "Kazajo" },
            { text: "Uzbeco" },
            { text: "Romaní" }
          ]
        },
  
        {
          text: "Arte",
          svg: (<SignatureOutlined />),
          suboptions: [
            { text: "Pintura" },
            { text: "Escultura" },
            { text: "Arquitectura" },
            { text: "Música" },
            { text: "Poesía/Literatura" },
            { text: "Danza" },
            { text: "Artes Escénicas" }
          ]
        },
  
        {
          text: "Matemáticas",
          svg: (<CalculatorOutlined />),
          suboptions: [
            { text: "Aritmética" },
            { text: "Álgebra" },
            { text: "Geometría" },
            { text: "Trigonometría" },
            { text: "Cálculo" },
            { text: "Probabilidad y Estadística" },
            { text: "Teoría de Números" },
            { text: "Topología" }
          ]
        }
        ,
        {
          text: "Ciencias Naturales",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Ciencia Natural" },
            { text: "Ciencia Física" },
            { text: "Física" },
            { text: "Química" },
            { text: "Astronomía" }
          ]
        }
        ,
        {
          text: "Ciencias Sociales",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Arqueología" },
            { text: "Historia" },
            { text: "Geografía" },
            { text: "Derecho" },
            { text: "Lingüística" },
            { text: "Psicología" },
            { text: "Ciencia Política" },
            { text: "Antropología" },
            { text: "Economía" },
            { text: "Sociología" },
            { text: "Psicología Social" }
          ]
        },
  
        {
          text: "Tecnología",
          svg: (<ExperimentOutlined />),
          suboptions: [
            { text: "Tecnología" },
            { text: "Desarrollo Web" },
            { text: "Diseño Gráfico" },
            { text: "Ciencia de Datos y Analítica" },
            { text: "Inteligencia Artificial y Aprendizaje Automático" },
            { text: "Ciberseguridad" },
            { text: "Desarrollo Web y Móvil" },
            { text: "Negocios" },
            { text: "Marketing Digital" },
            { text: "SEO" },
            { text: "Excel" },
            { text: "Power BI" },
            { text: "Finanzas y Contabilidad" },
            { text: "Coaching Online" }
          ]
        },
        {
          text: "Otro (especificar)",
          svg: (<SignatureOutlined />),
          input: true, // Agregar un campo de entrada
          placeholder: "Especifica tu opción aquí" // Placeholder para el input
        }
  
      ]
    }, {
    id: 2,
    question: "¿Cuál es tu nivel de conocimiento actual?",
    options: [
      { text: "Soy principiante" },
      { text: "Conozco lo básico" },
      { text: "Me desenvuelvo con soltura en esta disiplina" },
    ],
  },  {
    id: 3,
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
    id: 4,
    question: "¿Cuál es tu presupuesto para una clase?",
    type: "slider",
    min: 1,
    max: 40,
    step: 1,
    unit: "US$",
  }
  ]