import {default as login} from "./loginService";

document.getElementById("sign-in").addEventListener("click", async (evt) =>{
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    login.login(username, password).then(resp => {
        if (resp.status == true){
            localStorage.setItem('auth', resp.token)
            login.nextPage(resp.token)
        } else {
            document.getElementById('erro-mensagem').style = "display:block;"
            document.getElementById('erro-mensagem').innerText = resp.message
        }
    }).catch(err =>{
        document.getElementById('erro-mensagem').style = "display:block;"
        document.getElementById('erro-mensagem').innerText = "Falha ao conectar com o servidor"

    })
})