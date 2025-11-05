import OssImage from "@/components/oss-image";
import Page from "@/components/Page";
import server from "@/server";
import { proColumn } from "@/utils/pro-column-builder";
import { MenuOutlined } from "@ant-design/icons";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { message, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import AddApp from "./AddApp";
import EditApp from "./EditApp";

const { Link } = Typography;

const Banner = () => {
  const [ dataSrc, setDataSrc ] = useState<APIDao.WebEndpointsAdminAppAdminAppListVo[]>([])

  const reload = async () => {
    const result = await server.dao('POST /admin/app/list')
    setDataSrc(result!)
  }

  useEffect(() => {
    reload()
  }, []);

  const delApp = async (appId: string) => {
    await server.dao('POST /admin/app/delete', { appId });
    reload();
    message.success('删除成功');
  }

  const columns: ProColumns<APIDao.WebEndpointsAdminNodeAdminNodeListVo>[] = [
    proColumn('排序', 'no', { width: 120 }),
    proColumn('应用图标', 'logo', { width: 130 })
      ._render((_, record) => {
        return (
          <OssImage
            attachId={ record.logo }
            className="w-14 h-14 rounded-3"
          />
        )
      }),
    proColumn('应用名称', 'name', { width: 200 }),
    proColumn('描述', 'desc'),
    proColumn('链接', 'link', { ellipsis: true, width: 340 }),
    proColumn('操作', '', { width: 200 })
      ._option()
      ._render((_, record) => {
        return <Space size={ 'middle' }>
          <EditApp
            reload={ reload }
            initialValues={ record }
          />
          <Link
            type="danger"
            onClick={ () => delApp(record.appId) }
          >删除</Link>
        </Space>
      }),
  ];

  const handleDragSortEnd = async (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setDataSrc(newDataSource);
    await server.dao('POST /admin/app/sort', {
      appIds: newDataSource.map(item => item.appId)
    })
    reload()
    message.success('排序成功');
  };

  const dragHandleRender = (rowData: any, idx: any) => (
    <>
      <MenuOutlined style={ { cursor: 'grab', color: '#909399' } }/>
      &nbsp;&nbsp;{ idx + 1 }
    </>
  );

  return <Page
    title={ '应用市场配置' }
    full
    className="bg-white"
  >
    <DragSortTable
      options={ false }
      headerTitle={ '应用列表' }
      columns={ columns }
      dataSource={ dataSrc }
      rowKey="appId"
      search={ false }
      dragSortKey="no"
      onDragSortEnd={ handleDragSortEnd }
      dragSortHandlerRender={ dragHandleRender }
      toolBarRender={ () => [
        <AddApp reload={ reload }/>
      ] }
      pagination={ {
        pageSize: 1e10,
        showTotal: false,
        hideOnSinglePage: true
      } }
    />
  </Page>
}

export default Banner;