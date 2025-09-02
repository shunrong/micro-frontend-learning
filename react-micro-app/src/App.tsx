import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./App.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createTime: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 模拟初始数据
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "张三",
        email: "zhangsan@example.com",
        role: "管理员",
        status: "active",
        createTime: "2024-01-15",
      },
      {
        id: 2,
        name: "李四",
        email: "lisi@example.com",
        role: "编辑",
        status: "active",
        createTime: "2024-01-20",
      },
      {
        id: 3,
        name: "王五",
        email: "wangwu@example.com",
        role: "用户",
        status: "inactive",
        createTime: "2024-02-01",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "活跃" : "停用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: User) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success("删除成功");
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // 编辑用户
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        message.success("更新成功");
      } else {
        // 添加新用户
        const newUser: User = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...values,
          createTime: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);
        message.success("添加成功");
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error("验证失败:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>用户管理 (React 微应用)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title={editingUser ? "编辑用户" : "添加用户"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请输入角色" }]}
          >
            <Input placeholder="请输入角色" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Input placeholder="active 或 inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
