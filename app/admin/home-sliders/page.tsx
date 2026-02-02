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

    // ✅ watch image_url (reactive preview)
    const imageUrl = Form.useWatch('image_url', form);

    // ✅ upload to /api/admin/upload
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            // (optional) ถ้าคุณอยากแยกโฟลเดอร์ homeslider:
            // formData.append('folder', 'homeslider');

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
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // ✅ safety: ensure string only
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'slider_id',
            key: 'slider_id',
            width: 70,
        },
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            width: 220,
            render: (url: string) => (
                <Image
                    src={url}
                    alt="Slider"
                    width={150}
                    height={80}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Display Order',
            dataIndex: 'display_order',
            key: 'display_order',
            width: 150,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_: any, record: Slider) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Delete this slider?"
                        onConfirm={() => handleDelete(record.slider_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}
            >
                <Title level={2}>Home Sliders Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Slider
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="slider_id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingSlider ? 'Edit Slider' : 'Add Slider'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    {/* ✅ เก็บค่า image_url จริงใน Form แบบ hidden input */}
                    <Form.Item
                        name="image_url"
                        hidden
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* ✅ Form.Item นี้ไม่มี name และมี child แค่ 1 ตัว (Space) */}
                    <Form.Item label="Image" required>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Upload
                                name="file"
                                showUploadList={false}
                                customRequest={async ({ file, onSuccess, onError }) => {
                                    try {
                                        const uploadedPath = await handleUpload(file as File);
                                        if (!uploadedPath) throw new Error('No uploaded path');
                                        // form.setFieldValue ถูกทำใน handleUpload แล้ว แต่ทำซ้ำก็ได้
                                        form.setFieldValue('image_url', uploadedPath);
                                        onSuccess?.({ ok: true });
                                    } catch (e) {
                                        onError?.(e as any);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />} loading={uploading}>
                                    Upload Image
                                </Button>
                            </Upload>

                            {typeof imageUrl === 'string' && imageUrl.length > 0 && (
                                <Image
                                    src={imageUrl}
                                    alt="Preview"
                                    width={150}
                                    style={{ marginTop: 10, borderRadius: 4 }}
                                />
                            )}
                        </Space>
                    </Form.Item>

                    <Form.Item
                        label="Display Order"
                        name="display_order"
                        rules={[{ required: true, message: 'Please input display order!' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Image
                src="/static/homepage.png"
                alt="Homepage Preview"
                width={900}
                style={{
                    marginTop: 40,
                    borderRadius: 8,
                    display: 'block',
                }}
            />
        </div>
    );
}
