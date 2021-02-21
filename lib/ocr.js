const exec = require ("child_process"). exec
 const log = console.debug

 função reconhecer (nome do arquivo, config = {}) {
   opções const = getOptions (config)
   const binary = config.binary ||  "tesseract"

   comando const = [binário, `" $ {nome do arquivo} "`, "stdout", ... opções] .join ("")
   if (config.debug) log ("comando", comando)

   retornar nova promessa ((resolver, rejeitar) => {
     exec (comando, (erro, stdout, stderr) => {
       if (config.debug) log (stderr)
       se (erro) rejeitar (erro)
       resolver (stdout)
     })
   })
 }

 function getOptions (config) {
   const ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"]

   return Object.entries (config)
     .map (([chave, valor]) => {
       if (["debug", "presets", "binary"]. includes (key)) return
       if (key === "lang") return `-l $ {value}`
       if (ocrOptions.includes (key)) return `- $ {key} $ {value}`

       return `-c $ {key} = $ {value}`
     })
     .concat (config.presets)
     .filter (booleano)
 }

 module.exports = {
   reconhecer,
 }