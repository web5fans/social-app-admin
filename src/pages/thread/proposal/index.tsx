import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import { Badge, Flex, message, Popconfirm, Typography } from 'antd'
import PostDetailDrawer from "./PostDetailDrawer.tsx";
import server from "@/server";
import { useRef, useState } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";
import InitiatorAvatar from "./InitiatorAvatar.tsx";

const { Link } = Typography;

export const ProposalStatus = {
  1: {
    text: '进行中',
    status: 'Processing',
  },
  2: {
    text: '已通过',
    status: 'Success',
  },
  3: {
    text: '未通过',
    status: 'Error',
  },
}

const timeFormat = 'YYYY/MM/DD HH:mm:ss'

const PostList = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const takeDown = async (id: string) => {
    await server.dao('POST /admin/proposal/take-off', {
      proposalId: id,
    })
    message.success('下架成功')
    reload()
  }

  const columns = [
    proColumn('名称', 'name', { width: 300 })
      ._enableSearch(),
    proColumn('发布方（节点）', 'initiatorName', { width: 200 })
      ._enableSearch()
      ._render((_, record) => {
        if (!record.initiatorName || !record.initiatorAvatar) return '-'
        return <InitiatorAvatar avatar={record?.initiatorAvatar} name={record.initiatorName} />
      }),
    proColumn('状态', 'status', { width: 125 })
      ._enableSearch()
      ._valueEnum(ProposalStatus)
      ._extend({
        search: {
          transform: (value) => {
            return {
              status: Number(value),
            }
          }
        }
      }),
    proColumn('上下架', 'onShelf', { width: 100 })
      ._render((_, record) => {
        return record.onShelf ? <Badge status="success" text="已上架" /> : <Badge status="error" text="已下架" />
      }),
    proColumn('发布时间', 'createdAt',{ width: 125 })
      ._dateRange('startTime', 'endTime', 'YYYY-MM-DD')
      ._enableSearch()
      ._render((_, record) => dayjs(record.createdAt).format(timeFormat)),
    proColumn('截止时间', 'endAt',{ width: 125 })
      ._render((_, record) => dayjs(record.endAt).format(timeFormat)), ,
    proColumn('操作', '', { width: 100 })
      ._option()
      ._render((_, record) => {
        return <Flex gap={10}>
          <PostDetailDrawer proposalId={record.id} takeDown={() => takeDown(record.id)} />
          {record.onShelf && <Popconfirm title={'确定下架该提案吗？'} onConfirm={() => takeDown(record.id)}>
            <Link>下架</Link>
          </Popconfirm>}
        </Flex>
      })
  ]

  return <Page title={'提案'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'帖子列表'}
      columns={columns}
      options={false}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 'auto'
      }}
      request={async (params) => {
        const obj = {
          ...params,
          pageNum: params.current,
        }
        const result = await server.dao('POST /admin/proposal/page', obj)
        return {
          data: result?.items,
          total: result?.total,
          success: true,
        }
      }}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true,
      }}
    />
  </Page>
}

export default PostList;