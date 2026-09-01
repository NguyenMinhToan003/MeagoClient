'use client';

import { useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import { useTheme } from 'next-themes';

import { dayjs } from '@/lib/date-time';

export function AntdProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  useEffect(() => {
    dayjs.locale(locale === 'vi' ? 'vi' : 'en');
  }, [locale]);

  return (
    <ConfigProvider
      locale={locale === 'vi' ? viVN : enUS}
      theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        components: {
          DatePicker: {
            activeShadow: 'none',
            errorActiveShadow: 'none',
            warningActiveShadow: 'none',
          },
          Input: {
            activeShadow: 'none',
            errorActiveShadow: 'none',
            warningActiveShadow: 'none',
          },
          InputNumber: {
            activeShadow: 'none',
            errorActiveShadow: 'none',
            warningActiveShadow: 'none',
          },
          Select: {
            activeOutlineColor: 'transparent',
            optionSelectedBg: dark ? 'rgb(45 212 191 / 0.14)' : 'rgb(20 184 166 / 0.12)',
          },
        },
        token: {
          colorPrimary: dark ? '#2dd4bf' : '#14b8a6',
          colorInfo: dark ? '#2dd4bf' : '#14b8a6',
          borderRadius: 6,
          controlHeight: 36,
          colorBgContainer: dark ? '#1f1f1f' : '#ffffff',
          colorBgElevated: dark ? '#191919' : '#ffffff',
          colorBorder: dark ? '#3f3f46' : '#e5e5e5',
          colorText: dark ? '#fafafa' : '#171717',
          colorTextPlaceholder: dark ? '#a1a1aa' : '#737373',
          boxShadowSecondary: '0 8px 24px rgb(0 0 0 / 0.12)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
