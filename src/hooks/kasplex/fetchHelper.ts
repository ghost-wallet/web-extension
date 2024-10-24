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
