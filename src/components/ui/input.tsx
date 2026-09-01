'use client';

import { Input as AntInput, InputNumber as AntInputNumber } from 'antd';
import type { InputNumberProps, InputProps, InputRef } from 'antd';
import type { PasswordProps } from 'antd/es/input/Password';
import type { SearchProps } from 'antd/es/input/Search';
import type { Ref } from 'react';

import { cn } from '@/lib/utils';

interface MeagoInputProps extends InputProps {
  ref?: Ref<InputRef>;
}

function Input({ className, ref, ...props }: MeagoInputProps) {
  return <AntInput ref={ref} data-slot="input" className={cn('meago-antd-input', className)} {...props} />;
}

function PasswordInput({ className, ...props }: PasswordProps) {
  return <AntInput.Password data-slot="password-input" className={cn('meago-antd-input', className)} {...props} />;
}

function SearchInput({ className, ...props }: SearchProps) {
  return <AntInput.Search data-slot="search-input" className={cn('meago-antd-input', className)} {...props} />;
}

function InputNumber<T extends number | string = number>({ className, ...props }: InputNumberProps<T>) {
  return <AntInputNumber<T> data-slot="input-number" className={cn('meago-antd-input-number w-full', className)} {...props} />;
}

export { Input, InputNumber, PasswordInput, SearchInput };
