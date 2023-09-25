/*

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que el formulario se envíe automáticamente, si lo saco los carteles desaparecen automáticamente

 
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: "Usuario o Contraseña incorrectos!",
      showConfirmButton: false,
      timer: 3000, // Puedes configurar el temporizador si lo deseas
    });
 
  
  
});

*/

loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evita que el formulario se envíe automáticamente

  const email = document.getElementById("email").value; // Obtén el valor del campo de correo
  const password = document.getElementById("password").value; // Obtén el valor del campo de contraseña

  
  fetch('/api/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Serializa los datos a JSON
  })
    .then((response) => {
      if (response.status === 401 || response.status === 404) {
        // Si la respuesta tiene un código de estado 401
        return response.json(); // Analiza el cuerpo de la respuesta como JSON
      } else if(response.status === 200){

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Login validado",
          showConfirmButton: false,
          timer: 3000, // Puedes configurar el temporizador si lo deseas
          backdrop: false, // Fondo no interactivo
        });

        setTimeout(() => {
          window.location.href = '/api/products'
        }, 1000);
      }
    })
    .then((data) => {
      if (data && data.resultado === false) {
        // Aquí puedes acceder al valor de 'resultado' si es false
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `${data.message}`,
          showConfirmButton: false,
          timer: 3000, // Puedes configurar el temporizador si lo deseas
          backdrop: false, // Fondo no interactivo
        });
      } 
    })
    .catch((error) => {
      // Manejar errores si ocurren
      //console.error('Error', error);
    });

});





















