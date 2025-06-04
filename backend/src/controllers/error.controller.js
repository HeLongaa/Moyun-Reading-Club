/**
 * 错误控制器
 */
const { Error } = require('../models');
const { queryConfig } = require('../utils');

/**
 * 获取错误信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getErrorInfo = async (req, res) => {
  try {
    const { code } = req.params;
    
    // 检查错误代码是否有效
    if (!code || isNaN(parseInt(code))) {
      return res.status(400).json({
        success: false,
        error: '无效的错误代码'
      });
    }
    
    // 查询数据库中的错误信息
    const errorInfo = await Error.findByPk(parseInt(code));
    
    // 如果数据库中没有对应的错误信息，则使用默认错误信息
    if (!errorInfo) {
      const errorImageSource = queryConfig('Path', 'ErrorImageSource');
      let imageUrl = '';
      
      // 根据配置的错误图片来源生成图片URL
      if (errorImageSource === 'HTTP Cats') {
        imageUrl = `https://http.cat/${code}`;
      } else if (errorImageSource === 'HTTP Status Dogs') {
        imageUrl = `https://httpstatusdogs.com/img/${code}.jpg`;
      }
      
      return res.status(200).json({
        success: true,
        data: {
          error_code: parseInt(code),
          title: '未知错误',
          title_en: 'Unknown Error',
          content: '抱歉，发生了未知错误。',
          publish_time: new Date(),
          reference_link: null,
          image_url: imageUrl
        }
      });
    }
    
    // 根据配置的错误图片来源生成图片URL
    const errorImageSource = queryConfig('Path', 'ErrorImageSource');
    let imageUrl = '';
    
    if (errorImageSource === 'HTTP Cats') {
      imageUrl = `https://http.cat/${code}`;
    } else if (errorImageSource === 'HTTP Status Dogs') {
      imageUrl = `https://httpstatusdogs.com/img/${code}.jpg`;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...errorInfo.toJSON(),
        image_url: imageUrl
      }
    });
  } catch (error) {
    console.error('获取错误信息失败:', error);
    res.status(500).json({
      success: false,
      error: '获取错误信息失败，请稍后重试'
    });
  }
};

/**
 * 创建错误信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.createErrorInfo = async (req, res) => {
  try {
    const { error_code, title, title_en, content, reference_link } = req.body;
    
    // 检查必要字段
    if (!error_code || !title || !title_en || !content) {
      return res.status(400).json({
        success: false,
        error: '错误代码、标题和内容不能为空'
      });
    }
    
    // 检查错误代码是否已存在
    const existingError = await Error.findByPk(error_code);
    if (existingError) {
      return res.status(400).json({
        success: false,
        error: '错误代码已存在'
      });
    }
    
    // 创建错误信息
    const errorInfo = await Error.create({
      error_code,
      title,
      title_en,
      content,
      reference_link,
      publish_time: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: '错误信息创建成功',
      data: errorInfo
    });
  } catch (error) {
    console.error('创建错误信息失败:', error);
    res.status(500).json({
      success: false,
      error: '创建错误信息失败，请稍后重试'
    });
  }
};

/**
 * 更新错误信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.updateErrorInfo = async (req, res) => {
  try {
    const { code } = req.params;
    const { title, title_en, content, reference_link } = req.body;
    
    // 查找错误信息
    const errorInfo = await Error.findByPk(parseInt(code));
    
    if (!errorInfo) {
      return res.status(404).json({
        success: false,
        error: '错误信息不存在'
      });
    }
    
    // 更新错误信息
    await errorInfo.update({
      title: title || errorInfo.title,
      title_en: title_en || errorInfo.title_en,
      content: content || errorInfo.content,
      reference_link: reference_link !== undefined ? reference_link : errorInfo.reference_link
    });
    
    res.status(200).json({
      success: true,
      message: '错误信息更新成功',
      data: errorInfo
    });
  } catch (error) {
    console.error('更新错误信息失败:', error);
    res.status(500).json({
      success: false,
      error: '更新错误信息失败，请稍后重试'
    });
  }
};

/**
 * 删除错误信息
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteErrorInfo = async (req, res) => {
  try {
    const { code } = req.params;
    
    // 查找错误信息
    const errorInfo = await Error.findByPk(parseInt(code));
    
    if (!errorInfo) {
      return res.status(404).json({
        success: false,
        error: '错误信息不存在'
      });
    }
    
    // 删除错误信息
    await errorInfo.destroy();
    
    res.status(200).json({
      success: true,
      message: '错误信息删除成功'
    });
  } catch (error) {
    console.error('删除错误信息失败:', error);
    res.status(500).json({
      success: false,
      error: '删除错误信息失败，请稍后重试'
    });
  }
}; 