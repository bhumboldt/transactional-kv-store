export class SimpleStack<T> {
  private _stack: Array<T> = [];

  constructor() {}

  public push(element: T): void {
    this._stack.unshift(element);
  }

  public pop(): T | undefined {
    return this._stack.shift();
  }

  public peek(): T | undefined {
    return this._stack.length ? this._stack[0] : undefined;
  }
}