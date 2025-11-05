import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import PlaceSinglePoints from "./_components/PlaceSinglePoints";
import PlaceMultiPoints from "./_components/PlaceMultiPoints";
import { useRef, useState } from "react";
import server from "@/server";
import dayjs from "dayjs";
import { ActionType } from "@ant-design/pro-table/es/typing";

const PlacePoints = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const columns = [
    proColumn('接收者', 'nickName')
      ._enableSearch(),
    proColumn('手机号', 'phone'),
    proColumn('邮箱', 'email'),
    proColumn('发放者账号', 'createdBy'),
    proColumn('手机号或邮箱', 'phoneOrEmail', { hideInTable: true })
      ._enableSearch(),
    proColumn('发放时间', 'time')
      ._dateRange('startTime', 'endTime', 'YYYY-MM-DD')
      ._enableSearch()
      ._render((_, record) => dayjs(record.getTime).format('YYYY/MM/DD HH:mm:ss')),
    proColumn('发放稻米', 'score')
  ]

  return <Page title="发放稻米">
    <ProTable
      actionRef={actionRef}
      headerTitle="列表"
      columns={columns}
      options={false}
      toolBarRender={() => [
        <PlaceSinglePoints reload={reload} />,
        <PlaceMultiPoints reload={reload} />
      ]}
      request={async (params) => {
        const obj = {
          ...params,
          pageNum: params.current,
        }
        const result = await server.dao('POST /admin/score-distribute-record/page', obj)
        return {
          data: result?.items,
          total: result?.total,
          success: true,
        }
      }}
      search={{
        labelWidth: 'auto',
        collapsed: false,
        collapseRender: false,
      }}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default PlacePoints;