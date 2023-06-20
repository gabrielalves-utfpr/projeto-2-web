import {default as home} from "./homeService.js";

let auth = localStorage.getItem('auth')
let checkPagin = document.querySelector('input[name="pagin-prod"]:checked').value
let checkPagina = document.querySelector('input[name="pagina-prod"]:checked').value
let navPag = 1;
let pgWich = 'categorie'
let pgId = 1
let pgName = ''
document.getElementById('log-out').addEventListener("click", (evt) =>{
    localStorage.removeItem('auth')
    home.goToLogin()
})

/*
document.getElementById('list-dica').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        let id_tg = e.target.id.split('-')
        console.log(e.target)
        console.log(id_tg[1])
        tips.splice(parseInt(id_tg[1]), 1);
        atualizaLista();
        updatelocalStorage()
    }
})
*/
//navigator
let list = document.getElementById('nav-bar');
list.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'A') {
        let p = ev.target.id.split('-')
        navPag = parseInt(p[1])
        let selected = document.getElementById('n'+p[1]);
        if (selected.classList.contains('active')) {
        } else {
            selected.classList.add('active');
            for(let i = 1; i<=3;i++){
                if(i != p[1]) document.getElementById('n'+i).classList.remove('active');
            }
        }
        checkPagin = 5
        document.getElementById('pagin-5').checked = true
        checkPagina = 1
        document.getElementById('pagina-1').checked = true
        atualiza(navPag,parseInt(checkPagin),parseInt(checkPagina))
    }

});


window.onload = ()=>{
    let auth = localStorage.getItem('auth')
    const dataGET = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + auth
        },
    }
    if(auth != null){
        fetch('/user', dataGET)
        .then(resp => resp.json()) 
        .then(resposta =>{
            
            if(resposta.status == true){
                document.getElementById('username').innerText = resposta.username
                //atualizaProd(parseInt(checkPagin))
                atualiza(navPag,parseInt(checkPagin),parseInt(checkPagina))
            }else{
                acessoNegado()
            }
        })
    }else{
        acessoNegado()
    }
}
function atualiza(numLista, limite, pagina){
    limite = limite  || 5
    pagina = pagina  || 1
    numLista = numLista  || 1
    switch (numLista) {
        case 1:
            atualizaProd(limite, pagina)
            break;
        case 2:
            atualizaCatOrSup('categorie',limite, pagina)
            break;
        case 3:
            atualizaCatOrSup('supplier', limite, pagina)
            break;
        case 4:
            atualizaProd(limite, pagina, ('/'+pgWich),pgId,pgName)
            break;
    
            
        default:
            break;
    }
}

//Atualiza lista de Produtos
function atualizaProd (limite, pagina, filterFetch, filterId, filterCatName){
    limite = limite  || 5
    pagina = pagina  || 1
    let ff = filterFetch
    let fi = filterId
    let fc = filterCatName
    if(filterId){
        filterId = '&filterId='+filterId
        filterCatName = ' by '+filterCatName
    }else{
        filterId =''
        filterCatName = ''
        filterFetch = ''
    }

    let auth = localStorage.getItem('auth')
    const dataGET = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + auth
        },
    }
    fetch('/product/list'+filterFetch+'?limite='+limite+'&pagina='+pagina+''+filterId, dataGET)
        .then(resp => resp.json()) 
        .then(resposta =>{
            
            if(resposta != null && resposta != undefined){
                document.getElementById("title").innerText = ("PRODUCTS"+filterCatName)
                document.getElementById("list-prod").innerHTML =""
                certoLista()
                let caux = (resposta.count / limite)
                let totalPaginas = Math.ceil(caux)
                let a,b,c,d,e,f = ''
                for(let j = 0; j<resposta.rows.length;j++){
                    a = '<div class="prod" id="'+j+'">'
                    b = '<h3 class = "prod-t">'+resposta.rows[j].name+'</h3>'
                    c = '<h4 class = "prod-q"> Qtd Disponível: '+resposta.rows[j].qtd+' un.</h4>'
                    d = '<h4 class = "prod-p">R$ '+resposta.rows[j].price+'</h4>'
                    e = '<button class = "buy" id="b-'+j+'" type="button">Buy</button>'
                    f = '</div><div class = space><div>'
                    
                    //espaçamento correto entre items
                    let aux = (resposta.rows.length-(j+1))
                        if (aux < (resposta.rows.length%4) && aux != 0){
                            
                            f = '</div><div class = space style="max-width:1.2%"><div>'
                        }
                    /*if(((j+1)%4) != 0){
                        let aux = (resposta.count-(j+1))
                        if (aux < 4 && aux != 0){
                            console.log(aux)
                            f = '</div><div class = space style="max-width: 1px"><div>'
                        }else{
                            
                            f = '</div><div class = space><div>'
                        }
                    }else {
                        console.log('hey'+(j+1)) 
                        f = '</div>'}
                        */
                    document.getElementById("list-prod").insertAdjacentHTML("beforeend", a+b+c+d+e+f)
                    
                    //Função da Lógica de Negócio: Buy
                    let btn = document.getElementById("b-"+j)
                    if(resposta.rows[j].qtd > 0){
                        btn.disable = false
                        btn.addEventListener('click', (ev) => {
                            home.buy(resposta.rows[j].id, auth).then(resp =>{
                                if(resp){
                                    btn.innerText = "SUCESSO"
                                    btn.classList.add('hover-sucess')
                                    setTimeout(()=>{
                                        btn.classList.remove('hover-sucess')
                                        btn.innerText = "Buy"
                                        if(filterId == ''){
                                            atualizaProd(limite, pagina)
                                        }else{
                                            atualizaProd(limite, pagina, ff, fi, fc)
                                        }
                                    }, 2000)
                                } else{
                                    btn.innerText = "FAIL"
                                    btn.classList.add('hover-fail')
                                    setTimeout(()=>{
                                        btn.classList.remove('hover-fail')
                                        btn.innerText = "Buy"
                                        if(filterCatName == ''){
                                            atualizaProd(limite, pagina)
                                        }else{
                                            atualizaProd(limite, pagina, ff, fi, fc)
                                        }
                                    }, 2000)

                                }
                            })
                        })
                    }else{
                        btn.innerText = "INDISPONÍVEL"
                        btn.classList.add('hover-fail')
                        btn.disable = true

                    }

                }
                
                let rd, lb = ''
                document.getElementById("radio-pagina-prod").innerHTML = ''
                
                for(let i = 1; i<=(totalPaginas);i++){
                    rd = '<input type="radio" id = "pagina-'+i+'" name="pagina-prod" value="'+i+'" '
                    if(i == pagina) {
                        rd +='checked>'
                    }else{
                        rd +='>'
                    }
                    lb = '<label for = "pagina-'+i+'" >'+i+'</label>'
                    document.getElementById("radio-pagina-prod").insertAdjacentHTML("beforeend", rd+lb)
                    
                }
                
                
            }else{
                erroLista()
                //acessoNegado ('ERRO', resposta.message)
                //acessoNegado('ERRO',resposta.message)
            }
            
        
        })
}
//Pagination
document.getElementById('radio-pagin-prod').addEventListener("click", (evt) =>{
    let newcheckPagin = document.querySelector('input[name="pagin-prod"]:checked').value
    if(checkPagin != newcheckPagin){
        checkPagin = newcheckPagin
        atualiza(navPag,parseInt(checkPagin))
    }

})
document.getElementById('radio-pagina-prod').addEventListener("click", (evt) =>{
    let newcheckPagina = document.querySelector('input[name="pagina-prod"]:checked').value
    if(checkPagina != newcheckPagina){
        checkPagina = newcheckPagina
        atualiza(navPag, parseInt(checkPagin), parseInt(checkPagina))
    }

})


function acessoNegado (titleMsg, msg) {
    document.getElementById('ap').style = "display: flex;flex-direction: column;"
    let title = '<h2 class ="title">Acesso Negado</h2>'
    if (titleMsg) {
        title = '<h2 class ="title">'+titleMsg+'</h2>'
    }
    let sub = '<h4 class ="title" style = "font-size: 26px;">Redirecionando para Tela de Login</h4>'
    if (msg) {
        sub = '<h4 class ="title" style = "font-size: 26px;">'+msg+'</h4>'
    }
     document.getElementById('ap').innerHTML = (title+sub)
    setTimeout(()=>{
        home.goToLogin()
    }, 3000)
}

function erroLista(){
    document.getElementById('erro-mensagem').style = 'display: inline-block;'
}
function certoLista(){
    document.getElementById('erro-mensagem').style = 'display: none;'
}


//Atualiza lista de Categorie ou Suppliers
function atualizaCatOrSup(wichOne, limite, pagina){
    limite = limite  || 5
    pagina = pagina  || 1
    wichOne = wichOne || 'categorie'
    let auth = localStorage.getItem('auth')
    const dataGET = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + auth
        },
    }
    fetch('/'+wichOne+'/list?limite='+limite+'&pagina='+pagina+'', dataGET)
        .then(resp => resp.json())
        .then(resposta =>{
            
            if(resposta != null && resposta != undefined){
                document.getElementById("title").innerText = wichOne.toUpperCase()
                document.getElementById("list-prod").innerHTML =""
                certoLista()
                let caux = (resposta.count / limite)
                let totalPaginas = Math.ceil(caux)
                let a,b,c = ''
                for(let j = 0; j<resposta.rows.length;j++){
                    a = '<div class="CatOrSup" id="'+j+'">'
                    b = '<h3 class = "cos-t">'+resposta.rows[j].name+'</h3>'
                    c = '</div><div class = space><div>'
                    
                    /*let aux = (resposta.rows.length-(j+1))
                        if (aux < (resposta.rows.length%4) && aux != 0){
                            
                            console.log('id: '+(j+1)+' aux:'+aux)
                            c = '</div><div class = space style="max-width:1.2%"><div>'
                        }*/
                    /*if(((j+1)%4) != 0){
                        let aux = (resposta.count-(j+1))
                        if (aux < 4 && aux != 0){
                            console.log(aux)
                            f = '</div><div class = space style="max-width: 1px"><div>'
                        }else{
                            
                            f = '</div><div class = space><div>'
                        }
                    }else {
                        console.log('hey'+(j+1)) 
                        f = '</div>'}
                        */
                    document.getElementById("list-prod").insertAdjacentHTML("beforeend", a+b+c)
                    document.getElementById(j).addEventListener("click", (evt) =>{
                        atualizaProd(limite, pagina, ('/'+wichOne),resposta.rows[j].id,resposta.rows[j].name)
                        navPag = 4
                        pgWich = wichOne
                        pgId = resposta.rows[j].id
                        pgName = resposta.rows[j].name
                    })
                    

                }
                
                let rd, lb = ''
                document.getElementById("radio-pagina-prod").innerHTML = ''
                
                for(let i = 1; i<=(totalPaginas);i++){
                    rd = '<input type="radio" id = "pagina-'+i+'" name="pagina-prod" value="'+i+'" '
                    if(i == pagina) {
                        rd +='checked>'
                    }else{
                        rd +='>'
                    }
                    lb = '<label for = "pagina-'+i+'" >'+i+'</label>'
                    document.getElementById("radio-pagina-prod").insertAdjacentHTML("beforeend", rd+lb)
                    
                }
                
                
            }else{
                erroLista()
                //acessoNegado ('ERRO', resposta.message)
                //acessoNegado('ERRO',resposta.message)
            }
            
        
        })
}