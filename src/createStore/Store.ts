type Subscription = <S>(state: S) => void
type SetState<State> = ((prevState: State) => State) | State

export default class Store<State> {
  state?: State
  subscriptions: Subscription[] = []

  constructor(initialState: State) {
    this.state = initialState
  }

  setState<U extends SetState<State>>(updater: U) {
    this.state = typeof updater === 'function' ? updater(this.state) : updater
    this.subscriptions.forEach(subscription => subscription(this.state))
  }

  getState() {
    return this.state
  }

  subscribe(subscription: Subscription) {
    this.subscriptions.push(subscription)

    return () => {
      this.subscriptions = this.subscriptions.filter(
        item => item != subscription
      )
    }
  }
}
