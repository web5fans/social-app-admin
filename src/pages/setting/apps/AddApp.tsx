import server from "@/server";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { FC } from 'react'
import AppModalForm from './AppModalForm'

type AddAppProps = {
  reload?: () => void
}

const AddApp: FC<AddAppProps> = (props) => {
  return (
    <AppModalForm
      title={ '编辑' }
      trigger={
        <Button
          type={ 'primary' }
          icon={ <PlusOutlined/> }
        >
          新增
        </Button>
      }
      onFinish={async values => {
        await server.dao("POST /admin/app/create", values as APIDao.WebEndpointsAdminAppCreateAppReq)
        props.reload?.()
        message.success('新增成功');
        return true
      }}
    />
  )
}

export default AddApp
