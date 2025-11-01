'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    HomeOutlined,
    PictureOutlined,
    AppstoreOutlined,
    BranchesOutlined,
    ProjectOutlined,
    ShopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/admin',
            icon: <HomeOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/home-sliders',
            icon: <PictureOutlined />,
            label: <Link href="/admin/home-sliders">Home Sliders</Link>,
        },
        {
            key: '/admin/brands',
            icon: <TagsOutlined />,
            label: <Link href="/admin/brands">Brands</Link>,
        },
        {
            key: '/admin/collections',
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/collections">Collections</Link>,
        },
        {
            key: '/admin/projects',
            icon: <ProjectOutlined />,
            label: <Link href="/admin/projects">Projects</Link>,
        },
        {
            key: '/admin/product-focus',
            icon: <BranchesOutlined />,
            label: <Link href="/admin/product-focus">Product Focus</Link>,
        },
        {
            key: '/admin/product-main',
            icon: <ShopOutlined />,
            label: <Link href="/admin/product-main">Product Main</Link>,
        },
        {
            key: '/admin/product-items',
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/product-items">Product Items</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: collapsed ? 16 : 20,
                        fontWeight: 'bold',
                    }}
                >
                    {collapsed ? 'AMO' : 'AMO Admin'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}