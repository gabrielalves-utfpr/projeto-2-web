let homeService = {
    goToLogin: ()=>{
        window.location.href = "/login"
    },
    buy: async (id, auth) => {
        const dataPUT = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json', 
                'Authorization': 'Bearer ' + auth
            },
        }
        let data
        try {
            const resp = await fetch('/product/buy?id='+id+'&qtd=1', dataPUT)
            data = await resp.json()
            
        } catch (error) {
            return false
        }
        return data.status
    }
}

export default homeService