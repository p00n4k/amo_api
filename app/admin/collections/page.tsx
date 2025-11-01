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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Collection {
  collection_id: number;
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
    try {
      const values = await form.validateFields();
      
      if (editingCollection) {
        await axios.put('/api/admin/collection', {
          collection_id: editingCollection.collection_id,
          ...values,
        });
        message.success('Collection updated successfully!');
      } else {
        await axios.post('/api/admin/collection', values);
        message.success('Collection created successfully!');
      }

      mutate();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed!');
    }
  };

  const handleDelete = async (collection_id: number) => {
    try {
      await axios.delete('/api/admin/collection', { data: { collection_id } });
      message.success('Collection deleted successfully!');
      mutate();
    } catch (error) {
      message.error('Delete failed!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'collection_id',
      key: 'collection_id',
      width: 70,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (url: string) => (
        <Image src={url} alt="Collection" width={60} height={40} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      key: 'brand_name',
    },
    {
      title: 'Material',
      dataIndex: 'material_type',
      key: 'material_type',
      render: (type: string) => (
        <Tag color={type === 'Surface' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'default'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
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
            onConfirm={() => handleDelete(record.collection_id)}
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
        <Title level={2}>Collections Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Collection
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="collection_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingCollection ? 'Edit Collection' : 'Add Collection'}
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
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input type!' }]}
          >
            <Input placeholder="e.g., Marble White, Oak Natural" />
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
            label="Material Type"
            name="material_type"
            rules={[{ required: true, message: 'Please select material type!' }]}
          >
            <Select>
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
          >
            <Input placeholder="/uploads/products/..." />
          </Form.Item>

          <Form.Item
            label="Link"
            name="link"
          >
            <Input placeholder="https://example.com/products/..." />
          </Form.Item>

          <Form.Item
            label="Related Link"
            name="relate_link"
          >
            <Input placeholder="https://example.com/related/..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}