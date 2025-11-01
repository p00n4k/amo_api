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

    // ✅ เช็คจำนวนรายการ
    const surfaceCount = Array.isArray(surfaceData) ? surfaceData.length : 0;
    const furnishCount = Array.isArray(furnishData) ? furnishData.length : 0;

    // ✅ Upload handler
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', activeTab); // surface หรือ furnishing

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

        // ✅ ถ้าเพิ่มใหม่ และมีครบ 4 แล้ว
        if (!item && currentCount >= 4) {
            message.error(`Cannot add more items! Maximum 4 ${activeTab} items allowed.`);
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

            if (!values.link) {
                message.error('Please input product link!');
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
                // Update
                await axios.put(endpoint, {
                    item_id: editingItem.item_id,
                    ...payload,
                });
                message.success('Item updated successfully!');
            } else {
                // Add new
                await axios.post(endpoint, payload);
                message.success('Item created successfully!');
            }

            // Refresh data
            if (activeTab === 'surface') {
                mutateSurface();
            } else {
                mutateFurnish();
            }

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

            // ✅ ห้ามลบถ้าเหลือ 4 รายการ
            if (currentCount <= 4) {
                message.error(`Cannot delete! Minimum 4 ${activeTab} items required.`);
                return;
            }

            const endpoint = activeTab === 'surface'
                ? '/api/admin/productsurface'
                : '/api/admin/productfurnish';

            await axios.delete(endpoint, { data: { item_id } });
            message.success('Item deleted successfully!');

            if (activeTab === 'surface') {
                mutateSurface();
            } else {
                mutateFurnish();
            }
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
            width: 150,
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
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // ✅ Render Surface Tab
    const renderSurfaceTab = () => {
        const canAdd = surfaceCount < 4;

        return (
            <div>
                {/* Status Alert */}
                <Alert
                    message={`Surface Items: ${surfaceCount} / 4`}
                    description={
                        surfaceCount < 4
                            ? `You need to add ${4 - surfaceCount} more item(s)`
                            : 'Maximum items reached (4/4)'
                    }
                    type={surfaceCount === 4 ? 'success' : 'warning'}
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
                    Add Surface Product {!canAdd && '(Max 4)'}
                </Button>

                <Table
                    columns={columns}
                    dataSource={Array.isArray(surfaceData) ? surfaceData : []}
                    rowKey="item_id"
                    pagination={false}
                    loading={!surfaceData && !surfaceError}
                />
            </div>
        );
    };

    // ✅ Render Furnishing Tab
    const renderFurnishingTab = () => {
        const canAdd = furnishCount < 4;

        return (
            <div>
                {/* Status Alert */}
                <Alert
                    message={`Furnishing Items: ${furnishCount} / 4`}
                    description={
                        furnishCount < 4
                            ? `You need to add ${4 - furnishCount} more item(s)`
                            : 'Maximum items reached (4/4)'
                    }
                    type={furnishCount === 4 ? 'success' : 'warning'}
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
                    Add Furnishing Product {!canAdd && '(Max 4)'}
                </Button>

                <Table
                    columns={columns}
                    dataSource={Array.isArray(furnishData) ? furnishData : []}
                    rowKey="item_id"
                    pagination={false}
                    loading={!furnishData && !furnishError}
                />
            </div>
        );
    };

    return (
        <div>
            <Title level={2}>Product Items Management</Title>
            <p style={{ color: '#666', marginBottom: 24 }}>
                Each category must have exactly 4 items. Minimum 4, Maximum 4.
            </p>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as 'surface' | 'furnishing')}
                items={[
                    {
                        key: 'surface',
                        label: `Surface (${surfaceCount}/4)`,
                        children: renderSurfaceTab(),
                    },
                    {
                        key: 'furnishing',
                        label: `Furnishing (${furnishCount}/4)`,
                        children: renderFurnishingTab(),
                    },
                ]}
            />

            {/* Modal for Add/Edit */}
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