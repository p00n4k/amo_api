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
const { Option } = Select;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: 'Residential' | 'Commercial';
    project_images?: { image_id: number; image_url: string }[];
    collections?: { collection_id: number; type: string }[];
}

interface Collection {
    collection_id: number;
    type: string;
    material_type: string;
    status: boolean;
    image: string;
}

export default function ProjectsPage() {
    const { data, error, mutate } = useSWR<Project[]>('/api/admin/project', fetcher);
    const { data: collections } = useSWR<Collection[]>('/api/admin/collection', fetcher);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
    const [form] = Form.useForm();

    // ✅ Upload Project Image
    const [uploading, setUploading] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string>('');

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const path = res.data.filePath;
            setUploadedImagePath(path);
            message.success('Upload successful!');
            return path;
        } catch (err) {
            console.error('Upload error:', err);
            message.error('Upload failed!');
            return '';
        } finally {
            setUploading(false);
        }
    };

    // ✅ Add/Edit Project
    const showModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            form.setFieldsValue(project);
        } else {
            setEditingProject(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingProject) {
                await axios.put('/api/admin/project', {
                    project_id: editingProject.project_id,
                    ...values,
                });
                message.success('Project updated successfully!');
            } else {
                await axios.post('/api/admin/project', values);
                message.success('Project created successfully!');
            }
            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error('Operation failed!');
        }
    };

    // ✅ Delete Project
    const handleDelete = async (project_id: number) => {
        try {
            await axios.delete('/api/admin/project', { data: { project_id } });
            message.success('Project deleted successfully!');
            mutate();
        } catch (error) {
            message.error('Delete failed!');
        }
    };

    // ✅ Open Modal for Managing Collections
    const openCollectionsModal = async (project_id: number) => {
        try {
            setSelectedProjectId(project_id);
            const res = await axios.get(`/api/admin/projectcollection?project_id=${project_id}`);
            setSelectedCollections(res.data.map((c: any) => c.collection_id));
            setCollectionModalOpen(true);
        } catch (error) {
            console.error(error);
            message.error('Failed to load project collections!');
        }
    };

    // ✅ Save selected Collections
    const handleSaveCollections = async () => {
        try {
            await axios.post('/api/admin/projectcollection', {
                project_id: selectedProjectId,
                collection_ids: selectedCollections,
            });
            message.success('Collections updated!');
            setCollectionModalOpen(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to update collections!');
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
            title: 'Category',
            dataIndex: 'project_category',
            key: 'project_category',
        },
        {
            title: 'Last Update',
            dataIndex: 'data_update',
            key: 'data_update',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 250,
            render: (_: any, record: Project) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    <Button
                        size="small"
                        onClick={() => openCollectionsModal(record.project_id)}
                    >
                        Collections
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

            <Table
                columns={columns}
                dataSource={data}
                rowKey="project_id"
                pagination={{ pageSize: 10 }}
            />

            {/* ✅ Add/Edit Project Modal */}
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
                        label="Category"
                        name="project_category"
                        rules={[{ required: true, message: 'Please select project category!' }]}
                    >
                        <Select>
                            <Option value="Residential">Residential</Option>
                            <Option value="Commercial">Commercial</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Data Update"
                        name="data_update"
                        rules={[{ required: true, message: 'Please input date!' }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                </Form>
            </Modal>

            {/* ✅ Manage Collections Modal */}
            <Modal
                title="Manage Project Collections"
                open={isCollectionModalOpen}
                onOk={handleSaveCollections}
                onCancel={() => setCollectionModalOpen(false)}
                width={600}
            >
                <p style={{ marginBottom: 8 }}>
                    Select collections to link with this project.
                </p>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select collections"
                    value={selectedCollections}
                    onChange={(values) => setSelectedCollections(values)}
                >
                    {collections?.map((col) => (
                        <Option key={col.collection_id} value={col.collection_id}>
                            {col.type} — {col.material_type}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
}
