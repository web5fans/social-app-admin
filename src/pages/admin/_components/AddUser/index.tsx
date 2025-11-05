import { ModalForm, ProFormText } from "@ant-design/pro-components";
import S from './index.module.less';
import { Button, Form, message, Modal } from "antd";
import { FC } from "react";
import server from "@/server";
import FormRoleItem, { ACCOUNT_ROLE_TYPE } from "./components/FormRoleItem";

type AddUserProps = {
  trigger: JSX.Element
  reload?: () => void
}

const AddUser: FC<AddUserProps> = (props) => {
  const [modal, context] = Modal.useModal();
  return <>
    {context}
    <ModalForm
      width={450}
      title={'新增'}
      modalProps={{
        className: S.modal,
        centered: true,
        destroyOnClose: true
      }}
      trigger={props.trigger}
      layout={'horizontal'}
      submitter={{
        render: (props) => {
          return <div className={'pt-[16px]'}>
            <Button
              type="primary"
              onClick={props.submit}
            >确认</Button>
          </div>
        }
      }}
      onFinish={async (values) => {
        const res = await server.dao('POST /admin/admin-user/create', {
          ...values,
          phoneRegion: '86',
        })

        if (res?.password) {
          modal.info({
            title: "新增成功",
            content: (
              <>
                <div>账号: {values.phone}</div>
                <div>初始密码: {res.password}</div>
              </>
            )
          })
        }

        props.reload?.()
        return true
      }}
    >
      <div className={'mt-[15px]'} />
      <Form.Item
        name="role"
      >
        <FormRoleItem />
      </Form.Item>
      <ProFormText
        label={'账号'}
        name="phone"
        placeholder={'请输入手机号  '}
        rules={[{ required: true }]}
      />
    </ModalForm>
  </>
}

export default AddUser;