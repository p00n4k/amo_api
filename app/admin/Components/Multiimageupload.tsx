'use client';

import React, { useState } from 'react';
import { Upload, message, Image as AntImage, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import axios from 'axios';

interface MultiImageUploadProps {
    images: Array<{ image_id?: number; image_url: string; display_order?: number }>;
    onImageAdd: (imageUrl: string, displayOrder?: number) => Promise<void>;
    onImageDelete: (imageId: number) => Promise<void>;
    showOrder?: boolean;
    maxImages?: number;
}

export default function MultiImageUpload({
    images,
    onImageAdd,
    onImageDelete,
    showOrder = true,
    maxImages = 10,
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        if (images.length >= maxImages) {
            message.error(`Maximum ${maxImages} images allowed!`);
            return false;
        }

        // Validate file size (5MB)
        const isLtMaxSize = file.size / 1024 / 1024 < 5;
        if (!isLtMaxSize) {
            message.error('Image must be smaller than 5MB!');
            return false;
        }

        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const url = response.data.url;
            const nextOrder = showOrder ? (images.length > 0 ? Math.max(...images.map(img => img.display_order || 0)) + 1 : 1) : undefined;

            await onImageAdd(url, nextOrder);
            message.success('Image uploaded successfully!');
        } catch (error: any) {
            console.error('Upload error:', error);
            message.error(error.response?.data?.error || 'Upload failed!');
        } finally {
            setUploading(false);
        }

        return false;
    };

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {images.map((img, index) => (
                    <div
                        key={img.image_id || index}
                        style={{
                            position: 'relative',
                            width: 200,
                            border: '1px solid #d9d9d9',
                            borderRadius: 8,
                            padding: 8,
                        }}
                    >
                        <AntImage
                            src={img.image_url}
                            alt={`Image ${index + 1}`}
                            style={{
                                width: '100%',
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: 4,
                            }}
                        />
                        <div
                            style={{
                                marginTop: 8,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {showOrder && (
                                <span style={{ fontSize: 12, color: '#666' }}>
                                    Order: {img.display_order}
                                </span>
                            )}
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => img.image_id && onImageDelete(img.image_id)}
                                disabled={!img.image_id}
                            />
                        </div>
                    </div>
                ))}

                {images.length < maxImages && (
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={handleUpload}
                        accept="image/*"
                        disabled={uploading}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                )}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                {images.length} / {maxImages} images uploaded
            </div>
        </div>
    );
}