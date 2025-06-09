/**
 * API服务
 * 用于与第三方API交互
 */
const axios = require('axios');
const config = require('../utils/index');

class ApiService {
  constructor() {
    // 添加配置检查和默认值
    if (!config || !config.OPENAI) {
      throw new Error('OpenAI configuration is missing');
    }
    this.openAIConfig = {
      api_key: config.OPENAI.api_key,
      api_url: config.OPENAI.api_url || 'https://api.openai.com',
      model: config.OPENAI.model || 'gpt-3.5-turbo'
    };
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
   * 调用大模型
   * @param {string} prompt 提示词
   * @returns {Promise<Object>} 模型响应
   */
  async chat2OpenAPI(prompt) {
    try {
      const { api_key, model } = this.openAIConfig;
      const url = this.openAIConfig.api_url + '/v1/chat/completions';
      
      const response = await axios.post(
        url,
        {
          model,
          messages: [
            {
              role: "assistant",
              content: "你是一个有帮助的助手。"
            },
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_key}`
          }
        }
      );

      const assistantMessage = response.data.choices[0].message.content;
      return {
        success: true,
        data: assistantMessage,
        use: response.data.usage
      };
    } catch (error) {
      console.error('调用OpenAI模型失败:', error);
      return {
        success: false,
        error: '调用OpenAI模型失败',
        details: error.response?.data || error.message
      };
    }
  }
}

module.exports = ApiService;