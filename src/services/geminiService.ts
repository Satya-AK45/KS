import { textModel, visionModel } from '../config/gemini';
import { WeatherData } from '../types/weather';

// Generate crop suggestions based on location and weather data
export const getCropSuggestions = async (
  location: string,
  weatherData: WeatherData,
  soilType?: string,
  farmSize?: string
) => {
  try {
    const prompt = `
      I need crop suggestions for farming in ${location} based on the following weather data:
      Current temperature: ${weatherData.current.temp_c}°C
      Humidity: ${weatherData.current.humidity}%
      Precipitation: ${weatherData.current.precip_mm}mm
      Wind speed: ${weatherData.current.wind_kph} kph
      
      ${soilType ? `Soil type: ${soilType}` : ''}
      ${farmSize ? `Farm size: ${farmSize}` : ''}
      
      Please provide:
      1. Top 5 suitable crops for this weather with brief explanations
      2. Best planting time for each crop
      3. Estimated growing period
      4. Any specific recommendations for optimizing yield
      dont make bold using abstric and Write clean  
      dont provide Extra info other than crop
      Format the response in a structured way that's easy to read.
    `;
    
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating crop suggestions:', error);
    throw error;
  }
};

// Detect plant diseases from image
export const detectPlantDisease = async (imageData: string) => {
  try {
    const prompt = `
      Analyze this plant/crop image and identify any diseases or issues.
      
      If a disease is present:
      1. Identify the disease name
      2. Describe the symptoms visible in the image
      3. Explain the cause of the disease
      4. Recommend treatment and prevention methods
      5. Rate severity on a scale of 1-10
      
      If the plant looks healthy, confirm that and explain why it appears healthy.
      dont make bold using abstric
      Please provide a structured, detailed response.
    `;
    
    // Extract base64 string without prefix
    const base64Image = imageData.split(',')[1];

    // Call the vision model with base64 string (not Uint8Array)
    const result = await visionModel.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error detecting plant disease:', error);
    throw error;
  }
};


// Generate market insights using Gemini
export const generateMarketInsights = async (commodities: string[], locationData: string) => {
  try {
    const prompt = `
      Generate detailed market insights for the following agricultural commodities:
      ${commodities.join(', ')}
      
      Location information: ${locationData}
      
      Please provide:
      1. Current market trends for each commodity
      2. Price predictions for the next 3 months dont mention dates
      3. Factors that might affect prices (weather, demand, policies)
      4. Optimal time to sell each commodity for maximum profit
      5. Recommended storage strategies if prices are expected to rise
      
      Format dont make bold using abstric the response to be easily readable with clear sections for each commodity.
    `;
    
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating market insights:', error);
    throw error;
  }
};