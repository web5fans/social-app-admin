import { Drawer, Typography } from "antd";
import { ProTable } from "@ant-design/pro-components";
import S from './userBadgeDetail.module.less'
import { proColumn } from "@/utils/pro-column-builder";
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { useState } from "react";

const UserBadgeDetail = (props: {
  record: APIDao.WebApplicationVoAdminMedalPageVo
}) => {
  const { record = {} as APIDao.WebApplicationVoAdminMedalPageVo } = props;
  const [drawerVis, { toggle, setTrue, setFalse }] = useBoolean(false)
  const [totalHolder, setTotalHolder] = useState(0)

  const columns = [
    proColumn('昵称','nickName')
      ._render((_, item) => {
        return <div className={'flex items-center gap-[10px]'}>
          <img alt={''} src={item.avatar} className={'w-[24px] h-[24px] rounded-full'} />
          <span>{item.nickName}</span>
        </div>
      }),
    proColumn('手机号','phone'),
    proColumn('邮箱','email'),
    proColumn('手机号或邮箱','phoneOrEmail', { hideInTable: true })
      ._enableSearch(),
  ]

  return <>
    <Typography.Link onClick={setTrue}>{record.quantity || 0}</Typography.Link>
    <Drawer
      open={drawerVis}
      className={S.drawer}
      width={600}
      title={record.name}
      onClose={setFalse}
    >
      <ProTable
        headerTitle={`获得用户（${totalHolder}）`}
        columns={columns}
        options={false}
        className={S.table}
        request={async (params) => {
          const result = await server.dao('POST /admin/medal/users-holding/page', {
            medalId: record.id,
            ...params,
            pageNum: params.current,
          })
          setTotalHolder(result?.total || 0)
          return {
            data: result?.items,
            total: result?.total,
            success: true,
          }
        }}
        search={{
          labelWidth: 100,
          span: 12
        }}
        pagination={{
          pageSize: 10,
          showTotal: false,
          hideOnSinglePage: true,
        }}
      />
    </Drawer>
  </>
}

export default UserBadgeDetail;