import {default as login} from "./loginService.js";

document.getElementById("sign-in").addEventListener("click", async (evt) =>{
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login.login(username, password).then( async resp => {
        if (resp.status == true) {
            localStorage.setItem('auth', resp.token)
            await login.nextPage()
        } else {
            document.getElementById('erro-mensagem').style = "display:block;"
            document.getElementById('erro-mensagem').innerText = resp.message
        }
    }).catch(err =>{
        document.getElementById('erro-mensagem').style = "display:block;"
        document.getElementById('erro-mensagem').innerText = "Falha ao conectar com o servidor"
    })
})

document.getElementById("sign-up").addEventListener("click", async (evt) =>{
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login.subscribe(username, password).then( async resp => {
        if (resp.status == true) {
            localStorage.setItem('auth', resp.token)
            await login.nextPage()
        } else {
            document.getElementById('erro-mensagem').style = "display:block;"
            document.getElementById('erro-mensagem').innerText = resp.message
        }
    }).catch(err =>{
        document.getElementById('erro-mensagem').style = "display:block;"
        document.getElementById('erro-mensagem').innerText = "Falha ao conectar com o servidor"

    })
})