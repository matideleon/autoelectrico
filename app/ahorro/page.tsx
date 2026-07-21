// ============================================================
// autoelectrico.uy — /ahorro
// Simulador de ahorro EV vs combustión. Estático: no depende
// de la DB, solo de precios públicos de ANCAP y UTE.
// ============================================================

import type { Metadata } from 'next';
import SavingsCalculator from '@/components/SavingsCalculator';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Calculá cuánto ahorrás con un auto eléctrico',
  description:
    'Simulador de ahorro real: comparás el costo por km de un eléctrico contra uno a combustión con los precios actuales de nafta y UTE en Uruguay.',
};

export default function AhorroPage() {
  return (
    <>
      <Nav />
      <SavingsCalculator />
    </>
  );
}
