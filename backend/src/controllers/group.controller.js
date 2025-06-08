/**
 * 圈子控制器
 */
const { Op } = require('sequelize');
const { Group, GroupUser, GroupDiscussion, GroupDiscussionReply, User } = require('../models');
const FileManager = require('../services/fileManager');

// 创建文件管理器实例
const fileManager = new FileManager();

/**
 * 获取圈子列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // 查询圈子
    const { count, rows: groups } = await Group.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'founder',
          attributes: ['id', 'account', 'signature', 'avatar_path']
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['establish_time', 'DESC']]
    });
    
    // 查询每个圈子的成员数量和讨论数量
    const groupsWithStats = await Promise.all(groups.map(async (group) => {
      const memberCount = await GroupUser.count({ where: { group_id: group.id } });
      const discussionCount = await GroupDiscussion.count({ where: { group_id: group.id } });
      
      // 如果用户已登录，检查用户是否已加入该圈子
      let isJoined = false;
      if (req.user) {
        const membership = await GroupUser.findOne({
          where: {
            group_id: group.id,
            user_id: req.user.id
          }
        });
        isJoined = !!membership;
      }
      
      return {
        ...group.toJSON(),
        memberCount,
        discussionCount,
        isJoined
      };
    }));
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        groups: groupsWithStats
      }
    });
  } catch (error) {
    console.error('获取圈子列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取圈子列表失败，请稍后重试'
    });
  }
};

/**
 * 获取圈子详情
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: 'founder',
          attributes: ['id', 'account', 'signature', 'avatar_path']
        }
      ]
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 查询成员数量和讨论数量
    const memberCount = await GroupUser.count({ where: { group_id: id } });
    const discussionCount = await GroupDiscussion.count({ where: { group_id: id } });
    
    // 如果用户已登录，检查用户是否已加入该圈子
    let isJoined = false;
    if (req.user) {
      const membership = await GroupUser.findOne({
        where: {
          group_id: id,
          user_id: req.user.id
        }
      });
      isJoined = !!membership;
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...group.toJSON(),
        memberCount,
        discussionCount,
        isJoined
      }
    });
  } catch (error) {
    console.error('获取圈子详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取圈子详情失败，请稍后重试'
    });
  }
};

/**
 * 创建圈子
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const founder_id = req.user.id;
    
    // 检查必要字段
    if (!name) {
      return res.status(400).json({
        success: false,
        error: '圈子名称不能为空'
      });
    }
    
    // 检查圈子名称是否已存在
    const existingGroup = await Group.findOne({ where: { name } });
    if (existingGroup) {
      return res.status(400).json({
        success: false,
        error: '圈子名称已存在'
      });
    }
    
    // 创建圈子
    const group = await Group.create({
      name,
      description,
      founder_id,
      establish_time: new Date()
    });
    
    // 创建者自动加入圈子
    await GroupUser.create({
      user_id: founder_id,
      group_id: group.id,
      join_time: new Date(),
      stats: 'agree'
    });
    
    res.status(201).json({
      success: true,
      message: '圈子创建成功',
      data: group
    });
  } catch (error) {
    console.error('创建圈子失败:', error);
    res.status(500).json({
      success: false,
      error: '创建圈子失败，请稍后重试'
    });
  }
};

/**
 * 更新圈子
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    
    // 查找圈子
    const group = await Group.findByPk(id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查是否为创建者或管理员
    if (group.founder_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限修改这个圈子'
      });
    }
    
    // 如果更改了名称，检查新名称是否已存在
    if (name && name !== group.name) {
      const existingGroup = await Group.findOne({ where: { name } });
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          error: '新圈子名称已存在'
        });
      }
    }
    
    // 更新圈子
    await group.update({
      name: name || group.name,
      description: description !== undefined ? description : group.description
    });
    
    res.status(200).json({
      success: true,
      message: '圈子更新成功',
      data: group
    });
  } catch (error) {
    console.error('更新圈子失败:', error);
    res.status(500).json({
      success: false,
      error: '更新圈子失败，请稍后重试'
    });
  }
};

/**
 * 删除圈子
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // 查找圈子
    const group = await Group.findByPk(id);
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查是否为创建者或管理员
    if (group.founder_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限删除这个圈子'
      });
    }
    
    // 删除圈子
    await group.destroy();
    
    res.status(200).json({
      success: true,
      message: '圈子删除成功'
    });
  } catch (error) {
    console.error('删除圈子失败:', error);
    res.status(500).json({
      success: false,
      error: '删除圈子失败，请稍后重试'
    });
  }
};

/**
 * 加入圈子
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查是否已加入圈子
    const existingMembership = await GroupUser.findOne({
      where: {
        group_id: id,
        user_id
      }
    });
    
    if (existingMembership) {
      if (existingMembership.stats == 'agree') {
        return res.status(400).json({
          success: true,
          message: '您已经是该圈子的成员'
        });
      } else if (existingMembership.stats == 'wait') {
        return res.status(400).json({
          success: false,
          error: '您的加入申请正在审核中，请耐心等待'
        });
      }
      return res.status(400).json({
        success: false,
        error: '您已被拒绝加入该圈子，请联系圈子管理员'
      });
      
    }
    
    // 加入圈子
    await GroupUser.create({
      group_id: id,
      user_id,
      join_time: new Date(),
      stats: 'wait' // 初始状态为等待审核
    });
    // 发送通知给圈子管理员（需要添加通知服务）
    res.status(200).json({
      success: true,
      message: '成功加入圈子，等待管理员审核'
    });
  } catch (error) {
    console.error('加入圈子失败:', error);
    res.status(500).json({
      success: false,
      error: '加入圈子失败，请稍后重试'
    });
  }
};

/**
 * 退出圈子
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查是否为创建者
    if (group.founder_id === user_id) {
      return res.status(400).json({
        success: false,
        error: '圈子创建者不能退出圈子'
      });
    }
    
    // 检查是否已加入圈子
    const membership = await GroupUser.findOne({
      where: {
        group_id: id,
        user_id
      }
    });
    
    if (!membership) {
      return res.status(400).json({
        success: false,
        error: '您不是该圈子的成员'
      });
    }
    
    // 退出圈子
    await membership.destroy();
    
    res.status(200).json({
      success: true,
      message: '成功退出圈子'
    });
  } catch (error) {
    console.error('退出圈子失败:', error);
    res.status(500).json({
      success: false,
      error: '退出圈子失败，请稍后重试'
    });
  }
};

/**
 * 获取圈子成员列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 查询成员
    const { count, rows: memberships } = await GroupUser.findAndCountAll({
      where: { group_id: id, stats: 'agree' }, // 只查询已同意加入的成员
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'account', 'signature', 'role', 'avatar_path']
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['join_time', 'DESC']]
    });
    
    // 提取用户信息
    const members = memberships.map(membership => ({
      ...membership.user.toJSON(),
      join_time: membership.join_time,
      isFounder: membership.user.id === group.founder_id
    }));
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        members
      }
    });
  } catch (error) {
    console.error('获取圈子成员列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取圈子成员列表失败，请稍后重试'
    });
  }
};

/**
 * 获取圈子讨论列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getGroupDiscussions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 查询讨论
    const { count, rows: discussions } = await GroupDiscussion.findAndCountAll({
      where: { group_id: id },
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'account', 'signature']
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['post_time', 'DESC']]
    });
    
    // 查询每个讨论的回复数量
    const discussionsWithReplyCount = await Promise.all(discussions.map(async (discussion) => {
      const replyCount = await GroupDiscussionReply.count({
        where: { discussion_id: discussion.id }
      });
      
      return {
        ...discussion.toJSON(),
        replyCount
      };
    }));
    
    res.status(200).json({
      success: true,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        discussions: discussionsWithReplyCount
      }
    });
  } catch (error) {
    console.error('获取圈子讨论列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取圈子讨论列表失败，请稍后重试'
    });
  }
};

/**
 * 创建圈子讨论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.createDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const poster_id = req.user.id;
    
    // 检查必要字段
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: '标题和内容不能为空'
      });
    }
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查用户是否为圈子成员
    const membership = await GroupUser.findOne({
      where: {
        group_id: id,
        user_id: poster_id
      }
    });
    
    if (!membership) {
      return res.status(403).json({
        success: false,
        error: '您不是该圈子的成员，无法发表讨论'
      });
    }
    
    // 创建讨论
    const discussion = await GroupDiscussion.create({
      group_id: id,
      poster_id,
      title,
      content,
      post_time: new Date(),
      is_read: false
    });
    
    // 获取发帖人信息
    const poster = await User.findByPk(poster_id, {
      attributes: ['id', 'account', 'signature', 'avatar_path']
    });
    
    res.status(201).json({
      success: true,
      message: '讨论创建成功',
      data: {
        ...discussion.toJSON(),
        poster: poster.toJSON()
      }
    });
  } catch (error) {
    console.error('创建讨论失败:', error);
    res.status(500).json({
      success: false,
      error: '创建讨论失败，请稍后重试'
    });
  }
};

/**
 * 获取圈子讨论详情
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.getDiscussionById = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 查询讨论
    const discussion = await GroupDiscussion.findOne({
      where: {
        id: discussionId,
        group_id: id
      },
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'account', 'signature']
        }
      ]
    });
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: '讨论不存在'
      });
    }
    
    // 查询回复
    const replies = await GroupDiscussionReply.findAll({
      where: { discussion_id: discussionId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'account', 'signature']
        }
      ],
      order: [['reply_time', 'ASC']]
    });
    
    // 标记为已读（如果用户已登录且是讨论的接收者）
    if (req.user && discussion.poster_id !== req.user.id) {
      await discussion.update({ is_read: true });
    }
    
    res.status(200).json({
      success: true,
      data: {
        discussion: discussion.toJSON(),
        replies
      }
    });
  } catch (error) {
    console.error('获取讨论详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取讨论详情失败，请稍后重试'
    });
  }
};

/**
 * 回复圈子讨论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.replyToDiscussion = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    const { content } = req.body;
    const author_id = req.user.id;
    
    // 检查必要字段
    if (!content) {
      return res.status(400).json({
        success: false,
        error: '回复内容不能为空'
      });
    }
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查讨论是否存在
    const discussion = await GroupDiscussion.findOne({
      where: {
        id: discussionId,
        group_id: id
      }
    });
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: '讨论不存在'
      });
    }
    
    // 检查用户是否为圈子成员
    const membership = await GroupUser.findOne({
      where: {
        group_id: id,
        user_id: author_id
      }
    });
    
    if (!membership) {
      return res.status(403).json({
        success: false,
        error: '您不是该圈子的成员，无法回复讨论'
      });
    }
    
    // 创建回复
    const reply = await GroupDiscussionReply.create({
      discussion_id: discussionId,
      author_id,
      content,
      reply_time: new Date(),
      is_read: false
    });
    
    // 获取回复作者信息
    const author = await User.findByPk(author_id, {
      attributes: ['id', 'account', 'signature', 'avatar_path']
    });
    
    res.status(201).json({
      success: true,
      message: '回复成功',
      data: {
        ...reply.toJSON(),
        author: author.toJSON()
      }
    });
  } catch (error) {
    console.error('回复讨论失败:', error);
    res.status(500).json({
      success: false,
      error: '回复讨论失败，请稍后重试'
    });
  }
};

/**
 * 删除圈子讨论
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.deleteDiscussion = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    const userId = req.user.id;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 查询讨论
    const discussion = await GroupDiscussion.findOne({
      where: {
        id: discussionId,
        group_id: id
      }
    });
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: '讨论不存在'
      });
    }
    
    // 检查是否为讨论发起人、圈子创建者或管理员
    if (discussion.poster_id !== userId && group.founder_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限删除这个讨论'
      });
    }
    
    // 删除讨论
    await discussion.destroy();
    
    res.status(200).json({
      success: true,
      message: '讨论删除成功'
    });
  } catch (error) {
    console.error('删除讨论失败:', error);
    res.status(500).json({
      success: false,
      error: '删除讨论失败，请稍后重试'
    });
  }
};

/**
 * 上传圈子图标
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
exports.uploadGroupIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的图标'
      });
    }
    const id = req.params.id;
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    } else if (group.group_icon && group.group_icon !== '/groupIcon/default.png') {
      // 删除旧图标
      await fileManager.deleteFile(group.group_icon);
    }
    // 检查用户是否为圈子创建者或管理员
    if (group.founder_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限上传图标'
      });
    }

    // 文件路径
    const filePath = `/groupIcon/${req.file.filename}`;
    await group.update({
      group_icon: filePath
    });

    res.status(200).json({
      success: true,
      message: '图标上传成功',
      data: {
        path: filePath
      }
    });
  } catch (error) {
    console.error('上传图标失败:', error);
    res.status(500).json({
      success: false,
      error: '上传图标失败，请稍后重试'
    });
  }
}; 

/**
 * 获取待审核的成员列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */

exports.getPendingMembers = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查用户是否为圈子创建者或管理员
    if (group.founder_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限查看待审核成员'
      });
    }
    
    // 查询待审核成员
    const pendingMembers = await GroupUser.findAll({
      where: {
        group_id: id,
        state: 'wait'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'account', 'signature', 'avatar_path']
        }
      ],
      order: [['join_time', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: pendingMembers.map(membership => ({
        ...membership.toJSON(),
        user: membership.user.toJSON()
      }))
    });
  } catch (error) {
    console.error('获取待审核成员列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取待审核成员列表失败，请稍后重试'
    });
  }
};

exports.approveMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const isOno = req.body.isOno; // 是否同意加入，true为同意，false为拒绝
    
    // 检查圈子是否存在
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: '圈子不存在'
      });
    }
    
    // 检查用户是否为圈子创建者或管理员
    if (group.founder_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: '您没有权限审核成员'
      });
    }
    
    // 查找待审核成员
    const membership = await GroupUser.findOne({
      where: {
        group_id: id,
        user_id: userId,
        state: 'wait'
      }
    });
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        error: '待审核成员不存在'
      });
    }
    // 更新成员状态为同意/拒绝
    await membership.update({ state: isOno ? 'agree' : 'refuse' });
    
    res.status(200).json({
      success: true,
      message: isOno ? '成员审核通过' : '成员审核不通过',
      data: {
        user_id: userId,
        state: isOno ? 'agree' : 'refuse'
      }
    });
  } catch (error) {
    console.error('审核成员失败:', error);
    res.status(500).json({
      success: false,
      error: '审核成员失败，请稍后重试'
    });
  }
};