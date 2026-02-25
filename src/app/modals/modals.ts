import Swal from "sweetalert2";

export const showConfirmModal = Swal.mixin({
    showDenyButton: false,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonColor: "var(--confirmColor)",
    cancelButtonText: "Cancelar",
    background: "var(--backgroundSwalColor)",
    color: "var(--secondaryColor)",
});

export const showCompletionModal = Swal.mixin({
    background: "var(--backgroundSwalColor)",
    color: "var(--secondaryColor)",
    showConfirmButton: true,
    confirmButtonColor: "var(--confirmColor)",
    icon: "success"
})
