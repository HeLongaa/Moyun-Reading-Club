/**
 * 邮件服务
 */
const nodemailer = require('nodemailer');
const { queryConfig } = require('../utils');

class MailService {
  constructor() {
    const emailConfig = queryConfig('E-Mail');
    
    // 检查邮箱配置是否完整
    this.isConfigured = emailConfig.Host && 
                       emailConfig.Port && 
                       emailConfig.Username && 
                       emailConfig.Password && 
                       emailConfig.Sender;
    
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
      console.warn('邮箱服务未完全配置，部分功能可能不可用');
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
   * 发送密码重置邮件
   * @param {string} to 收件人
   * @param {string} resetToken 重置令牌
   * @param {string} username 用户名
   * @returns {Promise<boolean>} 是否发送成功
   */
  async sendPasswordResetEmail(to, resetToken, username) {
    const subject = '墨韵读书交流平台 - 密码重置';
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">密码重置</h2>
        <p>亲爱的 ${username}：</p>
        <p>我们收到了您的密码重置请求。请点击下面的链接重置您的密码：</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">重置密码</a>
        </p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
        <p>此链接将在24小时后失效。</p>
        <p>谢谢！</p>
        <p>墨韵读书交流平台团队</p>
      </div>
    `;
    
    return this.sendMail(to, subject, html);
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