import { OptionsType } from 'cookies-next'
const isProd = process.env.NODE_ENV === 'production'

export const CONFIG_COOKIE: OptionsType = {
  path: '/',
  secure: isProd,
  sameSite: 'lax',
  ...(isProd && { domain: process.env.NEXT_PUBLIC_DOMAIN }),
}
