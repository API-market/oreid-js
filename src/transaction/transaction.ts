import OreIdContext from '../core/IOreidContext'
import {
  AuthProvider,
  CreateTransactionData,
  ExternalWalletType,
  SignWithOreIdResult,
  TransactionData,
} from '../models'
import TransitHelper from '../transit/TransitHelper'
import { callApiCanAutosignTransaction, callApiCustodialSignTransaction, callApiSignTransaction } from '../api'
import { getOreIdSignUrl } from '../core/urlGenerators'
import Helpers from '../utils/helpers'
import User from '../user/user'

export class Transaction {
  constructor(args: { oreIdContext: OreIdContext; user: User; data: TransactionData }) {
    this._oreIdContext = args.oreIdContext
    this._user = args.user
    this.assertValidTransactionAndSetData(args.data)
    this._transitHelper = new TransitHelper(this._oreIdContext)
  }

  private _oreIdContext: OreIdContext

  private _data: TransactionData

  private _transitHelper: TransitHelper

  private _user: User

  get data() {
    return this._data
  }

  /** ensure all required parameters are provided */
  assertValidTransactionAndSetData(createTransactionData: CreateTransactionData) {
    const { chainNetwork, transaction, signedTransaction } = createTransactionData || {}
    const missingFields: string[] = []
    const validationIssues: string[] = []

    if (!this._user || !this._user?.info) {
      throw new Error('Make sure that a user has been authenticated and that youve called user.getInfo()')
    }

    // required fields
    if (!chainNetwork) missingFields.push('chainNetwork')
    if (!transaction && !signedTransaction) missingFields.push('transaction OR signedTransaction')
    // validaton rules
    if (!this._user.accountName)
      validationIssues.push('Transaction Data error - Expecting a user.accountName - is the user logged-in in?')
    if (transaction && signedTransaction) validationIssues.push('Only provide one: transaction OR signedTransaction')

    // TODO: Additional validation
    // transaction OR signedTransaction - check for valid JSON object

    if (!Helpers.isNullOrEmpty(missingFields)) {
      throw new Error(`Transaction parameter(s) missing: ${missingFields.join(', ')}`)
    }
    if (!Helpers.isNullOrEmpty(validationIssues)) {
      throw new Error(`Transaction parameter error: ${validationIssues.join(', ')}`)
    }

    // account param is set to logged-in user
    this._data = {
      account: this._user.accountName,
      ...createTransactionData,
    }
  }

  /** ensure that the chainNetwork and chainAccount for the transaction are in the user's wallet
   *  NOTE: This check is not required for a user signing with a wallet app - Since the account may be in the wallet and not yet added to OreId
   */
  assertTransactionAccountValidForUser() {
    const { chainAccount, chainNetwork } = this._data
    const { accountName } = this._user

    const permissionInWallet = this._user?.info.permissions.find(
      perm => perm.chainNetwork === chainNetwork && perm.chainAccount === chainAccount,
    )

    if (!permissionInWallet) {
      throw new Error(
        `Can't find a chainAccount: ${chainAccount} for chainNetwork: ${chainNetwork} in user's oreId account: ${accountName}`,
      )
    }

    if (permissionInWallet?.privateKeyStoredExterally) {
      throw new Error(
        `ChainAccount: ${chainAccount} for chainNetwork: ${chainNetwork} appears to be in a wallet app (type: ${permissionInWallet.externalWalletType}) - use signWithWallet() to sign`,
      )
    }
  }

  // TODO: check user.chainAccounts that

  /** validates that transaction is well-formed for the blockcahin
   * Returns array of errors
   */
  async validate(): Promise<string[]> {
    // TODO: add transactin/validate api endpoint
    throw new Error('Not Implemented')
  }

  /**
   * Returns a url to redirect the user's browser to - to sign transaction using OREID web interface
   */
  async getSignUrl(): Promise<SignWithOreIdResult> {
    this.assertTransactionAccountValidForUser()
    const transactionData = this.data
    const { signCallbackUrl } = this._oreIdContext.options
    // eslint-disable-next-line no-param-reassign
    if (!transactionData?.signOptions) transactionData.signOptions = {}
    // eslint-disable-next-line no-param-reassign
    transactionData.signOptions.callbackUrl = signCallbackUrl
    const signUrl = await getOreIdSignUrl(this._oreIdContext, transactionData)
    return { signUrl, errors: null }
  }

  /**
   * Whether the provided transaction (or signedTransaction) can be autoSigned via api (without user interaction)
   * Requires a serviceKey with the autoSign right
   * Returns: true if transaction can be signed using tansaction.sign()
   * */
  async checkCanAutoSign() {
    const { autoSignCredentialsExist } = await callApiCanAutosignTransaction(this._oreIdContext, this._data)
    return autoSignCredentialsExist
  }

  /** Attempt to sign a transaction without user interaction
   *  Expects user to have previously approved autoSign for transaction type and it hasn't expired
   *  Call callApiCanAutosignTransaction() first to confirm that this transaction can be autoSigned before attempting this call
   */
  async autoSign() {
    this.assertTransactionAccountValidForUser()
    const transactionData = this.data
    const { processId, signedTransaction, transactionId, errorCode, errorMessage } = await callApiSignTransaction(
      this._oreIdContext,
      { transactionData, autoSign: true },
    )

    if (errorCode || errorMessage) throw new Error(errorMessage)
    return { processId, signedTransaction, transactionId }
  }

  /** Sign a transaction without user interaction
   *  Requires a user's wallet password or encrypted password (a 'custodial' account managed by you)
   *  Requires a serviceKey with the proxySign right
   */
  async signWithPassword(userPassword?: string, userPasswordEncrypted?: string) {
    this.assertTransactionAccountValidForUser()
    const transactionData = this.data
    if (!transactionData?.signOptions) transactionData.signOptions = {}
    if (userPassword) transactionData.signOptions.userPassword = userPassword
    if (userPasswordEncrypted) transactionData.signOptions.userPasswordEncrypted = userPasswordEncrypted

    if (transactionData.signOptions.userPassword && transactionData.signOptions.userPasswordEncrypted) {
      throw new Error('Provide either a userPassword OR userPasswordEncrypted param. Both were provided.')
    }

    const {
      processId,
      signedTransaction,
      transactionId,
      errorCode,
      errorMessage,
    } = await callApiCustodialSignTransaction(this._oreIdContext, { transactionData, autoSign: false })
    if (errorCode || errorMessage) throw new Error(errorMessage)
    return { processId, signedTransaction, transactionId }
  }

  /** Sign with a supported blockchain wallet via Transit provider */
  async signWithWallet(walletType: ExternalWalletType) {
    const transactionData = this.data
    const isTransitProvider = this._transitHelper.isTransitProvider(walletType)
    if (!isTransitProvider) return null
    const signResult = this._transitHelper.signWithTransitProvider(transactionData)
    // If we've signed a transaction with a key in a wallet, callDiscoverAfterSign() will add it to the user's wallet
    const provider = Helpers.toEnumValue(AuthProvider, walletType)
    const { account, chainNetwork } = transactionData
    await this._transitHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    return signResult
  }
}
