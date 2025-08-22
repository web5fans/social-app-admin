import { ProForm, ProFormCaptcha, ProFormDependency, ProFormItem, ProFormText } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";

import styles from '../../form.module.less';
import { Button, message, Typography } from "antd";
import GoBack from "@/components/go-back";
import { useEffect, useState } from "react";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import MaskInteractionVerify from "@/components/InteractionVerify/MaskVerify";
import { SMSCodeType } from "@/components/form/ProFormCaptcha/utils";
import useUserInfoStore from "@/store/userInfo";
import server from "@/server";
import { useNavigate } from "@/router";
import { encryptEmail, firstCharToLowerCase } from "@/utils/tool";
import ProFormPassword from "@/components/styled-components/ProFormPassword";
import { useToast } from "@/components/styled-components/toast";


type LoginFormProps = {
  toForget: () => void;
}

const simpleRequired = (message: string) => ([{ required: true, message }]);

export default function LoginForm(props: LoginFormProps) {
  const { toForget } = props
  const { t } = useTranslation("component.login");
  const [toast, toastContext] = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [form] = ProForm.useForm();
  const [robotCheckerVisible, setRobotCheckVisible] = useState(false);
  const { login: systemLogin } = useUserInfoStore();
  const navigator = useNavigate();
  return (
    <>
      {toastContext}
      <div className={styles.formTitle}>{t(step === 1 ? "title.signin" : "title.2FA")}</div>
      <ProForm
        form={form}
        size="large"
        submitter={false}
        requiredMark={false}
        onFinish={async (fields) => {
          if (step === 1) {
            setRobotCheckVisible(true);
            return;
          }
          const tokenInfo = await server.dao("POST /admin/admin-user/login-with-verification-code", {
            ...fields,
          }, { silent: true })
            .catch(e => {
              const res = e.response.data as API.Response<any>;
              toast.show(res.message);
              throw e;
            })

          message.success('登录成功！')
          systemLogin(tokenInfo);
          navigator("/");
        }}
      >
        <ProFormText
          name="phone"
          label={t("fields.account")}
          required={false}
          placeholder={'请输入手机号'}
          // rules={simpleRequired(t("placeholder.account"))}
          hidden={step === 2}
        />
        <ProFormPassword
          name="password"
          labelCol={{ prefixCls: styles.withActions }}
          placeholder={t("placeholder.password")}
          // rules={simpleRequired(t("placeholder.password"))}
          hidden={step === 2}
          label={(
            <>
              <span>{t("fields.password")}</span>
              <Typography.Link onClick={toForget}>{t("tips.forgetPassword")}</Typography.Link>
            </>
          )}
        />
        <ProFormDependency name={['phone']}>
          {({ phone }) => (
            <StyledProFormCaptcha
              name="code"
              phoneName="phone"
              codeType={SMSCodeType.AdminLogin}
              label={`验证码将发至手机号 +86 ${phone}`}
              hidden={step === 1}
              formItemProps={{
                className: styles.captcha
              }}
              fieldProps={{
                className: styles.input
              }}
              captchaProps={{
                className: styles.button
              }}
            // captchaTextRender
            />
          )}
        </ProFormDependency>
        <ProFormDependency name={['phone', 'password', 'code']}>
          {({ phone, password, code }) => {
            const disabled = step === 1 ? (!phone || !password) : !code;
            return (
              <Button block disabled={disabled} type="primary" htmlType="submit">{step === 1 ? t("button.signin") : t("button.2fa")}</Button>
            )
          }}
        </ProFormDependency>
      </ProForm>
      <MaskInteractionVerify
        visible={robotCheckerVisible}
        onSuccess={async () => {
          setRobotCheckVisible(false);
          const fields = form.getFieldsValue();
          const flag = await server.dao("POST /admin/admin-user/login-with-password", fields, { silent: true })
            .catch(e => {
              const res = e.response.data as API.Response<any>;
              // if(res.errorData?.length) {
              //   form.setFields(
              //     res.errorData.map(field => ({ name: firstCharToLowerCase(field.propertyName), errors: [field.errorMessage] }))
              //   )
              // }
              toast.show(res.message);
              throw e;
            })
          if (flag) {
            setStep(2);
          }
        }}
        onMaskClose={() => setRobotCheckVisible(false)}
      />
    </>
  )
}