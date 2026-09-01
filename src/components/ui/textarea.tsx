'use client';

import { Input as AntInput } from 'antd';
import type { TextAreaProps } from 'antd/es/input/TextArea';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: TextAreaProps) {
  return <AntInput.TextArea data-slot="textarea" className={cn('meago-antd-input resize-y', className)} {...props} />;
}

export { Textarea };
