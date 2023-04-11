/** Default state selector */
export function defaultSearchStateSelector (state) {
  return state.search
}

/**
 * Creates convenience selectors for the specified resource.
 */
export function getSearchSelectors ({
  filterFunction,
  resourceName,
  resourceSelector,
  searchStateSelector = defaultSearchStateSelector
}) {
  return {
    text: getTextSelector({ resourceName, searchStateSelector }),
    result: getResultSelector({ filterFunction, resourceName, resourceSelector, searchStateSelector }),
    unfilteredResult: getUnfilteredResultSelector({ resourceName, searchStateSelector })
  }
}

/**
 * Returns the current search text for a given searchable resource.
 */
export function getTextSelector ({
  resourceName,
  searchStateSelector = defaultSearchStateSelector
}) {
  return function textSelector (state) {
    return searchStateSelector(state)[resourceName].text
  }
}

/**
 * Creates a default filter function capable of handling Maps and Objects.
 */
function createFilterFunction (resource) {
  return resource.has instanceof Function
    ? id => resource.has(id)
    : id => resource[id]
}

/**
 * Returns the current result list for a given searchable resource.
 * This list is pre-filtered to ensure that all ids exist within the current resource collection.
 */
export function getResultSelector ({
  filterFunction,
  resourceName,
  resourceSelector,
  searchStateSelector = defaultSearchStateSelector
}) {
  const unfilteredResultSelector = getUnfilteredResultSelector({ resourceName, searchStateSelector })

  return function resultSelector (state) {
    const result = unfilteredResultSelector(state)
    const resource = resourceSelector(resourceName, state)

    return result.filter(filterFunction || createFilterFunction(resource))
  }
}

/**
 * Returns the current result list for a given searchable resource.
 * This list is not pre-filtered; see issue #29 for more backstory.
 *
 * @param resourceName eg "databases"
 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
 */
export function getUnfilteredResultSelector ({
  resourceName,
  searchStateSelector = defaultSearchStateSelector
}) {
  return function resultSelector (state) {
    return searchStateSelector(state)[resourceName].result
  }
}
