import { message } from "antd"
import { ReactNode, useMemo } from "react";
import styles from './index.module.less';


/** 未完成， 优先使用useToast  */
const toast = {
  show(content: ReactNode) {
    message
      .open({
        className: styles.toast,
        content,
        style: {
          marginTop: '45vh'
        },
        duration: 3
      })
  }
}

export default toast;

export function useToast() {
  const [messageApi, contextHolder] = message.useMessage();


  const api = useMemo(() => {
    return {
      show(content: ReactNode) {
        messageApi.open({
          key: 'only-one',
          className: styles.toast,
          content,
          style: {
            marginTop: '48vh'
          },
          duration: 3
        })
      }
    }
  }, [])

  return [api, contextHolder] as const;
}


