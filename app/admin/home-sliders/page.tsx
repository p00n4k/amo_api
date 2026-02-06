'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Space,
    message,
    Typography,
    Image,
    Popconfirm,
    Upload,
    Input,
    Tag,
    Card,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title, Text } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Slider {
    slider_id: number;
    image_url: string;
    display_order: number;
    created_at: string;
}

export default function HomeSlidersPage() {
    const { data, error, mutate } = useSWR<Slider[]>(
        '/api/admin/homeslider',
        fetcher
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    const imageUrl = Form.useWatch('image_url', form);

    // Sort data by display_order
    const sortedData = data ? [...data].sort((a, b) => a.display_order - b.display_order) : [];

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const filePath = res.data?.filePath;

            if (typeof filePath === 'string' && filePath.length > 0) {
                form.setFieldValue('image_url', filePath);
                message.success('Upload successful!');
                return filePath;
            }

            message.error('Upload failed: No file path returned');
            return '';
        } catch (err) {
            console.error('Upload failed:', err);
            message.error('Upload failed!');
            return '';
        } finally {
            setUploading(false);
        }
    };

    const showModal = (slider?: Slider) => {
        if (slider) {
            setEditingSlider(slider);
            form.setFieldsValue({
                image_url: slider.image_url,
                display_order: slider.display_order,
            });
        } else {
            setEditingSlider(null);
            // Auto-assign next available order
            const maxOrder = sortedData.length > 0 
                ? Math.max(...sortedData.map(s => s.display_order))
                : 0;
            form.setFieldsValue({
                display_order: maxOrder + 1,
            });
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (typeof values.image_url !== 'string') {
                message.error('Invalid image_url');
                return;
            }

            if (editingSlider) {
                await axios.put('/api/admin/homeslider', {
                    slider_id: editingSlider.slider_id,
                    ...values,
                });
                message.success('Slider updated successfully!');
            } else {
                await axios.post('/api/admin/homeslider', values);
                message.success('Slider created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error('Operation failed!');
        }
    };

    const handleDelete = async (slider_id: number) => {
        try {
            await axios.delete('/api/admin/homeslider', { data: { slider_id } });
            message.success('Slider deleted successfully!');
            mutate();
        } catch (err) {
            console.error(err);
            message.error('Delete failed!');
        }
    };

    // Move slider up or down
    const moveSlider = async (slider: Slider, direction: 'up' | 'down') => {
        const currentIndex = sortedData.findIndex((s) => s.slider_id === slider.slider_id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= sortedData.length) return;

        const targetSlider = sortedData[targetIndex];

        try {
            // Swap display orders
            await Promise.all([
                axios.put('/api/admin/homeslider', {
                    slider_id: slider.slider_id,
                    image_url: slider.image_url,
                    display_order: targetSlider.display_order,
                }),
                axios.put('/api/admin/homeslider', {
                    slider_id: targetSlider.slider_id,
                    image_url: targetSlider.image_url,
                    display_order: slider.display_order,
                }),
            ]);

            message.success('Order updated!');
            mutate();
        } catch (err) {
            console.error(err);
            message.error('Failed to update order!');
        }
    };

    const columns = [
        {
            title: 'Position',
            dataIndex: 'display_order',
            key: 'display_order',
            width: 140,
            render: (order: number, record: Slider, index: number) => (
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Tag 
                        color="blue" 
                        style={{ 
                            fontSize: '16px', 
                            padding: '6px 16px',
                            fontWeight: 'bold',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        #{order}
                    </Tag>
                    <Space.Compact style={{ width: '100%' }}>
                        <Button
                            type="default"
                            size="small"
                            icon={<ArrowUpOutlined />}
                            disabled={index === 0}
                            onClick={() => moveSlider(record, 'up')}
                            title="Move up"
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="default"
                            size="small"
                            icon={<ArrowDownOutlined />}
                            disabled={index === sortedData.length - 1}
                            onClick={() => moveSlider(record, 'down')}
                            title="Move down"
                            style={{ flex: 1 }}
                        />
                    </Space.Compact>
                </Space>
            ),
        },
        {
            title: 'Image Preview',
            dataIndex: 'image_url',
            key: 'image_url',
            width: 240,
            render: (url: string) => (
                <Image
                    src={url}
                    alt="Slider"
                    width={180}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                    preview={{
                        mask: 'Preview',
                    }}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_: any, record: Slider) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="middle"
                        onClick={() => showModal(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this slider?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record.slider_id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} size="middle" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div style={{ padding: '24px' }}>
            <Card 
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <div>
                        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                            Home Sliders Management
                        </Title>
                        <Space direction="vertical" size={2}>
                            <Text type="secondary">
                                • Use ⬆️⬇️ buttons to move sliders one position at a time
                            </Text>
                            <Text type="secondary">
                                • Total sliders: <strong>{sortedData.length}</strong>
                            </Text>
                        </Space>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => showModal()} 
                        size="large"
                    >
                        Add New Slider
                    </Button>
                </div>
            </Card>

            <Table
                columns={columns}
                dataSource={sortedData}
                rowKey="slider_id"
                pagination={false}
                bordered
                size="middle"
                style={{ backgroundColor: 'white' }}
            />

            <Modal
                title={
                    <Space>
                        <span>{editingSlider ? 'Edit Slider' : 'Add New Slider'}</span>
                        {editingSlider && (
                            <Tag color="blue">Position #{editingSlider.display_order}</Tag>
                        )}
                    </Space>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                width={600}
                destroyOnClose
                okText={editingSlider ? 'Update' : 'Create'}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
                    <Form.Item
                        name="image_url"
                        hidden
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item 
                        label={
                            <Space>
                                <span>Slider Image</span>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    (Recommended: 1920x600px)
                                </Text>
                            </Space>
                        } 
                        required
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <Upload
                                name="file"
                                showUploadList={false}
                                customRequest={async ({ file, onSuccess, onError }) => {
                                    try {
                                        const uploadedPath = await handleUpload(file as File);
                                        if (!uploadedPath) throw new Error('No uploaded path');
                                        form.setFieldValue('image_url', uploadedPath);
                                        onSuccess?.({ ok: true });
                                    } catch (e) {
                                        onError?.(e as any);
                                    }
                                }}
                                accept="image/*"
                            >
                                <Button 
                                    icon={<UploadOutlined />} 
                                    loading={uploading} 
                                    block 
                                    size="large"
                                    type={imageUrl ? 'default' : 'primary'}
                                >
                                    {imageUrl ? '✓ Change Image' : 'Upload Image'}
                                </Button>
                            </Upload>

                            {typeof imageUrl === 'string' && imageUrl.length > 0 && (
                                <Card 
                                    size="small" 
                                    style={{ textAlign: 'center' }}
                                    bodyStyle={{ padding: 12 }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt="Preview"
                                        width="100%"
                                        style={{ borderRadius: 4 }}
                                    />
                                </Card>
                            )}
                        </Space>
                    </Form.Item>

                    <Form.Item
                        label={
                            <Space>
                                <span>Display Position</span>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    (Lower number = appears first)
                                </Text>
                            </Space>
                        }
                        name="display_order"
                        rules={[{ required: true, message: 'Please input display order!' }]}
                        extra={
                            editingSlider 
                                ? "Change this to reorder the slider manually" 
                                : `Auto-assigned to position ${sortedData.length + 1}. You can change this.`
                        }
                    >
                        <InputNumber 
                            min={1} 
                            style={{ width: '100%' }}
                            placeholder="e.g., 1 (first), 2 (second), etc."
                            size="large"
                            addonBefore="#"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Card 
                title="Homepage Preview Reference" 
                style={{ marginTop: 40 }}
                bordered={false}
            >
                <Image
                    src="/static/homepage.png"
                    alt="Homepage Preview"
                    width="100%"
                    style={{
                        borderRadius: 8,
                        border: '1px solid #f0f0f0',
                    }}
                />
            </Card>
        </div>
    );
}