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
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    PictureOutlined,
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
            const values = await imageForm.validateFields();
            await axios.post('/api/admin/homefocus', {
                focus_id: selectedFocus,
                ...values,
                action: 'add_image',
            });
            message.success('Image added successfully!');
            imageForm.resetFields();
            if (selectedFocus) {
                const response = await axios.get(`/api/admin/homefocus?focus_id=${selectedFocus}`);
                setFocusImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Operation failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/homefocus', {
                data: { image_id, action: 'delete_image' }
            });
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
            message.success('Product Focus deleted successfully!');
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
            title: 'Made In',
            dataIndex: 'made_in',
            key: 'made_in',
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
                        icon={<PictureOutlined />}
                        size="small"
                        onClick={() => showImageModal(record.focus_id)}
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
                        title="Delete this product focus?"
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

            <Table
                columns={columns}
                dataSource={data}
                rowKey="focus_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
            />

            <Modal
                title={editingFocus ? 'Edit Product Focus' : 'Add Product Focus'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                width={700}
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
                        name="brand_id"
                        rules={[{ required: true, message: 'Please select brand!' }]}
                    >
                        <Select placeholder="Select a brand">
                            {brands?.map((brand) => (
                                <Select.Option key={brand.brand_id} value={brand.brand_id}>
                                    {brand.brand_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Made In"
                        name="made_in"
                    >
                        <Input placeholder="e.g., Italy, Thailand" />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select type!' }]}
                    >
                        <Select>
                            <Select.Option value="Surface">Surface</Select.Option>
                            <Select.Option value="Furnishing">Furnishing</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Link"
                        name="link"
                    >
                        <Input placeholder="https://example.com/..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Product Focus Images"
                open={isImageModalOpen}
                onCancel={() => setIsImageModalOpen(false)}
                footer={null}
                width={800}
            >
                <Form form={imageForm} layout="inline" style={{ marginBottom: 16 }}>
                    <Form.Item
                        name="image_url"
                        rules={[{ required: true, message: 'Please input image URL!' }]}
                        style={{ width: '60%' }}
                    >
                        <Input placeholder="Image URL" />
                    </Form.Item>
                    <Form.Item
                        name="display_order"
                        rules={[{ required: true, message: 'Order!' }]}
                        style={{ width: '20%' }}
                    >
                        <Input type="number" placeholder="Order" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleAddImage}>
                            Add
                        </Button>
                    </Form.Item>
                </Form>

                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={focusImages}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{ position: 'relative' }}>
                                <Image src={item.image_url} alt="Focus" style={{ width: '100%' }} />
                                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                />
            </Modal>
        </div>
    );
}