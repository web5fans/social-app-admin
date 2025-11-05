import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Flex } from "antd";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import { ModalFormProps } from "@ant-design/pro-form/es/layouts/ModalForm";
import { debounce } from "lodash";
import { useMemo } from "react";
import S from './index.module.less'
import server from "@/server";

type AddBannerProps = {
  reload?: () => void
} & ModalFormProps

const AddBanner = (props: AddBannerProps) => {
  const {initialValues} = props
  // @ts-ignore
  const {
    data: nodeUsers,
    run: searchNodeUsers
  } = useRequest(
    async (phoneOrEmail = "") => server.dao('POST /admin/user-manage/user/unbound-node-user-search', { phoneOrEmail }),
    {
      manual: true
    }
  )

  const userList = useMemo(
    () => {
      return [ initialValues ]
        .concat(nodeUsers?.filter(item => item.userId !== initialValues?.userId))
        .filter(Boolean) ?? []
    },
    [ nodeUsers, initialValues ]
  )

  return <ModalForm
    width={600}
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
    {...props}
    onFinish={async (values) => {
      const user = userList.find((item) => item.userId === values.userId)
      const api = values.nodeId ? 'POST /admin/node/modify' : 'POST /admin/node/create';
      await server.dao(api, {...values, userId: user?.userId, userDid: user?.userDid})
      props.reload?.()
      return true
    }}
  >
    <ProFormText hidden name={'nodeId'} />
    <ProFormUpload
      label={'节点logo'}
      name={'logo'}
      maxSize={5}
      listType="picture-circle"
      circleClassName={'!bg-transparent !border-0'}
      className={S.circleUpload}
      descPosition={'right'}
      descriptions={[
        '1.建议比例: 1:1',
        '2.大小: 5MB以内',
        '3.格式: JPG, JPEG, PNG',
      ]}
      formItemProps={{
        rules: [
          { required: true, message: "请上传节点logo" }
        ]
      }}
    />
    <ProFormSelect
      label="节点用户"
      fieldProps={{
        showSearch: true,
        filterOption: false,
        onSearch: debounce(searchNodeUsers, 300),
        options: userList.map(item => ({
          label: [item.phone, item.email].filter(Boolean).join('/'),
          value: item.userId
        })),
      }}
      name="userId"
      rules={[
        { required: true, message: '请选择节点用户' }
      ]}
    />
    <ProFormText
      label={'节点名称'}
      name={'name'}
      rules={[
        { required: true, message: '请输入节点名称' },
      ]}
    />
    <ProFormTextArea
      label={'节点介绍'}
      name={'description'}
      rules={[
        {required: true, message: '请输入节点介绍'},
        { max: 500 }
      ]}
    />
  </ModalForm>
}

export default AddBanner;