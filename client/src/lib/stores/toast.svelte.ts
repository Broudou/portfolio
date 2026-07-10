export interface ToastMessage {
  id: number;
  text: string;
  variant: 'success' | 'error' | 'info';
}

let nextId = 1;
const toasts = $state<ToastMessage[]>([]);

/** Simple global toast queue for the admin panel (form save confirmations, delete errors, etc). */
export const toastStore = {
  get all() {
    return toasts;
  },
  push(text: string, variant: ToastMessage['variant'] = 'info', durationMs = 4000) {
    const id = nextId++;
    toasts.push({ id, text, variant });
    setTimeout(() => {
      const index = toasts.findIndex((t) => t.id === id);
      if (index !== -1) toasts.splice(index, 1);
    }, durationMs);
  },
  dismiss(id: number) {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) toasts.splice(index, 1);
  },
};
