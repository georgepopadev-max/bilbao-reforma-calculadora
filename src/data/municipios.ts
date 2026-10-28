/**
 * Municipios de Bizkaia con página propia en /bizkaia/[slug].
 * El texto de cada municipio es propio: no reutilizar párrafos entre ellos.
 */

export interface Municipio {
  slug: string;
  name: string;
  comarca: string;
  title: string;
  description: string;
  intro: string[];
  zonas: { name: string; text: string }[];
  obras: string[];
  precio: string;
  tramites: string;
  faqs: { q: string; a: string }[];
}

export const MUNICIPIOS: Municipio[] = [
  {
    slug: 'getxo',
    name: 'Getxo',
    comarca: 'Uribe Kosta',
    title: 'Reformas en Getxo 2026: Precios y Presupuestos',
    description: 'Reformas en Getxo: precios orientativos, qué se reforma en Algorta, Areeta, Neguri o Romo, trámites en el Ayuntamiento y presupuestos de empresas de la zona.',
    intro: [
      'Getxo combina zonas muy distintas en pocos kilómetros: las villas y palacetes de Neguri, los edificios señoriales de Areeta-Las Arenas, los bloques de Romo y el Algorta de calles estrechas junto al Puerto Viejo. Eso hace que aquí convivan reformas sencillas de piso con rehabilitaciones de casas de gran valor.',
      'La cercanía al mar también se nota: la humedad y el salitre castigan carpinterías exteriores, fachadas y suelos de madera, y en muchas reformas de Getxo la ventana y el aislamiento son partidas tan importantes como la cocina o el baño.',
    ],
    zonas: [
      { name: 'Neguri', text: 'Viviendas unifamiliares y palacetes de principios del siglo XX. Las reformas suelen ser integrales y de gama alta, con elementos originales que conviene conservar y, a menudo, limitaciones de protección en fachadas y jardines.' },
      { name: 'Areeta-Las Arenas', text: 'Edificios señoriales con techos altos y pisos amplios, junto a bloques de los años 60 y 70. Muchas reformas integrales redistribuyen pisos grandes pensados para otra época.' },
      { name: 'Algorta y Puerto Viejo', text: 'En el entorno del Puerto Viejo hay casas antiguas en calles estrechas y en cuesta, donde la logística de la obra pesa en el precio. En el resto de Algorta abundan los pisos de los 70 y 80.' },
      { name: 'Romo', text: 'Barrio de bloques de mediados del siglo XX, con reformas de baño, cocina e instalaciones muy parecidas a las de los barrios obreros de Bilbao.' },
    ],
    obras: [
      'Cambio de ventanas y mejora del aislamiento en viviendas expuestas al mar.',
      'Reformas integrales de pisos grandes en Areeta, a menudo dividiendo o reorganizando estancias.',
      'Rehabilitación de unifamiliares, con cubierta, fachada e instalaciones.',
      'Baños y cocinas en los pisos de los 70 y 80 de Algorta y Romo.',
    ],
    precio: 'En los pisos de Algorta y Romo los precios son muy parecidos a los de Bilbao. En Neguri y en los pisos señoriales de Areeta las calidades suelen ser más altas y la reforma integral se mueve con facilidad por encima de los 1.200 €/m².',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Getxo. Una reforma interior sin cambios de distribución suele ser obra menor; si se toca estructura, fachada o cubierta, o la vivienda está en un entorno protegido como Neguri o el Puerto Viejo, el trámite es más exigente y puede requerir proyecto técnico.',
    faqs: [
      { q: '¿Cuánto cuesta una reforma integral en Getxo?', a: 'En un piso de calidades medias, entre 950 y 1.150 €/m², muy parecido a Bilbao. En viviendas de Neguri o pisos señoriales de Areeta con calidades altas, lo habitual es superar los 1.200 €/m².' },
      { q: '¿Qué hay que tener en cuenta al reformar cerca del mar en Getxo?', a: 'Elegir carpinterías y herrajes resistentes a la corrosión, aislar bien las fachadas para evitar condensación y usar suelos que aguanten la humedad, como el porcelánico o el multicapa bien protegido.' },
      { q: '¿Necesito licencia para reformar mi casa en Neguri?', a: 'Si la obra afecta a fachada, cubierta, volumen o jardín, casi seguro que sí, y puede haber condiciones de protección. Consulta en el Ayuntamiento de Getxo antes de pedir presupuestos.' },
    ],
  },
  {
    slug: 'barakaldo',
    name: 'Barakaldo',
    comarca: 'Margen Izquierda',
    title: 'Reformas en Barakaldo 2026: Precios y Presupuestos',
    description: 'Reformas en Barakaldo: precios orientativos, qué se reforma en Zuazo, Rontegi, Lutxana o Urban Galindo, trámites y presupuestos de empresas de la zona.',
    intro: [
      'Barakaldo es el municipio más poblado de Bizkaia después de Bilbao, y buena parte de sus viviendas se construyó entre los años 50 y 70, cuando la industria atrajo a miles de familias. Por eso el trabajo más habitual aquí es poner al día pisos con instalaciones antiguas, baños pequeños y cocinas cerradas.',
      'Al mismo tiempo, zonas como Urban Galindo o los nuevos desarrollos junto a la ría tienen viviendas recientes, donde las reformas son más parciales y de acabados.',
    ],
    zonas: [
      { name: 'Centro, Zuazo y Bagatza', text: 'Bloques de los 50 a los 70 con pisos de 60 a 80 m². Lo normal es una reforma integral con fontanería y electricidad nuevas, o reformas de baño y cocina por separado.' },
      { name: 'Rontegi, Lutxana y Burtzeña', text: 'Barrios obreros con edificios de varias alturas, a veces sin ascensor. Las obras de accesibilidad en comunidad son frecuentes.' },
      { name: 'Cruces, Retuerto y San Vicente', text: 'Mezcla de bloques de los 70 y 80 con edificios más recientes. Muchas reformas se centran en cambiar bañera por ducha y renovar la cocina.' },
      { name: 'Urban Galindo', text: 'Viviendas de los 2000 en adelante, con instalaciones en buen estado. Aquí se piden sobre todo cambios de suelo, pintura y armarios.' },
    ],
    obras: [
      'Reformas integrales de pisos de 60-80 m² de los años 50 a 70.',
      'Cambio de bañera por plato de ducha, muy pedido por personas mayores.',
      'Renovación de instalaciones eléctricas sin toma de tierra.',
      'Ascensores y eliminación de barreras en comunidades.',
    ],
    precio: 'Los precios en Barakaldo suelen estar en línea con Bilbao o ligeramente por debajo, y como los pisos son más pequeños, el presupuesto total de una reforma integral es más contenido: un piso de 70 m² con calidades medias suele quedar entre 60.000 y 75.000 €.',
    tramites: 'Las obras se comunican o solicitan en el Ayuntamiento de Barakaldo. Las reformas interiores sin cambios de distribución suelen ser obra menor. Para ocupar la calle con un contenedor o un andamio hace falta permiso municipal.',
    faqs: [
      { q: '¿Cuánto cuesta reformar un piso en Barakaldo?', a: 'Una reforma integral con calidades medias cuesta entre 850 y 1.050 €/m². Para un piso típico de 70 m², entre 60.000 y 75.000 € con licencia e imprevistos.' },
      { q: '¿Cuánto cuesta reformar un baño en Barakaldo?', a: 'Para un baño de 4 m², entre 2.000 y 3.500 € si solo se cambian sanitarios y acabados, y entre 5.500 y 8.500 € si se renueva todo, incluidas tuberías.' },
      { q: '¿Hay ayudas para poner ascensor en Barakaldo?', a: 'Sí, la instalación de ascensores y la eliminación de barreras suelen tener ayudas del Gobierno Vasco y, según la convocatoria, del propio Ayuntamiento. Las pide la comunidad de propietarios antes de empezar la obra.' },
    ],
  },
  {
    slug: 'portugalete',
    name: 'Portugalete',
    comarca: 'Margen Izquierda',
    title: 'Reformas en Portugalete 2026: Precios y Presupuestos',
    description: 'Reformas en Portugalete: precios, qué se reforma en el casco histórico, Repélega o Buenavista, trámites municipales y presupuestos de empresas de la zona.',
    intro: [
      'Portugalete tiene uno de los cascos históricos mejor conservados de la ría, con calles en cuesta que bajan desde la basílica de Santa María hasta el Puente Bizkaia. Reformar allí no es lo mismo que en los barrios altos, donde dominan los bloques de los años 60 y 70.',
      'En el casco, la dificultad está en el acceso y en los edificios antiguos. En el resto de la villa, el trabajo habitual es renovar instalaciones, baños y cocinas de pisos que no se han tocado en décadas.',
    ],
    zonas: [
      { name: 'Casco histórico', text: 'Edificios antiguos en calles estrechas y empinadas, muchas peatonales. La obra necesita planificar bien la entrada de material y la salida de escombros, y las fachadas tienen protección.' },
      { name: 'Muelle y entorno del Puente Bizkaia', text: 'Edificios señoriales frente a la ría, con pisos amplios y techos altos. Son habituales las reformas integrales de calidad media-alta.' },
      { name: 'Repélega, Buenavista y Azeta', text: 'Barrios de bloques de los 60 y 70 con pisos de tamaño medio. Las reformas más pedidas son baño, cocina y electricidad.' },
    ],
    obras: [
      'Reformas integrales en pisos del casco y del muelle.',
      'Renovación de baños y cocinas en los barrios altos.',
      'Adaptación de viviendas para personas mayores, en una villa con muchas cuestas.',
      'Rehabilitación de fachadas y cubiertas en comunidades.',
    ],
    precio: 'En los barrios altos los precios son similares a los de Bilbao. En el casco histórico, la logística y la antigüedad de los edificios pueden añadir entre un 10 y un 20 % al presupuesto.',
    tramites: 'Las licencias y comunicaciones se tramitan en el Ayuntamiento de Portugalete. En el casco histórico cualquier obra que afecte a fachada, carpintería exterior o elementos comunes tiene que respetar la normativa de protección, así que conviene consultar antes de cerrar el proyecto.',
    faqs: [
      { q: '¿Es más caro reformar en el casco histórico de Portugalete?', a: 'Suele serlo, entre un 10 y un 20 % más, por el acceso complicado, la antigüedad de los edificios y las condiciones de protección en fachadas.' },
      { q: '¿Cuánto cuesta reformar una cocina en Portugalete?', a: 'Para una cocina de 7-8 m², entre 5.000 y 8.500 € si solo se cambian muebles, encimera y electrodomésticos, y entre 8.000 y 14.000 € en una reforma completa con instalaciones.' },
      { q: '¿Puedo cambiar las ventanas de mi piso en el casco?', a: 'Normalmente sí, pero el modelo, el color y la forma deben respetar la estética del edificio. Pregunta en el Ayuntamiento qué condiciones aplica a tu calle antes de encargarlas.' },
    ],
  },
  {
    slug: 'santurtzi',
    name: 'Santurtzi',
    comarca: 'Margen Izquierda',
    title: 'Reformas en Santurtzi 2026: Precios y Presupuestos',
    description: 'Reformas en Santurtzi: precios orientativos, qué se reforma en el centro, Kabiezes o Mamariga, humedad junto al puerto, trámites y presupuestos.',
    intro: [
      'Santurtzi creció hacia arriba desde el puerto pesquero: en la parte baja hay edificios más antiguos y en las laderas, bloques de los años 60 y 70 y urbanizaciones más recientes como las de Kabiezes. Esa mezcla se refleja en el tipo de reformas que se piden.',
      'Junto al mar, la humedad y el salitre afectan a fachadas, ventanas y barandillas, y es habitual que una reforma de piso incluya cambio de carpintería exterior.',
    ],
    zonas: [
      { name: 'Centro y zona del puerto', text: 'Edificios antiguos y bloques de mediados del siglo XX. Las reformas integrales con instalaciones nuevas son lo más común.' },
      { name: 'Mamariga', text: 'Barrio en ladera con bloques de los 60 y 70. Baños, cocinas y electricidad son las partidas habituales.' },
      { name: 'Kabiezes', text: 'Viviendas más recientes, con reformas parciales de acabados, suelos y cocina.' },
    ],
    obras: [
      'Cambio de ventanas por modelos resistentes a la humedad y al salitre.',
      'Reformas de baño y cocina en pisos de los 60 y 70.',
      'Reformas integrales en el centro.',
      'Tratamiento de humedades por condensación.',
    ],
    precio: 'Los precios en Santurtzi son muy parecidos a los de Bilbao. Las carpinterías y materiales preparados para ambiente marino pueden encarecer algo esas partidas concretas.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Santurtzi. Una reforma interior sin cambio de distribución suele ser obra menor; las obras en fachada o elementos comunes necesitan acuerdo de la comunidad y permiso municipal.',
    faqs: [
      { q: '¿Cuánto cuesta una reforma integral en Santurtzi?', a: 'Con calidades medias, entre 900 y 1.100 €/m². Un piso de 75 m² suele quedar entre 70.000 y 85.000 € con licencia e imprevistos.' },
      { q: '¿Qué ventanas convienen cerca del puerto?', a: 'PVC o aluminio con rotura de puente térmico y herrajes de buena calidad, que resisten mejor la corrosión. El doble acristalamiento reduce también la condensación en invierno.' },
      { q: '¿Cómo se evitan las humedades en un piso de Santurtzi?', a: 'La mayoría son de condensación: se reducen ventilando a diario, con extractores en baño y cocina y aislando las paredes de fachada. Si la mancha aparece en la parte baja de la pared, puede ser capilaridad y necesita otro tratamiento.' },
    ],
  },
  {
    slug: 'basauri',
    name: 'Basauri',
    comarca: 'Nerbioi-Ibaizabal',
    title: 'Reformas en Basauri 2026: Precios y Presupuestos',
    description: 'Reformas en Basauri: precios orientativos, qué se reforma en San Miguel, Ariz, Kalero o Basozelai, trámites municipales y presupuestos de empresas de la zona.',
    intro: [
      'Basauri es un municipio muy residencial a pocos minutos de Bilbao, con barrios levantados en su mayoría entre los años 50 y 80. Muchos pisos conservan la distribución original, con cocina cerrada, baño pequeño y pasillo largo.',
      'Las reformas que más se piden aquí buscan ganar espacio y luz: abrir la cocina, juntar habitaciones y renovar instalaciones que ya han cumplido su vida útil.',
    ],
    zonas: [
      { name: 'San Miguel y centro', text: 'Bloques de distintas épocas alrededor del centro, con muchas reformas integrales en pisos de 70 a 90 m².' },
      { name: 'Kalero y Pozokoetxe', text: 'Edificios de los 60 y 70, donde baño, cocina y electricidad son las obras más frecuentes.' },
      { name: 'Ariz y Basozelai', text: 'Barrios en altura con bloques de varias plantas. Las obras de accesibilidad y ascensores en comunidad son habituales.' },
      { name: 'Urbi', text: 'Zona con viviendas más recientes, donde se piden sobre todo reformas parciales y de acabados.' },
    ],
    obras: [
      'Abrir la cocina al salón y redistribuir pisos de los 60 y 70.',
      'Reformas integrales con instalaciones nuevas.',
      'Cambio de bañera por ducha.',
      'Ascensores y accesibilidad en comunidades.',
    ],
    precio: 'Los precios en Basauri suelen estar en línea con Bilbao o algo por debajo. Una reforma integral de un piso de 80 m² con calidades medias suele moverse entre 68.000 y 82.000 €.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Basauri. Las reformas interiores sin tocar estructura suelen ser obra menor; tirar un tabique exige confirmar antes con un técnico que no es de carga.',
    faqs: [
      { q: '¿Cuánto cuesta una reforma integral en Basauri?', a: 'Con calidades medias, entre 850 y 1.050 €/m². Para un piso de 80 m², entre 68.000 y 82.000 € con licencia e imprevistos.' },
      { q: '¿Se puede abrir la cocina al salón en un piso de Basauri?', a: 'En muchos pisos sí, siempre que el tabique no sea de carga. Un técnico debe confirmarlo antes. El derribo y los remates cuestan entre 1.200 y 3.000 €.' },
      { q: '¿Cuánto tarda reformar un piso entero?', a: 'Entre 2,5 y 4 meses para un piso de 80 m², contando la tramitación y la fabricación de la cocina.' },
    ],
  },
  {
    slug: 'leioa',
    name: 'Leioa',
    comarca: 'Uribe',
    title: 'Reformas en Leioa 2026: Precios y Presupuestos',
    description: 'Reformas en Leioa: precios orientativos, qué se reforma en Lamiako, Ondiz, Udondo o el centro, pisos de alquiler junto al campus y presupuestos.',
    intro: [
      'Leioa ha crecido mucho en las últimas décadas, y junto a los barrios tradicionales como Lamiako hay urbanizaciones y bloques recientes en Ondiz o el centro. El campus de la UPV/EHU también marca el municipio: muchos pisos se alquilan a estudiantes y profesorado.',
      'Por eso aquí conviven las reformas de vivienda familiar con las reformas pensadas para alquilar: materiales resistentes, cocinas prácticas y baños fáciles de mantener.',
    ],
    zonas: [
      { name: 'Lamiako', text: 'Barrio junto a la ría con edificios más antiguos, donde son habituales las reformas integrales con instalaciones nuevas y el tratamiento de humedades.' },
      { name: 'Centro y Udondo', text: 'Bloques de los 70 a los 90 con pisos de tamaño medio. Se reforman sobre todo baños, cocinas y suelos.' },
      { name: 'Ondiz y urbanizaciones', text: 'Viviendas recientes y adosados, con reformas de acabados, cocinas y, en unifamiliares, cubiertas y fachadas.' },
    ],
    obras: [
      'Reformas de pisos para alquiler, con materiales resistentes y de poco mantenimiento.',
      'Baños y cocinas en bloques de los 70 a los 90.',
      'Reformas integrales en Lamiako.',
      'Mejoras de aislamiento y ventanas en unifamiliares.',
    ],
    precio: 'Los precios en Leioa son similares a los de Bilbao. En pisos para alquiler se suelen elegir calidades medias y materiales duraderos, que permiten mantener el presupuesto contenido.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Leioa. Una reforma interior sin cambios de distribución suele ser obra menor; en unifamiliares, las obras de fachada, cubierta o ampliación necesitan licencia con proyecto.',
    faqs: [
      { q: '¿Cuánto cuesta reformar un piso para alquilar en Leioa?', a: 'Una puesta al día de pintura, suelo, cocina sencilla y baño cuesta entre 15.000 y 30.000 € en un piso de 70 m². Una reforma integral con instalaciones nuevas, entre 60.000 y 75.000 €.' },
      { q: '¿Qué materiales convienen en un piso de alquiler?', a: 'Suelo vinílico o porcelánico, pintura lavable, encimera de cuarzo o laminado de buena calidad y sanitarios estándar fáciles de reponer. Aguantan el uso y abaratan el mantenimiento.' },
      { q: '¿Cuánto cuesta reformar la cocina en Leioa?', a: 'Para una cocina de 8 m², entre 5.500 y 9.000 € cambiando muebles y electrodomésticos, y entre 8.500 y 14.500 € en una reforma completa.' },
    ],
  },
  {
    slug: 'galdakao',
    name: 'Galdakao',
    comarca: 'Nerbioi-Ibaizabal',
    title: 'Reformas en Galdakao 2026: Precios y Presupuestos',
    description: 'Reformas en Galdakao: precios orientativos, qué se reforma en pisos y caseríos, trámites en el Ayuntamiento y presupuestos de empresas de reformas de la zona.',
    intro: [
      'Galdakao mezcla un núcleo urbano con bloques de los años 60 a los 90 y una parte rural con caseríos y viviendas unifamiliares. Eso da dos tipos de obra muy distintos: la reforma de piso y la rehabilitación de casa.',
      'En los pisos se repiten las reformas de baño, cocina e instalaciones. En los caseríos y unifamiliares, las partidas grandes son la cubierta, la fachada, el aislamiento y la calefacción.',
    ],
    zonas: [
      { name: 'Centro urbano', text: 'Bloques de los 60 a los 90 con pisos de tamaño medio. Las reformas integrales y de baño y cocina son las más pedidas.' },
      { name: 'Barrios altos y urbanizaciones', text: 'Viviendas más recientes y adosados, con reformas de acabados, suelos y cocina.' },
      { name: 'Zona rural', text: 'Caseríos y casas unifamiliares, donde la rehabilitación incluye cubierta, estructura de madera, aislamiento y calefacción.' },
    ],
    obras: [
      'Rehabilitación de caseríos: cubierta, estructura y aislamiento.',
      'Reformas integrales de pisos de los 60 y 70.',
      'Cambio de calefacción en unifamiliares, a menudo hacia aerotermia.',
      'Baños y cocinas en bloques del centro.',
    ],
    precio: 'En los pisos, los precios son similares a los de Bilbao o algo inferiores. La rehabilitación de un caserío es otra escala: depende mucho del estado de la estructura y la cubierta, y conviene una visita técnica antes de hablar de cifras.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Galdakao. En suelo rural, las obras en caseríos tienen condiciones urbanísticas propias, sobre todo si se amplía o se cambia el uso, así que conviene consultar antes de encargar el proyecto.',
    faqs: [
      { q: '¿Cuánto cuesta rehabilitar un caserío en Galdakao?', a: 'Depende mucho del estado. Una rehabilitación completa con cubierta, estructura e instalaciones nuevas suele superar los 1.000 €/m², y la cubierta sola puede costar entre 150 y 300 €/m². Lo mejor es pedir una visita técnica antes de presupuestar.' },
      { q: '¿Merece la pena la aerotermia en una casa de Galdakao?', a: 'En una vivienda unifamiliar bien aislada, sí: reduce mucho el gasto frente al gasóleo o el gas. Si la casa no está aislada, conviene mejorar antes cubierta, fachada y ventanas.' },
      { q: '¿Cuánto cuesta reformar un piso en el centro de Galdakao?', a: 'Una reforma integral con calidades medias cuesta entre 850 y 1.050 €/m². Para un piso de 75 m², entre 64.000 y 79.000 € con licencia e imprevistos.' },
    ],
  },
  {
    slug: 'sestao',
    name: 'Sestao',
    comarca: 'Margen Izquierda',
    title: 'Reformas en Sestao 2026: Precios y Presupuestos',
    description: 'Reformas en Sestao: precios orientativos, qué se reforma en Kueto, Txabarri o Urbinaga, ayudas a la rehabilitación y presupuestos de empresas de la zona.',
    intro: [
      'Sestao creció con la industria de la ría, y muchas de sus viviendas son edificios obreros de la primera mitad del siglo XX y bloques de los años 50 y 60. Es uno de los municipios de Bizkaia con un parque de viviendas más antiguo, y eso se nota en las reformas.',
      'Aquí son frecuentes las obras que van más allá del interior del piso: fachadas, cubiertas, bajantes y ascensores, a menudo dentro de programas de regeneración urbana.',
    ],
    zonas: [
      { name: 'Kueto', text: 'Barrio con edificios antiguos, muchos de ellos objeto de programas de rehabilitación. Las obras de estructura, fachada e instalaciones generales son habituales.' },
      { name: 'Txabarri y centro', text: 'Bloques de mediados del siglo XX con pisos pequeños. Se renuevan baños, cocinas y electricidad, y se redistribuyen para ganar espacio.' },
      { name: 'Urbinaga y zonas nuevas', text: 'Mezcla de edificios antiguos y promociones recientes, con reformas más parciales en las viviendas nuevas.' },
    ],
    obras: [
      'Reformas integrales de pisos pequeños con instalaciones muy antiguas.',
      'Rehabilitación de fachadas, cubiertas y bajantes en comunidad.',
      'Instalación de ascensores.',
      'Retirada de materiales con amianto en edificios antiguos.',
    ],
    precio: 'Los precios por metro cuadrado en Sestao suelen estar algo por debajo de Bilbao, pero los edificios antiguos suelen tener más imprevistos. Conviene reservar un 15-20 % del presupuesto para lo que aparezca al abrir paredes y suelos.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Sestao. En los barrios con programas de regeneración, las obras de comunidad pueden tener ayudas específicas, así que conviene preguntar antes de empezar.',
    faqs: [
      { q: '¿Cuánto cuesta reformar un piso en Sestao?', a: 'Una reforma integral con calidades medias cuesta entre 800 y 1.000 €/m². En un piso de 60 m², entre 50.000 y 62.000 €, más un margen del 15-20 % para imprevistos en edificios antiguos.' },
      { q: '¿Hay ayudas para rehabilitar edificios en Sestao?', a: 'Sí. Además de las ayudas del Gobierno Vasco a la rehabilitación, en algunos barrios hay programas de regeneración urbana. Las solicita normalmente la comunidad de propietarios antes de empezar la obra.' },
      { q: '¿Qué hago si mi edificio tiene amianto?', a: 'No lo manipules. Si aparece fibrocemento en bajantes, cubiertas o depósitos, solo puede retirarlo una empresa inscrita en el registro de empresas con riesgo de amianto, con un plan de trabajo aprobado.' },
    ],
  },
  {
    slug: 'durango',
    name: 'Durango',
    comarca: 'Duranguesado',
    title: 'Reformas en Durango 2026: Precios y Presupuestos',
    description: 'Reformas en Durango: precios orientativos, qué se reforma en el casco histórico, Tabira y los barrios nuevos, trámites municipales y presupuestos de la zona.',
    intro: [
      'Durango es la capital del Duranguesado y un municipio con vida propia, a media hora de Bilbao. Su casco histórico, con calles estrechas y edificios antiguos, convive con ensanches de los años 60 y 70 y con barrios nuevos en las afueras.',
      'Muchas familias que trabajan en la comarca reforman aquí en lugar de comprar en Bilbao, y las reformas integrales de pisos de 80 a 100 m² son muy habituales.',
    ],
    zonas: [
      { name: 'Casco histórico', text: 'Edificios antiguos, algunos con estructura de madera, en calles estrechas. Las reformas integrales necesitan planificar bien la logística y respetar las condiciones de protección.' },
      { name: 'Tabira', text: 'Barrio con historia propia y edificios de distintas épocas, donde se reforman tanto pisos antiguos como viviendas más recientes.' },
      { name: 'Ensanches y barrios nuevos', text: 'Bloques de los 60 y 70 alrededor del centro y promociones recientes en las afueras, con reformas de baño, cocina y acabados.' },
    ],
    obras: [
      'Reformas integrales de pisos familiares de 80 a 100 m².',
      'Rehabilitación de edificios antiguos del casco.',
      'Baños y cocinas en los ensanches de los 60 y 70.',
      'Mejora de calefacción y aislamiento, con inviernos más fríos que en la costa.',
    ],
    precio: 'Los precios en Durango son similares a los de Bilbao o ligeramente inferiores. Los pisos suelen ser algo más grandes, así que el presupuesto total de una reforma integral tiende a ser mayor.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Durango. En el casco histórico, las obras en fachada, cubierta o elementos comunes tienen que cumplir las condiciones de protección del conjunto.',
    faqs: [
      { q: '¿Cuánto cuesta una reforma integral en Durango?', a: 'Con calidades medias, entre 850 y 1.050 €/m². Para un piso de 90 m², entre 77.000 y 95.000 € con licencia e imprevistos.' },
      { q: '¿Es más caro reformar en el casco de Durango?', a: 'Suele serlo por el acceso, la antigüedad de los edificios y las condiciones de protección. Cuenta con un 10-20 % más que en un bloque del ensanche.' },
      { q: '¿Qué calefacción conviene en Durango?', a: 'En pisos con gas, una caldera de condensación es lo más sencillo. En reformas integrales o unifamiliares, la aerotermia con suelo radiante o radiadores de baja temperatura es la opción más eficiente si la vivienda está bien aislada.' },
    ],
  },
  {
    slug: 'erandio',
    name: 'Erandio',
    comarca: 'Uribe',
    title: 'Reformas en Erandio 2026: Precios y Presupuestos',
    description: 'Reformas en Erandio: precios orientativos, qué se reforma en Altzaga, Astrabudua, Lutxana, Goierri o Asua, trámites municipales y presupuestos de la zona.',
    intro: [
      'Erandio es un municipio repartido en barrios muy distintos entre sí: Altzaga y Astrabudua junto a la ría, con edificios de mediados del siglo XX, y Goierri o Asua, más dispersos y con viviendas unifamiliares. Está pegado a Bilbao, y muchas empresas de la capital trabajan aquí con los mismos precios.',
      'En los barrios de la ría predominan las reformas de pisos antiguos; en las zonas altas, las de casas y adosados.',
    ],
    zonas: [
      { name: 'Altzaga y Astrabudua', text: 'Bloques de los 50 a los 70 junto a la ría. Las reformas integrales, de baño y de cocina son las más frecuentes, a menudo con tratamiento de humedades.' },
      { name: 'Lutxana', text: 'Barrio con edificios de distintas épocas, donde se renuevan instalaciones y se redistribuyen pisos.' },
      { name: 'Goierri y Asua', text: 'Viviendas unifamiliares y caseríos, con obras de cubierta, fachada, aislamiento y calefacción.' },
    ],
    obras: [
      'Reformas integrales de pisos junto a la ría.',
      'Tratamiento de humedades en plantas bajas.',
      'Rehabilitación de unifamiliares en Goierri y Asua.',
      'Baños y cocinas en bloques de los 60 y 70.',
    ],
    precio: 'Al estar junto a Bilbao, los precios en Erandio son prácticamente los mismos. En los barrios junto a la ría, un piso de 70 m² con reforma integral de calidades medias suele quedar entre 62.000 y 76.000 €.',
    tramites: 'Las obras se tramitan en el Ayuntamiento de Erandio. Las reformas interiores sin cambios de distribución suelen ser obra menor; en suelo rural, las obras en caseríos tienen condiciones urbanísticas propias.',
    faqs: [
      { q: '¿Cuánto cuesta reformar un piso en Erandio?', a: 'Una reforma integral con calidades medias cuesta entre 880 y 1.080 €/m². Para un piso de 70 m², entre 62.000 y 76.000 € con licencia e imprevistos.' },
      { q: '¿Cómo se tratan las humedades en una planta baja de Astrabudua?', a: 'Primero hay que saber si es condensación o capilaridad. La condensación se corrige con ventilación y aislamiento; la capilaridad necesita barreras en el muro o morteros específicos, con un coste de 80 a 200 € por metro lineal de pared.' },
      { q: '¿Trabajan en Erandio las empresas de Bilbao?', a: 'Sí, la mayoría de empresas de reformas de Bilbao trabajan en Erandio sin coste adicional por desplazamiento. Con el formulario de esta página te ponemos en contacto con varias.' },
    ],
  },
];

export const getMunicipio = (slug: string) => MUNICIPIOS.find((m) => m.slug === slug);
