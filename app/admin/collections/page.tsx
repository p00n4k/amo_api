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
  material_type: string;
  brand_name: string;
  type: 'Surface' | 'Furniture' | 'Other';
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
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filePath = res.data.filePath;
      form.setFieldValue('image', filePath);
      message.success('Image uploaded successfully!');
      return filePath;
    } catch (error) {
      message.error('Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
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
    try {
      await form.validateFields();

      // ✅ วิธีที่ 1: สร้าง payload แบบ manual (แนะนำที่สุด)
      const formValues = form.getFieldsValue();

      const payload = {
        collection_name: formValues.collection_name,
        type: formValues.type,
        brand_id: formValues.brand_id,
        material_type: formValues.material_type,
        status: formValues.status ?? true,
        description: formValues.description || '',
        image: formValues.image || '',
        link: formValues.link || '',
        relate_link: formValues.relate_link || '',
      };

      console.log('🔍 Payload being sent:', payload);
      console.log('🔍 All form values:', formValues);

      if (editingCollection) {
        await axios.put('/api/admin/collection', {
          collection_id: editingCollection.collection_id,
          ...payload
        });
        message.success('Collection updated successfully!');
      } else {
        await axios.post('/api/admin/collection', payload);
        message.success('Collection created successfully!');
      }

      mutate();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error('❌ Error saving collection:', error);
      console.error('❌ Error response:', error.response?.data);
      message.error('Failed to save: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (collection_id: number) => {
    try {
      await axios.delete('/api/admin/collection', { data: { collection_id } });
      message.success('Collection deleted successfully!');
      mutate();
    } catch (error: any) {
      console.error('❌ Error deleting:', error);
      message.error('Failed to delete: ' + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'collection_id',
      width: 60,
      sorter: (a: Collection, b: Collection) => a.collection_id - b.collection_id,
    },
    {
      title: 'Collection Name',
      dataIndex: 'collection_name',
      sorter: (a: Collection, b: Collection) => a.collection_name.localeCompare(b.collection_name),
    },
    {
      title: 'Item',
      dataIndex: 'material_type'
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (val: string) => {
        const color = val === 'Surface' ? 'blue' : val === 'Furniture' ? 'green' : 'orange';
        return <Tag color={color}>{val}</Tag>;
      },
      filters: [
        { text: 'Surface', value: 'Surface' },
        { text: 'Furniture', value: 'Furniture' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value: any, record: Collection) => record.type === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: boolean) => (
        <Tag color={val ? 'green' : 'red'}>
          {val ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (url: string) => (
        url ? (
          <Image
            src={url}
            width={70}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={{ src: url }}
          />
        ) : (
          <span style={{ color: '#999' }}>No image</span>
        )
      ),
    },
    {
      title: 'Actions',
      width: 120,
      render: (_: any, record: Collection) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          />
          <Popconfirm
            title="Delete this collection?"
            description="This action cannot be undone."
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Collections Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          size="large"
        >
          Add Collection
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={collections}
        rowKey="collection_id"
        loading={!data && !error}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCollection ? 'Edit Collection' : 'Add New Collection'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>

          <Form.Item
            label="Collection Name"
            name="collection_name"
            rules={[{ required: true, message: 'Please enter collection name' }]}
          >
            <Input placeholder="Enter collection name" size="large" />
          </Form.Item>

          <Form.Item
            label="Item"
            name="material_type"
            rules={[{ required: true, message: 'Item Name in Collection' }]}
          >
            <Input placeholder="Nero Marquina , EY09 Gold Catalan , Ivory" size="large" />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand_id"
            rules={[{ required: true, message: 'Please select a brand' }]}
          >
            <Select placeholder="Select a brand" size="large">
              {brands?.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_id}>
                  {b.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type" size="large">
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea
              rows={3}
              placeholder="Enter description (optional)"
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* ✅ Fixed Upload Component - ไม่เพิ่ม file/fileList เข้า form */}
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Please upload an image' }]}
          >
            <div>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  // ✅ Upload แล้ว return false เพื่อไม่ให้ antd จัดการต่อ
                  handleUpload(file);
                  return false;
                }}
                accept="image/*"
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                  size="large"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Upload>

              {form.getFieldValue('image') && (
                <div style={{ marginTop: 12 }}>
                  <Image
                    src={form.getFieldValue('image')}
                    alt="Preview"
                    width={200}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #d9d9d9',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item label="Product Link" name="link">
            <Input placeholder="https://example.com/product (optional)" size="large" />
          </Form.Item>

          <Form.Item label="Related Link" name="relate_link">
            <Input placeholder="https://example.com/related (optional)" size="large" />
          </Form.Item>

        </Form>
      </Modal>

      {/* Preview Image */}
      <div style={{ marginTop: 40 }}>
        <Title level={4}>Collection Preview</Title>
        <Image
          src="/static/collectionpreview.png"
          alt="Collection Preview"
          width={900}
          style={{
            borderRadius: 8,
            border: '1px solid #f0f0f0'
          }}
        />
      </div>
    </div>
  );
}