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
}

export default function BrandsPage() {
    const { data, error, mutate } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    // ✅ ใช้ upload แทน URL
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploading(false);
            return res.data.filePath; // คืน path ที่อัปโหลดเสร็จ
        } catch {
            message.error('Upload failed!');
            setUploading(false);
            return '';
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
        } catch {
            message.error('Operation failed!');
        }
    };

    const handleDelete = async (brand_id: number) => {
        try {
            await axios.delete('/api/admin/brand', { data: { brand_id } });
            message.success('Brand deleted successfully!');
            mutate();
        } catch {
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
            render: (url: string) => (
                <Image src={url} alt="Brand" width={70} height={50} style={{ objectFit: 'cover' }} />
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
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
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
    const brands = Array.isArray(data) ? data : [];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>Brands Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Brand
                </Button>
            </div>

            <Table columns={columns} dataSource={brands} rowKey="brand_id" pagination={{ pageSize: 10 }} />

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

                    <Form.Item label="Brand Image" name="brand_image" rules={[{ required: true }]}>
                        <Upload
                            name="file"
                            listType="picture"
                            customRequest={async ({ file, onSuccess }) => {
                                const path = await handleUpload(file as File);
                                form.setFieldValue('brand_image', path);
                                onSuccess && onSuccess('ok');
                            }}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                Upload Image
                            </Button>
                        </Upload>
                        {form.getFieldValue('brand_image') && (
                            <Image
                                src={form.getFieldValue('brand_image')}
                                alt="Preview"
                                width={120}
                                style={{ marginTop: 10, borderRadius: 4 }}
                            />
                        )}
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

                    <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Porcelain, Ceramic, Wood" />
                    </Form.Item>

                    <Form.Item
                        label="Brand URL"
                        name="brand_url"
                        rules={[{ required: true, message: 'Please input brand URL!' }]}
                    >
                        <Input placeholder="https://amo.co.th" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
