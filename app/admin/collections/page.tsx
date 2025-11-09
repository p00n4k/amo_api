'use client';

import React, { useState } from 'react';
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
  Tag,
  Upload,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Collection {
  collection_id: number;
  collection_name: string;
  type: string;
  brand_name: string;
  material_type: 'Surface' | 'Furniture';
  status: boolean;
  description: string;
  image: string;
  link: string;
  relate_link: string;
  created_at: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

export default function CollectionsPage() {
  const { data, error, mutate } = useSWR<Collection[]>('/api/admin/collection', fetcher);
  const { data: brands } = useSWR<Brand[]>('/api/admin/brand', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const collections = Array.isArray(data) ? data : [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUploading(false);
    const filePath = res.data.filePath;
    form.setFieldValue('image', filePath);
    return filePath;
  };

  const showModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      form.setFieldsValue(collection);
    } else {
      setEditingCollection(null);
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (editingCollection) {
      await axios.put('/api/admin/collection', { collection_id: editingCollection.collection_id, ...values });
      message.success('Collection updated successfully!');
    } else {
      await axios.post('/api/admin/collection', values);
      message.success('Collection created successfully!');
    }
    mutate();
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (collection_id: number) => {
    await axios.delete('/api/admin/collection', { data: { collection_id } });
    message.success('Collection deleted successfully!');
    mutate();
  };

  const columns = [
    { title: 'ID', dataIndex: 'collection_id', width: 60 },
    { title: 'Collection Name', dataIndex: 'collection_name' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Brand', dataIndex: 'brand_name' },
    {
      title: 'Material',
      dataIndex: 'material_type',
      render: (val: string) => <Tag color={val === 'Surface' ? 'blue' : 'green'}>{val}</Tag>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (url: string) => <Image src={url} width={70} height={40} style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Actions',
      render: (_: any, record: Collection) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.collection_id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Collections Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Collection</Button>
      </div>

      <Table columns={columns} dataSource={collections} rowKey="collection_id" />

      <Modal open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item label="Collection Name" name="collection_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Brand" name="brand_id" rules={[{ required: true }]}>
            <Select>
              {brands?.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_id}>{b.brand_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Material Type" name="material_type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Image" name="image" rules={[{ required: true }]}>
            <Upload showUploadList={false} customRequest={async ({ file, onSuccess }) => {
              await handleUpload(file as File);
              onSuccess && onSuccess("ok");
            }}>
              <Button icon={<UploadOutlined />} loading={uploading}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>

          <Form.Item label="Relate Link" name="relate_link">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
