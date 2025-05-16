import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { getMarketPrices, getMarketInsights, getCommodityPriceHistory } from '../../services/marketService';
import { MarketPrice } from '../../types/market';
import Button from '../../components/common/Button';

const MarketInsights: React.FC = () => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [priceHistory, setPriceHistory] = useState<{ date: string; price: number }[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const prices = await getMarketPrices();
        setMarketPrices(prices);
        
        // Set first commodity as selected for price history
        if (prices.length > 0) {
          setSelectedCommodity(prices[0].commodity);
          const history = await getCommodityPriceHistory(prices[0].commodity);
          setPriceHistory(history);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketData();
  }, []);

  const handleCommoditySelection = (commodity: string) => {
    setSelectedCommodities(prev => {
      if (prev.includes(commodity)) {
        return prev.filter(item => item !== commodity);
      } else {
        return [...prev, commodity];
      }
    });
  };

  const handleGenerateInsights = async () => {
    if (selectedCommodities.length === 0 || !location) {
      alert('Please select at least one commodity and enter your location');
      return;
    }
    
    setInsightsLoading(true);
    try {
      const result = await getMarketInsights(selectedCommodities, location);
      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Failed to generate market insights. Please try again later.');
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleCommodityHistorySelect = async (commodity: string) => {
    setSelectedCommodity(commodity);
    try {
      const history = await getCommodityPriceHistory(commodity);
      setPriceHistory(history);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Market Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Market Prices */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Current Market Prices</h2>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commodity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (₹)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marketPrices.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={selectedCommodities.includes(item.commodity)}
                            onChange={() => handleCommoditySelection(item.commodity)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.commodity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.market}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.price}/{item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.trend === 'up' ? (
                              <>
                                <TrendingUp className="h-5 w-5 text-success-500 mr-1.5" />
                                <span className="text-success-600 text-sm">
                                  +{item.percentChange.toFixed(1)}%
                                </span>
                              </>
                            ) : item.trend === 'down' ? (
                              <>
                                <TrendingDown className="h-5 w-5 text-error-500 mr-1.5" />
                                <span className="text-error-600 text-sm">
                                  {item.percentChange.toFixed(1)}%
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500 text-sm">Stable</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-accent-600 hover:text-accent-700 flex items-center"
                            onClick={() => handleCommodityHistorySelect(item.commodity)}
                          >
                            View History <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Price History Chart */}
          {selectedCommodity && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Price History - {selectedCommodity}</h2>
              
              <div className="h-64 flex items-end space-x-1">
                {priceHistory.map((point, i) => {
                  const max = Math.max(...priceHistory.map(p => p.price));
                  const min = Math.min(...priceHistory.map(p => p.price));
                  const range = max - min;
                  const height = range === 0 ? 50 : ((point.price - min) / range) * 80;
                  
                  return (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary-500 rounded-t"
                        style={{ height: `${height + 20}%` }}
                      ></div>
                      {i % 5 === 0 && (
                        <div className="text-xs text-gray-500 mt-2 w-full text-center">
                          {new Date(point.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Generate Insights */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Generate Custom Insights</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="City, State or Pin Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Commodities: {selectedCommodities.length}
                </label>
                {selectedCommodities.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCommodities.map((commodity) => (
                      <span 
                        key={commodity}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {commodity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">
                    Select commodities from the table to get insights
                  </p>
                )}
                
                <Button
                  onClick={handleGenerateInsights}
                  isLoading={insightsLoading}
                  disabled={selectedCommodities.length === 0 || !location}
                  className="w-full"
                  icon={<BarChart2 className="h-4 w-4" />}
                >
                  Generate Insights
                </Button>
              </div>
              
              {insights && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-semibold mb-3">Market Analysis</h3>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: insights.replace(/\n/g, '<br />') 
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <BarChart2 className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-lg font-semibold">Why Use Market Insights?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Optimal Timing</h3>
            <p className="text-sm text-gray-600">
              Use price forecasts to time your harvest and sales for maximum profit margins.
              Identify the best seasons for specific crops.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Crop Selection</h3>
            <p className="text-sm text-gray-600">
              Choose crops with strong market demand and favorable price trends.
              Avoid oversaturated markets with declining prices.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Strategic Planning</h3>
            <p className="text-sm text-gray-600">
              Plan your farming operations based on market forecasts and trends.
              Make informed decisions about storage, transport, and sales channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;