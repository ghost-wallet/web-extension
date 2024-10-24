import React from 'react'

export const fetchData = async (
  fetchFn: () => Promise<any>,
  dispatch: React.Dispatch<any>,
  successType: string,
  errorType: string,
) => {
  try {
    dispatch({ type: 'loading', payload: true })
    dispatch({ type: 'error', payload: null })

    const result = await fetchFn()
    dispatch({ type: successType, payload: result })
  } catch (err) {
    dispatch({ type: errorType, payload: `Error fetching data: ${err}` })
  } finally {
    dispatch({ type: 'loading', payload: false })
  }
}

export const getApiBase = (selectedNode: number): string => {
  switch (selectedNode) {
    case 0:
      return 'api'
    case 1:
      return 'tn10api'
    case 2:
      return 'tn11api'
    default:
      return 'api' // Default case, if no selected node is found
  }
}
