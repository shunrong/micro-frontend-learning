import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

interface Order {
  id: number;
  orderNo: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createTime: string;
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzPopconfirmModule,
    NzIconModule,
    NzInputNumberModule,
  ],
  template: `
    <div class="order-management">
      <div class="order-header">
        <h2>订单管理 (Angular 微应用)</h2>
        <button nz-button nzType="primary" (click)="showAddModal()">
          <i nz-icon nzType="plus"></i>
          添加订单
        </button>
      </div>

      <nz-table
        #basicTable
        [nzData]="orders"
        [nzPageSize]="10"
        [nzShowSizeChanger]="true"
        [nzShowQuickJumper]="true"
        [nzShowTotal]="totalTemplate"
      >
        <thead>
          <tr>
            <th>订单ID</th>
            <th>订单号</th>
            <th>客户姓名</th>
            <th>商品名称</th>
            <th>数量</th>
            <th>单价</th>
            <th>总金额</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of basicTable.data">
            <td>{{ order.id }}</td>
            <td>{{ order.orderNo }}</td>
            <td>
              <i nz-icon nzType="user"></i>
              {{ order.customerName }}
            </td>
            <td>{{ order.productName }}</td>
            <td>{{ order.quantity }}</td>
            <td>¥{{ order.price.toFixed(2) }}</td>
            <td>¥{{ order.totalAmount.toFixed(2) }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(order.status)">
                {{ getStatusText(order.status) }}
              </nz-tag>
            </td>
            <td>{{ order.createTime }}</td>
            <td>
              <button nz-button nzType="primary" nzSize="small" (click)="editOrder(order)">
                <i nz-icon nzType="edit"></i>
                编辑
              </button>
              <nz-popconfirm
                nzTitle="确定删除这个订单吗？"
                nzOkText="是"
                nzCancelText="否"
                (nzOnConfirm)="deleteOrder(order.id)"
              >
                <button nz-button nzType="primary" nzDanger nzSize="small" nz-popconfirm>
                  <i nz-icon nzType="delete"></i>
                  删除
                </button>
              </nz-popconfirm>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <nz-modal
        [nzTitle]="editingOrder ? '编辑订单' : '添加订单'"
        [(nzVisible)]="isModalVisible"
        [nzOkText]="'确定'"
        [nzCancelText]="'取消'"
        (nzOnOk)="handleOk()"
        (nzOnCancel)="handleCancel()"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="orderForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>订单号</nz-form-label>
              <nz-form-control nzErrorTip="请输入订单号">
                <input nz-input formControlName="orderNo" placeholder="请输入订单号" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>客户姓名</nz-form-label>
              <nz-form-control nzErrorTip="请输入客户姓名">
                <input nz-input formControlName="customerName" placeholder="请输入客户姓名" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>商品名称</nz-form-label>
              <nz-form-control nzErrorTip="请输入商品名称">
                <input nz-input formControlName="productName" placeholder="请输入商品名称" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>数量</nz-form-label>
              <nz-form-control nzErrorTip="请输入数量">
                <nz-input-number
                  formControlName="quantity"
                  [nzMin]="1"
                  [nzStep]="1"
                  placeholder="请输入数量"
                  style="width: 100%"
                ></nz-input-number>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>单价</nz-form-label>
              <nz-form-control nzErrorTip="请输入单价">
                <nz-input-number
                  formControlName="price"
                  [nzMin]="0"
                  [nzStep]="0.01"
                  [nzPrecision]="2"
                  placeholder="请输入单价"
                  style="width: 100%"
                ></nz-input-number>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>状态</nz-form-label>
              <nz-form-control nzErrorTip="请选择状态">
                <nz-select formControlName="status" placeholder="请选择状态">
                  <nz-option nzValue="pending" nzLabel="待处理"></nz-option>
                  <nz-option nzValue="processing" nzLabel="处理中"></nz-option>
                  <nz-option nzValue="shipped" nzLabel="已发货"></nz-option>
                  <nz-option nzValue="delivered" nzLabel="已送达"></nz-option>
                  <nz-option nzValue="cancelled" nzLabel="已取消"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>

      <ng-template #totalTemplate let-total> 共 {{ total }} 条记录 </ng-template>
    </div>
  `,
  styles: [
    `
      .order-management {
        padding: 24px;
        background: #fff;
        min-height: 100vh;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
      }

      .order-header h2 {
        margin: 0;
        color: #fa8c16;
        font-size: 20px;
        font-weight: 600;
      }

      .order-management button {
        margin-right: 8px;
      }

      .order-management button:last-child {
        margin-right: 0;
      }

      /* 响应式设计 */
      @media (max-width: 768px) {
        .order-management {
          padding: 16px;
        }

        .order-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .order-header h2 {
          font-size: 18px;
        }
      }
    `,
  ],
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  isModalVisible = false;
  editingOrder: Order | null = null;
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.orderForm = this.fb.group({
      orderNo: ['', [Validators.required]],
      customerName: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // 模拟初始数据
    this.orders = [
      {
        id: 1,
        orderNo: 'ORD-2024-001',
        customerName: '张三',
        productName: 'iPhone 15 Pro',
        quantity: 1,
        price: 8999,
        totalAmount: 8999,
        status: 'delivered',
        createTime: '2024-01-15',
      },
      {
        id: 2,
        orderNo: 'ORD-2024-002',
        customerName: '李四',
        productName: '商务西装',
        quantity: 2,
        price: 1299,
        totalAmount: 2598,
        status: 'shipped',
        createTime: '2024-01-20',
      },
      {
        id: 3,
        orderNo: 'ORD-2024-003',
        customerName: '王五',
        productName: 'Vue.js 实战指南',
        quantity: 3,
        price: 89,
        totalAmount: 267,
        status: 'processing',
        createTime: '2024-02-01',
      },
    ];
  }

  showAddModal(): void {
    this.editingOrder = null;
    this.orderForm.reset({
      orderNo: '',
      customerName: '',
      productName: '',
      quantity: 1,
      price: 0,
      status: 'pending',
    });
    this.isModalVisible = true;
  }

  editOrder(order: Order): void {
    this.editingOrder = order;
    this.orderForm.patchValue(order);
    this.isModalVisible = true;
  }

  deleteOrder(id: number): void {
    this.orders = this.orders.filter((order) => order.id !== id);
    this.message.success('删除成功');
  }

  handleOk(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const totalAmount = formValue.quantity * formValue.price;

      if (this.editingOrder) {
        // 编辑订单
        const index = this.orders.findIndex((o) => o.id === this.editingOrder!.id);
        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            ...formValue,
            totalAmount,
          };
        }
        this.message.success('更新成功');
      } else {
        // 添加新订单
        const newOrder: Order = {
          id: Math.max(...this.orders.map((o) => o.id)) + 1,
          ...formValue,
          totalAmount,
          createTime: new Date().toISOString().split('T')[0],
        };
        this.orders = [...this.orders, newOrder];
        this.message.success('添加成功');
      }

      this.isModalVisible = false;
    } else {
      Object.values(this.orderForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      pending: 'default',
      processing: 'processing',
      shipped: 'warning',
      delivered: 'success',
      cancelled: 'error',
    };
    return colorMap[status] || 'default';
  }

  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
    };
    return textMap[status] || status;
  }
}
