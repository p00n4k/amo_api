'use client';

import React, { useMemo, useRef, useState } from 'react';
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
    Switch,
} from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Brand {
    brand_id: number;
    brand_name: string;
    brand_image: string;
    main_type: 'Surface' | 'Furnishing' | 'Other';
    type: string;
    brand_url: string;

    // ✅ NEW: active (รองรับทั้ง 0/1 หรือ boolean)
    active?: number | boolean;
}

type DataIndex = keyof Brand;

export default function BrandsPage() {
    const { data, error, mutate } = useSWR<Brand[]>('/api/admin/brand', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    // ✅ column search state
    const [searchedText, setSearchedText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState<DataIndex | ''>('');

    // ✅ FIX: use InputRef (type) instead of Input (value)
    const searchInput = useRef<InputRef>(null);

    // ✅ Upload image to /api/admin/upload
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('/api/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploading(false);
            return res.data.filePath;
        } catch {
            message.error('Upload failed!');
            setUploading(false);
            return '';
        }
    };

    const showModal = (brand?: Brand) => {
        if (brand) {
            setEditingBrand(brand);

            // ✅ ให้ active ไปเป็น boolean ในฟอร์ม
            form.setFieldsValue({
                ...brand,
                active: !!brand.active,
            });
        } else {
            setEditingBrand(null);

            // ✅ default active = true เวลาสร้างใหม่
            form.resetFields();
            form.setFieldsValue({ active: true });
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // ✅ แปลง active boolean -> 1/0 ส่งไป backend
            const payload = {
                ...values,
                active: values.active ? 1 : 0,
            };

            if (editingBrand) {
                await axios.put('/api/admin/brand', {
                    brand_id: editingBrand.brand_id,
                    ...payload,
                });
                message.success('Brand updated successfully!');
            } else {
                await axios.post('/api/admin/brand', payload);
                message.success('Brand created successfully!');
            }
            mutate();
            setIsModalOpen(false);
            form.resetFields();
        } catch (err) {
            console.error(err);
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

    // ✅ Toggle active from table (inline)
    const handleToggleActive = async (brand_id: number, checked: boolean) => {
        try {
            await axios.put('/api/admin/brand', {
                brand_id,
                active: checked ? 1 : 0,
            });
            message.success('Active updated!');
            mutate();
        } catch (e) {
            console.error(e);
            message.error('Update active failed!');
        }
    };

    const brands = Array.isArray(data) ? data : [];

    // ✅ build unique list for "Type" filter
    const typeFilters = useMemo(() => {
        const uniq = Array.from(
            new Set(brands.map((b) => (b.type || '').trim()).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        return uniq.map((t) => ({ text: t, value: t }));
    }, [brands]);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    // ✅ helper: column text search (in header)
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Brand> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${String(dataIndex)}`}
                    value={(selectedKeys[0] as string) || ''}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => {
                        confirm();
                        setSearchedText((selectedKeys[0] as string) || '');
                        setSearchedColumn(dataIndex);
                    }}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="small"
                        onClick={() => {
                            confirm();
                            setSearchedText((selectedKeys[0] as string) || '');
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            clearFilters?.();
                            setSearchedText('');
                            setSearchedColumn('');
                            confirm({ closeDropdown: false } as FilterConfirmProps);
                        }}
                    >
                        Reset
                    </Button>
                    <Button size="small" type="link" onClick={() => close()}>
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            const v = String(value || '').toLowerCase();
            const field = String(record[dataIndex] ?? '').toLowerCase();
            return field.includes(v);
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => searchInput.current?.select?.(), 100);
        },
    });

    const columns: ColumnsType<Brand> = [
        {
            title: 'ID',
            dataIndex: 'brand_id',
            key: 'brand_id',
            width: 70,
            sorter: (a, b) => a.brand_id - b.brand_id,
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            width: 110,
            filters: [
                { text: 'Active', value: '1' },
                { text: 'Inactive', value: '0' },
            ],
            onFilter: (value, record) => {
                const v = String(value);
                const a = record.active ? '1' : '0';
                return a === v;
            },
            render: (_: any, record: Brand) => (
                <Switch
                    checked={!!record.active}
                    onChange={(checked) => handleToggleActive(record.brand_id, checked)}
                />
            ),
        },
        {
            title: 'Image',
            dataIndex: 'brand_image',
            key: 'brand_image',
            render: (url: string) =>
                url ? (
                    <Image
                        src={url}
                        alt="Brand"
                        width={70}
                        height={50}
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <span>No Image</span>
                ),
        },
        {
            title: 'Brand Name',
            dataIndex: 'brand_name',
            key: 'brand_name',
            ...getColumnSearchProps('brand_name'),
        },
        {
            title: 'Main Type',
            dataIndex: 'main_type',
            key: 'main_type',
            filters: [
                { text: 'Surface', value: 'Surface' },
                { text: 'Furnishing', value: 'Furnishing' },
                { text: 'Other', value: 'Other' },
            ],
            onFilter: (value, record) => record.main_type === value,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: typeFilters,
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'URL',
            dataIndex: 'brand_url',
            key: 'brand_url',
            ...getColumnSearchProps('brand_url'),
            render: (url: string) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>Brands Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Brand
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={brands}
                rowKey="brand_id"
                pagination={{ pageSize: 10 }}
            />

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
                    <Form.Item label="Active" name="active" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Brand Name"
                        name="brand_name"
                        rules={[{ required: true, message: 'Please input brand name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Brand Image"
                        name="brand_image"
                        rules={[{ required: true, message: 'Please upload image!' }]}
                    >
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
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input type!' }]}
                    >
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

            <Image
                src="/static/brandspreview.png"
                alt="Homepage Preview"
                width={900}
                style={{ marginTop: 40, borderRadius: 8, display: 'block' }}
            />
        </div>
    );
}