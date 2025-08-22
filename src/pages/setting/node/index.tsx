import Page from "@/components/Page";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { proColumn } from "@/utils/pro-column-builder";
import { Button, message, Space, Typography } from "antd";
import server from "@/server";
import OssImage from "@/components/oss-image";
import pcHolder from '@/assets/banner/pc.png'
import AddNode from "./AddNode.tsx";

const { Link } = Typography;

const Banner = () => {
  const [dataSrc, setDataSrc] = useState<APIDao.WebEndpointsAdminNodeAdminNodeListVo[]>([])

  const reload = async () => {
    const result = await server.dao('POST /admin/node/list')
    setDataSrc(result)
  }

  useEffect(() => {
    reload()
  }, []);

  const delBanner = async (nodeId: string) => {
    await server.dao('POST /admin/node/delete', { nodeId });
    reload();
    message.success('删除成功');
  }

  const columns: ProColumns<APIDao.WebEndpointsAdminNodeAdminNodeListVo>[] = [
    proColumn('排序', 'no', { width: 120 }),
    proColumn('节点名称', 'node', { width: 340 })
      ._render((_, record) => {
        return <div className={'flex items-center gap-[10px]'}>
          <OssImage attachId={record.logo} className={'w-[28px] h-[28px] rounded-full'} />
          <span>{record.name}</span>
        </div>
      }),
    proColumn('介绍', 'description', { ellipsis: true, width: 340 }),
    proColumn('操作', '', { width: 300 })
      ._option()
      ._render((_, record) => {
        return <Space size={'middle'}>
          <AddNode
            title={'编辑'}
            trigger={
              <Link>编辑</Link>
            }
            reload={reload}
            initialValues={record}
          />
          <Link
            type="danger"
            onClick={() => delBanner(record.nodeId)}
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
    await server.dao('POST /admin/node/sort', {
      nodeIds: newDataSource.map(item => item.nodeId)
    })
    reload()
    message.success('排序成功');
  };

  const dragHandleRender = (rowData: any, idx: any) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: '#909399' }} />
      &nbsp;&nbsp;{idx + 1}
    </>
  );

  return <Page
    title={'节点信息配置'}
    full
    className="bg-white"
  >
    <DragSortTable
      options={false}
      headerTitle={'节点列表'}
      columns={columns}
      dataSource={dataSrc}
      rowKey="nodeId"
      search={false}
      dragSortKey="no"
      onDragSortEnd={handleDragSortEnd}
      dragSortHandlerRender={dragHandleRender}
      toolBarRender={() => [
        <AddNode
          title={'新增'}
          trigger={<Button
            type={'primary'}
            icon={<PlusOutlined />}
          >新增</Button>}
          reload={reload}
        />
      ]}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default Banner;