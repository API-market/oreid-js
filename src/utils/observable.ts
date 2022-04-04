export class Observable<Subscriber extends Function> {
  private _subscribers: any[]

  constructor() {
    this._subscribers = []
  }

  public subscribe(subscriber: Subscriber) {
    const hasThisSubscriber = this._subscribers.find(s => s === subscriber)
    if (!subscriber || hasThisSubscriber) {
      return
    }
    subscriber(this)
    this._subscribers.push(subscriber)
  }

  public unsubscribe(subscriber: Subscriber) {
    this._subscribers = this._subscribers.filter(f => f !== subscriber)
  }

  public callSubscribers() {
    this._subscribers.forEach(f => f(this))
  }
}
