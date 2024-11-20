import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string = 'projects'
): Promise<{ url: string; public_id: string }> => {
  try {
    const b64 = Buffer.from(file).toString('base64');
    const dataURI = `data:image/jpeg;base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const deleteFromCloudinary = async (public_id: string) => {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete file');
    }
  };