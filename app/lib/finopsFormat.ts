/* =====================================================
   HELPERS
===================================================== */

function trimZeros(value: string) {
    return value.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  }
  
  /* =====================================================
     USD FORMATTER (FinOps Style)
  ===================================================== */
  
  export function formatUSD(value?: number | null): string {
  
    if (value === null || value === undefined || isNaN(value)) {
      return "USD $0";
    }
  
    const abs = Math.abs(value);
  
    /* BILLIONS */
  
    if (abs >= 1_000_000_000) {
      return `USD $${trimZeros((value / 1_000_000_000).toFixed(2))}B`;
    }
  
    /* MILLIONS */
  
    if (abs >= 1_000_000) {
      return `USD $${trimZeros((value / 1_000_000).toFixed(2))}M`;
    }
  
    /* THOUSANDS */
  
    if (abs >= 1_000) {
      return `USD $${trimZeros((value / 1_000).toFixed(2))}K`;
    }
  
    /* SMALL VALUES */
  
    return `USD $${trimZeros(value.toFixed(2))}`;
  }
  
  /* =====================================================
     PERCENTAGE FORMATTER
  ===================================================== */
  
  export function formatPercentage(value?: number | null): string {
  
    if (value === null || value === undefined || isNaN(value)) {
      return "0%";
    }
  
    return `${trimZeros(value.toFixed(2))}%`;
  }