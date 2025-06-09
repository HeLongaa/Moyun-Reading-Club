/**
 * 模型索引文件
 * 导出所有模型，并建立模型之间的关联关系
 */

const User = require('./user.model');
const Book = require('./book.model');
const Journal = require('./journal.model');
const JournalComment = require('./journalComment.model');
const JournalLike = require('./journalLike.model');
const Group = require('./group.model');
const GroupUser = require('./groupUser.model');
const GroupDiscussion = require('./groupDiscussion.model');
const GroupDiscussionReply = require('./groupDiscussionReply.model');
const Chat = require('./chat.model');
const Error = require('./error.model');

// 用户与书评的关联
User.hasMany(Journal, { foreignKey: 'author_id', as: 'journals' });
Book.hasMany(Journal, { foreignKey: 'book_id', as: 'journals' });

// 用户与书评评论的关联
User.hasMany(JournalComment, { foreignKey: 'author_id', as: 'journalComments' });
Journal.hasMany(JournalComment, { foreignKey: 'journal_id', as: 'comments' });

// 用户与书评点赞的关联
User.hasMany(JournalLike, { foreignKey: 'author_id', as: 'journalLikes' });
Journal.hasMany(JournalLike, { foreignKey: 'journal_id', as: 'likes' });

// 用户与圈子的关联
User.hasMany(Group, { foreignKey: 'founder_id', as: 'foundedGroups' });

// 用户与圈子讨论的关联
User.hasMany(GroupDiscussion, { foreignKey: 'poster_id', as: 'discussions' });
Group.hasMany(GroupDiscussion, { foreignKey: 'group_id', as: 'discussions' });

// 用户与圈子讨论回复的关联
GroupDiscussion.hasMany(GroupDiscussionReply, { foreignKey: 'discussion_id', as: 'replies' });

// 用户与聊天的关联
User.hasMany(Chat, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Chat, { foreignKey: 'receiver_id', as: 'receivedMessages' });

module.exports = {
  User,
  Book,
  Journal,
  JournalComment,
  JournalLike,
  Group,
  GroupUser,
  GroupDiscussion,
  GroupDiscussionReply,
  Chat,
  Error
}; 