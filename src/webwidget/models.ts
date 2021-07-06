import { OreIdOptions } from '../models'

export enum DappActions {
  Sign = 'sign',
  NewAccount = 'new_account',
  RecoverAccount = 'recover_account',
}

export enum WebWidgetPropType {
  Object = 'object',
  String = 'string',
  Function = 'function',
}

export type WebWidgetProps = {
  oreIdOptions: OreIdOptions
  action: DappActions
  options: any
  onSuccess: (response: any) => {} // TODO: type this as much as possible
  // errors is a comma-delimited string of error codes and/or an error message
  onError: ({ success, errors }: { success: boolean; errors: string }) => {}
}
