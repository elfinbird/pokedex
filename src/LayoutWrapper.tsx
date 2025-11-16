import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeFilled, UnorderedListOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { tss } from './tss';

const { Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/', label: 'Home', icon: <HomeFilled /> },
  { key: '/list', label: 'List', icon: <UnorderedListOutlined /> },
];

export const LayoutWrapper = () => {
  const { classes } = useStyles();
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={classes.rootLayout}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

const useStyles = tss.create(({ theme }) => ({
  rootLayout: {
    height: '100vh',
    backgroundColor: theme.color.surface,
    color: theme.color.text.primary,
    '& main': {
      padding: 16,
      overflowY: 'auto',
    },
    '& .ant-layout-sider-children': {
      background: `${theme.color.surface} !important`, // setting new bg color for the assignment
    },
    '& .ant-layout-sider-trigger': {
      background: `${theme.color.surface} !important`, // setting new bg color for the assignment
    },
    '& .ant-layout-sider-children *': {
      background: `${theme.color.surface} !important`, // setting new bg color for the assignment
    },
  },
}));
