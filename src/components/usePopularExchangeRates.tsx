// usePopularExchangeRates.ts

import { useExchangeRate } from "@/hooks/useApi";
import { ExchangeRate } from "@/config/types";

export const usePopularExchangeRates = (
  base: string,
  codes: string[],
  customerType: string,
  fallbackRate: ExchangeRate
) => {
  const queries = codes.map((code) =>
    useExchangeRate(base, code, customerType)
  );

  const rates = codes.reduce<Record<string, ExchangeRate>>((acc, code, idx) => {
    const { data } = queries[idx];
    acc[code] =
      data
        ? {
            ...data,
            rate: parseFloat(data.rate as any),
            finalRate: parseFloat(data.finalRate as any),
          }
        : {
            ...fallbackRate,
            target: code,
            id: `fallback-${base}-${code}`,
          };

    return acc;
  }, {});

  return rates;
};
