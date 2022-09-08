import { GraphQLResolveInfo } from 'graphql';

/// @ts-ignore
class InjectionToken<T> {
  constructor(private _desc: string) {}

  toString(): string {
    return `InjectionToken ${this._desc}`;
  }
}
interface Type<T> extends Function {
  new (...args: any[]): T;
}

export abstract class Injector {
  abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: any): T;
}

export interface MiddlewareContext<R, A> {
  root: R;
  args: A;
  context: GraphQLModules.GlobalContext;
  info: GraphQLResolveInfo;
}

export type Next<T = any> = () => Promise<T>;

export type Middleware<R = any, A = { [argName: string]: any }> = (
  context: MiddlewareContext<R, A>,
  next: Next,
) => Promise<any>;
