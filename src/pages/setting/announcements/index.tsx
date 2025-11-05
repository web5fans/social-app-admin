import Page from "@/components/Page";
import { Link as RouteLink } from '@/router.ts'
import server from "@/server";
import { proColumn } from "@/utils/pro-column-builder";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, message, Space, Typography } from "antd";
import dayjs from "dayjs";
import { type FC } from "react";

const { Link } = Typography;

const Announcements: FC = () => {

  const {
    data: anncList,
    loading: anncListLoading,
    refresh: refreshAnncList,
    mutate: updateAnncList
  } = useRequest(async () => server.dao("POST /admin/information/list"))

  const {
    run: delAnnc
  } = useRequest(
    async (informationId: string) => server.dao("POST /admin/information/delete", { informationId }),
    {
      manual: true,
      onFinally: refreshAnncList
    }
  )

  const columns: ProColumns<APIDao.WebEndpointsAdminInformationAdminInformationListVo>[] = [
    proColumn('排序', 'no', { width: 120 }),
    proColumn('标题', 'name', { width: 340 }),
    proColumn('发布时间', 'createAt', { ellipsis: true, width: 340 })
      ._render((_, rencord) => {
        return dayjs(rencord.createAt).format('YYYY-MM-DD HH:mm:ss')
      }),
    proColumn('操作', '', { width: 300 })
      ._option()
      ._render((_, record) => {
        return (
          <Space size={ 'middle' }>
            <RouteLink to="/setting/announcements/edit/:id" params={ { id: record.id } }>编辑</RouteLink>
            <Link
              type="danger"
              onClick={ () => delAnnc(record.id) }
            >删除</Link>
          </Space>
        )
      }),
  ];

  const handleDragSortEnd = async (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    updateAnncList(newDataSource);
    await server.dao('POST /admin/information/sort', {
      informationIds: newDataSource.map(item => item.id)
    })
    refreshAnncList()
    message.success('排序成功');
  };

  const dragHandleRender = (rowData: any, idx: any) => (
    <>
      <MenuOutlined style={ { cursor: 'grab', color: '#909399' } }/>
      &nbsp;&nbsp;{ idx + 1 }
    </>
  );

  return <Page
    title={ '公告栏配置' }
    full
    className="bg-white"
  >
    <DragSortTable
      options={ false }
      headerTitle={ '公告列表' }
      columns={ columns }
      loading={ anncListLoading }
      dataSource={ anncList! }
      rowKey="id"
      search={ false }
      dragSortKey="no"
      onDragSortEnd={ handleDragSortEnd }
      dragSortHandlerRender={ dragHandleRender }
      toolBarRender={ () => [
        <RouteLink to="/setting/announcements/new">
          <Button type={ 'primary' } icon={ <PlusOutlined/> }>新增</Button>
        </RouteLink>
      ] }
      pagination={ {
        showTotal: false,
        hideOnSinglePage: true
      } }
    />
  </Page>
}

export default Announcements;