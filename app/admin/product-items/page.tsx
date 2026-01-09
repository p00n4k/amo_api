'use client';

import React, { useState } from 'react';
import {
    Tabs,
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
    Alert,
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
    const { data: surfaceData, error: surfaceError, mutate: mutateSurface } = useSWR<ProductItem[]>(
        '/api/admin/productsurface',
        fetcher
    );
    const { data: furnishData, error: furnishError, mutate: mutateFurnish } = useSWR<ProductItem[]>(
        '/api/admin/productfurnish',
        fetcher
    );

    const [activeTab, setActiveTab] = useState<'surface' | 'furnishing'>('surface');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string>('');

    // ✅ Count items
    const surfaceCount = Array.isArray(surfaceData) ? surfaceData.length : 0;
    const furnishCount = Array.isArray(furnishData) ? furnishData.length : 0;

    // ✅ Upload handler
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', activeTab);

            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const filePath = res.data?.filePath;
            if (filePath) {
                setUploadedImagePath(filePath);
                form.setFieldsValue({ image: filePath });
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

    // ✅ Open modal
    const showModal = (item?: ProductItem) => {
        const currentCount = activeTab === 'surface' ? surfaceCount : furnishCount;

        // ✅ Prevent adding more than 5 items
        if (!item && currentCount >= 5) {
            message.error(`Cannot add more items! Maximum 5 ${activeTab} items allowed.`);
            return;
        }

        if (item) {
            setEditingItem(item);
            setUploadedImagePath(item.image);
            form.setFieldsValue(item);
        } else {
            setEditingItem(null);
            setUploadedImagePath('');
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // ✅ Save item
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (!uploadedImagePath) {
                message.error('Please upload an image first!');
                return;
            }

            const payload = {
                image: uploadedImagePath,
                link: values.link,
            };

            const endpoint = activeTab === 'surface'
                ? '/api/admin/productsurface'
                : '/api/admin/productfurnish';

            if (editingItem) {
                await axios.put(endpoint, {
                    item_id: editingItem.item_id,
                    ...payload,
                });
                message.success('Item updated successfully!');
            } else {
                await axios.post(endpoint, payload);
                message.success('Item created successfully!');
            }

            activeTab === 'surface' ? mutateSurface() : mutateFurnish();

            setIsModalOpen(false);
            setUploadedImagePath('');
            form.resetFields();
        } catch (err: any) {
            console.error('Error saving:', err);
            message.error(err.response?.data?.error || 'Operation failed!');
        }
    };

    // ✅ Delete item
    const handleDelete = async (item_id: number) => {
        try {
            const currentCount = activeTab === 'surface' ? surfaceCount : furnishCount;

            // ✅ Prevent deleting if only 5 items left
            if (currentCount <= 5) {
                message.error(`Cannot delete! Minimum 5 ${activeTab} items required.`);
                return;
            }

            const endpoint = activeTab === 'surface'
                ? '/api/admin/productsurface'
                : '/api/admin/productfurnish';

            await axios.delete(endpoint, { data: { item_id } });
            message.success('Item deleted successfully!');

            activeTab === 'surface' ? mutateSurface() : mutateFurnish();
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Delete failed!');
        }
    };

    // ✅ Table columns
    const columns = [
        { title: 'ID', dataIndex: 'item_id', key: 'item_id', width: 80 },
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
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_: any, record: ProductItem) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showModal(record)} />
                    
                </Space>
            ),
        },
    ];

    // ✅ Surface Tab
    const renderSurfaceTab = () => {
        const canAdd = surfaceCount < 5;
        return (
            <div>
                <Alert
                    message={`Surface Items: ${surfaceCount} / 5`}
                    description={
                        surfaceCount < 5
                            ? `You need to add ${5 - surfaceCount} more item(s)`
                            : 'Maximum items reached (5/5)'
                    }
                    type={surfaceCount === 5 ? 'success' : 'warning'}
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ marginBottom: 16 }}
                    disabled={!canAdd}
                >
                    Add Surface Product {!canAdd && '(Max 5)'}
                </Button>

                <Table columns={columns} dataSource={surfaceData || []} rowKey="item_id" pagination={false} />
            </div>
        );
    };

    // ✅ Furnish Tab
    const renderFurnishingTab = () => {
        const canAdd = furnishCount < 5;
        return (
            <div>
                <Alert
                    message={`Furnishing Items: ${furnishCount} / 5`}
                    description={
                        furnishCount < 5
                            ? `You need to add ${5 - furnishCount} more item(s)`
                            : 'Maximum items reached (5/5)'
                    }
                    type={furnishCount === 5 ? 'success' : 'warning'}
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ marginBottom: 16 }}
                    disabled={!canAdd}
                >
                    Add Furnishing Product {!canAdd && '(Max 5)'}
                </Button>

                <Table columns={columns} dataSource={furnishData || []} rowKey="item_id" pagination={false} />
            </div>
        );
    };

    return (
        <div>
            <Title level={2}>Product Items Management</Title>
            <p style={{ color: '#666', marginBottom: 24 }}>
                Each category must have exactly 5 items. Minimum 5, Maximum 5.
            </p>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as 'surface' | 'furnishing')}
                items={[
                    { key: 'surface', label: `Surface (${surfaceCount}/5)`, children: renderSurfaceTab() },
                    { key: 'furnishing', label: `Furnishing (${furnishCount}/5)`, children: renderFurnishingTab() },
                ]}
            />

            <Modal
                title={editingItem ? `Edit ${activeTab} Product` : `Add ${activeTab} Product`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    setUploadedImagePath('');
                    form.resetFields();
                }}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Upload Image" required>
                        <Upload
                            name="file"
                            showUploadList={false}
                            accept="image/*"
                            customRequest={async ({ file, onSuccess, onError }) => {
                                const success = await handleUpload(file as File);
                                if (success) onSuccess?.('ok');
                                else onError?.(new Error('Upload failed'));
                            }}
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                {uploadedImagePath ? 'Change Image' : 'Upload Image'}
                            </Button>
                        </Upload>

                        {uploadedImagePath && (
                            <div style={{ marginTop: 16 }}>
                                <Image src={uploadedImagePath} alt="Preview" width={200} style={{ borderRadius: 6 }} />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item name="image" hidden><Input /></Form.Item>

                    <Form.Item
                        label="Product Link"
                        name="link"
                        rules={[{ required: true, message: 'Please input product link!' }]}
                    >
                        <Input placeholder="https://example.com/product" />
                    </Form.Item>
                </Form>
            </Modal>
            <Image
                src="/static/product.png"
                alt="Homepage Preview"
                width={900}
                style={{
                    marginTop: 40,
                    borderRadius: 8,
                    display: "block",
                }}
            />
        </div>
    );
}
