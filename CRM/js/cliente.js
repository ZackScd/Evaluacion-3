var g_id_cliente = "";

function agregarCliente() {
    var id_cliente      =    document.getElementById("txt_id_cliente").value;
    var dv              =    document.getElementById("txt_dv").value;
    var nombres         =    document.getElementById("txt_nombre").value;
    var apellidos       =    document.getElementById("txt_apellido").value;
    var email           =    document.getElementById("txt_email").value;
    var celular         =    document.getElementById("txt_celular").value;
    var fechaHoraActual =    obtenerFechaHora();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    
    const raw = JSON.stringify({
        "id_cliente"    :    id_cliente,
        "dv"            :    dv,
        "nombres"       :    nombres,
        "apellidos"     :    apellidos,
        "email"         :    email,
        "celular"       :    celular,
        "fecha_registro":    fechaHoraActual
    });
    
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
    .then((response)=>{
        if(response.status == 200){
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
          }
      
          if(response.status == 400){
           const modal = new bootstrap.Modal(document.getElementById('errorModal'));
           modal.show();
          }
    })
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

function listarCliente(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_cliente').DataTable();
    })
    .then(result => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element,index,arr){
    var fechaFormateada = formatearFechaHora(element.fecha_registro);
    
    arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML += 
    `<tr> 
    <td>${element.id_cliente}</td>
    <td>${element.dv}</td>
    <td>${element.nombres}</td>
    <td>${element.apellidos}</td>
    <td>${element.email}</td>
    <td>${element.celular}</td>
    <td>${fechaFormateada}</td>
    <td>
    <a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

function obtenerIdActualizacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;
    
    obtenerDatosActualizacion(p_id_cliente);
}

function obtenerDatosActualizacion(id_cliente){
    
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormularioActualizar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFormularioActualizar(element){
    var nombres     =    element.nombres;
    var apellidos   =    element.apellidos;
    var email       =    element.email;
    var celular     =    element.celular;
    document.getElementById('txt_nombre').value     =    nombres;
    document.getElementById('txt_apellido').value   =    apellidos;
    document.getElementById('txt_email').value      =    email;
    document.getElementById('txt_celular').value    =    celular;
}

function actualizarCliente(){
    var nombres     =    document.getElementById("txt_nombre").value;
    var apellidos   =    document.getElementById("txt_apellido").value;
    var email       =    document.getElementById("txt_email").value;
    var celular     =    document.getElementById("txt_celular").value;
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw =JSON.stringify({
        "nombres"   :    nombres,
        "apellidos" :    apellidos,
        "email"     :    email,
        "celular"   :    celular
    });
    
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
        }
        
        if(response.status == 400){
           const modal = new bootstrap.Modal(document.getElementById('errorModal'));
           modal.show();
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function obtenerIdEliminacion(){
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;

    obtenerDatosEliminacion(p_id_cliente);
}

function obtenerDatosEliminacion(id_cliente){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+id_cliente, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiquetaEliminar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarEtiquetaEliminar(element){
    var nombreCliente = element.nombres;
    var apellidoCliente = element.apellidos;
    document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este cliente? <br><br><b>"+nombreCliente+" "+apellidoCliente+"</b>";
}

function eliminarCliente(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/cliente/"+g_id_cliente, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlertaError("No se puede eliminar el cliente. <br>Es posible que esté siendo utilizado por otro registro.")
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}


function obtenerFechaHora(){
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES',{
      hour12:false,
      year  :   'numeric',
      month :   '2-digit', 
      day   :   '2-digit',
      hour  :   '2-digit',
      minute:   '2-digit', 
      second:   '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  
   return fechaFormateada;
    }
  
function formatearFechaHora(fecha_registro){
    var fechaHoraActual = new Date(fecha_registro);
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES',{
      hour12:false,
      year      :   'numeric',
      month     :   '2-digit', 
      day       :   '2-digit',
      hour      :   '2-digit',
      minute    :   '2-digit', 
      second    :   '2-digit',
      timeZone  :    'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  
   return fechaFormateada;
}


function mostrarAlertaError(mensaje, tipo){
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}