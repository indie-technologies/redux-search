import { INDEX_MODES } from 'js-worker-search'
import SearchApi from './SearchApi'

function getSearchApi ({ indexMode, tokenizePattern, caseSensitive, matchAnyToken } = {}) {
  const documentA = {id: 1, name: 'One', description: 'The first document'}
  const documentB = {id: 2, name: 'Two', description: 'The second document'}
  const documentC = {id: 3, name: 'Three', description: 'The third document'}
  const documentD = {id: 4, name: 'Four', description: 'The 4th (fourth) document'}

  // Single-threaded Search API for easier testing
  const searchApi = new SearchApi({ indexMode, tokenizePattern, caseSensitive, matchAnyToken })
  searchApi.indexResource({
    fieldNamesOrIndexFunction: ['name', 'description'],
    resourceName: 'documents',
    resources: [ documentA, documentB, documentC, documentD ],
    state: {}
  })

  return searchApi
}

/** Simple smoke test of non-web-worker based SearchApi */
test('SearchApi should return documents ids for any searchable field matching a query', async t => {
  const searchApi = getSearchApi()
  const ids = await searchApi.performSearch('documents', 'One')
  expect(ids).toHaveLength(1)
  expect(ids[0]).toEqual(1)
})

test('SearchApi should pass through the correct :indexMode for ALL_SUBSTRINGS', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.ALL_SUBSTRINGS })

  const matches = await searchApi.performSearch('documents', 'econ')
  expect(matches).toHaveLength(1)
  expect(matches[0]).toEqual(2)

  const noMatches = await searchApi.performSearch('documents', 'xyz')
  expect(noMatches).toHaveLength(0)
})

test('SearchApi should pass through the correct :indexMode for PREFIXES', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.PREFIXES })

  const matches = await searchApi.performSearch('documents', 'Thre')
  expect(matches).toHaveLength(1)
  expect(matches[0]).toEqual(3)

  const noMatches = await searchApi.performSearch('documents', 'econd')
  expect(noMatches).toHaveLength(0)
})

test('SearchApi should pass through the correct :indexMode for EXACT_WORDS', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.EXACT_WORDS })

  const matches = await searchApi.performSearch('documents', 'One')
  expect(matches).toHaveLength(1)
  expect(matches[0]).toEqual(1)

  const noMatches = await searchApi.performSearch('documents', 'seco')
  expect(noMatches).toHaveLength(0)
})

test('SearchApi should pass through the correct :tokenizePattern', async t => {
  const searchApi = getSearchApi({
    tokenizePattern: /[^a-z0-9]+/
  })

  const matches = await searchApi.performSearch('documents', 'fourth')
  expect(matches).toHaveLength(1)
  expect(matches[0]).toEqual(4)
})

test('SearchApi should pass through the correct :caseSensitive bit', async t => {
  const searchApi = getSearchApi({
    caseSensitive: true
  })

  let matches = await searchApi.performSearch('documents', 'Second')
  expect(matches).toHaveLength(0)

  matches = await searchApi.performSearch('documents', 'second')
  expect(matches).toHaveLength(1)
  expect(matches[0], 2)
})

test('SearchApi should pass through the correct :matchAnyToken bit', async t => {
  const searchApi = getSearchApi({
    matchAnyToken: true
  })

  const matches = await searchApi.performSearch('documents', 'first two second')
  expect(matches).toHaveLength(2)
  expect(matches[0], 2) // Second document has more matching tokens
  expect(matches[1], 1)  
})
