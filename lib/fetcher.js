const fetch = require ('node-fetch')
 const fs = require ('fs')

 exportações.getBase64 = getBase64 = async (url) => {
     const response = await fetch (url, {headers: {'User-Agent': 'okhttp / 4.5.0'}});
     if (! response.ok) lança novo erro (`resposta inesperada $ {response.statusText}`);
     buffer const = espera resposta.buffer ();
     const videoBase64 = `data: $ {response.headers.get ('content-type')}; base64,` + buffer.toString ('base64');
     if (buffer)
         return videoBase64;
 };

 exportações.getBuffer = getBuffer = async (url) => {
 const res = await fetch (url, {headers: {'User-Agent': 'okhttp / 4.5.0'}, método: 'GET'})
 const anu = fs.readFileSync ('./ src / emror.jpg')
 if (! res.ok) return {type: 'image / jpeg', result: anu}
 const buff = await res.buffer ()
 if (buff)
 return {type: res.headers.get ('content-type'), result: buff}
 }

 exportações.fetchJson = fetchJson = (url, opções) => nova promessa (assíncrono (resolver, rejeitar) => {
     buscar (url, opções)
         .então (resposta => resposta.json ())
         .então (json => {
             // console.log (json)
             resolver (json)
         })
         .catch ((err) => {
             rejeitar (errar)
         })
 })


 exportações.fetchText = fetchText = (url, opções) => nova promessa (async (resolver, rejeitar) => {
     buscar (url, opções)
         .então (resposta => response.text ())
         .então (texto => {
             // console.log (texto)
             resolver (texto)
         })
         .catch ((err) => {
             rejeitar (errar)
         })
 })

 //exports.getBase64 = getBase64;