# Dashboard Mensual — bilbaoreforma.es

## Hoja 1: KPIs Semanales

Columnas: Fecha | Clics | Impresiones | CTR | Posición Media | Conversiones | Leads Tel | Leads Form

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Fecha | Clics | Impresiones | CTR | Pos Media | Conversiones | Tel | Form |

Fórmulas (copiar de GSC y GA4):
- B: pegar export Search Console "Páginas"
- C: pegar export Search Console "Páginas"  
- D: =B/C (formato %)
- E: pegar export Search Console "Páginas"
- F: =G+H
- G: =COUNTIF(GA4_Eventos!B:B,"clic_telefono")
- H: =COUNTIF(GA4_Eventos!B:B,"generate_lead")

## Hoja 2: Top 20 Consultas

Columnas: Query | Clics | Impresiones | CTR | Posición | Tendencia

Pegar export de Search Console → Consultas → ordenar por impresiones desc → top 20

## Hoja 3: Conversiones por Fuente

| Fuente/Medium | Clics | Leads Tel | Leads Form | Total Conv | Conv Rate |
|---|---|---|---|---|---|

Pegar export GA4 → Adquisición → Todo el tráfico → secundario "Source/Medium"

## Hoja 4: Checklist Mensual

- [ ] Revisar Search Console → Cobertura → Errores de indexación
- [ ] Revisar Search Console → Experiencia → Core Web Vitals
- [ ] Revisar GA4 → Eventos top 5
- [ ] Revisar GA4 → Conversiones por source
- [ ] Revisar top 10 consultas vs posición objetivo
- [ ] Identificar 3 quick wins SEO del mes
- [ ] Planificar 1 artículo blog/mes
- [ ] Contactar 3 empresas para "Destacadas" si impressions >100/semana