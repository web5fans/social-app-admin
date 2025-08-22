import S from "./index.module.less";
import { Button, Divider, Drawer, Flex, Progress, Typography } from "antd";
import cx from "classnames";
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { ProDescriptions } from "@ant-design/pro-components";
import { ProposalStatus } from "./index.tsx";
import dayjs from "dayjs";
import VoteProgress from "./VoteProgress.tsx";
import InitiatorAvatar from "./InitiatorAvatar.tsx";

const timeFormat = 'YYYY/MM/DD HH:mm:ss'

const PostDetailDrawer = (props:
                            {
                              proposalId: string;
                              takeDown: () => void
                            }
) => {
  const [drawerVis, { toggle, setTrue, setFalse }] = useBoolean(false)
  const { data: detail } = useRequest(() => server.dao('POST /admin/proposal/detail', {
    proposalId: props.proposalId
  }), {
    ready: drawerVis
  })

  const { data: proposalContent } = useRequest(async () => {
    const [fileType, fileId] = detail!.attachId.split('-')
    const fileBlob: Blob = await server.dao('GET /file/download', {
      fileId,
      fileType,
    }, { getWholeBizData: true, responseType: "blob" })
    return await fileBlob.text()
  }, {
    ready: !!detail?.attachId,
    refreshDeps: [detail?.attachId]
  })


  return <>
    <Typography.Link onClick={setTrue}>详情</Typography.Link>
    <Drawer
      open={drawerVis}
      className={S.drawer}
      width={600}
      title={'查看'}
      onClose={setFalse}
      footer={<Flex
        gap={8}
        justify={'end'}
      >
        <Button onClick={setFalse}>取消</Button>
        {detail?.onShelf && <Button
          type="primary"
          onClick={() => {
            props.takeDown()
            setFalse()
          }}
        >下架</Button>}
      </Flex>}
    >
      <div className={S.header}>
        {detail?.name}
      </div>
      <InitiatorAvatar
        avatar={detail?.initiatorAvatar}
        name={detail?.initiatorName}
        className={'mt-[16px] mb-[16px]'}
      />
      <ProDescriptions<APIDao.WebEndpointsAdminProposalAdminProposalDetailVo>
        className={S.proDes}
        dataSource={detail!}
        column={2}
        columns={[{
          title: '发布时间',
          dataIndex: 'createdAt',
          render: (_, record) => dayjs(record.createdAt).format(timeFormat),
        }, {
          title: '截止时间',
          dataIndex: 'endAt',
          render: (_, record) => dayjs(record.endAt).format(timeFormat),
        }, {
          title: '提案状态',
          dataIndex: 'status',
          valueEnum: ProposalStatus
        }]}
      />

      <Divider className={'mt-[12px] mb-[20px] border-[#D4DBE2]'} />

      <pre dangerouslySetInnerHTML={{ __html: proposalContent }} />

      <div className={S.voteWrap}>
        <p className={S.title}>总投票数</p>
        <div className={S.content}>
          <div className={cx(S.progress, 'mb-[12px]')}>
            <span className={S.type}>同意</span>
            <VoteProgress
              numerator={detail?.agreeVotes}
              denominator={detail?.totalVotes}
            />
          </div>
          <div className={S.progress}>
            <span className={S.type}>反对</span>
            <VoteProgress
              numerator={detail?.opposeVotes}
              denominator={detail?.totalVotes}
              color={'#FD615B'}
            />
          </div>
        </div>
      </div>
    </Drawer>
  </>
}

export default PostDetailDrawer;