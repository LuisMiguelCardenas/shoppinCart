$(document).ready(function () {
    const templateFooter = document.getElementById('template-footer').content
    const templateCarrito = document.getElementById('template-carrito').content
    const items = document.getElementById('items')
    const footer = document.getElementById('footer')
    const cards = document.getElementById('containerProducts')
    const fragment = document.createDocumentFragment()
    let carrito = {}
    
    $('.table').hide()

    $(cards).click(e =>{
        addCarrito(e)
        $('.table').fadeIn()
    })
    
    $(items).click (e => {
        btnMasMenos(e)
    })

    $.ajax({
        url:"./api.json",
        type: "GET",
        dataType: "json",
    })
    .done(function (resultado){
        let productos=resultado.products
        pintarObjetosEnPantalla (productos)

    })
    .fail(function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error)
    })
    
    function pintarObjetosEnPantalla (paramentro){
        for (let i =0; i <paramentro.length;i++){
        let tarjeta = document.createElement('div')
        $(tarjeta).attr('class', 'row col-5 col-md-3 col-lg-2 text-center m-1 my-4');
        let titulo = document.createElement('h3')
        titulo.textContent = paramentro[i].name
        tarjeta.append(titulo)

        let imagen = document.createElement('img')
        $(imagen).attr('src',paramentro[i].img)
        tarjeta.append(imagen)

        let precio = document.createElement('p')
        precio.textContent = paramentro[i].price
        tarjeta.append(precio)

        let boton = document.createElement('button')
        boton.dataset.id = paramentro[i].id
        boton.textContent = 'Comprar'
        $(boton).attr('class','btn-primary')
        tarjeta.append(boton)
        
        let contenedor = document.getElementById('containerProducts')
        contenedor.append(tarjeta)
        }
    }
    const addCarrito  = e =>{
        if(e.target.classList.contains('btn-primary')){
            setCarrito(e.target.parentElement)
        }
        e.stopPropagation()    
    }

    const setCarrito = objeto => {
        const producto = {
            id: objeto.querySelector('.btn-primary').dataset.id,
            name: objeto.querySelector('h3').textContent,
            price: objeto.querySelector('p').textContent,
            cantidad: 1
        }
        if (carrito.hasOwnProperty(producto.id)){
            producto.cantidad = carrito[producto.id].cantidad +1
        }
        carrito[producto.id]= {...producto}
        pintarCarrito()
    }

    const pintarCarrito = () =>{
        items.innerHTML=''
        Object.values(carrito).forEach(producto => {
            templateCarrito.querySelector('th').textContent = producto.id
            templateCarrito.querySelectorAll('td')[0].textContent = producto.name
            templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            templateCarrito.querySelector('.btn-info').dataset.id = producto.id
            templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
            templateCarrito.querySelector('span').textContent = producto.cantidad*producto.price
            const clone = templateCarrito.cloneNode(true)
            fragment.append(clone)
        })
        items.append(fragment)
        pintarFooter()

        localStorage.setItem('carrito', JSON.stringify(carrito) )
    }

    const pintarFooter = () =>{
        footer.innerHTML=''
        if (Object.keys(carrito).length === 0){
            footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
            return
        }
        const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc+cantidad ,0)
        const nPrecio = Object.values(carrito).reduce((acc,{cantidad,price}) => acc+cantidad*price ,0)
    

        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio

        const clone = templateFooter.cloneNode(true)
        fragment.append(clone)
        footer.append(fragment)

        const botonVaciarCarrito = document.getElementById('vaciar-carrito')
        $(botonVaciarCarrito).click(()=>{
            carrito = {}
            pintarCarrito()

        })
    }
    const btnMasMenos = e =>{
        if(e.target.classList.contains('btn-info')){
            const producto = carrito[e.target.dataset.id]
            producto.cantidad++
            carrito[e.target.dataset.id] = {...producto}
            pintarCarrito()
        }
        if(e.target.classList.contains('btn-danger')){
            const producto = carrito[e.target.dataset.id]
            producto.cantidad --
            if(producto.cantidad === 0){
                delete carrito[e.target.dataset.id]
            }
            pintarCarrito()
        }
        e.stopPropagation()
    }
    
    function localStorageItmes (){
        if (localStorage.getItem('carrito')){
            carrito = JSON.parse(localStorage.getItem('carrito'))
            pintarCarrito()
        }
    }
    localStorageItmes ()

});

