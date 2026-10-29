/**
 * Importes en euros con separador de miles también en cifras de 4 dígitos
 * (Intl en es-ES escribe "2805"; el resto del sitio escribe "2.805 €").
 */
export function formatEuros(n: number): string {
  const grouped = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped} €`;
}
