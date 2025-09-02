<template>
  <div class="product-management">
    <div class="product-header">
      <h2>商品管理 (Vue 3 微应用)</h2>
      <a-button type="primary" @click="showAddModal">
        <template #icon>
          <PlusOutlined />
        </template>
        添加商品
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="products"
      :row-key="(record: Product) => record.id"
      :pagination="{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条记录`,
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-space>
            <ShoppingOutlined />
            {{ record.name }}
          </a-space>
        </template>
        <template v-else-if="column.key === 'price'">
          ¥{{ record.price.toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'stock'">
          <a-tag :color="record.stock > 10 ? 'green' : record.stock > 0 ? 'orange' : 'red'">
            {{ record.stock > 0 ? `库存 ${record.stock}` : '缺货' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '上架' : '下架' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" size="small" @click="editProduct(record)">
              <template #icon>
                <EditOutlined />
              </template>
              编辑
            </a-button>
            <a-popconfirm
              title="确定删除这个商品吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteProduct(record.id)"
            >
              <a-button type="primary" danger size="small">
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      :title="editingProduct ? '编辑商品' : '添加商品'"
      v-model:open="isModalVisible"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleOk"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="商品名称" name="name">
          <a-input v-model:value="formData.name" placeholder="请输入商品名称" />
        </a-form-item>

        <a-form-item label="商品描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入商品描述"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="价格" name="price">
          <a-input-number
            v-model:value="formData.price"
            :min="0"
            :precision="2"
            placeholder="请输入价格"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="库存" name="stock">
          <a-input-number
            v-model:value="formData.stock"
            :min="0"
            placeholder="请输入库存数量"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-select v-model:value="formData.category" placeholder="请选择分类">
            <a-select-option value="electronics">电子产品</a-select-option>
            <a-select-option value="clothing">服装</a-select-option>
            <a-select-option value="books">图书</a-select-option>
            <a-select-option value="food">食品</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-select v-model:value="formData.status" placeholder="请选择状态">
            <a-select-option value="active">上架</a-select-option>
            <a-select-option value="inactive">下架</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
} from '@ant-design/icons-vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive'
  createTime: string
}

const products = ref<Product[]>([])
const isModalVisible = ref(false)
const editingProduct = ref<Product | null>(null)
const formRef = ref()

const formData = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  status: 'active' as 'active' | 'inactive',
})

const rules = {
  name: [{ required: true, message: '请输入商品名称' }],
  description: [{ required: true, message: '请输入商品描述' }],
  price: [{ required: true, message: '请输入价格' }],
  stock: [{ required: true, message: '请输入库存数量' }],
  category: [{ required: true, message: '请选择分类' }],
  status: [{ required: true, message: '请选择状态' }],
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const categoryMap: Record<string, string> = {
  electronics: '电子产品',
  clothing: '服装',
  books: '图书',
  food: '食品',
}

// 初始化数据
onMounted(() => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: '最新款苹果手机，A17 Pro芯片，钛金属设计',
      price: 8999,
      stock: 25,
      category: 'electronics',
      status: 'active',
      createTime: '2024-01-15',
    },
    {
      id: 2,
      name: '商务西装',
      description: '经典商务西装，100%羊毛材质，适合正式场合',
      price: 1299,
      stock: 8,
      category: 'clothing',
      status: 'active',
      createTime: '2024-01-20',
    },
    {
      id: 3,
      name: 'Vue.js 实战指南',
      description: 'Vue.js 3.0 全面学习指南，从入门到精通',
      price: 89,
      stock: 0,
      category: 'books',
      status: 'inactive',
      createTime: '2024-02-01',
    },
  ]
  products.value = mockProducts
})

const showAddModal = () => {
  editingProduct.value = null
  Object.assign(formData, {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'active',
  })
  isModalVisible.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  Object.assign(formData, product)
  isModalVisible.value = true
}

const deleteProduct = (id: number) => {
  products.value = products.value.filter(product => product.id !== id)
  message.success('删除成功')
}

const handleOk = async () => {
  try {
    await formRef.value.validate()
    
    if (editingProduct.value) {
      // 编辑商品
      const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...formData }
      }
      message.success('更新成功')
    } else {
      // 添加新商品
      const newProduct: Product = {
        id: Math.max(...products.value.map(p => p.id)) + 1,
        ...formData,
        createTime: new Date().toISOString().split('T')[0],
      }
      products.value.push(newProduct)
      message.success('添加成功')
    }
    
    isModalVisible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  }
}
</script>

<style scoped>
.product-management {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.product-header h2 {
  margin: 0;
  color: #52c41a;
  font-size: 20px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-management {
    padding: 16px;
  }
  
  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .product-header h2 {
    font-size: 18px;
  }
}
</style>
