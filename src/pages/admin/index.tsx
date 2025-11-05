import Page from "@/components/Page";
import { proColumn } from "@/utils/pro-column-builder";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddUser from "./_components/AddUser";
import server from "@/server";
import { useRef } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import cx from "classnames";

const User = () => {
  const actionRef = useRef<ActionType>()

  const columns = [
    proColumn('角色', 'role')
      ._render((_, record)=> {
        if (record.special) return '超级管理员'
        return {
          1: '管理员',
          2: '运营',
        }[record.role]
      }),
    proColumn('账号', 'phone'),
    proColumn('操作')
      ._option()
      ._render((_, record) => {
        if (record.special) return '-'
        return <Typography.Link
          type={'danger'}
          onClick={async () => {
            await server.dao('POST /admin/admin-user/delete', {
              id: record.id
            })
            actionRef.current?.reload()
          }}
        >删除</Typography.Link>
      }),
  ]

  return <Page full title={'管理员管理'} className={'bg-white'}>
    <ProTable
      actionRef={actionRef}
      search={false}
      options={false}
      headerTitle={'账号列表'}
      columns={columns}
      toolBarRender={() => {
        return [
          <AddUser trigger={<Button type="primary">
            <PlusOutlined />新增
          </Button>} reload={() => actionRef.current?.reload()} />
        ]
      }}
      request={async (params) => {
        const obj = {...params, pageNum: params.current}
        const result = await server.dao('POST /admin/admin-user/page', obj)
        return {
          data: result?.items,
          total: result?.total,
          success: true
        }
      }}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default User;