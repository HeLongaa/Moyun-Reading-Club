/**
 * 文件管理服务
 */
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { queryConfig, generateRandomString, ensureDirectoryExists, getFileExtension, isAllowedFileType } = require('../utils');

class FileManager {
  constructor() {
    // 获取存储路径配置
    const storagePath = queryConfig('Path', 'StoragePath') || '../static';
    this.storagePath = path.resolve(process.cwd(), storagePath);
    
    // 确保存储目录存在
    ensureDirectoryExists(this.storagePath);
    
    // 定义允许的文件类型
    this.allowedImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    this.allowedbookTypes = ['.txt', '.pdf', '.epub', '.mobi', '.azw3'];
    // 初始化各类文件的存储路径
    this.profilePhotoPath = path.join(this.storagePath, 'profilePhoto');
    this.bookCoverPath = path.join(this.storagePath, 'bookCover');
    this.journalHeaderPath = path.join(this.storagePath, 'journalHeader');
    this.groupIconPath = path.join(this.storagePath, 'groupIcon');
    this.bookLocalPath = path.join(this.storagePath, 'bookLocal');

    // 确保各类文件的存储目录存在
    ensureDirectoryExists(this.profilePhotoPath);
    ensureDirectoryExists(this.bookCoverPath);
    ensureDirectoryExists(this.journalHeaderPath);
    ensureDirectoryExists(this.groupIconPath);
    ensureDirectoryExists(this.bookLocalPath);
  }
  
  /**
   * 配置Multer存储
   * @param {string} destination 目标路径
   * @returns {multer.StorageEngine} Multer存储引擎
   */
  configureStorage(destination) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + generateRandomString(8);
        const extension = getFileExtension(file.originalname);
        cb(null, uniqueSuffix + extension);
      }
    });
  }
  
  /**
   * 文件过滤器
   * @param {Array<string>} allowedTypes 允许的文件类型
   * @returns {Function} 文件过滤函数
   */
  fileFilter(allowedTypes) {
    return (req, file, cb) => {
      const extension = getFileExtension(file.originalname);
      if (isAllowedFileType(extension, allowedTypes)) {
        cb(null, true);
      } else {
        cb(new Error('不支持的文件类型'), false);
      }
    };
  }
  
  /**
   * 获取用户头像上传中间件
   * @returns {multer.Multer} Multer中间件
   */
  getProfilePhotoUploader() {
    return multer({
      storage: this.configureStorage(this.profilePhotoPath),
      fileFilter: this.fileFilter(this.allowedImageTypes),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }
  
  /**
   * 获取书籍封面上传中间件
   * @returns {multer.Multer} Multer中间件
   */
  getBookCoverUploader() {
    return multer({
      storage: this.configureStorage(this.bookCoverPath),
      fileFilter: this.fileFilter(this.allowedImageTypes),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }

  /**
   * 获取书籍上传中间件
   * @returns {multer.Multer} Multer中间件
   */
  getBookUploader() {
    return multer({
      storage: this.configureStorage(this.bookLocalPath),
      fileFilter: this.fileFilter(this.allowedbookTypes),
      limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
      }
    });
  }
  
  /**
   * 获取书评头图上传中间件
   * @returns {multer.Multer} Multer中间件
   */
  getJournalHeaderUploader() {
    return multer({
      storage: this.configureStorage(this.journalHeaderPath),
      fileFilter: this.fileFilter(this.allowedImageTypes),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }
  
  /**
   * 获取圈子图标上传中间件
   * @returns {multer.Multer} Multer中间件
   */
  getGroupIconUploader() {
    return multer({
      storage: this.configureStorage(this.groupIconPath),
      fileFilter: this.fileFilter(this.allowedImageTypes),
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }
  
  /**
   * 删除文件
   * @param {string} filePath 文件路径
   * @returns {Promise<boolean>} 是否删除成功
   */
  async deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }
}

module.exports = FileManager; 