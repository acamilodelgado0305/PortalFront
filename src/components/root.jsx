import React, { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Typography, Avatar, Button } from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Logo from "../../images/logo.png";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: '/inicio/dashboard', icon: <BarChartOutlined />, label: 'Dashboard' },
    { key: '/inicio/students', icon: <UserOutlined />, label: 'Estudiantes' },
    { key: '/inicio/programas', icon: <BookOutlined />, label: 'Programas' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} 
             breakpoint="lg" collapsedWidth="80"
             onBreakpoint={(broken) => {
               if (broken) {
                 setCollapsed(true);
               }
             }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="bg-white p-0 flex justify-between items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            className="text-xl w-16 h-16"
          />
          <div className="flex items-center mr-4">
          <Avatar src={Logo} className="mr-2" />
            <span className="mr-4">IFEVA</span>
            <Button type="link" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </div>
        </Header>
        <Content className="m-4 p-4 bg-white rounded-lg overflow-y-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Root;