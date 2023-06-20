import {default as home} from "./homeService.js";



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
            console.log(resposta)
            
            if(resposta.status == true){
                document.getElementById('username').innerText = resposta.username
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
            console.log(resposta)
            
            if(resposta.status == true){
                document.getElementById('username').innerText = resposta.username
            }else{
                acessoNegado()
            }
            
        
        })
//Função da Lógica de Negócio: Buy
document.getElementsByClassName('buy').addEventListener("click", (evt) =>{
    
})
}

function acessoNegado () {
    document.getElementById('ap').style = "display: flex;flex-direction: column;"
    let title = '<h2 class ="title">Acesso Negado</h2>'
    let sub = '<h4 class ="title" style = "font-size: 26px;">Redirecionando para Tela de Login</h4>'
    document.getElementById('ap').innerHTML = (title+sub)
    setTimeout(()=>{
        home.goToLogin()
    }, 3000)
}