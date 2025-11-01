'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
    TagsOutlined,
    AppstoreOutlined,
    ProjectOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';

const { Title } = Typography;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const { data: brands } = useSWR('/api/admin/brand', fetcher);
    const { data: collections } = useSWR('/api/admin/collection', fetcher);
    const { data: projects } = useSWR('/api/admin/project', fetcher);
    const { data: sliders } = useSWR('/api/admin/homeslider', fetcher);

    return (
        <div>
            <Title level={2}>Dashboard</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Brands"
                            value={brands?.length || 0}
                            prefix={<TagsOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Collections"
                            value={collections?.length || 0}
                            prefix={<AppstoreOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Projects"
                            value={projects?.length || 0}
                            prefix={<ProjectOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Home Sliders"
                            value={sliders?.length || 0}
                            prefix={<PictureOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}