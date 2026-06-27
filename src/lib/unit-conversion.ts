const conversions: Record<string, Record<string, number>> = {
  MWh: { kWh: 1000 },
  kWh: { MWh: 0.001 },
  tonne: { kg: 1000 },
  kg: { tonne: 0.001 },
  m3: { L: 1000 },
  L: { m3: 0.001 }
};

export function convertUnit(quantity: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return quantity;
  const direct = conversions[fromUnit]?.[toUnit];
  if (direct) return quantity * direct;
  throw new Error('No unit conversion from ' + fromUnit + ' to ' + toUnit);
}
