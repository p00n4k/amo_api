'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    message,
    Typography,
    Image,
    Popconfirm,
    Upload,
    Tag,
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

interface Brand {
    brand_id: number;
    brand_name: string;
    brand_image: string;
    main_type: 'Surface' | 'Furnishing';
    type: string;
    brand_url: string;
    created_at: string;
}

export default function BrandsPage() {
    const { data, error, mutate } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await axios.post('/api/admin/upload', formData);
            message.success('Upload successful!');
            return response.data.url;
        } catch (error) {
            message.error('Upload failed!');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const showModal = (brand?: Brand) => {
        if (brand) {
            setEditingBrand(brand);
            form.setFieldsValue(brand);
        } else {
            setEditingBrand(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingBrand) {
                await axios.put('/api/admin/brand', {
                    brand_id: editingBrand.brand_id,
                    ...values,
                });
                message.success('Brand updated successfully!');
            } else {
                await axios.post('/api/admin/brand', values);
                message.success('Brand created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Operation failed!');
        }
    };

    const handleDelete = async (brand_id: number) => {
        try {
            await axios.delete('/api/admin/brand', { data: { brand_id } });
            message.success('Brand deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'brand_id',
            key: 'brand_id',
            width: 70,
        },
        {
            title: 'Image',
            dataIndex: 'brand_image',
            key: 'brand_image',
            width: 100,
            render: (url: string) => (
                <Image src={url} alt="Brand" width={60} height={40} style={{ objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Brand Name',
            dataIndex: 'brand_name',
            key: 'brand_name',
        },
        {
            title: 'Main Type',
            dataIndex: 'main_type',
            key: 'main_type',
            render: (type: string) => (
                <Tag color={type === 'Surface' ? 'blue' : 'green'}>{type}</Tag>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'URL',
            dataIndex: 'brand_url',
            key: 'brand_url',
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
            render: (_: any, record: Brand) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Delete this brand?"
                        onConfirm={() => handleDelete(record.brand_id)}
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

    // Ensure data is an array
    const brands = Array.isArray(data) ? data : [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>Brands Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Brand
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={brands}
                rowKey="brand_id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingBrand ? 'Edit Brand' : 'Add Brand'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Brand Name"
                        name="brand_name"
                        rules={[{ required: true, message: 'Please input brand name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Brand Image URL"
                        name="brand_image"
                        rules={[{ required: true, message: 'Please input image URL!' }]}
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        label="Main Type"
                        name="main_type"
                        rules={[{ required: true, message: 'Please select main type!' }]}
                    >
                        <Select>
                            <Select.Option value="Surface">Surface</Select.Option>
                            <Select.Option value="Furnishing">Furnishing</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input type!' }]}
                    >
                        <Input placeholder="e.g., Wood, Metal, Ceramic" />
                    </Form.Item>

                    <Form.Item
                        label="Brand URL"
                        name="brand_url"
                        rules={[{ required: true, message: 'Please input brand URL!' }]}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}