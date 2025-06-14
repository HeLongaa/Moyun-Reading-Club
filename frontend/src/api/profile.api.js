import api from '../utils/api';

// 获取用户个人资料（可选id）
export function getProfile(id) {
  return api.get(id ? `/profile/${id}` : '/profile');
}

// 更新个人资料
export function updateProfile(data) {
  return api.put('/profile', data);
}

// 上传头像（FormData，字段名为 photo）
export function uploadPhoto(formData) {
  return api.post('/profile/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// 获取用户统计信息（可选id）
export function getStats(id) {
  return api.get(id ? `/profile/stats/get/${id}` : '/profile/stats/get');
}
