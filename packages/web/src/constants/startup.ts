/**
 * Startup types
 */
export const STARTUP_TYPES = ['ESG', 'NGO', 'DAO', 'COM'] as const
export type StartupTypesType = typeof STARTUP_TYPES[number] | undefined
export const STARTUP_TYPES_COLOR_MAP = {
  ESG: '#947DFF',
  NGO: '#FC8181',
  DAO: '#4BD4B4',
  COM: '#F8C631'
} as const
/**
 * 0:NONE,1:ESG,2:NGO,3:DAO,4:COM
 * @param mode contract mode
 */
export function getStartupTypeFromNumber(mode: number) {
  return STARTUP_TYPES[mode - 1]
}
/**
 * @param type contract mode
 * @return 0:NONE,1:ESG,2:NGO,3:DAO,4:COM
 */
export function getStartupNumberFromType(type: StartupTypesType) {
  if (type === undefined) {
    return 0
  }
  return STARTUP_TYPES.indexOf(type) + 1
}
