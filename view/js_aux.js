import {default as home} from "./homeService.js";

document.getElementById('log-out').addEventListener("click", (evt) =>{
    localStorage.removeItem('auth')
    home.goToLogin()
})

window.onload = ()=>{
    localStorage.setItem('auth', '')
    document.getElementById('username').innerText = "carlos"
    let auth = localStorage.getItem('auth')
    if(auth == null){
        console.log('here')
        document.getElementById('ap').style = "display: flex;flex-direction: column;"
        let title = '<h2 class ="title">Acesso Negado</h2>'
        let sub = '<h4 class ="title" style = "font-size: 26px;">Redirecionando para Tela de Login</h4>'
        document.getElementById('ap').innerHTML = (title+sub)
        setTimeout(()=>{
            home.goToLogin()
        }, 3000)
        }
}
