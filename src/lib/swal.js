import Swal from 'sweetalert2';

const isDark = () => document.documentElement.classList.contains('dark');

export const confirmDelete = (opts = {}) =>
  Swal.fire({
    title: opts.title || 'Are you sure?',
    text: opts.text || 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: isDark() ? '#1f2937' : '#ffffff',
    color: isDark() ? '#f9fafb' : '#111827',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      confirmButton: 'rounded-lg font-medium px-5 py-2.5',
      cancelButton: 'rounded-lg font-medium px-5 py-2.5',
    },
  });
