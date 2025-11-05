import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import AddBadgeModal from "./AddBadgeModal.tsx";
import UserBadgeDetail from "@/pages/place/badge/UserBadgeDetail.tsx";
import server from "@/server";
import { useRef, useState } from "react";
import OssImage from "@/components/oss-image";
import { ActionType } from "@ant-design/pro-table/es/typing";

const BadgePlace = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const columns = [
    proColumn('徽章','attachId', { width: 120})
      ._render((_, record) => {
        return <OssImage className={'w-[64px] h-[64px]'} attachId={record.attachId} />
      }),
    proColumn('徽章名称','name'),
    proColumn('获得用户','quantity')
      ._render((_, record) => {
        return <UserBadgeDetail record={record} />
      }),
  ]

  return <Page title={'发放徽章'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'徽章列表'}
      columns={columns}
      search={false}
      options={false}
      toolBarRender={() => {
        return [<AddBadgeModal reload={reload} />]
      }}
      request={async (params) => {

        const result = await server.dao('POST /admin/medal/page', {
          pageNum: params.current!,
          pageSize: params.pageSize!
        })
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

export default BadgePlace;