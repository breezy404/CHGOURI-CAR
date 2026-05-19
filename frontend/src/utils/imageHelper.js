// Image URL formatting helper for hybrid local/Cloudinary support
import { API_BASE_URL } from '../context/AuthContext';

/**
 * Formats a single image URL to work with both local uploads and Cloudinary URLs.
 */
export const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/uploads')) {
    try {
      const urlObj = new URL(API_BASE_URL);
      const rootUrl = `${urlObj.protocol}//${urlObj.host}`;
      return `${rootUrl}${url}`;
    } catch (e) {
      return `http://localhost:5000${url}`;
    }
  }
  
  return url;
};

/**
 * Safely parses any image field (string, JSON string, or array) 
 * and returns an array of formatted image URLs.
 */
export const normalizeImages = (imageField) => {
  let list = [];
  if (!imageField) {
    return ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600'];
  }

  if (Array.isArray(imageField)) {
    list = imageField;
  } else if (typeof imageField === 'string') {
    if (imageField.trim().startsWith('[')) {
      try {
        list = JSON.parse(imageField);
        if (!Array.isArray(list)) list = [list];
      } catch (e) {
        list = [imageField];
      }
    } else {
      list = [imageField];
    }
  }

  // Filter out any invalid items and map to formatted URLs
  const formattedList = list.filter(Boolean).map(url => formatImageUrl(url));
  
  return formattedList.length > 0 ? formattedList : ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600'];
};
