export type Document = { id: number, name: string, description: string }

export type ResourceName = string;

type Resources = { [index: ResourceName]: string; }

export type Result = Document[];

export type Search = {
  [index: ResourceName]: { isSearching: boolean; result: Result, text: string };
}

type State = { resources: Resources; search: Search; }

/** Default state selector */
export function defaultSearchStateSelector (state: State): Search {
  return state.search
}

type ResultSelector = (state: State) => Result
type TextSelector = (state: State) => string
type SearchStateSelector = (state: State) => State['search']
type ResourceSelector = (resourceName: string, state: State) => Document
/**
 * Creates convenience selectors for the specified resource.
 *
 * @param filterFunction Custom filter function for resources that are computed (not basic maps)
 * @param resourceName eg "databases"
 * @param resourceSelector Returns an iterable resouce map for a given, searchable resource.
 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
 */
export function getSearchSelectors ({
  filterFunction,
  resourceName,
  resourceSelector,
  searchStateSelector = defaultSearchStateSelector
}: {
  filterFunction: () => any;
  resourceName: ResourceName;
  resourceSelector: ResourceSelector;
  searchStateSelector: SearchStateSelector;
}): {
  text: TextSelector;
  result: ResultSelector;
  unfilteredResult: ResultSelector;
} {
  return {
    text: getTextSelector({ resourceName, searchStateSelector }),
    result: getResultSelector({ filterFunction, resourceName, resourceSelector, searchStateSelector }),
    unfilteredResult: getUnfilteredResultSelector({ resourceName, searchStateSelector })
  }
}

/**
 * Returns the current search text for a given searchable resource.
 *
 * @param resourceName eg "databases"
 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
 */
export function getTextSelector ({
  resourceName,
  searchStateSelector = defaultSearchStateSelector
}: {
  resourceName: string;
  searchStateSelector: SearchStateSelector;
}): TextSelector {
  return function textSelector (state) {
    return searchStateSelector(state)[resourceName].text
  }
}

/**
 * Creates a default filter function capable of handling Maps and Objects.
 */
function createFilterFunction (resource: any) {
  return resource.has instanceof Function
    ? (id: string) => resource.has(id)
    : (id: string) => resource[id]
}

/**
 * Returns the current result list for a given searchable resource.
 * This list is pre-filtered to ensure that all ids exist within the current resource collection.
 *
 * @param filterFunction Custom filter function for resources that are computed (not basic maps)
 * @param resourceName eg "databases"
 * @param resourceSelector Returns an iterable resouce map for a given, searchable resource.
 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
 */
export function getResultSelector ({
  filterFunction,
  resourceName,
  resourceSelector,
  searchStateSelector = defaultSearchStateSelector
}: {
  filterFunction: () => Document;
  resourceName: ResourceName;
  resourceSelector: ResourceSelector;
  searchStateSelector: SearchStateSelector;
}): ResultSelector {
  const unfilteredResultSelector = getUnfilteredResultSelector({ resourceName, searchStateSelector })

  return function resultSelector (state: State) {
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
  searchStateSelector = defaultSearchStateSelector,
}: {
  resourceName: string;
  searchStateSelector: SearchStateSelector;
}): ResultSelector {
  return function resultSelector (state) {
    return searchStateSelector(state)[resourceName].result
  }
}