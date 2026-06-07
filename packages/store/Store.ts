type Subscription<State> = (state?: State) => void;
type SetState<State> = ((prevState: State) => State) | State;

export class Store<State> {
  state?: State;
  subscriptions: Subscription<State>[] = [];

  constructor(initialState?: State) {
    this.state = initialState;
  }

  setState<U extends SetState<State>>(updater: U) {
    this.state = typeof updater === 'function' ? updater(this.state) : updater;
    this.subscriptions.forEach(subscription => subscription(this.state));
  }

  getState() {
    return this.state;
  }

  subscribe(subscription: Subscription<State>) {
    this.subscriptions.push(subscription);

    return () => {
      this.subscriptions = this.subscriptions.filter(
        item => item !== subscription,
      );
    };
  }
}
