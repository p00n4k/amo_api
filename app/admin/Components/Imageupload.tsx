'use client';

import React, { useState } from 'react';
import { Upload, message, Image as AntImage } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';

interface ImageUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    maxSize?: number; // in MB
}

export default function ImageUpload({ value, onChange, maxSize = 5 }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(value || '');

    const handleUpload = async (file: File) => {
        // Validate file size
        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            message.error(`Image must be smaller than ${maxSize}MB!`);
            return false;
        }

        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const url = response.data.url;
            setImageUrl(url);

            if (onChange) {
                onChange(url);
            }

            message.success('Upload successful!');
        } catch (error: any) {
            console.error('Upload error:', error);
            message.error(error.response?.data?.error || 'Upload failed!');
        } finally {
            setLoading(false);
        }

        return false; // Prevent default upload behavior
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleUpload}
                accept="image/*"
            >
                {imageUrl ? (
                    <AntImage
                        src={imageUrl}
                        alt="uploaded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        preview={false}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
            {imageUrl && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    {imageUrl}
                </div>
            )}
        </div>
    );
}