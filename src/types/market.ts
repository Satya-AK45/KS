export interface MarketPrice {
  commodity: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  commodities: string[];
  date: string;
  source: string;
  prediction: string;
  confidence: number;
}