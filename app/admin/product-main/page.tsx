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
    brand_image: string;
    link: string;
    images?: ProductImage[];
}

interface Brand {
    brand_id: number;
    brand_name: string;
}

interface ProductImage {
    image_id: number;
    image_url: string;
}

export default function ProductMainPage() {
    const { data, error, mutate } = useSWR<ProductMain[]>('/api/admin/productmain', fetcher);
    const { data: brands } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductMain | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string>('');

    // ✅ Upload Image Handler
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
                setUploadedImagePath(filePath);
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

    const showModal = (product?: ProductMain) => {
        if (product) {
            setEditingProduct(product);
            form.setFieldsValue(product);
        } else {
            setEditingProduct(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const showImageModal = async (product_id: number) => {
        setSelectedProduct(product_id);
        setUploadedImagePath(''); // Reset
        try {
            const response = await axios.get(`/api/admin/productmain?id=${product_id}`);
            setProductImages(response.data.images || []);
            setIsImageModalOpen(true);
        } catch (error) {
            message.error('Failed to load images!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingProduct) {
                await axios.put('/api/admin/productmain', {
                    id: editingProduct.id,
                    ...values,
                });
                message.success('Product updated successfully!');
            } else {
                await axios.post('/api/admin/productmain', values);
                message.success('Product created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Error:', error);
            message.error('Operation failed!');
        }
    };

    const handleAddImage = async () => {
        try {
            // ✅ ตรวจสอบว่ามีรูปที่อัปโหลดแล้ว
            if (!uploadedImagePath) {
                message.error('Please upload an image first!');
                return;
            }

            console.log('🟢 Adding image:', {
                product_main_id: selectedProduct,
                image_url: uploadedImagePath,
            });

            // ✅ ส่งเฉพาะ string path ไปยัง API
            await axios.post('/api/admin/productmain', {
                action: 'add_image',
                product_main_id: selectedProduct,
                image_url: uploadedImagePath, // ✅ ส่งเป็น string
            });

            message.success('Image added successfully!');
            setUploadedImagePath(''); // Reset

            // ✅ Reload images
            if (selectedProduct) {
                const response = await axios.get(`/api/admin/productmain?id=${selectedProduct}`);
                setProductImages(response.data.images || []);
            }
        } catch (error: any) {
            console.error('Add image error:', error);
            message.error(error.response?.data?.error || 'Operation failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/productmain', {
                data: { action: 'delete_image', image_id },
            });
            message.success('Image deleted successfully!');

            // Reload images
            if (selectedProduct) {
                const response = await axios.get(`/api/admin/productmain?id=${selectedProduct}`);
                setProductImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete('/api/admin/productmain', { data: { id } });
            message.success('Deleted successfully!');
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
            title: 'Collection',
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
            render: (link: string) =>
                link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        View
                    </a>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: ProductMain) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Button
                        icon={<PictureOutlined />}
                        size="small"
                        onClick={() => showImageModal(record.id)}
                    >
                        Images
                    </Button>
            
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
               
            </div>

            <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />

            {/* Modal: Add/Edit Product */}
            <Modal
                title={editingProduct ? 'Edit Product Main' : 'Add Product Main'}
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
                        rules={[{ required: true, message: 'Please input collection name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Brand"
                        name="brand_name"
                        rules={[{ required: true, message: 'Please select brand!' }]}
                    >
                        <Select placeholder="Select Brand">
                            {brands?.map((b) => (
                                <Select.Option key={b.brand_id} value={b.brand_name}>
                                    {b.brand_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Link" name="link">
                        <Input placeholder="https://example.com/product" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal: Manage Images */}
            <Modal
                title="Manage Product Images"
                open={isImageModalOpen}
                onCancel={() => {
                    setIsImageModalOpen(false);
                    setUploadedImagePath('');
                }}
                footer={null}
                width={800}
            >
                {/* ✅ Upload Section */}
                <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                    <Title level={5}>Upload New Image</Title>

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

                    {/* ✅ Preview */}
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

                    <Button
                        type="primary"
                        onClick={handleAddImage}
                        disabled={!uploadedImagePath}
                        style={{ marginTop: 16 }}
                        block
                    >
                        Add Image to Product
                    </Button>
                </div>

                {/* ✅ Current Images */}
                <div>
                    <Title level={5}>Current Images</Title>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={productImages}
                        renderItem={(item) => (
                            <List.Item>
                                <div style={{ position: 'relative' }}>
                                    <Image
                                        src={item.image_url}
                                        alt="Product"
                                        style={{
                                            width: '100%',
                                            height: 150,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                        }}
                                    />
                                    <div style={{ marginTop: 8, textAlign: 'right' }}>
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
                        locale={{ emptyText: 'No images yet. Upload one above!' }}
                    />
                </div>
            </Modal>
            <Image
                src="/static/productmain.png"
                alt="Product Main Preview"
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