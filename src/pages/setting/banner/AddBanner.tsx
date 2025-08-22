import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Flex, message } from "antd";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import { ModalFormProps } from "@ant-design/pro-form/es/layouts/ModalForm";
import server from "@/server";

type AddBannerProps = {
  reload?: () => void
} & ModalFormProps

const AddBanner = (props: AddBannerProps) => {
  const { reload, ...rest } = props;

  return <ModalForm
    width={450}
    submitter={{
      render: (props) => {
        return <Flex justify={'center'} className={'w-full'}>
          <Button type={'primary'} onClick={props.submit}>确认</Button>
        </Flex>
      }
    }}
    layout={'horizontal'}
    labelCol={{ span: 4 }}
    modalProps={{
      centered: true,
      destroyOnClose: true
    }}
    {...rest}
    onFinish={async (values) => {
      const api = values.id ? 'POST /admin/banner/modify' : 'POST /admin/banner/create';
      await server.dao(api, values)
      message.success(rest.title + '成功')
      reload?.()
      return true
    }}
  >
    <ProFormText name={'id'} hidden />
    <ProFormUpload
      label={'Banner'}
      name={'bannerFileId'}
      maxSize={5}
      className={'w-[188px] h-[100px]'}
      descriptions={[
        '1.尺寸: 750 x 400 px',
        '2.大小: 5MB以内',
        '3.格式: JPG, JPEG, PNG',
      ]}
      descClassName={'mt-[15px]'}
    />
    <ProFormText label={'链接地址'} name={'linkAddress'} />
  </ModalForm>
}

export default AddBanner;