import { ModalForm, ProFormDigit, ProFormText } from "@ant-design/pro-components";
import { Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import { SMSCodeType } from "@/components/form/ProFormCaptcha/utils.ts";
import S from './index.module.less'
import useCurrentUserInfo from "@/hooks/useCurrentUserInfo.ts";
import { encryptPhone } from "@/utils/tool.ts";
import server from "@/server";

const PlaceSinglePointsModal = (props: { reload: () => void }) => {
  const { userInfo } = useCurrentUserInfo()

  return <ModalForm
    trigger={<Button type={'primary'} icon={<PlusOutlined />}>单个发放</Button>}
    width={480}
    title={'发放稻米'}
    layout={'horizontal'}
    submitter={{
      render: (props) => [
        <Flex justify="center" className={'w-full'}>
          <Button type={'primary'} onClick={props.submit}>确认</Button>
        </Flex>
      ]
    }}
    modalProps={{
      centered: true,
      destroyOnClose: true,
    }}
    onFinish={async (values) => {
      const { adminUser, ...rest } = values;
      await server.dao('POST /admin/score-distribution/single', rest)
      message.success('发送成功')
      props.reload()
      return true
    }}
  >
    <ProFormText name={'adminUser'} hidden initialValue={userInfo?.phone} />
    <ProFormText label={'发放账号'} name={'phoneOrEmail'} placeholder={'请输入手机号/邮箱'} />
    <ProFormDigit
      label={'发放稻米'}
      name={'score'}
      min={1}
      max={1_0000_0000}
      fieldProps={{ precision: 0 }}
    />
    <div className={S.content}>
      <p className={'m-0'}>为了保证账号安全，需验证成功后，再进行发送稻米操作。</p>
      <p className={'mb-[12px] mt-0'}>当前绑定账号：{encryptPhone(userInfo?.phone)}</p>
      <StyledProFormCaptcha phoneName={'adminUser'} codeType={SMSCodeType.AdminPlacePoints} label={'验证码'} name={'code'} />
    </div>
  </ModalForm>
}

export default PlaceSinglePointsModal;