import { ConfigProvider, message } from "antd";
import styles from './index.module.less';
import { ProFormCaptcha, ProFormCaptchaProps, ProFormContext, ProFormDependency } from "@ant-design/pro-components";
import classNames from "classnames";
import { SMSCodeType } from "./utils";
import server from "@/server";
import { useTranslation } from "react-i18next";
import { useContext, useRef } from "react";
import { useToast } from "@/components/styled-components/toast";



type StyledProFormCaptchaProps = Omit<ProFormCaptchaProps, 'onGetCaptcha'> & {
  codeType: SMSCodeType;
  onGetCaptcha?: ProFormCaptchaProps['onGetCaptcha'];
}

export default function StyledProFormCaptcha(props: StyledProFormCaptchaProps) {
  const { codeType, onGetCaptcha, ...restProps } = props;
  const { t } = useTranslation("component.captcha")
  const formCtx = useContext(ProFormContext);
  const [toast, toastContext] = useToast();
  const isFirstSendRef = useRef(true);
  return (
    <ConfigProvider wave={{ disabled: true }}>
      <ProFormCaptcha
        {...restProps}
        formItemProps={{ ...restProps.formItemProps, className: classNames(styles.styledCaptcha, restProps.formItemProps?.className) }}
        fieldProps={{
          variant: 'borderless',
          ...restProps.fieldProps,
          className: classNames(styles.input, restProps.fieldProps?.className),
          onChange() {
            formCtx.formRef?.current.setFields([
              {
                name: restProps.name,
                errors: []
              }
            ])
          }
        }}
        captchaProps={{ autoInsertSpace: false, disabled: !restProps.phoneName, ...restProps.captchaProps, className: classNames(styles.button, restProps.captchaProps?.className) }}
        captchaTextRender={(timing, count) => {
          if (!timing) return isFirstSendRef.current ? t("send") : t("retry");
          return `${count}s`;
        }}
        onGetCaptcha={onGetCaptcha || (async (receiver: string) => {
          await server.dao("POST /sms/send", {
            phoneRegion: '86',
            phone: receiver,
            codeType,
          });
          toast.show(t("message.success"));
          isFirstSendRef.current = false;
        })}
      />
      {toastContext}
      {
        restProps.phoneName
          ? (
            <ProFormDependency name={[restProps.phoneName]}>
              {(ctx) => {
                // const receiver = ctx[restProps.phoneName];
                // setIsFirstSend(prev => prev !== receiver);
                isFirstSendRef.current = true;
                return null;
              }}
            </ProFormDependency>
          )
          : null
      }
    </ConfigProvider>
  )
}