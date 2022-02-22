import { OreIdOptions } from '../models'

export enum DappAction {
  Auth = 'auth',
  NewAccount = 'newAccount',
  RecoverAccount = 'recoverAccount',
  Sign = 'sign',
  Logout = 'logout',
}

export type WebWidgetProps = {
  oreIdOptions: OreIdOptions
  action: {
    name: DappAction
    params: any
  }
  onSuccess: (response: any) => {} // TODO: type this as much as possible
  /** errors is a delimited string of error codes and/or an error message */
  onError: ({ errors, data }: { errors?: string; data?: any }) => void
  timeout: number
}
