'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    message,
    Typography,
    Popconfirm,
    Image,
    Upload,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProductItem {
    item_id: number;
    image: string;
    link: string;
}

export default function ProductItemsPage() {
    const { data, error, mutate } = useSWR<ProductItem[]>(
        '/api/admin/productsurface',
        fetcher
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string>(''); // ✅ เพิ่ม state แยก

    // ✅ Upload image and save path
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const filePath = res.data?.filePath;
            if (filePath) {
                setUploadedImagePath(filePath); // ✅ เซ็ตใน state แยก
                form.setFieldsValue({ image: filePath }); // ✅ อัปเดต form
                message.success('Upload successful!');
                return true;
            } else {
                message.error('No file path returned!');
                return false;
            }
        } catch (err) {
            console.error('Upload failed:', err);
            message.error('Upload failed!');
            return false;
        } finally {
            setUploading(false);
        }
    };

    // ✅ Open modal (add or edit)
    const showModal = (item?: ProductItem) => {
        if (item) {
            setEditingItem(item);
            setUploadedImagePath(item.image); // ✅ เซ็ตรูปเดิม
            form.setFieldsValue(item);
        } else {
            setEditingItem(null);
            setUploadedImagePath(''); // ✅ รีเซ็ต
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // ✅ Save item (add or update)
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            console.log('🟢 Form values:', values);
            console.log('🟢 Uploaded image path:', uploadedImagePath);

            // ✅ ตรวจสอบว่ามีรูปหรือไม่
            if (!uploadedImagePath) {
                message.error('Please upload an image first!');
                return;
            }

            if (!values.link) {
                message.error('Please input product link!');
                return;
            }

            const payload = {
                image: uploadedImagePath, // ✅ ใช้จาก state
                link: values.link,
            };

            if (editingItem) {
                // Update existing
                await axios.put('/api/admin/productsurface', {
                    item_id: editingItem.item_id,
                    ...payload,
                });
                message.success('Item updated successfully!');
            } else {
                // Add new
                await axios.post('/api/admin/productsurface', payload);
                message.success('Item created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            setUploadedImagePath(''); // ✅ รีเซ็ต
            form.resetFields();
        } catch (err: any) {
            console.error('Error saving:', err);
            message.error(err.response?.data?.error || 'Operation failed!');
        }
    };

    // ✅ Delete item
    const handleDelete = async (item_id: number) => {
        try {
            await axios.delete('/api/admin/productsurface', { data: { item_id } });
            message.success('Item deleted successfully!');
            mutate();
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Delete failed!');
        }
    };

    // ✅ Table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'item_id',
            key: 'item_id',
            width: 80,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (url: string) =>
                url ? (
                    <Image
                        src={url}
                        width={120}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        alt="Product"
                    />
                ) : (
                    <span>No image</span>
                ),
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (url: string) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ProductItem) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Delete this item?"
                        onConfirm={() => handleDelete(record.item_id)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Surface Product Items</Title>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Add New Product
            </Button>

            <Table
                columns={columns}
                dataSource={Array.isArray(data) ? data : []}
                rowKey="item_id"
                pagination={{ pageSize: 10 }}
                loading={!data && !error}
            />

            {/* ✅ Modal for Add/Edit */}
            <Modal
                title={editingItem ? 'Edit Product' : 'Add New Product'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setUploadedImagePath('');
                }}
                width={600}
            >
                <Form form={form} layout="vertical">
                    {/* ✅ แก้ไข Form.Item สำหรับ Upload */}
                    <Form.Item
                        label="Upload Image"
                        required
                    >
                        <Upload
                            name="file"
                            showUploadList={false}
                            accept="image/*"
                            customRequest={async ({ file, onSuccess, onError }) => {
                                const success = await handleUpload(file as File);
                                if (success) {
                                    onSuccess && onSuccess('ok');
                                } else {
                                    onError && onError(new Error('Upload failed'));
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                {uploadedImagePath ? 'Change Image' : 'Upload Image'}
                            </Button>
                        </Upload>

                        {/* ✅ แสดง Preview */}
                        {uploadedImagePath && (
                            <div style={{ marginTop: 16 }}>
                                <Image
                                    src={uploadedImagePath}
                                    alt="Preview"
                                    width={200}
                                    style={{ borderRadius: 6 }}
                                />
                            </div>
                        )}
                    </Form.Item>

                    {/* ✅ Hidden field เพื่อเก็บ path */}
                    <Form.Item name="image" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Product Link"
                        name="link"
                        rules={[{ required: true, message: 'Please input product link!' }]}
                    >
                        <Input placeholder="https://example.com/product" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}