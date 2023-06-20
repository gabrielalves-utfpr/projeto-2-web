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
                atualizaProd()
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
                console.log(resposta)
                certoLista()
                let a,b,c,d,e,f = ''
                for(let j = 0; j<resposta.count;j++){
                    a = '<div class="prod" id="'+j+'">'
                    b = '<h3 class = "prod-t">'+resposta.rows[j].name+'</h3>'
                    c = '<h4 class = "prod-q">Disponível: '+resposta.rows[j].qtd+' un.</h4>'
                    d = '<h4 class = "prod-p">R$ '+resposta.rows[j].price+'</h4>'
                    e = '<button class = "buy" id="b-'+j+'" type="button">Buy</button>'
                    f = '</div><div class = space><div>'
                    
                    //espaçamento correto entre items
                    let aux = (resposta.count-(j+1))
                        if (aux < (resposta.count%4) && aux != 0){
                            console.log
                            console.log('id: '+(j+1)+' aux:'+aux)
                            f = '</div><div class = space style="max-width:4.8%"><div>'
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