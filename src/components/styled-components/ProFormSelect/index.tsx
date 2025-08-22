import { ProFormSelect, ProFormSelectProps } from "@ant-design/pro-components";
import IconArrowDown from './assets/icon-arrow-down.svg?react';




export default function StyledProFormSelect(props: ProFormSelectProps) {

  return <ProFormSelect {...props} fieldProps={{ ...props.fieldProps, suffixIcon: <IconArrowDown /> }} />
}