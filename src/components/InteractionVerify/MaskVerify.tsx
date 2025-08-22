import InteractionVerify from './Verify';
import styles from './mask.module.less';
import { Modal } from 'antd';
import IconClose from './assets/closeIcon.svg?react';
import { useTranslation } from 'react-i18next';
// import CaptchaCodeVerify from './CaptchaCodeVerify';
// import { useState } from 'react';

// type CaptchaCodeData = {
//   key: string;
//   value: string;
// }

export type MaskInteractionVerifyProps = {
  visible: boolean;
  onSuccess: VoidFunction; // (captchaCodeData: { key: string, value: string }) => void;
  onMaskClose: VoidFunction;
};

const MaskInteractionVerify = (props: MaskInteractionVerifyProps) => {
  const { t } = useTranslation("component.verification");
  // const [captchaData, setCaptchaData] = useState<CaptchaCodeData>({} as CaptchaCodeData);
  return (
    <Modal
      open={props.visible}
      onCancel={props.onMaskClose}
      closable
      centered
      footer={null}
      // onOk={() => {
      //   props.onSuccess(captchaData)
      // }}
      width={350}
      className={styles.modal}
      closeIcon={<IconClose />}
      title={t("title")}
      
    >
      <>
        <InteractionVerify
          onSuccess={() => {
            props.onSuccess();
          }}
          text={t("swipe.tips")}
        />
        {/* <CaptchaCodeVerify
          onChange={(key, value) => setCaptchaData({ key, value })}
        /> */}
      </>
    </Modal>
  );
};

export default MaskInteractionVerify;
