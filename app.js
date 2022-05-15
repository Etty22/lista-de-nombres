(()=>{
    //variables
    const IDB = indexedDB.open("nombre",1);
    let botonSubirInfo = document.getElementById('btn-info');
    let valor = document.getElementById('valor');
    let contenedor=document.getElementById('containerCoso');
    let fragmento = document.createDocumentFragment();

    const validacion= /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    //funciones
    const nombresHTML =(id,nombre)=>{
        const container = document.createElement("div");
        const h2 = document.createElement("h2");
        const options = document.createElement("div");
        const saveButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        container.classList.add("container-nombre");
        options.classList.add("option");
        saveButton.classList.add("imposible");
        deleteButton.classList.add("delete");
        h2.classList.add("item");
        
        saveButton.textContent = "Guardar"
        deleteButton.textContent ="Eliminar"
        h2.textContent = nombre.nombre
        h2.setAttribute("contenteditable","true")
        h2.setAttribute("spellcheck","false")

        options.appendChild(saveButton);
        options.appendChild(deleteButton);
        container.appendChild(h2);
        container.appendChild(options);
        h2.addEventListener("keyup",()=>{
            saveButton.classList.replace("imposible","posible")
        })
        saveButton.addEventListener("click",()=>{
            if(saveButton.className == "posible"){
                editarObjeto(id,{nombre:h2.textContent} )
                saveButton.classList.replace("posible","imposible")
            }})
        deleteButton.addEventListener("click",()=>{
            eliminarObjeto(id);
            contenedor.removeChild(container)
        })
        return container
    }
    const Titulo = ()=>{
        const Titulo = document.createElement("h1")
        Titulo.classList.add("titulo")
        Titulo.innerHTML = "Nombre"
        return Titulo
    }



    const addObjeto = objeto=>{
        const IDBdata = transactionOperation("readwrite")

        IDBdata.add(objeto);

    }
    const editarObjeto = (key,objeto)=>{
        const IDBdata = transactionOperation("readwrite")
        IDBdata.put(objeto,key);

    }
    const eliminarObjeto = key=>{
        const IDBdata = transactionOperation("readwrite") 

        IDBdata.delete(key);

    }

    const leerObjetos = ()=>{
        const IDBdata = transactionOperation("readonly")
        const cursor = IDBdata.openCursor()
        let titulo = Titulo()
        contenedor.innerHTML = ""
        fragmento.appendChild(titulo)
        cursor.addEventListener("success",()=>
        {
            if(cursor.result){
                let elemento = nombresHTML(cursor.result.key,cursor.result.value)

                fragmento.appendChild(elemento)
                cursor.result.continue()}else{
                contenedor.appendChild(fragmento)}
        })
    }
    const transactionOperation = mode=>{
        const db = IDB.result;
        const IDBtransaction = db.transaction("nombres",mode);
        const objectStore = IDBtransaction.objectStore("nombres");
        return objectStore

    }
    const clickOEnter = ()=>{
        let nombre = valor.value
        if(nombre.length > 0){
            if (validacion.test(nombre)){
                alert("no podes hacer eso")
            }
            else if(document.querySelector(".posible")!==null){
                    if(confirm("No guardaste algo, seguro que queres continuar?")){
                        addObjeto({nombre:nombre})
                        leerObjetos()
                    }
            }
            else{
                addObjeto({nombre:nombre})

                leerObjetos()
            }
        }else{
            alert("escribí algo")
        }
    }


    //eventListener
    IDB.addEventListener("upgradeneeded",()=>{
        const db = IDB.result;
        db.createObjectStore("nombres",{
            autoIncrement: true
        });
    });

    IDB.addEventListener("success",()=>{

        leerObjetos()})
    botonSubirInfo.addEventListener("click",()=>clickOEnter())
    valor.addEventListener("keypress",e=>{
        if(e.key == "Enter"){
            clickOEnter()
        }
    })
})()
    //4:55:19