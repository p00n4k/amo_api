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
    const { data: projects, error, mutate } = useSWR<Project[]>('/api/admin/project', fetcher);
    const { data: collectionsData } = useSWR('/api/admin/collection', fetcher);

    // ✅ ปรับให้รองรับทุกแบบ (array หรือ object)
    const collections: Collection[] = Array.isArray(collectionsData)
        ? collectionsData
        : collectionsData?.collections || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);

    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
    const [selectedProjectImages, setSelectedProjectImages] = useState<
        { image_id: number; image_url: string }[]
    >([]);

    const [uploading, setUploading] = useState(false);
    const [uploadedPath, setUploadedPath] = useState<string>('');

    const [form] = Form.useForm();

    // ✅ Filters
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

    // ✅ Collections Modal
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

    // ✅ Image modal functions
    const openImageModal = async (project_id: number) => {
        setSelectedProjectId(project_id);
        try {
            const res = await axios.get(`/api/admin/project?project_id=${project_id}`);
            setSelectedProjectImages(res.data.project_images || []);
            setImageModalOpen(true);
        } catch {
            message.error('Failed to load project images!');
        }
    };

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file); // ใช้ default path (ยังไม่ระบุ folder)

            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const filePath = res.data?.filePath;
            setUploadedPath(filePath);
            message.success('Upload successful!');
        } catch (error) {
            message.error('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleAddImage = async () => {
        if (!uploadedPath) return message.error('Please upload an image first!');
        try {
            await axios.post('/api/admin/project', {
                action: 'add_image',
                project_id: selectedProjectId,
                image_url: uploadedPath,
            });
            message.success('Image added successfully!');
            setUploadedPath('');
            const res = await axios.get(`/api/admin/project?project_id=${selectedProjectId}`);
            setSelectedProjectImages(res.data.project_images || []);
        } catch {
            message.error('Add image failed!');
        }
    };

    const handleDeleteImage = async (image_id: number) => {
        try {
            await axios.delete('/api/admin/project', {
                data: { action: 'delete_image', image_id },
            });
            message.success('Image deleted!');
            const res = await axios.get(`/api/admin/project?project_id=${selectedProjectId}`);
            setSelectedProjectImages(res.data.project_images || []);
        } catch {
            message.error('Delete failed!');
        }
    };

    // ✅ Columns
    const columns = [
        { title: 'ID', dataIndex: 'project_id', width: 70 },
        { title: 'Project Name', dataIndex: 'project_name' },
        { title: 'Category', dataIndex: 'project_category' },
        { title: 'Last Update', dataIndex: 'data_update' },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
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
                    <Button
                        icon={<PictureOutlined />}
                        size="small"
                        onClick={() => openImageModal(record.project_id)}
                    >
                        Images
                    </Button>
                    <Popconfirm
                        title="Delete this project?"
                        onConfirm={() => handleDelete(record.project_id)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const collectionColumns = [
        { title: 'ID', dataIndex: 'collection_id', width: 70 },
        { title: 'Brand', dataIndex: 'brand_name' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Item', dataIndex: 'material_type' },
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

    // ✅ Filter logic
    const filteredCollections = collections.filter((c) => {
        const matchesSearch =
            c.type.toLowerCase().includes(searchText.toLowerCase()) ||
            c.brand_name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.material_type.toLowerCase().includes(searchText.toLowerCase());

        const matchesBrand = filterBrand ? c.brand_name === filterBrand : true;
        const matchesType = filterType ? c.type === filterType : true;
        const matchesMaterialType = filterMaterialType
            ? c.material_type === filterMaterialType
            : true;

        return matchesSearch && matchesBrand && matchesType && matchesMaterialType;
    });

    const uniqueBrands = Array.from(new Set(collections.map((c) => c.brand_name)));
    const uniqueTypes = Array.from(new Set(collections.map((c) => c.type)));
    const uniqueMaterialTypes = Array.from(new Set(collections.map((c) => c.material_type)));

    if (error) return <div>Failed to load</div>;
    if (!projects) return <div>Loading...</div>;

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
                dataSource={projects}
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

            {/* ✅ Manage Project Images Modal */}
            <Modal
                title="Manage Project Images"
                open={isImageModalOpen}
                onCancel={() => setImageModalOpen(false)}
                footer={null}
                width={800}
            >
                <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={async ({ file, onSuccess }) => {
                        await handleUpload(file as File);
                        onSuccess && onSuccess('ok');
                    }}
                >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                        Upload New Image
                    </Button>
                </Upload>

                {uploadedPath && (
                    <div style={{ marginTop: 16 }}>
                        <Image src={uploadedPath} alt="Preview" width={200} />
                        <Button
                            type="primary"
                            onClick={handleAddImage}
                            style={{ display: 'block', marginTop: 8 }}
                        >
                            Add to Project
                        </Button>
                    </div>
                )}

                <div style={{ marginTop: 24 }}>
                    <Title level={5}>Current Images</Title>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {selectedProjectImages.map((img) => (
                            <div key={img.image_id} style={{ position: 'relative' }}>
                                <Image
                                    src={img.image_url}
                                    width={150}
                                    height={100}
                                    style={{ objectFit: 'cover', borderRadius: 4 }}
                                />
                                <Popconfirm
                                    title="Delete this image?"
                                    onConfirm={() => handleDeleteImage(img.image_id)}
                                >
                                    <Button
                                        danger
                                        size="small"
                                        style={{ position: 'absolute', top: 4, right: 4 }}
                                    >
                                        X
                                    </Button>
                                </Popconfirm>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <Image
                src="/static/project.png"
                alt="Project Preview"
                width={900}
                style={{
                    marginTop: 40,
                    borderRadius: 8,
                    display: "block",
                }}
            />
            <Image
                src="/static/projectall.png"
                alt="Project All Preview"
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
