import S from './index.module.less';
import { Checkbox } from 'antd';
import cx from 'classnames'
import { FC, useEffect, useState } from 'react';

export enum ACCOUNT_ROLE_TYPE {
  ADMIN = 1,
  OPERATOR = 2
}

type RoleItemType = { value: number; name: string; work: string }

type FormRoleItemProps = {
  value?: number;
  onChange?: (value: number) => void
}

const FormRoleItem: FC<FormRoleItemProps> = (props) => {
  const [curRole, setCurRole] = useState<ACCOUNT_ROLE_TYPE | undefined>(ACCOUNT_ROLE_TYPE.ADMIN);

  useEffect(() => {
    if (!curRole) return
    props.onChange?.(curRole)
  }, [curRole])

  const roles = [{
    value: ACCOUNT_ROLE_TYPE.ADMIN,
    name: '管理员',
  },{
    value: ACCOUNT_ROLE_TYPE.OPERATOR,
    name: '运营',
  }]

  return <div className={S.container}>
    {roles.map(role => <RoleItem
      key={role.value}
      role={role}
      checked={role.value === curRole}
      onChange={setCurRole}
    />)}
  </div>
};

export default FormRoleItem;

function RoleItem(props: {
  role: RoleItemType;
  checked?: boolean;
  onChange?: (value: ACCOUNT_ROLE_TYPE) => void
}) {
  const { role, checked } = props;
  return <div
    className={cx(S.roleItem, checked && S.active)}
    onClick={() => props.onChange?.(role.value)}
  >
    <p className={S.roleName}>{role.name}</p>
    <Checkbox checked={checked} />
  </div>
}