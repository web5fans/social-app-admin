import { ProFormText } from "@ant-design/pro-components";
import { ComponentProps, useState } from "react";
import IconVisible from './assets/icon-visible.svg?react';
import IconHide from './assets/icon-hide.svg?react';


type ProFormPasswordProps = ComponentProps<typeof ProFormText.Password>;

export default function ProFormPassword(props: ProFormPasswordProps) {
  const [iconVisibile, setIconVisible] = useState(false);
  return (
    <>
      <ProFormText.Password
        {...props}
        fieldProps={{
          ...props.fieldProps,
          iconRender: (visible) => {
            if (!iconVisibile) return null;
            return visible ? <IconVisible style={{ cursor: 'pointer' }} /> : <IconHide style={{ cursor: 'pointer' }} />
          },
          onChange(e) {
            props.fieldProps?.onChange?.(e);
            setIconVisible(!!e.target.value);
          },
        }}
      />
    </>
  )
}