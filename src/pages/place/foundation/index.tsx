import Page from "@/components/Page";
import { ProCard, ProForm, ProFormDigit } from "@ant-design/pro-components";
import ProFormUploadFile from "@/components/styled-components/ProFormUploadFile";
import { Flex, Form, message, Typography } from "antd";
import S from './index.module.less'
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { useEffect } from "react";

const FoundationSetting = () => {
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
    if (!editable) {
      updateGlobalConfig();
    }
  }, [editable])

  return <Page
    title={'乡建DAO金库财务公示'}
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
          const flagRes = await server.dao('POST /admin/global-config/modify-foundation-info', fields, { getWholeBizData: true });
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
          label={'金库规模'}
          name={'fundScale'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          readonly
          label={'发行稻米规模'}
          name={'issuePointsScale'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
        <ProFormUploadFile
          disabled={!editable}
          label={'金库信息公开文件'}
          buttonText={'上传PDF'}
          accept={'.pdf'}
          name={'foundationPublicDocument'}
        />
      </ProForm>
    </ProCard>
  </Page>
}

export default FoundationSetting;