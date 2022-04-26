import DIContainer, { object, use } from 'rsdi'
import type { ClassOf, ResolvedType, ResolverName } from 'rsdi/types'

export const modules = new DIContainer()

modules.add({ di: new DIContainer() })

function addModule<T>(module: ClassOf<T>) {
  modules.add({
    [module.name]: object(module).construct(use('di')),
  })
}

export function useModule<T>(module: ClassOf<T>) {
  try {
    return modules.get(module)
  } catch (e) {
    if (e.message === `Dependency with name ${module.name} is not defined`) {
      addModule(module)
      return useModule(module)
    }
    throw e
  }
}

export function getInstance<Custom, Name extends ResolverName>(
  dependencyName: Name
): ResolvedType<Custom, Name> {
  const di = modules.get('di')
  return di.get(dependencyName)
}
