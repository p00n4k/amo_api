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
  Tag,
  List,
  Image,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  PictureOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ProductFocus {
  focus_id: number;
  collection_name: string;
  brand_name: string;
  description: string;
  made_in: string;
  type: 'Furnishing' | 'Surface';
  link: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface FocusImage {
  image_id: number;
  image_url: string;
  display_order: number;
}

export default function ProductFocusPage() {
  const { data, error, mutate } = useSWR<ProductFocus[]>(
    '/api/admin/homefocus',
    fetcher
  );
  const { data: brands } = useSWR<Brand[]>('/api/admin/brand', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingFocus, setEditingFocus] = useState<ProductFocus | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<number | null>(null);
  const [focusImages, setFocusImages] = useState<FocusImage[]>([]);

  const [form] = Form.useForm();
  const [imageForm] = Form.useForm();

  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string>('');

  // =========================
  // Helpers
  // =========================
  const loadFocusImages = async (focus_id: number) => {
    const response = await axios.get(`/api/admin/homefocus?focus_id=${focus_id}`);
    const imgs: FocusImage[] = response.data.images || [];
    // ✅ enforce max 1 client-side (just in case backend has more)
    setFocusImages(imgs.slice(0, 1));
    return imgs.length;
  };

  // ✅ Upload Image Handler
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
        setUploadedImagePath(filePath);
        imageForm.setFieldsValue({ image_url: filePath });
        message.success('Upload successful!');
        return true;
      } else {
        message.error('No file path returned!');
        return false;
      }
    } catch (err) {
      console.error('Upload failed:', err);
      message.error('Upload failed!');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Focus CRUD
  // =========================
  const showModal = (focus?: ProductFocus) => {
    setUploadedImagePath('');

    if (focus) {
      setEditingFocus(focus);
      form.setFieldsValue(focus);
    } else {
      setEditingFocus(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingFocus) {
        await axios.put('/api/admin/homefocus', {
          focus_id: editingFocus.focus_id,
          ...values,
        });
        message.success('Signature Collection (Stock) updated successfully!');
      } else {
        await axios.post('/api/admin/homefocus', values);
        message.success('Signature Collection (Stock) created successfully!');
      }

      mutate();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed!');
    }
  };

  // =========================
  // Images (REQUIRED + MAX 1)
  // =========================
  const showImageModal = async (focus_id: number) => {
    setSelectedFocus(focus_id);
    setUploadedImagePath('');
    imageForm.resetFields();

    try {
      await loadFocusImages(focus_id);
      setIsImageModalOpen(true);
    } catch (error) {
      message.error('Failed to load images!');
    }
  };

  // ✅ Add (only if none)
  const handleAddImage = async () => {
    try {
      if (!selectedFocus) return;

      // ✅ max = 1
      if (focusImages.length >= 1) {
        message.warning(
          'This collection already has 1 image. Please replace it instead.'
        );
        return;
      }

      if (!uploadedImagePath) {
        message.error('Please upload an image first!');
        return;
      }

      await axios.post('/api/admin/homefocus', {
        focus_id: selectedFocus,
        image_url: uploadedImagePath,
        display_order: 0,
        action: 'add_image',
      });

      message.success('Image added successfully!');
      imageForm.resetFields();
      setUploadedImagePath('');
      await loadFocusImages(selectedFocus);
    } catch (error) {
      console.error('Add image error:', error);
      message.error('Operation failed!');
    }
  };

  // ✅ Replace (must already have 1)
  const handleReplaceImage = async () => {
    try {
      if (!selectedFocus) return;

      if (focusImages.length === 0) {
        message.warning('No image yet. Please add one first.');
        return;
      }

      if (!uploadedImagePath) {
        message.error('Please upload a new image to replace!');
        return;
      }

      setReplacing(true);

      // delete old
      const oldImageId = focusImages[0].image_id;
      await axios.delete('/api/admin/homefocus', {
        data: { image_id: oldImageId, action: 'delete_image' },
      });

      // add new
      await axios.post('/api/admin/homefocus', {
        focus_id: selectedFocus,
        image_url: uploadedImagePath,
        display_order: 0,
        action: 'add_image',
      });

      message.success('Image replaced successfully!');
      imageForm.resetFields();
      setUploadedImagePath('');
      await loadFocusImages(selectedFocus);
    } catch (e) {
      console.error(e);
      message.error('Replace failed!');
    } finally {
      setReplacing(false);
    }
  };

  // ✅ IMPORTANT: cannot delete last image (required)
  // If you still want delete button, disable it always OR only enable when >1 (but we enforce max=1)
  const handleDeleteImage = async (_image_id: number) => {
    message.warning('Each collection must have 1 image (required). Use Replace Image instead.');
  };

  // =========================
  // Table
  // =========================
  const columns = [
    { title: 'ID', dataIndex: 'focus_id', key: 'focus_id', width: 70 },
    { title: 'Collection', dataIndex: 'collection_name', key: 'collection_name' },
    { title: 'Brand', dataIndex: 'brand_name', key: 'brand_name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Surface' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: any, record: ProductFocus) => (
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
            onClick={() => showImageModal(record.focus_id)}
          >
            Images
          </Button>
        </Space>
      ),
    },
  ];

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Signature Collection (Stock) Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Signature Collection (Stock)
        </Button>
      </div>

      {/* ✅ allow more than 2 collections */}
      <Table columns={columns} dataSource={data} rowKey="focus_id" pagination={false} />

      {/* =========================
          Add/Edit Focus Modal
         ========================= */}
      <Modal
        title={editingFocus ? 'Edit Signature Collection (Stock)' : 'Add Signature Collection (Stock)'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingFocus(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Collection Name" name="collection_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Brand Name" name="brand_name" rules={[{ required: true }]}>
            <Select placeholder="Select Brand">
              {brands?.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_name}>
                  {b.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Made In" name="made_in">
            <Input />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select placeholder="Select Type">
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furnishing">Furnishing</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* =========================
          Manage Images Modal (REQUIRED + MAX 1)
         ========================= */}
      <Modal
        title="Manage Focus Image (Required: Exactly 1)"
        open={isImageModalOpen}
        onCancel={() => {
          setIsImageModalOpen(false);
          setUploadedImagePath('');
          imageForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Form form={imageForm} layout="vertical">
            <Form.Item label={focusImages.length === 0 ? 'Upload Image (Required)' : 'Upload New Image (Replace)'} required>
              <Upload
                name="file"
                showUploadList={false}
                accept="image/*"
                customRequest={async ({ file, onSuccess, onError }) => {
                  const success = await handleUpload(file as File);
                  if (success) onSuccess && onSuccess('ok');
                  else onError && onError(new Error('Upload failed'));
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploadedImagePath ? 'Change Image' : 'Upload Image'}
                </Button>
              </Upload>

              {uploadedImagePath && (
                <div style={{ marginTop: 16 }}>
                  <Image
                    src={uploadedImagePath}
                    alt="Preview"
                    width={200}
                    style={{ borderRadius: 6 }}
                  />
                </div>
              )}
            </Form.Item>

            <Form.Item name="image_url" hidden>
              <Input />
            </Form.Item>

            <Form.Item>
              {focusImages.length === 0 ? (
                <Button
                  type="primary"
                  onClick={handleAddImage}
                  disabled={!uploadedImagePath}
                  block
                >
                  Add Image (Required)
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleReplaceImage}
                  disabled={!uploadedImagePath}
                  loading={replacing}
                  block
                >
                  Replace Image
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>

        <div>
          <Title level={5}>Current Image (Max 1)</Title>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={focusImages.slice(0, 1)}
            renderItem={(item) => (
              <List.Item>
                <div style={{ position: 'relative' }}>
                  <Image
                    src={item.image_url}
                    alt="Focus"
                    style={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Order: {item.display_order}</span>

                    {/* ❌ not allowed to delete (required) */}
                    <Button danger size="small" onClick={() => handleDeleteImage(item.image_id)}>
                      Delete
                    </Button>
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <Tag color="orange">Image is required (cannot be empty)</Tag>
                    <Tag color="red">Max 1 image</Tag>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: 'No image yet. Upload one above (required)!' }}
          />
        </div>
      </Modal>

      <Image
        src="/static/productfocus.png"
        alt="Homepage Preview"
        width={900}
        style={{
          marginTop: 40,
          borderRadius: 8,
          display: 'block',
        }}
      />
    </div>
  );
}
