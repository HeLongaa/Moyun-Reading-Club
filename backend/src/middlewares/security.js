/**
 * 安全检查中间件
 * 包含各种安全相关的检查和防护措施
 */

const securityCheck = (req, res, next) => {
  // 设置安全相关的HTTP头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // 检查请求是否包含可疑内容
  const requestBody = req.body;
  if (requestBody) {
    // 简单的SQL注入检查
    const sqlInjectionPattern = /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i;
    const jsonString = JSON.stringify(requestBody);
    
    if (sqlInjectionPattern.test(jsonString)) {
      return res.status(403).json({
        error: '检测到潜在的SQL注入尝试',
        success: false
      });
    }
  }
  
  next();
};

module.exports = {
  securityCheck
}; 