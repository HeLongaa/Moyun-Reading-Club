/**
 * 邮件服务
 */
const nodemailer = require('nodemailer');
const { queryConfig } = require('../utils');

class MailService {
  constructor() {
    const emailConfig = queryConfig('E-Mail');
    
    // 添加调试日志
    console.log('邮箱配置:', {
      host: emailConfig.Host,
      port: emailConfig.Port,
      username: emailConfig.Username,
      hasPassword: !!emailConfig.Password
    });
    
    // 检查邮箱配置是否完整
    this.isConfigured = emailConfig.Host && 
                       emailConfig.Port && 
                       emailConfig.Username && 
                       emailConfig.Password;
    
    if (this.isConfigured) {
      // 创建邮件传输对象
      this.transporter = nodemailer.createTransport({
        host: emailConfig.Host,
        port: emailConfig.Port,
        secure: emailConfig.Port === 465, // true for 465, false for other ports
        auth: {
          user: emailConfig.Username,
          pass: emailConfig.Password
        }
      });
    } else {
      console.warn('邮箱配置不完整:', {
        missingHost: !emailConfig.Host,
        missingPort: !emailConfig.Port,
        missingUsername: !emailConfig.Username,
        missingPassword: !emailConfig.Password
      });
    }
  }
  
  /**
   * 发送邮件
   * @param {string} to 收件人
   * @param {string} subject 主题
   * @param {string} html 邮件内容（HTML格式）
   * @returns {Promise<boolean>} 是否发送成功
   */
  async sendMail(to, subject, html) {
    if (!this.isConfigured) {
      console.error('邮箱服务未配置，无法发送邮件');
      return false;
    }
    
    try {
      const emailConfig = queryConfig('E-Mail');
      const info = await this.transporter.sendMail({
        from: `"墨韵读书交流平台" <${emailConfig.Sender}>`,
        to,
        subject,
        html
      });
      
      console.log('邮件发送成功:', info.messageId);
      return true;
    } catch (error) {
      console.error('邮件发送失败:', error);
      return false;
    }
  }
  
  /**
   * 发送验证码邮件
   * @param {string} to 收件人邮箱
   * @param {string} code 验证码
   * @param {string} account 用户账号
   */
  async sendVerificationCode(to, code, account) {
    const subject = '密码重置验证码';
    const content = `
      <h1>密码重置验证码</h1>
      <p>亲爱的 ${account}：</p>
      <p>您正在尝试重置密码。您的验证码是：</p>
      <h2 style="color: #1a73e8;">${code}</h2>
      <p>此验证码将在10分钟后过期。如果这不是您本人的操作，请忽略此邮件。</p>
      <p>谢谢！</p>
      <p>墨韵读书会团队</p>
    `;
    
    return this.sendMail(to, subject, content);
  }
  
  /**
   * 发送注册确认邮件
   * @param {string} to 收件人
   * @param {string} username 用户名
   * @returns {Promise<boolean>} 是否发送成功
   */
  async sendRegistrationEmail(to, username) {
    const subject = '欢迎加入墨韵读书交流平台';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">欢迎加入墨韵读书交流平台</h2>
        <p>亲爱的 ${username}：</p>
        <p>感谢您注册墨韵读书交流平台！我们很高兴您能加入我们的社区。</p>
        <p>在墨韵，您可以：</p>
        <ul>
          <li>发表书评，分享您的阅读心得</li>
          <li>加入读书圈子，与志同道合的书友交流</li>
          <li>探索各类书籍，发现更多阅读乐趣</li>
        </ul>
        <p>如果您有任何问题或建议，欢迎随时联系我们。</p>
        <p>祝您阅读愉快！</p>
        <p>墨韵读书交流平台团队</p>
      </div>
    `;
    
    return this.sendMail(to, subject, html);
  }
}

module.exports = MailService;