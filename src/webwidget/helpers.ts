import * as Yup from 'yup'
import { WebWidgetAction } from './models'

export const webWidgetPropsSchema = Yup.object({
  oreIdOptions: Yup.object({
    appId: Yup.string().required(),
    apiKey: Yup.string(),
    appName: Yup.string(),
    backgroundColor: Yup.string(),
    oreIdUrl: Yup.string(),
    serviceKey: Yup.string(),
    setBusyCallback: Yup.mixed(),
    ualProviders: Yup.mixed(),
    eosTransitWalletProviders: Yup.array().of(Yup.mixed()),
  }),
  action: Yup.object({
    name: Yup.string()
      .oneOf(Object.values(WebWidgetAction))
      .required(),
    params: Yup.object().nullable(),
  }).required(),
  onSuccess: Yup.mixed().required(),
  onError: Yup.mixed().required(),
})
