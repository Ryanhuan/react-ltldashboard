import Swal from 'sweetalert2';

export const customAlert = Swal.mixin({
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
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


// customAlert.fire({ title: '確定要修改?', icon: 'warning' })
// .then(async (result) => {
//     if (result.isConfirmed) {
       
//     }
// })
