import cx from "classnames";
import DefaultAvatar from '@/assets/default-avatar.svg?react';

const InitiatorAvatar = (props: {
  avatar?: string;
  name?: string;
  className?: string;
}) => {
  const { avatar, name, className } = props;

  return <div className={cx('flex items-center gap-[4px]', className)}>
    {avatar ? <img
      src={avatar}
      alt={'avatar'}
      className={'w-[20px] h-[20px] rounded-full'}
    /> : <DefaultAvatar className={'w-[20px] h-[20px] rounded-full'} />}
    <span>{name}</span>
  </div>
}

export default InitiatorAvatar;