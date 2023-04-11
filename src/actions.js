import {
  ACTION,
  INITIALIZE_RESOURCES,
  SEARCH_API,
  SEARCH,
  RECEIVE_RESULT
} from './constants'

export function searchAPI (method) {
  return (...args) => ({
    type: SEARCH_API,
    payload: {
      method,
      args
    }
  })
}
export const defineIndex = searchAPI('defineIndex')
export const indexResource = searchAPI('indexResource')
export const performSearch = searchAPI('performSearch')

export function search (resourceName) {
  return function searchResource (text) {
    return {
      type: ACTION,
      payload: {
        api: performSearch(resourceName, text),
        action: {
          type: SEARCH,
          payload: {
            resourceName,
            text
          }
        }
      }
    }
  }
}

export function receiveResult (resourceName) {
  return function receiveResultForResource (result) {
    return {
      type: RECEIVE_RESULT,
      payload: {
        resourceName,
        result
      }
    }
  }
}

export function initializeResources (resourceNames) {
  return {
    type: INITIALIZE_RESOURCES,
    payload: {
      resourceNames
    }
  }
}