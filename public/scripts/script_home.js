import {default as home} from "./homeService.js";

let checkPagin = document.querySelector('input[name="pagin-prod"]:checked').value
let checkPagina = document.querySelector('input[name="pagina-prod"]:checked').value
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
        .then(resp => resp.json()) // Parse the response JSON
        .then(resposta =>{
            console.log('jt')
            
            if(resposta.status == true){
                document.getElementById('username').innerText = resposta.username
                atualizaProd(parseInt(checkPagin))
            }else{
                acessoNegado()
            }
            
        
        })
    }else{
        acessoNegado()
    }
}

function atualizaProd(limite, pagina){
    limite  = limite  || 10
    pagina  = pagina  || 1

    let auth = localStorage.getItem('auth')
    const dataGET = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json', 
            'Authorization': 'Bearer ' + auth
        },
    }
    fetch('/product/list?limite='+limite+'&pagina='+pagina+'', dataGET)
        .then(resp => resp.json()) // Parse the response JSON
        .then(resposta =>{
            
            console.log('resposta')
            if(resposta != null && resposta != undefined){
                document.getElementById("title").innerText = "Produtos"
                document.getElementById("list-prod").innerHTML =""
                console.log(resposta)
                certoLista()
                let totalPaginas = resposta.count / resposta.rows.length
                console.log(totalPaginas)
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
                            
                            console.log('id: '+(j+1)+' aux:'+aux)
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
                
                console.log('here')
                
            }else{
                erroLista()
                //acessoNegado ('ERRO', resposta.message)
                console.log('Erro')
                console.log(resposta)
                //acessoNegado('ERRO',resposta.message)
            }
            
        
        })
/*
document.getElementsByClassName('buy').addEventListener("click", (evt) =>{
    
})
*/
}
//Pagination
document.getElementById('radio-pagin-prod').addEventListener("click", (evt) =>{
    let newcheckPagin = document.querySelector('input[name="pagin-prod"]:checked').value
    if(checkPagin != newcheckPagin){
        checkPagin = newcheckPagin
        atualizaProd(parseInt(checkPagin))
    }

})
document.getElementById('radio-pagina-prod').addEventListener("click", (evt) =>{
    let newcheckPagina = document.querySelector('input[name="pagina-prod"]:checked').value
    if(checkPagina != newcheckPagina){
        checkPagina = newcheckPagina
        atualizaProd(parseInt(checkPagin), parseInt(checkPagina))
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