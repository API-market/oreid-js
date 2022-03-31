/** interface to pass OreId members to helper classes (e.g. User) */
export default interface IStorage {
  getItem: (key: string) => string

  removeItem: (key: string) => void

  setItem: (key: string, value: string, options?: any) => void
}
