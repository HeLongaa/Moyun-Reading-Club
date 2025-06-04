/**
 * API服务
 * 用于与第三方API交互
 */
const axios = require('axios');
const { queryConfig } = require('../utils');

class ApiService {
  constructor() {
    this.weatherConfig = queryConfig('Yiketianqi');
    this.qwenConfig = queryConfig('Qwen');
    
    // 检查配置是否完整
    this.weatherConfigured = this.weatherConfig.appid && this.weatherConfig.appsecret;
    this.qwenConfigured = this.qwenConfig.api_key;
    
    if (!this.weatherConfigured) {
      console.warn('一刻天气API未完全配置，相关功能可能不可用');
    }
    
    if (!this.qwenConfigured) {
      console.warn('通义千问API未完全配置，相关功能可能不可用');
    }
  }
  
  /**
   * 获取今日诗词
   * @returns {Promise<Object>} 诗词数据
   */
  async getTodayPoem() {
    try {
      const response = await axios.get('https://v2.jinrishici.com/one.json');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('获取今日诗词失败:', error);
      return {
        success: false,
        error: '获取今日诗词失败'
      };
    }
  }
  
  /**
   * 获取天气信息
   * @param {string} city 城市名称
   * @returns {Promise<Object>} 天气数据
   */
  async getWeather(city) {
    if (!this.weatherConfigured) {
      return {
        success: false,
        error: '一刻天气API未配置'
      };
    }
    
    try {
      const { version, appid, appsecret } = this.weatherConfig;
      const url = `https://yiketianqi.com/api?version=${version}&appid=${appid}&appsecret=${appsecret}&city=${encodeURIComponent(city)}`;
      
      const response = await axios.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('获取天气信息失败:', error);
      return {
        success: false,
        error: '获取天气信息失败'
      };
    }
  }
  
  /**
   * 调用通义千问模型
   * @param {string} prompt 提示词
   * @returns {Promise<Object>} 模型响应
   */
  async callQwenModel(prompt) {
    if (!this.qwenConfigured) {
      return {
        success: false,
        error: '通义千问API未配置'
      };
    }
    
    try {
      const { api_key, model } = this.qwenConfig;
      const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
      
      const response = await axios.post(
        url,
        {
          model,
          input: {
            prompt
          },
          parameters: {
            temperature: 0.7,
            top_p: 0.8,
            top_k: 50
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_key}`
          }
        }
      );
      
      return {
        success: true,
        data: response.data.output.text
      };
    } catch (error) {
      console.error('调用通义千问模型失败:', error);
      return {
        success: false,
        error: '调用通义千问模型失败'
      };
    }
  }
}

module.exports = ApiService; 