import { LANGUAGE } from '@/i18n';
import { useI18nStore } from '@/store/i18n.ts';
import { Popover } from 'antd';
import styles from './index.module.less';
import classNames from 'classnames';
import { CSSProperties } from 'react';


const lanConfig = [
  { key: ['en-US', 'en'], label: 'English' },
  { key: ['zh-CN'], label: '中文' }
]

type LanPickerProps = {
  className?: string;
  style?: CSSProperties;
}

export default function LanPicker(props: LanPickerProps) {
  const { className, style } = props;

  const currentLanguage = useI18nStore.use.language();
  const changeLanguage = useI18nStore.use.setLanguage();

  const content = (
    <div>
      {lanConfig.map(item => (
        <div
          key={item.label}
          onClick={() => changeLanguage(item.key[0] as LANGUAGE)}
          className={classNames(styles.tab)} >{item.label}
          {item.key.indexOf(currentLanguage) !== -1 ? < CheckIcon /> : null}
        </div>
      ))}
    </div>
  )

  return null;

  // return (
  //   <Popover content={content} placement="bottomRight" arrow={false} overlayClassName={styles.overlay}>
  //     <div className={classNames(styles.lanPicker, className)} style={style}>
  //       <LanIcon />
  //     </div>
  //   </Popover>
  // )
}



function LanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_383_214)">
        <path d="M8 0C6.41775 0 4.87104 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0V0ZM13.7647 4.66667H11.6173C11.1366 3.55266 10.5037 2.51072 9.73667 1.57067C11.4343 2.03262 12.8815 3.14498 13.7647 4.66667ZM11 8C10.9945 8.67876 10.8876 9.35288 10.6827 10H5.31734C5.11244 9.35288 5.00548 8.67876 5 8C5.00548 7.32124 5.11244 6.64712 5.31734 6H10.6827C10.8876 6.64712 10.9945 7.32124 11 8ZM5.852 11.3333H10.148C9.58216 12.4505 8.85877 13.4806 8 14.392C7.14092 13.4808 6.4175 12.4507 5.852 11.3333ZM5.852 4.66667C6.41785 3.54952 7.14123 2.51944 8 1.608C8.85909 2.51918 9.58251 3.54931 10.148 4.66667H5.852ZM6.26667 1.57067C5.49844 2.51052 4.86439 3.55247 4.38267 4.66667H2.23534C3.11924 3.14429 4.56778 2.03184 6.26667 1.57067ZM1.64067 6H3.93334C3.76051 6.65276 3.67091 7.32476 3.66667 8C3.67091 8.67524 3.76051 9.34724 3.93334 10H1.64067C1.2309 8.69815 1.2309 7.30185 1.64067 6ZM2.23534 11.3333H4.38267C4.86439 12.4475 5.49844 13.4895 6.26667 14.4293C4.56778 13.9682 3.11924 12.8557 2.23534 11.3333ZM9.73667 14.4293C10.5037 13.4893 11.1366 12.4473 11.6173 11.3333H13.7647C12.8815 12.855 11.4343 13.9674 9.73667 14.4293ZM14.3593 10H12.0667C12.2395 9.34724 12.3291 8.67524 12.3333 8C12.3291 7.32476 12.2395 6.65276 12.0667 6H14.358C14.7678 7.30185 14.7678 8.69815 14.358 10H14.3593Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_383_214">
          <rect width="16" height="16" />
        </clipPath>
      </defs>
    </svg>

  )
}


function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.99992 11.3333C6.7807 11.3336 6.56357 11.2907 6.36097 11.2069C6.15838 11.1232 5.97429 11.0003 5.81925 10.8453L3.63525 8.71599L5.03125 7.28399L6.99992 9.2L10.9653 5.28799L12.3706 6.71199L8.17525 10.85C8.02091 11.0041 7.8376 11.1261 7.63588 11.2091C7.43416 11.2921 7.21803 11.3343 6.99992 11.3333Z" fill="#1B293D" />
    </svg>
  )
}