let loginService = {
    login: async function(username, password){
        const data = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json', 
            },
            body: JSON.stringify({username: username, password: password})
        }
        const resposta = await fetch('/login', data)
        return await resposta.json()
    },
    subscribe:async function(username, password){
        const data = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password})
        }
        const resposta = await fetch('/login/subscribe', data)
        return await resposta.json()
    },
    nextPage: async function(){
        /*
        const data = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json', 
                'Authorization': 'Bearer ' + token
            },
        }
        const url = '/user';
      
        await fetch(url, data);
        */
        window.location.href = "/"
        //return await fetch('/user', data)
    }
}

export default loginService