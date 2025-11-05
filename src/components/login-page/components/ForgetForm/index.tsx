import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from '../../form.module.less';
import { ProForm, ProFormDependency, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import GoBack from "@/components/go-back";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import { SMSCodeType } from "@/components/form/ProFormCaptcha/utils";
import server from "@/server";
import ProFormPassword from "@/components/styled-components/ProFormPassword";
import { firstCharToLowerCase } from "@/utils/tool";





type ForgetFormProps = {
  navBack: () => void;
}

export default function ForgetForm(props: ForgetFormProps) {
  const { t, i18n } = useTranslation("component.login");
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.validateFields();
  }, [i18n.language])

  return (
    <>
      <GoBack className={styles.navBack} onClick={() => { props.navBack() }} />
      <div className={styles.formTitle}>{t("title.forgetPassword")}</div>
      <ProForm
        size="large"
        submitter={false}
        form={form}
        onFinish={async (fields) => {
          setLoading(true)
          const flag = await server.dao("POST /admin/admin-user/reset-password", fields, { silent: true })
            .catch(e => {
              const res = e.response.data as API.Response<any>;
              if (res.errorData?.length) {
                form.setFields(
                  res.errorData.map(field => ({ name: firstCharToLowerCase(field.propertyName), errors: [field.errorMessage] }))
                )
              }
              throw e;
            }).finally(() => setLoading(false));
          if (flag) {
            message.success(t("message.reset-sucess"));
            props.navBack();
          }
        }}
      >
        <ProFormText
          name="phone"
          label={'手机号'}
          placeholder={'请输入手机号'}
        />
        <StyledProFormCaptcha
          name="code"
          codeType={SMSCodeType.AdminResetPass}
          phoneName="phone"
          placeholder={t("placeholder.verify-code")}
          label={t("fields.verify-code")}
          formItemProps={{
            className: styles.captcha
          }}
          fieldProps={{
            className: styles.input
          }}
          captchaProps={{
            className: styles.button
          }}
        />
        <ProFormPassword
          name="newPassword"
          placeholder={t("placeholder.new-password")}
          // labelCol={{ prefixCls: styles.withActions }}
          label={t("fields.new-password")}
          fieldProps={{
            autoComplete: "new-password",
            onChange() {
              form.validateFields(["confirmNewPassword"]);
            }
          }}
        />
        <ProFormDependency name={["newPassword"]}>
          {({ newPassword }) => (
            <ProFormPassword
              name="confirmNewPassword"
              placeholder={t("placeholder.confirm-password")}
              // labelCol={{ prefixCls: styles.withActions }}
              label={t("fields.confirm-password")}
              rules={[{
                validator(_, val) {
                  if (!val) return Promise.resolve();
                  if (val !== newPassword) {
                    return Promise.reject(t("tips.password-not-same"))
                  }
                  return Promise.resolve();
                }
              }]}
            />
          )}
        </ProFormDependency>
        <ProFormDependency name={['newPassword', 'confirmNewPassword', 'code']}>
          {({ newPassword, confirmNewPassword, code }) => {
            const clickable = newPassword && confirmNewPassword && code;
            return (
              <Button
                loading={loading}
                block
                disabled={!clickable}
                type="primary"
                htmlType="submit"
              >{t("button.reset-password")}</Button>
            )
          }}
        </ProFormDependency>
      </ProForm>
    </>
  )
}