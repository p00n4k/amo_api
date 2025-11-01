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
import dayjs from 'dayjs';

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: 'Residential' | 'Commercial';
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
    const [uploading, setUploading] = useState(false);

    // ✅ ป้องกัน rawData.some is not a function
    const projects = Array.isArray(data) ? data : [];

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

    const handleDelete = async (project_id: number) => {
        try {
            await axios.delete('/api/admin/project', { data: { project_id } });
            message.success('Project deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    // ✅ Upload function
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
                message.error('No file path returned');
            }
            setUploading(false);
            return filePath;
        } catch (error) {
            message.error('Upload failed!');
            setUploading(false);
            return '';
        }
    };

    const handleAddImage = async () => {
        try {
            const values = await imageForm.validateFields();
            await axios.post('/api/admin/projectimage', {
                project_id: selectedProject,
                ...values,
            });
            message.success('Image added successfully!');
            const response = await axios.get(`/api/admin/project?project_id=${selectedProject}`);
            setProjectImages(response.data.images || []);
            imageForm.resetFields();
        } catch (error) {
            message.error('Add image failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/projectimage', { data: { image_id } });
            message.success('Image deleted successfully!');
            const response = await axios.get(`/api/admin/project?project_id=${selectedProject}`);
            setProjectImages(response.data.images || []);
        } catch (error) {
            message.error('Delete image failed!');
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
            title: 'Date Update',
            dataIndex: 'data_update',
            key: 'data_update',
        },
        {
            title: 'Category',
            dataIndex: 'project_category',
            key: 'project_category',
            render: (cat: string) => (
                <Tag color={cat === 'Residential' ? 'blue' : 'green'}>{cat}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Project) => (
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
                        onClick={() => showImageModal(record.project_id)}
                    >
                        Images
                    </Button>
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

            {/* ✅ ใช้ projects ที่เป็น array แน่นอน */}
            <Table
                columns={columns}
                dataSource={projects}
                rowKey="project_id"
                pagination={{ pageSize: 10 }}
            />

            {/* Modal: Project Form */}
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
                        label="Date Update"
                        name="data_update"
                        rules={[{ required: true, message: 'Please select date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
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

            {/* Modal: Manage Project Images */}
            <Modal
                title="Manage Project Images"
                open={isImageModalOpen}
                onCancel={() => setIsImageModalOpen(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={imageForm} // ✅ ผูก useForm
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
                                const path = await handleUpload(file as File);
                                if (path) imageForm.setFieldValue('image_url', path);
                                onSuccess && onSuccess('ok');
                            }}
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                Upload Image
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="display_order"
                        rules={[{ required: true, message: 'Order required!' }]}
                        style={{ width: '20%' }}
                    >
                        <Input type="number" placeholder="Order" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>

                {/* ✅ Preview image */}
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

                {/* ✅ List images */}
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={projectImages}
                    renderItem={(item) => (
                        <List.Item>
                            <div style={{ position: 'relative' }}>
                                <Image src={item.image_url} alt="Project" style={{ width: '100%' }} />
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
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
