import Page from "@/components/Page";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { proColumn } from "@/utils/pro-column-builder";
import { Button, message, Space, Typography } from "antd";
import server from "@/server";
import OssImage from "@/components/oss-image";
import AddBanner from "@/pages/setting/banner/AddBanner.tsx";

const { Link } = Typography;

const Banner = () => {
  const [dataSrc, setDataSrc] = useState<APIDao.WebApplicationVoBannerVo[]>([])

  const reload = async () => {
    const result = await server.dao('POST /admin/banner/list')
    setDataSrc(result)
  }

  useEffect(() => {
    reload()
  }, []);

  const delBanner = async (id: string) => {
    await server.dao('POST /admin/banner/delete', { id });
    reload();
    message.success('删除成功');
  }

  const columns: ProColumns<APIDao.WebApplicationVoBannerVo>[] = [
    proColumn('排序', 'no'),
    proColumn('Banner', 'banner')
      ._render((_, record) => {
        return <OssImage attachId={record.bannerFileId} className={'w-[188px] h-[100px]'} />
      }),
    proColumn('链接', 'linkAddress'),
    proColumn('操作')
      ._option()
      ._render((_, record) => {
        return <Space size={'middle'}>
          <AddBanner
            title={'编辑'}
            trigger={
              <Link>编辑</Link>
            }
            reload={reload}
            initialValues={record}
          />
          <Link type="danger" onClick={() => delBanner(record.id)}>删除</Link>
        </Space>
      }),
  ];

  const handleDragSortEnd = async (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    setDataSrc(newDataSource);
    await server.dao('POST /admin/banner/sort', {
      bannerIds: newDataSource.map(item => item.id)
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

  return <Page title={'Banner配置'} full className="bg-white">
    <DragSortTable
      options={false}
      headerTitle={'Banner列表'}
      columns={columns}
      dataSource={dataSrc}
      rowKey="id"
      search={false}
      pagination={false}
      dragSortKey="no"
      onDragSortEnd={handleDragSortEnd}
      dragSortHandlerRender={dragHandleRender}
      toolBarRender={() => [
        <AddBanner
          title={'新增'}
          trigger={<Button type={'primary'} icon={<PlusOutlined />}>新增</Button>}
          reload={reload}
        />
      ]}
    />
  </Page>
}

export default Banner;