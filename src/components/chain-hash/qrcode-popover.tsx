import { Popover, QRCode, Tooltip } from 'antd';
import QRCodeIcon from './assets/qrcode.svg?react';
import styles from './qrcode-popover.module.less';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type QRCodePopoverProps = {
  className?: string;
  value: string;
}

export default function QRCodePopover(props: QRCodePopoverProps) {
  const { className, value } = props;
  const { t } = useTranslation("component.chain-hash")
  return (
    <Popover placement="top" content={<QRCode value={value} />} trigger="click">
      <Tooltip title={t("icon.qrcode")}><QRCodeIcon className={classNames(styles.trigger, className)} /></Tooltip>
    </Popover>
  )
}