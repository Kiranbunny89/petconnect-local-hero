// Image utilities for file handling and validation

export const validateImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      resolve(false);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      resolve(false);
      return;
    }

    resolve(true);
  });
};

export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to base64
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};