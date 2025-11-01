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
    Popconfirm,
    List,
    Image,
    Upload,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    PictureOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProductMain {
    id: number;
    collection_name: string;
    brand_name: string;
    link: string;
}

interface Brand {
    brand_id: number;
    brand_name: string;
}

interface MainImage {
    image_id: number;
    image_url: string;
}

export default function ProductMainPage() {
    const { data, error, mutate } = useSWR<ProductMain[]>('/api/admin/productmain', fetcher);
    const { data: brands } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingMain, setEditingMain] = useState<ProductMain | null>(null);
    const [selectedMain, setSelectedMain] = useState<number | null>(null);
    const [mainImages, setMainImages] = useState<MainImage[]>([]);
    const [form] = Form.useForm();
    const [imageForm] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    const showModal = (main?: ProductMain) => {
        if (main) {
            setEditingMain(main);
            form.setFieldsValue(main);
        } else {
            setEditingMain(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const showImageModal = async (id: number) => {
        setSelectedMain(id);
        try {
            const response = await axios.get(`/api/admin/productmain?id=${id}`);
            setMainImages(response.data.images || []);
            setIsImageModalOpen(true);
        } catch (error) {
            message.error('Failed to load images!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingMain) {
                await axios.put('/api/admin/productmain', {
                    id: editingMain.id,
                    ...values,
                });
                message.success('Product Main updated successfully!');
            } else {
                await axios.post('/api/admin/productmain', values);
                message.success('Product Main created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Operation failed!');
        }
    };

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
                imageForm.setFieldValue('image_url', filePath);
                message.success('Upload successful!');
            } else {
                message.error('No file path returned!');
            }
            setUploading(false);
        } catch (error) {
            message.error('Upload failed!');
            setUploading(false);
        }
    };

    const handleAddImage = async () => {
        try {
            const values = await imageForm.validateFields();
            await axios.post('/api/admin/productmain', {
                product_main_id: selectedMain,
                ...values,
                action: 'add_image',
            });
            message.success('Image added successfully!');
            imageForm.resetFields();

            if (selectedMain) {
                const response = await axios.get(`/api/admin/productmain?id=${selectedMain}`);
                setMainImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Operation failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/productmain', {
                data: { image_id, action: 'delete_image' },
            });
            message.success('Image deleted successfully!');
            if (selectedMain) {
                const response = await axios.get(`/api/admin/productmain?id=${selectedMain}`);
                setMainImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete('/api/admin/productmain', { data: { id } });
            message.success('Product Main deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Collection Name',
            dataIndex: 'collection_name',
            key: 'collection_name',
        },
        {
            title: 'Brand',
            dataIndex: 'brand_name',
            key: 'brand_name',
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
            width: 200,
            render: (_: any, record: ProductMain) => (
                <Space>
                    <Button
                        icon={<PictureOutlined />}
                        size="small"
                        onClick={() => showImageModal(record.id)}
                    >
                        Images
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Delete this product main?"
                        onConfirm={() => handleDelete(record.id)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>Product Main Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Product Main
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
            />

            {/* ✅ Modal: Add/Edit Product Main */}
            <Modal
                title={editingMain ? 'Edit Product Main' : 'Add Product Main'}
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
                        label="Collection Name"
                        name="collection_name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Brand" name="brand_name" rules={[{ required: true }]}>
                        <Select placeholder="Select Brand">
                            {brands?.map((b) => (
                                <Select.Option key={b.brand_id} value={b.brand_name}>
                                    {b.brand_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Link" name="link">
                        <Input placeholder="https://example.com" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ✅ Modal: Manage Images with Upload */}
            <Modal
                title="Manage Main Images"
                open={isImageModalOpen}
                onCancel={() => setIsImageModalOpen(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={imageForm}
                    layout="inline"
                    onFinish={handleAddImage}
                    style={{ marginBottom: 16 }}
                >
                    <Form.Item
                        name="image_url"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                        style={{ width: '60%' }}
                    >
                        <Upload
                            name="file"
                            showUploadList={false}
                            customRequest={async ({ file, onSuccess }) => {
                                await handleUpload(file as File);
                                onSuccess && onSuccess('ok');
                            }}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                            >
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>

                {/* ✅ Preview */}
                {imageForm.getFieldValue('image_url') && (
                    <div style={{ marginBottom: 16 }}>
                        <Image
                            src={imageForm.getFieldValue('image_url')}
                            alt="Preview"
                            width={200}
                            style={{ borderRadius: 4 }}
                        />
                    </div>
                )}

                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={mainImages}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{ position: 'relative' }}>
                                <Image src={item.image_url} alt="Main" style={{ width: '100%' }} />
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Popconfirm
                                        title="Delete this image?"
                                        onConfirm={() => handleDeleteImage(item.image_id)}
                                    >
                                        <Button danger size="small" icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
}
