import { useMemo } from "react";

export function useCrudResource(items, actions) {
  return useMemo(
    () => ({
      items,
      create: actions.create,
      read: (id) => items.find((item) => item.id === id),
      update: actions.update,
      delete: actions.delete,
      count: items.length,
    }),
    [actions, items]
  );
}
