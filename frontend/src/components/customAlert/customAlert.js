import Swal from 'sweetalert2';

export const customAlert = Swal.mixin({
    customClass: {
        confirmButton: 'btn btnMain',
        cancelButton: 'btn btnError'
    },
    buttonsStyling: false
})


export const customToastTopEnd = Swal.mixin({
    customClass: { container: 'swal_customToastTopEnd',
                    title: 'swal_customToastTitle',
                },
    toast: true,
    position: 'top-end',
    width: 250,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

// customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error');

// customToastTopEnd.fire('OK!', '修改成功!', 'success');

