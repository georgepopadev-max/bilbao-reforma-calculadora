/**
 * Bilbao Reforma — Validated Price Dataset
 * Data sourced from blog articles (2025)
 * Each entry includes: source file, confidence level, date extracted
 */

const DATASET_VALIDATED = {
  reformScope: {
    // €/m² for full reform by quality level
    basic: {
      label: 'Reforma básica',
      minPerSqm: 550,
      maxPerSqm: 700,
      basePerSqm: 625,
      source: 'blog/precio-reforma-integral-bilbao.html',
      confidence: 'high',
      notes: 'Materiales marca blanca (Leroy Merlin), pintura vinílica, suelo vinilo o parqué económico, sanitarios Roca básicos, grifería estándar. No incluye electrodomésticos ni licencias.'
    },
    medium: {
      label: 'Reforma media',
      minPerSqm: 700,
      maxPerSqm: 950,
      basePerSqm: 825,
      source: 'blog/precio-reforma-integral-bilbao.html',
      confidence: 'high',
      notes: 'Muebles cocina gama media (Cosentino bajo), encimera Silestone, parqué 8mm AC4, sanitarios Roca o similar, grifería monomando Grohe o similar. No incluye electrodomésticos.'
    },
    integral: {
      label: 'Reforma integral',
      minPerSqm: 900,
      maxPerSqm: 1300,
      basePerSqm: 1100,
      source: 'blog/precio-reforma-integral-bilbao.html',
      confidence: 'high',
      notes: 'Muebles a medida, encimera Dekton o piedra natural, parqué de alta gama, sanitarios Villeroy & Boch, grifería Hansgrohe, electrodomésticos Gaggenau o Miele. No incluye electrodomésticos según presupuesto estándar.'
    },
    luxury: {
      label: 'Reforma premium',
      minPerSqm: 1300,
      maxPerSqm: 1600,
      basePerSqm: 1450,
      source: 'blog/precio-reforma-integral-bilbao.html',
      confidence: 'medium',
      notes: 'Nivel superior del rango premium del blog. Incluye los acabados de gama más alta del rango 800–1.400 €/m².'
    }
  },

  reformType: {
    painting: {
      label: 'Pintura',
      minPerSqm: 8,
      maxPerSqm: 20,
      unit: 'm²',
      source: 'blog/pintar-piso-bilbao.html',
      confidence: 'high',
      notes: 'Precio con mano de obra incluida en Bilbao. Los metros se calculan de pared, no de suelo. Una vivienda de 80m² tiene aproximadamente 160–180m² de pared. No incluye electrodomésticos.',
      variants: {
        vinylBasic: {
          label: 'Pintura básica (vinílica)',
          minPerSqm: 8,
          maxPerSqm: 10,
          source: 'blog/pintar-piso-bilbao.html',
          confidence: 'high',
          notes: 'Dos manos de pintura vinílica, sin empastado, sin masilla.'
        },
        acrylicMedium: {
          label: 'Pintura media (acrílica)',
          minPerSqm: 10,
          maxPerSqm: 12,
          source: 'blog/pintar-piso-bilbao.html',
          confidence: 'high',
          notes: 'Dos manos de acrílica mate o satinada, repaso de pequeñas grietas, protección de suelos y marcos.'
        },
        premiumWashable: {
          label: 'Pintura premium (lavable)',
          minPerSqm: 12,
          maxPerSqm: 15,
          source: 'blog/pintar-piso-bilbao.html',
          confidence: 'high',
          notes: 'Dos manos de pintura lavable de alta gama (Procolor, Titan, Bruguer Expert), empastado de pared, rodapiés protegidos, acabado perfecto.'
        },
        goteleSmoothed: {
          label: 'Gotelé alisado + pintura',
          minPerSqm: 15,
          maxPerSqm: 20,
          source: 'blog/pintar-piso-bilbao.html',
          confidence: 'high',
          notes: 'Eliminación de gotelé mediante plaste, dos manos de acrílica. Algunos edificios de los años 70 pueden tener amianto — requiere estudio previo.'
        },
        wallpaper: {
          label: 'Papel pintado / decoración',
          minPerSqm: 12,
          maxPerSqm: 18,
          source: 'blog/pintar-piso-bilbao.html',
          confidence: 'medium',
          notes: 'Material + colocación de papel pintado o pintura decorativa.'
        }
      }
    },

    flooring: {
      label: 'Suelo',
      unit: 'm²',
      source: 'blog/cambiar-suelo-bilbao.html',
      confidence: 'high',
      notes: 'Precios incluyen material + instalación profesional en Bilbao. IVA no incluido.',
      variants: {
        // Parqué
        parqueteEconomic: {
          label: 'Parqué flotante roble económico',
          minPerSqm: 30,
          maxPerSqm: 45,
          materialPerSqm: { min: 18, max: 28 },
          installPerSqm: { min: 12, max: 17 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Parqué flotante roble gama económica. Instalación: 12–17 €/m².'
        },
        parqueteMedium: {
          label: 'Parqué flotante roble medio',
          minPerSqm: 50,
          maxPerSqm: 75,
          materialPerSqm: { min: 35, max: 55 },
          installPerSqm: { min: 15, max: 20 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Parqué flotante roble gama media. Instalación: 15–20 €/m².'
        },
        parquetePremium: {
          label: 'Parqué macizo roble premium',
          minPerSqm: 85,
          maxPerSqm: 130,
          materialPerSqm: { min: 60, max: 90 },
          installPerSqm: { min: 25, max: 40 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Parqué macizo roble premium. Instalación más laboriosa. Se puede lijar y restaurar varias veces.'
        },
        // Porcelánico
        porcelainicoEconomic: {
          label: 'Porcelánico imitación madera económico',
          minPerSqm: 35,
          maxPerSqm: 55,
          materialPerSqm: { min: 20, max: 35 },
          installPerSqm: { min: 15, max: 20 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Porcelánico imitación madera gama económica. Instalación: 18–28 €/m² según el blog.'
        },
        porcelainicoMedium: {
          label: 'Porcelánico imitación madera medio',
          minPerSqm: 55,
          maxPerSqm: 85,
          materialPerSqm: { min: 40, max: 65 },
          installPerSqm: { min: 15, max: 20 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Porcelánico imitación madera gama media.'
        },
        porcelainicoPremium: {
          label: 'Porcelánico símil piedra premium',
          minPerSqm: 75,
          maxPerSqm: 120,
          materialPerSqm: { min: 55, max: 90 },
          installPerSqm: { min: 20, max: 30 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Porcelánico símil piedra gama premium.'
        },
        // Vinilo
        viniloEconomic: {
          label: 'Vinilo LVT click económico',
          minPerSqm: 25,
          maxPerSqm: 40,
          materialPerSqm: { min: 15, max: 25 },
          installPerSqm: { min: 10, max: 15 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Vinilo LVT click gama económica. Impermeable al 100%. Instalación rápida con sistema click.'
        },
        viniloMedium: {
          label: 'Vinilo LVT click medio',
          minPerSqm: 40,
          maxPerSqm: 60,
          materialPerSqm: { min: 28, max: 45 },
          installPerSqm: { min: 12, max: 15 },
          source: 'blog/cambiar-suelo-bilbao.html',
          confidence: 'high',
          notes: 'Vinilo LVT click gama media.'
        }
      }
    },

    bathroom: {
      label: 'Reforma baño',
      unit: 'baño completo',
      source: 'blog/reforma-bano-bilbao.html',
      confidence: 'high',
      notes: 'Precios incluyen materiales y mano de obra. IVA no incluido. Baño típico bilbaino ~5m².',
      variants: {
        small: {
          label: 'Baño pequeño (3–5 m²)',
          minTotal: 2500,
          maxTotal: 10000,
          source: 'blog/reforma-bano-bilbao.html',
          confidence: 'high',
          qualityTiers: {
            economic: { min: 2500, max: 4000 },
            medium: { min: 4000, max: 6500 },
            premium: { min: 6500, max: 10000 }
          },
          notes: 'Rango completo desde reforma económica hasta premium para baño pequeño.'
        },
        medium: {
          label: 'Baño mediano (5–8 m²)',
          minTotal: 3500,
          maxTotal: 14000,
          source: 'blog/reforma-bano-bilbao.html',
          confidence: 'high',
          qualityTiers: {
            economic: { min: 3500, max: 5500 },
            medium: { min: 5500, max: 9000 },
            premium: { min: 9000, max: 14000 }
          },
          notes: 'Baño típico bilbaino de 5m² con reforma media cuesta 5.500–9.000 €.'
        },
        large: {
          label: 'Baño grande (8–12 m²)',
          minTotal: 5000,
          maxTotal: 20000,
          source: 'blog/reforma-bano-bilbao.html',
          confidence: 'high',
          qualityTiers: {
            economic: { min: 5000, max: 7500 },
            medium: { min: 7500, max: 12000 },
            premium: { min: 12000, max: 20000 }
          },
          notes: 'Rango completo desde reforma económica hasta premium para baño grande.'
        }
      },
      // Desglose por elemento (gama media)
      elementBreakdown: {
        demolition: { min: 350, max: 700, source: 'blog/reforma-bano-bilbao.html' },
        fontaneria: { min: 600, max: 1500, source: 'blog/reforma-bano-bilbao.html' },
        electricidad: { min: 400, max: 1000, source: 'blog/reforma-bano-bilbao.html' },
        alicatado: { min: 45, max: 80, unit: 'm²', quality: 'medium', source: 'blog/reforma-bano-bilbao.html' },
        solado: { min: 50, max: 90, unit: 'm²', quality: 'medium', source: 'blog/reforma-bano-bilbao.html' }
      }
    },

    kitchen: {
      label: 'Reforma cocina',
      unit: 'cocina 8–10 m²',
      source: 'blog/reforma-cocina-bilbao.html',
      confidence: 'high',
      notes: 'Precios para cocina de 8–10 m² incluyen materiales y mano de obra (electricidad, fontanería, albañilería). IVA no incluido. Electrodomésticos no incluidos salvo que se indique en cada nivel.',
      variants: {
        basic: {
          label: 'Cocina básica (8–10 m²)',
          minTotal: 5000,
          maxTotal: 6000,
          source: 'blog/reforma-cocina-bilbao.html',
          confidence: 'high',
          notes: 'Muebles económico (Leroy Merlin, marca blanca), encimera laminada (Formica o similar), fregadero de acero, grifo estándar, pintura. Sin electrodomésticos nuevos.'
        },
        medium: {
          label: 'Cocina media (8–10 m²)',
          minTotal: 8000,
          maxTotal: 10000,
          source: 'blog/reforma-cocina-bilbao.html',
          confidence: 'high',
          notes: 'Muebles de gama media (cocinas estándar de proveedor local o cadena), encimera Silestone (20mm), fregadero de un seno + escurridor (Roca o similar), grifo monomando Grohe o Cisal, electrodomésticos Bosch o Balay (placa, horno, campana), iluminación LED.'
        },
        premium: {
          label: 'Cocina premium (8–10 m²)',
          minTotal: 12000,
          maxTotal: 16000,
          source: 'blog/reforma-cocina-bilbao.html',
          confidence: 'high',
          notes: 'Muebles a medida (fabricación local o Cosentino), encimera Dekton o piedra natural (20–30mm), Electrodomésticos Gaggenau o Miele (placa de inducción, horno pirolítico, microondas integrable, lavavajillas), grifería Hansgrohe o similar, detalles como led empotrado o tiradores perfilados.'
        }
      },
      // Partidas desglosadas (cocina media 8m²)
      itemBreakdown: {
        demolition: { min: 300, max: 600 },
        albañileria: { min: 600, max: 1200 },
        fontaneria: { min: 400, max: 800 },
        electricidad: { min: 500, max: 1000 },
        mueblesCocina: { min: 2500, max: 4000 },
        encimera: { min: 800, max: 1500 },
        fregaderoGriifo: { min: 300, max: 600 },
        electrodomesticos: { min: 1500, max: 2500 },
        iluminacion: { min: 200, max: 400 },
        pintura: { min: 200, max: 400 },
        acabados: { min: 200, max: 400 }
      },
      appliances: {
        inductionPlate: { min: 400, max: 800 },
        oven: { min: 350, max: 700 },
        hood: { min: 200, max: 500 },
        dishwasher: { min: 350, max: 600 },
        microwaveIntegrable: { min: 200, max: 400 },
        refrigerator: { min: 500, max: 1200 },
        totalBasic: { min: 2000, max: 3500 }
      }
    }
  },

  qualityMultiplier: {
    basic: {
      label: 'Básica',
      multiplier: 0.8,
      desc: 'Leroy Merlin, marca blanca'
    },
    medium: {
      label: 'Media',
      multiplier: 1.0,
      desc: 'Cosentino, Porcelanosa gama media, Roca, Grohe'
    },
    premium: {
      label: 'Premium',
      multiplier: 1.4,
      desc: 'Dekton, Saloni alta gama, Villeroy & Boch, Hansgrohe'
    }
  },

  ageMultiplier: {
    new: {
      label: '< 20 años',
      multiplier: 1.0,
      note: 'Instalaciones modernas'
    },
    moderate: {
      label: '20–40 años',
      multiplier: 1.05,
      note: 'Renovación parcial recomendada'
    },
    old: {
      label: '40–70 años',
      multiplier: 1.15,
      note: 'Tuberías y electricidad pueden necesitarse'
    },
    historic: {
      label: '> 70 años / Casco Viejo',
      multiplier: 1.30,
      note: 'Mayor complejidad + licencias'
    }
  },

  // Metadata
  metadata: {
    lastUpdated: '2025-05-15',
    extractedBy: 'agent',
    extractionDate: '2025-05-21',
    dataVersion: '1.0',
    blogPublicationDate: '2025-04-06',
    sources: [
      {
        file: 'blog/precio-reforma-integral-bilbao.html',
        title: 'Precio Reforma Integral Bilbao 2025: Guía Completa con €/m²',
        dataPoints: 9,
        confidence: 'high',
        coverage: ['€/m² reforma integral por calidad', 'factores precio', 'antigüedad edificio multiplicadores', 'ejemplo piso 80m²']
      },
      {
        file: 'blog/pintar-piso-bilbao.html',
        title: 'Pintar un Piso en Bilbao: Precios por m² 2025',
        dataPoints: 8,
        confidence: 'high',
        coverage: ['€/m² pintura por tipo', 'pintura básica/media/premium', 'gotelé alisado', 'mano de obra']
      },
      {
        file: 'blog/cambiar-suelo-bilbao.html',
        title: 'Cambiar Suelo en Bilbao: Guía de Precios 2025',
        dataPoints: 8,
        confidence: 'high',
        coverage: ['€/m² parqué por gama', '€/m² porcelánico por gama', '€/m² vinilo por gama', 'consejos instalación']
      },
      {
        file: 'blog/reforma-cocina-bilbao.html',
        title: 'Cuánto Cuesta Reformar una Cocina en Bilbao en 2025',
        dataPoints: 6,
        confidence: 'high',
        coverage: ['€ total cocina 8–10m² por nivel', 'partidas desglosadas', 'electrodomésticos por tipo', 'tendencias']
      },
      {
        file: 'blog/reforma-bano-bilbao.html',
        title: 'Reforma de Baño en Bilbao 2025',
        dataPoints: 5,
        confidence: 'high',
        coverage: ['€ total baño por tamaño y calidad', 'precios por elemento', 'desglose partidas']
      }
    ],
    notes: [
      'Todos los precios son orientativos para Bilbao y Bizkaia en 2025.',
      'IVA no incluido (10% para viviendas de más de 2 años, 21% general).',
      'No incluyen licencias ni tasas municipales.',
      'Los precios incluyen materiales y mano de obra salvo que se indique lo contrario.',
      'Para reforma integral en Casco Viejo añadir 20–30% por complejidad de acceso y restricciones patrimoniales.'
    ]
  }
};

// Freeze to prevent accidental modification
Object.freeze(DATASET_VALIDATED);
Object.freeze(DATASET_VALIDATED.metadata);
Object.keys(DATASET_VALIDATED).forEach(key => {
  if (typeof DATASET_VALIDATED[key] === 'object' && DATASET_VALIDATED[key] !== null) {
    Object.freeze(DATASET_VALIDATED[key]);
  }
});
window.DATASET_VALIDATED = DATASET_VALIDATED;
