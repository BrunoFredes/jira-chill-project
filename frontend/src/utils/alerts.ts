import Swal from 'sweetalert2';

export const successAlert = (
  title: string
) => {

  Swal.fire({
    icon: 'success',
    title,
    timer: 1500,
    showConfirmButton: false
  });

};

export const errorAlert = (
  title: string,
  text: string
) => {

  Swal.fire({
    icon: 'error',
    title,
    text
  });

};