import { Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import server from "@/server";
import { debounce } from "lodash";
import { useState } from "react";

const AddNodeUserModal = (props: { reload: () => void }) => {
  const [options, setOptions] = useState([]);

  const searchUser = async (keyWords: string) => {
    if (!keyWords) {
      setOptions([]);
      return
    }
    const result = await server.dao('POST /admin/user-manage/user/search', {
      phoneOrEmail: keyWords
    })

    const options = result?.map((res) => ({
      label: res.phone && res.email ? `${res.phone}/${res.email}` : (res.phone || res.email), value: res.userId
    }))

    setOptions(options)
  }

  return <>
    <ModalForm
      trigger={<Button
        type="primary"
        icon={<PlusOutlined />}
      >新增</Button>}
      width={450}
      layout="horizontal"
      title={'新增'}
      modalProps={{
        centered: true,
        destroyOnClose: true,
      }}
      submitter={{
        render: (props, dom) => {
          return <Flex
            className={'w-full mt-[20px]'}
            justify="center"
          >
            <Button
              type="primary"
              onClick={props.submit}
            >设为节点用户</Button>
          </Flex>
        }
      }}
      onFinish={async (values) => {
        await server.dao('POST /admin/user-manage/user/set-node-user', values)
        message.success('新增成功')
        props.reload();
        return true
      }}
    >
      <div className={'mt-[30px]'} />
      <ProFormSelect
        label={'账号'}
        name={'id'}
        placeholder={'请输入手机号或邮箱'}
        fieldProps={{
          showSearch: true,
          filterOption: false,
          onSearch: debounce(searchUser, 300),
          options: options,
        }}
      />

    </ModalForm>
  </>
}

export default AddNodeUserModal;