import Page from "@/components/Page";
import { ProCard, ProForm, ProFormDigit } from "@ant-design/pro-components";
import S from './index.module.less'
import { Flex, Form, message, Typography } from "antd";
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { useEffect } from "react";

const ProposalSetting = () => {
  const [editable, { toggle, setTrue, setFalse }] = useBoolean(false)
  const [form] = Form.useForm()

  const { data: globalConfig, refresh: updateGlobalConfig } = useRequest(() => server.dao('POST /admin/global-config/detail'))

  useEffect(() => {
    if (!globalConfig) return
    form.setFieldsValue(globalConfig)
  }, [globalConfig])

  const submit = () => {
    form.submit();
    // setFalse()
  }

  useEffect(() => {
    if(!editable) {
      updateGlobalConfig();
    }
  }, [editable])

  return <Page
    title={'提案配置'}
    full
    className={'bg-white'}
  >
    <ProCard
      title={'配置项'}
      extra={<Flex gap={10}>
        {editable ? <>
          <Typography.Link onClick={setFalse}>取消</Typography.Link>
          <Typography.Link onClick={submit}>提交</Typography.Link>
        </> : <Typography.Link onClick={setTrue}>编辑</Typography.Link>}
      </Flex>}
      className={S.card}
    >
      <ProForm
        form={form}
        submitter={false}
        initialValues={globalConfig || {}}
        onFinish={async (fields) => {
          const flagRes = await server.dao('POST /admin/global-config/modify-proposal-config', fields, { getWholeBizData: true });
          if (flagRes.data) {
            setFalse();
            // updateGlobalConfig()
            message.success('编辑成功')
            return true
          }
          message.error(flagRes.message);
          return false;
        }}
      >
        <ProFormDigit
          disabled={!editable}
          label={'提案通过票数设置'}
          name={'proposalApprovalVotes'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </ProCard>
  </Page>
}

export default ProposalSetting;