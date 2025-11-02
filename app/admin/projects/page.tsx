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
    Image,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
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
}

interface Collection {
    collection_id: number;
    type: string;
    material_type: string;
    status: boolean;
    image: string;
    brand_name: string;
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

    // ✅ Filter states
    const [searchText, setSearchText] = useState('');
    const [filterBrand, setFilterBrand] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterMaterialType, setFilterMaterialType] = useState<string | null>(null);

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

    // ✅ Open Collections Modal
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

    // ✅ Save Selected Collections
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

    // ✅ Columns for Project Table
    const columns = [
        { title: 'ID', dataIndex: 'project_id', width: 70 },
        { title: 'Project Name', dataIndex: 'project_name' },
        { title: 'Category', dataIndex: 'project_category' },
        { title: 'Last Update', dataIndex: 'data_update' },
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
                    <Button size="small" onClick={() => openCollectionsModal(record.project_id)}>
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

    // ✅ Columns for Collections Table
    const collectionColumns = [
        { title: 'ID', dataIndex: 'collection_id', width: 70 },
        { title: 'Brand', dataIndex: 'brand_name' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Material Type', dataIndex: 'material_type' },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: boolean) => (status ? 'Available' : 'Not available'),
        },
        {
            title: 'Preview',
            dataIndex: 'image',
            render: (img: string) => (
                <Image
                    src={img}
                    width={80}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                />
            ),
        },
    ];

    // ✅ Apply filters & search
    const filteredCollections = collections?.filter((c) => {
        const matchesSearch =
            c.type.toLowerCase().includes(searchText.toLowerCase()) ||
            c.brand_name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.material_type.toLowerCase().includes(searchText.toLowerCase());

        const matchesBrand = filterBrand ? c.brand_name === filterBrand : true;
        const matchesType = filterType ? c.type === filterType : true;
        const matchesMaterialType = filterMaterialType ? c.material_type === filterMaterialType : true;

        return matchesSearch && matchesBrand && matchesType && matchesMaterialType;
    });

    // ✅ Extract unique filter values
    const uniqueBrands = Array.from(new Set(collections?.map((c) => c.brand_name)));
    const uniqueTypes = Array.from(new Set(collections?.map((c) => c.type)));
    const uniqueMaterialTypes = Array.from(new Set(collections?.map((c) => c.material_type)));

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

            {/* ✅ Project Table */}
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
                width={1000}
            >
                {/* 🔍 Filter Section */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <Input
                        placeholder="Search by brand, type, or material..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ width: '30%' }}
                    />
                    <Select
                        allowClear
                        placeholder="Filter by Brand"
                        value={filterBrand || undefined}
                        onChange={(v) => setFilterBrand(v || null)}
                        style={{ width: '20%' }}
                    >
                        {uniqueBrands.map((b) => (
                            <Option key={b} value={b}>
                                {b}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        allowClear
                        placeholder="Filter by Type"
                        value={filterType || undefined}
                        onChange={(v) => setFilterType(v || null)}
                        style={{ width: '20%' }}
                    >
                        {uniqueTypes.map((t) => (
                            <Option key={t} value={t}>
                                {t}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        allowClear
                        placeholder="Filter by Material Type"
                        value={filterMaterialType || undefined}
                        onChange={(v) => setFilterMaterialType(v || null)}
                        style={{ width: '20%' }}
                    >
                        {uniqueMaterialTypes.map((m) => (
                            <Option key={m} value={m}>
                                {m}
                            </Option>
                        ))}
                    </Select>
                </div>

                <Table
                    rowKey="collection_id"
                    dataSource={filteredCollections}
                    columns={collectionColumns}
                    rowSelection={{
                        selectedRowKeys: selectedCollections,
                        onChange: (keys) => setSelectedCollections(keys as number[]),
                    }}
                    pagination={{ pageSize: 8 }}
                />
            </Modal>
        </div>
    );
}
