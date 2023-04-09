import {
  defaultSearchStateSelector,
  getSearchSelectors
} from './selectors'
import { search } from './actions'
// @ts-ignore
import reduxSearch from './reduxSearch'
// @ts-ignore
import reducer from './reducer'
// @ts-ignore
import SearchApi from './SearchApi'

export default reduxSearch
export {
  defaultSearchStateSelector,
  getSearchSelectors,
  reducer,
  reduxSearch,
  search as createSearchAction,
  SearchApi
}
// @ts-ignore
export { INDEX_MODES } from 'js-worker-search'
