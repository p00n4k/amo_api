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
    Tag,
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
const { TextArea } = Input;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProductFocus {
    focus_id: number;
    collection_name: string;
    brand_name: string;
    description: string;
    made_in: string;
    type: 'Furnishing' | 'Surface';
    link: string;
}

interface Brand {
    brand_id: number;
    brand_name: string;
}

interface FocusImage {
    image_id: number;
    image_url: string;
    display_order: number;
}

export default function ProductFocusPage() {
    const { data, error, mutate } = useSWR<ProductFocus[]>('/api/admin/homefocus', fetcher);
    const { data: brands } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingFocus, setEditingFocus] = useState<ProductFocus | null>(null);
    const [selectedFocus, setSelectedFocus] = useState<number | null>(null);
    const [focusImages, setFocusImages] = useState<FocusImage[]>([]);
    const [form] = Form.useForm();
    const [imageForm] = Form.useForm();
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
                imageForm.setFieldsValue({ image_url: filePath });
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

    const showModal = (focus?: ProductFocus) => {
        if (focus) {
            setEditingFocus(focus);
            form.setFieldsValue(focus);
        } else {
            setEditingFocus(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const showImageModal = async (focus_id: number) => {
        setSelectedFocus(focus_id);
        setUploadedImagePath(''); // Reset uploaded image
        imageForm.resetFields();
        try {
            const response = await axios.get(`/api/admin/homefocus?focus_id=${focus_id}`);
            setFocusImages(response.data.images || []);
            setIsImageModalOpen(true);
        } catch (error) {
            message.error('Failed to load images!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingFocus) {
                await axios.put('/api/admin/homefocus', {
                    focus_id: editingFocus.focus_id,
                    ...values,
                });
                message.success('Product Focus updated successfully!');
            } else {
                await axios.post('/api/admin/homefocus', values);
                message.success('Product Focus created successfully!');
            }

            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Operation failed!');
        }
    };

    const handleAddImage = async () => {
        try {
            // ✅ Validate that image is uploaded
            if (!uploadedImagePath) {
                message.error('Please upload an image first!');
                return;
            }

            const values = await imageForm.validateFields();

            await axios.post('/api/admin/homefocus', {
                focus_id: selectedFocus,
                image_url: uploadedImagePath, // ✅ Use uploaded path
                display_order: values.display_order || 0,
                action: 'add_image',
            });

            message.success('Image added successfully!');

            // ✅ Reset form and image
            imageForm.resetFields();
            setUploadedImagePath('');

            // ✅ Reload images
            if (selectedFocus) {
                const response = await axios.get(`/api/admin/homefocus?focus_id=${selectedFocus}`);
                setFocusImages(response.data.images || []);
            }
        } catch (error) {
            console.error('Add image error:', error);
            message.error('Operation failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/homefocus', { data: { image_id, action: 'delete_image' } });
            message.success('Image deleted successfully!');
            if (selectedFocus) {
                const response = await axios.get(`/api/admin/homefocus?focus_id=${selectedFocus}`);
                setFocusImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const handleDelete = async (focus_id: number) => {
        try {
            await axios.delete('/api/admin/homefocus', { data: { focus_id } });
            message.success('Deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'focus_id',
            key: 'focus_id',
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'Surface' ? 'blue' : 'green'}>{type}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: ProductFocus) => (
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
                        onClick={() => showImageModal(record.focus_id)}
                    >
                        Images
                    </Button>
                    <Popconfirm
                        title="Delete this focus?"
                        onConfirm={() => handleDelete(record.focus_id)}
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
                <Title level={2}>Product Focus Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Product Focus
                </Button>
            </div>

            <Table columns={columns} dataSource={data} rowKey="focus_id" pagination={{ pageSize: 10 }} />

            {/* Modal: Add/Edit Focus */}
            <Modal
                title={editingFocus ? 'Edit Product Focus' : 'Add Product Focus'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Collection Name" name="collection_name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Brand Name" name="brand_name" rules={[{ required: true }]}>
                        <Select placeholder="Select Brand">
                            {brands?.map((b) => (
                                <Select.Option key={b.brand_id} value={b.brand_name}>
                                    {b.brand_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Made In" name="made_in">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Surface">Surface</Select.Option>
                            <Select.Option value="Furnishing">Furnishing</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Link" name="link">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal: Manage Focus Images */}
            <Modal
                title="Manage Focus Images"
                open={isImageModalOpen}
                onCancel={() => {
                    setIsImageModalOpen(false);
                    setUploadedImagePath('');
                    imageForm.resetFields();
                }}
                footer={null}
                width={800}
            >
                {/* ✅ Upload Form */}
                <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                    <Form form={imageForm} layout="vertical">
                        <Form.Item label="Upload Image" required>
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

                            {/* ✅ Image Preview */}
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

                        {/* ✅ Hidden field to store image URL */}
                        <Form.Item name="image_url" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Display Order" name="display_order">
                            <Input type="number" placeholder="Order (0, 1, 2, ...)" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={handleAddImage}
                                disabled={!uploadedImagePath}
                                block
                            >
                                Add Image to Collection
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                {/* ✅ Images List */}
                <div>
                    <Title level={5}>Current Images</Title>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={focusImages}
                        renderItem={(item) => (
                            <List.Item>
                                <div style={{ position: 'relative' }}>
                                    <Image
                                        src={item.image_url}
                                        alt="Focus"
                                        style={{
                                            width: '100%',
                                            height: 150,
                                            objectFit: 'cover',
                                            borderRadius: 4
                                        }}
                                    />
                                    <div style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>Order: {item.display_order}</span>
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
        </div>
    );
}