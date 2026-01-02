"use client";

import { useState, useEffect } from "react";

/**
 * Mock Oracle for $COMINE Price
 * 
 * This is a mock implementation that simulates an oracle price feed.
 * In production, this would connect to a real oracle service.
 */
export function useComineOracle(basePrice: number) {
  const [oraclePrice, setOraclePrice] = useState(basePrice);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate oracle price updates every 30 seconds
    const interval = setInterval(() => {
      setIsLoading(true);
      
      // Simulate price variation (±2% from base price)
      const variation = (Math.random() - 0.5) * 0.04; // -2% to +2%
      const newPrice = basePrice * (1 + variation);
      
      setTimeout(() => {
        setOraclePrice(newPrice);
        setLastUpdate(new Date());
        setIsLoading(false);
      }, 500); // Simulate network delay
    }, 30000);

    return () => clearInterval(interval);
  }, [basePrice]);

  return {
    price: oraclePrice,
    lastUpdate,
    isLoading,
    // Oracle metadata
    source: "Mock Oracle",
    confidence: 0.95,
  };
}




