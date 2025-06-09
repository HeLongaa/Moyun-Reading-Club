/**
 * 公共路由控制器
 * 用于与大语言模型交互等功能
 */
const ApiService = require('../services/apiService');

// 创建API服务实例
const apiService = new ApiService();

/**
 * 调用模型
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // 检查必要字段
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: '提示词不能为空'
      });
    }
    
    // 调用模型
    const result = await apiService.chat2OpenAPI(prompt);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || '调用大模型失败'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        response: result.data
      }
    });
  } catch (error) {
    console.error('调用大模型失败:', error);
    res.status(500).json({
      success: false,
      error: '调用大模型失败，请稍后重试'
    });
  }
};

/**
 * 书籍推荐
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.recommendBooks = async (req, res) => {
  try {
    const { preferences, genres, exclude } = req.body;
    
    // 检查必要字段
    if (!preferences && !genres) {
      return res.status(400).json({
        success: false,
        error: '偏好或类型不能同时为空'
      });
    }
    
    // 构建提示词
    let prompt = '请推荐一些书籍，';
    
    if (preferences) {
      prompt += `根据以下偏好：${preferences}，`;
    }
    
    if (genres) {
      prompt += `类型为：${genres}，`;
    }
    
    if (exclude) {
      prompt += `排除以下书籍：${exclude}，`;
    }
    
    prompt += '请给出书名、作者和简短推荐理由。';
    
    // 调用通义千问模型
    const result = await apiService.callQwenModel(prompt);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || '获取书籍推荐失败'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        recommendations: result.data
      }
    });
  } catch (error) {
    console.error('获取书籍推荐失败:', error);
    res.status(500).json({
      success: false,
      error: '获取书籍推荐失败，请稍后重试'
    });
  }
};

/**
 * 书评生成
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.generateJournal = async (req, res) => {
  try {
    const { bookTitle, author, thoughts, style } = req.body;
    
    // 检查必要字段
    if (!bookTitle || !author) {
      return res.status(400).json({
        success: false,
        error: '书名和作者不能为空'
      });
    }
    
    // 构建提示词
    let prompt = `请为《${bookTitle}》（作者：${author}）写一篇书评，`;
    
    if (thoughts) {
      prompt += `我的阅读感受是：${thoughts}，`;
    }
    
    if (style) {
      prompt += `风格要求：${style}，`;
    }
    
    prompt += '请给出标题、首段和正文内容。';
    
    // 调用通义千问模型
    const result = await apiService.callQwenModel(prompt);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || '生成书评失败'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        journal: result.data
      }
    });
  } catch (error) {
    console.error('生成书评失败:', error);
    res.status(500).json({
      success: false,
      error: '生成书评失败，请稍后重试'
    });
  }
}; 