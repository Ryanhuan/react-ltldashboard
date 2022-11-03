import Swal from 'sweetalert2';

export const customAlert = Swal.mixin({
    customClass: {
        confirmButton: 'btn btnMain',
        cancelButton: 'btn btnError'
    },
    buttonsStyling: false
})


