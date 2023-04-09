import {
  ACTION,
  INITIALIZE_RESOURCES,
  SEARCH_API,
  SEARCH,
  RECEIVE_RESULT
} from './constants'
import { ResourceName, Result } from './selectors';

export const indexResource = ({
  fieldNamesOrIndexFunction,
  resourceName,
  resources,
  state,
}: {
  fieldNamesOrIndexFunction: string;
  resourceName: string;
  resources: Document[];
  state: {};
}) => ({
  type: SEARCH_API,
  payload: {
    method: 'indexResource',
    fieldNamesOrIndexFunction,
    resourceName,
    resources,
    state,
  }
})

export type Action = SearchApiAction | SearchAction | ReceiveResultAction | InitializeResourcesAction

export type SearchApiAction = {
  type: '@@reduxSearch/API';
  payload: {
    method: 'performSearch';
    args: string[];
  }
}

export type SearchAction = {
  type: '@@reduxSearch/action';
  payload: {
    api: SearchApiAction;
    action: {
      type: '@@reduxSearch/search';
      payload: {
        resourceName: string;
        text: string;
      }
    }
  }
}

export type ReceiveResultAction = {
  type: '@@reduxSearch/receiveResult';
  payload: {
    resourceName: ResourceName;
    result: Result;
  }
}

export type InitializeResourcesAction = {
  type: '@@reduxSearch/initializeResources';
  payload: {
    resourceNames: ResourceName[];
  }
}

export const performSearch = (resourceName: string, text: string): SearchApiAction => ({
  type: SEARCH_API,
  payload: {
    method: 'performSearch',
    args: [
      resourceName,
      text,
    ],
  },
})

export function search (resourceName: string): (text: string) => SearchAction {
  return function searchResource (text: string) {
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

export function receiveResult (resourceName: ResourceName): (result: Result) => ReceiveResultAction {
  return function receiveResultForResource (result: Result) {
    return {
      type: RECEIVE_RESULT,
      payload: {
        resourceName,
        result,
      }
    }
  }
}

export function initializeResources (resourceNames: ResourceName[]): InitializeResourcesAction {
  return {
    type: INITIALIZE_RESOURCES,
    payload: {
      resourceNames
    }
  }
}