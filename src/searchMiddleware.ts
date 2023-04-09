import { Action, SearchAction, SearchApiAction } from './actions'
import {
  ACTION,
  SEARCH_API
} from './constants'
import { Search } from './selectors'

type SearchApi = {
  indexDocument(uid: string, text: string): void;
  search(query: string): Promise<string[]>;
  terminate(): void;
}
/**
 * Middleware for interacting with the search API
 * @param {Search} Search object
 */
export default function searchMiddleware (search: any): Function {
  return ({ dispatch }: { dispatch: any }) => (next: any) => (action: Action) => {
    if (action.type === SEARCH_API) {
      const { method, args } = (action as SearchApiAction).payload
      return search[method](...args)
    } else if (action.type === ACTION) {
      next((action as SearchAction).payload.action)
      return dispatch((action as SearchAction).payload.api)
    } else {
      return next(action)
    }
  }
}