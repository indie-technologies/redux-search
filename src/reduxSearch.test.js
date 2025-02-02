import { combineReducers, createStore } from 'redux'
import reduxSearch from './reduxSearch'
import reducer from './reducer'

function createMiddleware (params = {}) {
  return reduxSearch(params)(createStore)(
    combineReducers({
      search: reducer
    })
  )
}

class MockSearchApi {
  constructor () {
    this.indexResourceCalls = []
    this.performSearchCalls = []
    this.subscribeCalls = []
  }

  indexResource ({ fieldNamesOrIndexFunction, resourceName, resources, state }) {
    this.indexResourceCalls.push({ fieldNamesOrIndexFunction, resourceName, resources, state })
  }

  async performSearch (resourceName, text) {
    this.performSearchCalls.push({ resourceName, text })
    return Promise.resolve([])
  }

  subscribe (onNext, onError) {
    this.subscribeCalls.push({ onNext, onError })
  }
}

test('reduxSearch should subscribe to the specified searchApi', t => {
  const searchApi = new MockSearchApi()
  createMiddleware({ searchApi })
  expect(searchApi.subscribeCalls).toHaveLength(1)
})

test('reduxSearch should auto-index searchable resources if a resourceSelector is specified', t => {
  const searchApi = new MockSearchApi()
  const resourceIndexes = { users: ['name'] }
  const resources = {}
  const resourceSelectorCalls = []
  const resourceSelector = (resourceName, nextState) => {
    resourceSelectorCalls.push({ resourceName, nextState })
    return resources
  }

  const store = createMiddleware({ resourceIndexes, resourceSelector, searchApi })

  expect(resourceSelectorCalls).toHaveLength(0)

  // Simulate a resource update
  store.dispatch({ type: 'fakeResourceUpdate' })

  // Called once on resource-change and once after search has been re-run
  expect(resourceSelectorCalls).toHaveLength(2)
  expect(resourceSelectorCalls[0].resourceName, 'users')
  expect(resourceSelectorCalls[1].resourceName, 'users')
  expect(searchApi.indexResourceCalls).toHaveLength(1)
})

test('reduxSearch should auto-update index any time a searchable resource changes', t => {
  const searchApi = new MockSearchApi()
  const resourceIndexes = { users: ['name'] }
  const resourceA = {}
  const resourceB = {}
  const resourceSelectorCalls = []
  const resourceSelector = (resourceName, nextState) => {
    resourceSelectorCalls.push({ resourceName, nextState })
    return resourceSelectorCalls.length === 1 ? resourceA : resourceB
  }

  const store = createMiddleware({ resourceIndexes, resourceSelector, searchApi })

  expect(resourceSelectorCalls).toHaveLength(0)

  // Simulate a resource update
  store.dispatch({ type: 'fakeResourceUpdate' })

  // Selector is called 3x (1x per changed resource, 1x more to verify no additional change)
  expect(resourceSelectorCalls).toHaveLength(3)
  expect(resourceSelectorCalls[0].resourceName).toEqual('users')
  expect(resourceSelectorCalls[1].resourceName).toEqual('users')
  expect(resourceSelectorCalls[2].resourceName).toEqual('users')

  // Index is built twice since our resource changed twice
  expect(searchApi.indexResourceCalls).toHaveLength(2)
})

test('reduxSearch should not auto-index searchable resources if no resourceSelector is specified', t => {
  const searchApi = new MockSearchApi()
  const resourceIndexes = { users: ['name'] }
  const store = createMiddleware({ resourceIndexes, searchApi })

  // Simulate a resource update
  store.dispatch({ type: 'fakeResourceUpdate' })

  expect(searchApi.indexResourceCalls).toHaveLength(0)
})
