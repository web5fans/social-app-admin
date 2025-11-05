



import { useTranslation } from 'react-i18next';
import styles from '../../form.module.less';
import { ProForm, ProFormCheckbox, ProFormDependency, ProFormItem, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import GoBack from '@/components/go-back';
import StyledProFormCaptcha from '@/components/form/ProFormCaptcha';
import server from '@/server';
import { SMSCodeType } from '@/components/form/ProFormCaptcha/utils';
import { useCountryOptions } from '@/hooks/useCountryOptions';
import ProFormPassword from '@/components/styled-components/ProFormPassword';
import StyledProFormSelect from '@/components/styled-components/ProFormSelect';
import { firstCharToLowerCase } from '@/utils/tool';
import { useToast } from '@/components/styled-components/toast';
import { PDFViewerModal } from '@/components/pdf-preview';


type RegisterFormProps = {
  toLogin: () => void
}

export default function RegisterForm(props: RegisterFormProps) {
  const { toLogin } = props;
  const { t } = useTranslation("component.login");
  const [form] = ProForm.useForm();
  const [toast, toastContext] = useToast();

  const countryOptions = useCountryOptions();

  const onFinish = async (fields) => {
    const flag = await server.ipn("POST /user/register", fields, { silent: true })
      .catch(e => {
        const res = e.response.data as API.Response<any>;
        // if (res.errorData?.length) {
        //   form.setFields(
        //     res.errorData.map(field => ({ name: firstCharToLowerCase(field.propertyName), errors: [field.errorMessage] }))
        //   )
        // }
        toast.show(res.message);
        throw e;
      });;
    if (flag) {
      message.success(t("message.register-success"));
      toLogin();
    }
  }

  return (
    <>
      <GoBack className={styles.navBack} onClick={toLogin} />
      <div className={styles.formTitle}>{t("title.register")}</div>
      {toastContext}
      <ProForm form={form} size="large" submitter={false} onFinish={onFinish}>
        <StyledProFormSelect
          name="region"
          label={t("fields.region")}
          required={false}
          placeholder={t("placeholder.region")}
          options={countryOptions}
        />
        <ProFormText
          name="email"
          label={t("fields.email")}
          placeholder={t("placeholder.account")}
        />
        <ProFormPassword
          name="password"
          labelCol={{ prefixCls: styles.withActions }}
          label={t("fields.set-password")}
          placeholder={t("placeholder.set-password")}
          fieldProps={{
            autoComplete: "new-password",
          }}
        />
        <StyledProFormCaptcha
          name="code"
          phoneName="email"
          codeType={SMSCodeType.Register}
          label={t("fields.verify-code")}
          placeholder={t("placeholder.verify-code")}
          formItemProps={{ style: { marginBottom: 11 } }}
        // captchaTextRender
        />
        <ProFormItem name="codeType" initialValue={SMSCodeType.Register} hidden />
        <ProFormCheckbox
          name="agreement"
          formItemProps={{ className: styles.agreement, style: { marginBottom: 31 } }}
          children={<>
            {t("agreement.agreed")}
            <PDFViewerModal
              file="/assets/term of service.pdf"
              trigger={<a>{t("agreement.user-condition")}</a>}
            />
            {t("agreement.and")}
            <PDFViewerModal
              file="/assets/USDI Exchange Service Agreement.pdf"
              trigger={<a>{t("agreement.privacy")}</a>}
            />
            {t("agreement.ofIPN")}
          </>}
        />
        <ProFormDependency name={['region', 'email', 'password', 'code', 'agreement']}>
          {({ region, email, password, code, agreement }) => {
            const clickable = !!region && !!email && !!password && !!code && !!agreement;
            return (
              <Button block disabled={!clickable} type="primary" htmlType="submit">{t("button.register")}</Button>
            )
          }}
        </ProFormDependency>
        <Button className={styles.subButton} block style={{ marginTop: 20 }} onClick={toLogin}>
          {t("tips.have-accounts")}
          <a>{t("tips.signin")}</a>
        </Button>
      </ProForm>
    </>
  )
}