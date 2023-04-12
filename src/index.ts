// @ts-ignore
import { search } from './actions'
// @ts-ignore
import reduxSearch from './reduxSearch'
// @ts-ignore
import reducer from './reducer'

export default reduxSearch
export {
  reducer,
  reduxSearch,
  search as createSearchAction,
}