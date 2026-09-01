'use client';

import { Select as AntSelect, Tag } from 'antd';
import type { BaseOptionType, DefaultOptionType, SelectProps } from 'antd/es/select';

import { cn } from '@/lib/utils';

interface MeagoSelectProps<
  ValueType,
  OptionType extends BaseOptionType | DefaultOptionType,
> extends SelectProps<ValueType, OptionType> {
  tagColors?: Readonly<Record<string, string>>;
}

function Select<
  ValueType = unknown,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
>({ className, tagColors, tagRender, ...props }: MeagoSelectProps<ValueType, OptionType>) {
  const coloredTagRender = tagColors
    ? ({ closable, label, onClose, value }: Parameters<NonNullable<SelectProps['tagRender']>>[0]) => (
        <Tag
          color={tagColors[String(value)]}
          closable={closable}
          onClose={onClose}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          style={{ marginInlineEnd: 0 }}
        >
          {label}
        </Tag>
      )
    : undefined;

  return (
    <AntSelect<ValueType, OptionType>
      data-slot="select"
      className={cn('meago-antd-select w-full', className)}
      tagRender={tagRender ?? coloredTagRender}
      {...props}
    />
  );
}

export { Select };
export type { SelectProps };
