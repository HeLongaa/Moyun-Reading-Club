import api from '../utils/api';
import { ElMessage } from 'element-plus';

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

// 获取用户统计信息（可选id），带 loading 和错误提示
export async function getStats(id, { loading, onError, retry } = {}) {
  if (loading) loading.value = true;
  try {
    const res = await api.get(id ? `/profile/stats/get/${id}` : '/profile/stats/get');
    return res;
  } catch (e) {
    ElMessage.error('统计数据加载失败，请重试');
    if (onError) onError(e);
    if (retry) retry();
    throw e;
  } finally {
    if (loading) loading.value = false;
  }
}

export default {
  getProfile,
  updateProfile,
  uploadPhoto,
  getStats
}
