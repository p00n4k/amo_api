'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  message,
  Typography,
  Image,
  Popconfirm,
  Upload,
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

interface Collection {
  collection_id: number;
  collection_name: string;
  type: 'Surface' | 'Furniture' | 'Other';
  brand_id: number; // ✅ important (API needs brand_id)
  brand_name: string;
  material_type: string;
  status: boolean;
  description: string;
  image: string;
  link: string;
  relate_link: string;
  created_at?: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

type DataIndex = keyof Collection;

export default function CollectionsPage() {
  // ✅ use ONE endpoint for CRUD (matches your route.ts)
  const API = '/api/admin/collection';

  const { data, error, mutate } = useSWR<Collection[]>(API, fetcher);
  const { data: brandData } = useSWR<Brand[]>('/api/admin/brand', fetcher);

  const collections: Collection[] = Array.isArray(data) ? data : [];
  const brands: Brand[] = Array.isArray(brandData)
    ? [...brandData].sort((a, b) => a.brand_name.localeCompare(b.brand_name))
    : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form] = Form.useForm();

  const [uploading, setUploading] = useState(false);

  // column search
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | ''>('');
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
      return res.data.filePath as string;
    } catch (e) {
      console.error(e);
      setUploading(false);
      message.error('Upload failed!');
      return '';
    }
  };

  const showModal = (record?: Collection) => {
    if (record) {
      setEditing(record);
      // ✅ make sure form uses brand_id, not brand_name
      form.setFieldsValue({
        ...record,
        brand_id: record.brand_id,
      });
    } else {
      setEditing(null);
      form.resetFields();
      form.setFieldsValue({
        status: true,
        type: 'Surface',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await axios.put(API, {
          collection_id: editing.collection_id,
          ...values,
        });
        message.success('Collection updated!');
      } else {
        await axios.post(API, values);
        message.success('Collection created!');
      }

      mutate();
      setIsModalOpen(false);
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error('Save failed!');
    }
  };

  const handleDelete = async (collection_id: number) => {
    try {
      await axios.delete(API, { data: { collection_id } });
      message.success('Deleted!');
      mutate();
    } catch (e) {
      console.error(e);
      message.error('Delete failed!');
    }
  };

  // ✅ column search helper
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Collection> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={(selectedKeys[0] as string) || ''}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            confirm();
            setSearchText((selectedKeys[0] as string) || '');
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
              setSearchText((selectedKeys[0] as string) || '');
              setSearchedColumn(dataIndex);
            }}
          >
            Search
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              setSearchText('');
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

  // quick filters from data
  const brandFilters = useMemo(() => {
    const uniq = Array.from(new Set(collections.map((c) => c.brand_name).filter(Boolean))).sort();
    return uniq.map((b) => ({ text: b, value: b }));
  }, [collections]);

  const materialFilters = useMemo(() => {
    const uniq = Array.from(new Set(collections.map((c) => c.material_type).filter(Boolean))).sort();
    return uniq.map((m) => ({ text: m, value: m }));
  }, [collections]);

  const columns: ColumnsType<Collection> = [
    {
      title: 'ID',
      dataIndex: 'collection_id',
      key: 'collection_id',
      width: 80,
      sorter: (a, b) => a.collection_id - b.collection_id,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 110,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="collection"
            width={70}
            height={50}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'collection_name',
      key: 'collection_name',
      ...getColumnSearchProps('collection_name'),
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      key: 'brand_name',
      filters: brandFilters,
      onFilter: (value, record) => record.brand_name === value,
      sorter: (a, b) => (a.brand_name || '').localeCompare(b.brand_name || ''),
    },
    {
      title: 'Material',
      dataIndex: 'material_type',
      key: 'material_type',
      filters: materialFilters,
      onFilter: (value, record) => record.material_type === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Surface', value: 'Surface' },
        { text: 'Furniture', value: 'Furniture' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      filters: [
        { text: 'Active', value: '1' },
        { text: 'Inactive', value: '0' },
      ],
      onFilter: (value, record) => (record.status ? '1' : '0') === String(value),
      render: (val: boolean) => <Switch checked={!!val} disabled />,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      width: 200,
      ...getColumnSearchProps('link'),
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
            {url.length > 17 ? url.substring(0, 17) + '...' : url}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'Relate',
      dataIndex: 'relate_link',
      key: 'relate_link',
      width: 200,
      ...getColumnSearchProps('relate_link'),
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
            {url.length > 17 ? url.substring(0, 17) + '...' : url}
          </a>
        ) : (
          '-'
        ),
    },

    // ✅ Description = second last column (ก่อน Actions)
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
      ellipsis: true,
      width: 260,
    },

    // ✅ Actions = LAST column
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Collection) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Delete this collection?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.collection_id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <div>Failed to load</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Collections Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Collection
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={collections}
        rowKey="collection_id"
        scroll={{ x: 1400 }}
      />

      <Modal
        title={editing ? 'Edit Collection' : 'Add Collection'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Collection Name"
            name="collection_name"
            rules={[{ required: true, message: 'Please input collection name!' }]}
          >
            <Input />
          </Form.Item>

          {/* ✅ IMPORTANT: use brand_id (number) */}
          <Form.Item label="Brand" name="brand_id" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" placeholder="Select brand">
              {brands.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_id} label={b.brand_name}>
                  {b.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Material Type" name="material_type" rules={[{ required: true }]}>
            <Input placeholder="e.g., Porcelain, Ceramic, Wood" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please upload image!' }]}>
            <Upload
              name="file"
              listType="picture"
              customRequest={async ({ file, onSuccess }) => {
                const path = await handleUpload(file as File);
                form.setFieldValue('image', path);
                onSuccess && onSuccess('ok');
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload Image
              </Button>
            </Upload>

            {form.getFieldValue('image') && (
              <Image
                src={form.getFieldValue('image')}
                alt="Preview"
                width={120}
                style={{ marginTop: 10, borderRadius: 4 }}
              />
            )}
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Relate Link" name="relate_link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}