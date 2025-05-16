import axios from 'axios';
import { MarketPrice, MarketInsight } from '../types/market';
import { generateMarketInsights } from './geminiService';

// This is a mock service since we don't have a real market API
// In a real application, you would connect to an actual market API

// Mock data for market prices
const mockMarketPrices: MarketPrice[] = [
  {
    commodity: 'Rice',
    market: 'Mandi A',
    price: 2200,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'up',
    percentChange: 3.5
  },
  {
    commodity: 'Wheat',
    market: 'Mandi B',
    price: 1850,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'down',
    percentChange: -1.2
  },
  {
    commodity: 'Potatoes',
    market: 'Mandi C',
    price: 1250,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'stable',
    percentChange: 0.3
  },
  {
    commodity: 'Onions',
    market: 'Mandi A',
    price: 1400,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'up',
    percentChange: 5.7
  },
  {
    commodity: 'Tomatoes',
    market: 'Mandi B',
    price: 1680,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'up',
    percentChange: 8.2
  },
  {
    commodity: 'Soybean',
    market: 'Mandi C',
    price: 3800,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'down',
    percentChange: -2.1
  },
  {
    commodity: 'Cotton',
    market: 'Mandi A',
    price: 5900,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'up',
    percentChange: 1.8
  },
  {
    commodity: 'Pulses',
    market: 'Mandi B',
    price: 5500,
    unit: 'quintal',
    date: '2024-06-10',
    trend: 'stable',
    percentChange: 0.5
  }
];

// Get market prices for commodities
export const getMarketPrices = async (): Promise<MarketPrice[]> => {
  // In a real app, this would call an API
  // For this demo, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMarketPrices);
    }, 500);
  });
};

// Get market insights for specific commodities
export const getMarketInsights = async (commodities: string[], location: string): Promise<string> => {
  try {
    // Use Gemini API to generate insights based on the commodities and location
    const insights = await generateMarketInsights(commodities, location);
    return insights;
  } catch (error) {
    console.error('Error getting market insights:', error);
    throw error;
  }
};

// Get commodity price history (mock data)
export const getCommodityPriceHistory = async (commodity: string, days: number = 30): Promise<{ date: string; price: number }[]> => {
  // Generate mock price history
  const history = [];
  const today = new Date();
  const basePrice = mockMarketPrices.find(p => p.commodity === commodity)?.price || 2000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some random variation
    const variation = (Math.random() * 0.1) - 0.05; // -5% to +5%
    const price = Math.round(basePrice * (1 + variation));
    
    history.push({
      date: date.toISOString().split('T')[0],
      price
    });
  }
  
  return history;
};