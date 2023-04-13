/** Tests search actions, reducers, and selectors. */
import {
  initializeResources,
  receiveResult,
  search
} from './actions'
import reducer from './reducer'
import {
  getResultSelector,
  getSearchSelectors,
  getTextSelector,
  getUnfilteredResultSelector
} from './selectors'

const RESOURCE_NAME = 'users'

test('getSearchSelectors should return a wrapper containing the correct default selectors', t => {
  const wrapper = getSearchSelectors({
    resourceName: RESOURCE_NAME,
    resourceSelector: () => {}
  })
  expect(Object.keys(wrapper).length).to.equal(3)
  expect(wrapper.result instanceof Function).to.equal(true)
  expect(wrapper.text instanceof Function).to.equal(true)
  expect(wrapper.unfilteredResult instanceof Function).to.equal(true)
})

function intializeState ({
  resourceName = RESOURCE_NAME,
  resource = {},
  result = [],
  text = 'brian'
} = {}) {
  let state = {
    resources: { [resourceName]: resource },
    search: {}
  }
  state.search = reducer(state.search, initializeResources([resourceName]))
  if (text) {
    state.search = reducer(state.search, search(resourceName)(text).payload.action)
  }
  if (result) {
    state.search = reducer(state.search, receiveResult(resourceName)(result))
  }
  return state
}

test('getTextSelector should return text provided by the default :searchStateSelector', t => {
  const state = intializeState()
  const selector = getTextSelector({ resourceName: RESOURCE_NAME })
  expect(selector(state)).to.equal('brian')
})

test('getTextSelector should invoke the custom :searchStateSelector if provided', t => {
  const state = intializeState()
  const calls = []
  const selector = getTextSelector({
    resourceName: RESOURCE_NAME,
    searchStateSelector: state => {
      calls.push(state)
      return state.search
    }
  })
  selector(state)
  expect(calls).toHaveLength(1)
  expect(calls[0]).to.equal(state)
})

test('getResultSelector should remove resources that are no longer in the resource Map', t => {
  const state = intializeState({
    resource: {
      brian: {},
      fernando: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  expect(result.length).to.equal(2)
  expect(result.includes('brian')).to.equal(true)
  expect(result.includes('fernando')).to.equal(true)
})

test('getResultSelector should remove resources that are no longer in the resource Array', t => {
  const state = intializeState({
    resource: {
      brian: {},
      fernando: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  expect(result).toHaveLength(2)

  expect(result).toContain('brian')
  expect(result).toContain('fernando')
})

test('getResultSelector should invoke the custom :filterFunction if provide', t => {
  const state = intializeState({
    resource: {
      brian: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const calls = []
  const selector = getResultSelector({
    filterFunction: id => calls.push(id),
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  selector(state)
  expect(calls).toHaveLength(3)
  expect(calls).toContain('brian')
  expect(calls).toContain('cesar')
  expect(calls).toContain('fernando')
})

test('getUnfilteredResultSelector should not remove resources that are no longer in the resource collection', t => {
  const state = intializeState({
    resource: {
      brian: {},
      fernando: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getUnfilteredResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  expect(result).toHaveLength(3)
  expect(result).toContain('brian')
  expect(result).toContain('cesar')
  expect(result).toContain('fernando')
})
