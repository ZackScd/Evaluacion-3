var g_id_tipo_gestion = "";

function agregarTipoGestion(){
    var nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value;
    var fechaFormateada = obtenerFechaHora();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw =JSON.stringify({
        "nombre_tipo_gestion": nombre_tipo_gestion,
        "fecha_registro": fechaFormateada
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.210.74:8080/api/tipo_gestion", requestOptions)
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

function listarTipoGestion(){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_tipo_gestion').DataTable();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element,index,arr){
    var fechaFormateada = formatearFechaHora(element.fecha_registro);
    arr[index] = document.querySelector("#tbl_tipo_gestion tbody").innerHTML += 
    `<tr> 
        <td>${element.id_tipo_gestion}</td>
        <td>${element.nombre_tipo_gestion}</td>
        <td>${fechaFormateada}</td>
        <td>
            <a href='actualizar.html?id=${element.id_tipo_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
            <a href='eliminar.html?id=${element.id_tipo_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
        </td>
    </tr>`
}

function obtenerFechaHora(){
    var fechaHoraActual = new Date();
    var fechaFormateada = fechaHoraActual.toLocaleString('es-ES',{
      hour12:false,
      year      :   'numeric',
      month     :   '2-digit', 
      day       :   '2-digit',
      hour      :   '2-digit',
      minute    :   '2-digit', 
      second    :   '2-digit'
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
      timeZone  :   'UTC'
    }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
  
   return fechaFormateada;
}

function obtenerIdActualizacion(){
    const queryString       = window.location.search;
    const parametros        = new URLSearchParams(queryString);
    const p_id_tipo_gestion = parametros.get('id');
    g_id_tipo_gestion       = p_id_tipo_gestion;  

    obtenerDatosActualizacion(p_id_tipo_gestion);
}

function obtenerDatosActualizacion(id_tipo_gestion){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion/"+id_tipo_gestion, requestOptions)
    .then((response) => response.json())
    .then((json)     => json.forEach(completarFormularioActualizar))
    .then((result)   => console.log(result))
    .catch((error)   => console.error(error));
}

function completarFormularioActualizar(element){
    var nombreTipoGestion = element.nombre_tipo_gestion;
    document.getElementById('txt_nombre_tipo_gestion').value = nombreTipoGestion;
}

function actualizarTipoGestion(){
    
    var nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value;
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "nombre_tipo_gestion": nombre_tipo_gestion
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion/"+g_id_tipo_gestion, requestOptions)
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
    const queryString       = window.location.search;
    const parametros        = new URLSearchParams(queryString);
    const p_id_tipo_gestion = parametros.get('id');
    g_id_tipo_gestion       = p_id_tipo_gestion;
    
    obtenerDatosEliminacion(p_id_tipo_gestion);
}

function obtenerDatosEliminacion(id_tipo_gestion){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion/"+id_tipo_gestion, requestOptions)
    .then(response => response.json())
    .then((json) => json.forEach(completarEtiquetaEliminar))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarEtiquetaEliminar(element){
    var nombreTipoGestion = element.nombre_tipo_gestion;
    document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este tipo de gestión? <b>"+nombreTipoGestion +"</b>";
}

function eliminarTipoGestion(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/api/tipo_gestion/"+g_id_tipo_gestion, requestOptions)
    .then((response)=>{
        if(response.status == 200){
            location.href = "listar.html";
        }
        if(response.status == 400){
            mostrarAlerta("No se puede eliminar el tipo de gestión")
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function mostrarAlerta(mensaje, tipo){
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}