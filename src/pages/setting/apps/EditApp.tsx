import server from "@/server";
import { message, Typography } from "antd";
import type { FC } from 'react'
import AppModalForm from './AppModalForm'

const { Link } = Typography

type EditAppProps = {
  initialValues?: APIDao.WebEndpointsAdminAppAdminAppListVo
  reload?: () => void
}

const EditApp: FC<EditAppProps> = (props) => {
  const { initialValues, reload } = props

  return (
    <AppModalForm
      title={ '编辑' }
      trigger={ <Link>编辑</Link> }
      initialValues={ initialValues }
      onFinish={ async values => {
        await server.dao("POST /admin/app/modify", values as APIDao.WebEndpointsAdminAppModifyAppReq)
        reload?.()
        message.success('编辑成功');
        return true
      } }
    />
  )
}

export default EditApp
