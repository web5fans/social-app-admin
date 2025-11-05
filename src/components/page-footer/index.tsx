
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';
import { Typography } from 'antd';



export default function PageFooter () {
  const { t } = useTranslation("translation");
  return (
    <>
      <div className={styles.footerShadow}></div>
      <div className={styles.footer}>
        {t("footer.text")}
        <Typography.Link style={{ marginLeft: 10 }} href="mailto:contact@interpaystellar.com">contact@interpaystellar.com</Typography.Link>
      </div>
    </>
  )
}