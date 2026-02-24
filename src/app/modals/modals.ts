import Swal from "sweetalert2";

export const showConfirmModal = Swal.mixin({
    showDenyButton: false,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonColor: "red",
    cancelButtonText: "Cancelar",
    background: "black",
    color: "var(--textColor)",
});

export const showCompletionModal = Swal.mixin({
    background: "black",
    color: "var(--textColor)",
    showConfirmButton: true,
    confirmButtonColor: "var(--secondary-color)",
    icon: "success"
})
