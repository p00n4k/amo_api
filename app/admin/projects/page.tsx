'use client';

import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
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
import dayjs from 'dayjs';

const { Title } = Typography;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: 'Residential' | 'Commercial';
    created_at: string;
}

interface ProjectImage {
    image_id: number;
    image_url: string;
    display_order: number;
}

export default function ProjectsPage() {
    const { data, error, mutate } = useSWR<Project[]>('/api/admin/project', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
    const [form] = Form.useForm();
    const [imageForm] = Form.useForm();

    const showModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            form.setFieldsValue({
                ...project,
                data_update: dayjs(project.data_update),
            });
        } else {
            setEditingProject(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const showImageModal = async (project_id: number) => {
        setSelectedProject(project_id);
        try {
            const response = await axios.get(`/api/admin/project?project_id=${project_id}`);
            setProjectImages(response.data.images || []);
            setIsImageModalOpen(true);
        } catch (error) {
            message.error('Failed to load images!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                data_update: values.data_update.format('YYYY-MM-DD'),
            };

            if (editingProject) {
                await axios.put('/api/admin/project', {
                    project_id: editingProject.project_id,
                    ...formattedValues,
                });
                message.success('Project updated successfully!');
            } else {
                await axios.post('/api/admin/project', formattedValues);
                message.success('Project created successfully!');
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
            await axios.post('/api/admin/productimage', {
                project_id: selectedProject,
                ...values,
            });
            message.success('Image added successfully!');
            imageForm.resetFields();
            // Reload images
            if (selectedProject) {
                const response = await axios.get(`/api/admin/project?project_id=${selectedProject}`);
                setProjectImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Operation failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/productimage', { data: { image_id } });
            message.success('Image deleted successfully!');
            // Reload images
            if (selectedProject) {
                const response = await axios.get(`/api/admin/project?project_id=${selectedProject}`);
                setProjectImages(response.data.images || []);
            }
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const handleDelete = async (project_id: number) => {
        try {
            await axios.delete('/api/admin/project', { data: { project_id } });
            message.success('Project deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'project_id',
            key: 'project_id',
            width: 70,
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: 'Date Updated',
            dataIndex: 'data_update',
            key: 'data_update',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Category',
            dataIndex: 'project_category',
            key: 'project_category',
            render: (category: string) => (
                <Tag color={category === 'Residential' ? 'blue' : 'orange'}>{category}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Project) => (
                <Space>
                    <Button
                        icon={<PictureOutlined />}
                        size="small"
                        onClick={() => showImageModal(record.project_id)}
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
                        title="Delete this project?"
                        onConfirm={() => handleDelete(record.project_id)}
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
                <Title level={2}>Projects Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Project
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="project_id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingProject ? 'Edit Project' : 'Add Project'}
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
                        label="Project Name"
                        name="project_name"
                        rules={[{ required: true, message: 'Please input project name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Date Updated"
                        name="data_update"
                        rules={[{ required: true, message: 'Please select date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="project_category"
                        rules={[{ required: true, message: 'Please select category!' }]}
                    >
                        <Select>
                            <Select.Option value="Residential">Residential</Select.Option>
                            <Select.Option value="Commercial">Commercial</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Project Images"
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
                    dataSource={projectImages}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{ position: 'relative' }}>
                                <Image src={item.image_url} alt="Project" style={{ width: '100%' }} />
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