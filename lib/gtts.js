solicitação const = requer ('solicitação');
 const escapeStringRegexp = require ('escape-string-regexp');
 const async = require ('async');
 const fs = require ('fs');
 const MultiStream = require ('multistream');
 const fakeUa = require ('fake-useragent');

 const GOOGLE_TTS_URL = 'http://translate.google.com/translate_tts';
 const MAX_CHARS = 100;
 const LANGUAGES = {
   'af': 'Afrikaans',
   'sq': 'albanês',
   'ar': 'árabe',
   'hy': 'armênio',
   'ca': 'Catalão',
   'zh': 'chinês',
   'zh-cn': 'chinês (mandarim / China)',
   'zh-tw': 'chinês (mandarim / Taiwan)',
   'zh-yue': 'chinês (cantonês)',
   'hr': 'croata',
   'cs': 'checo',
   'da': 'Dinamarquês',
   'nl': 'holandês',
   'en': 'Inglês',
   'en-au': 'Inglês (Austrália)',
   'en-uk': 'Inglês (Reino Unido)',
   'en-us': 'Inglês (Estados Unidos)',
   'eo': 'Esperanto',
   'fi': 'finlandês',
   'fr': 'francês',
   'de': 'Alemão',
   'el': 'grego',
   'ht': 'crioulo haitiano',
   'oi': 'Hindi',
   'hu': 'húngaro',
   'é': 'islandês',
   'id': 'indonésio',
   'it': 'italiano',
   'ja': 'Japonês',
   'ko': 'coreano',
   'la': 'latim',
   'lv': 'letão',
   'mk': 'macedônio',
   'não': 'norueguês',
   'pl': 'polonês',
   'pt': 'português',
   'pt-br': 'Português (Brasil)',
   'ro': 'romeno',
   'ru': 'Russo',
   'sr': 'sérvio',
   'sk': 'eslovaco',
   'es': 'espanhol',
   'es-es': 'espanhol (Espanha)',
   'es-us': 'espanhol (Estados Unidos)',
   'sw': 'Swahili',
   'sv': 'sueco',
   'ta': 'Tamil',
   'th': 'tailandês',
   'tr': 'turco',
   'vi': 'vietnamita',
   'cy': 'galês'
 }

 function Text2Speech (_lang, _debug) {
   var lang = _lang ||  'en';
   var debug = _debug ||  falso;
   lang = lang.toLowerCase ();

   if (! LANGUAGES [lang])
     lançar um novo erro ('Idioma não suportado:' + idioma);

   var getArgs = getArgsFactory (idioma);

   Retorna {
     tokenize: tokenize,
     createServer: (port) => createServer (getArgs, port),
     fluxo: (texto) => fluxo (getArgs, texto),
     salvar: (caminho do arquivo, texto, retorno de chamada) => salvar (getArgs, caminho do arquivo, texto, retorno de chamada)
   }
 }

 function save (getArgs, filepath, text, callback) {
   var text_parts = tokenize (texto);
   var total = text_parts.length;
   async.eachSeries (text_parts, function (part, cb) {
     var index = text_parts.indexOf (part);
     var headers = getHeader ();
     var args = getArgs (parte, índice, total);
     var fullUrl = GOOGLE_TTS_URL + args;

     var writeStream = fs.createWriteStream (filepath, {
       sinalizadores: índice> 0?  'a': 'w'
     });
     solicitação({
         uri: fullUrl,
         cabeçalhos: cabeçalhos,
         método: 'GET'
       })
       .pipe (writeStream);
     writeStream.on ('terminar', cb);
     writeStream.on ('erro', cb);
   }, ligar de volta);
 }

 fluxo de função (getArgs, texto) {
   var text_parts = tokenize (texto);
   var total = text_parts.length;

   return MultiStream (text_parts.map (function (part, index) {
     var headers = getHeader ();
     var args = getArgs (parte, índice, total);
     var fullUrl = GOOGLE_TTS_URL + args

     pedido de retorno ({
       uri: fullUrl,
       cabeçalhos: cabeçalhos,
       método: 'GET'
     });
   }));
 }

 function getHeader () {
   var headers = {
     "User-Agent": fakeUa ()
   };
   //console.log('headers ', headers);
   retornar cabeçalhos;
 }

 function getArgsFactory (lang) {
   função de retorno (texto, índice, total) {
     var textlen = text.length;
     var encodedText = encodeURIComponent (texto);
     var language = lang ||  'en';
     return `? ie = UTF-8 & tl = $ {language} & q = $ {encodedText} & total = $ {total} & idx = $ {index} & client = tw-ob & textlen = $ {textlen}`
   }
 }

 tokenize de função (texto) {
   var text_parts = [];
   if (! texto)
     lance um novo erro ('Sem texto para falar');

   var punc = '¡! () [] ¶; | ° • - «» ≤≥ «» ‹› \ n';
   var punc_list = punc.split (''). map (função (char) {
     return escapeStringRegexp (char);
   });

   var pattern = punc_list.join ('|');
   var parts = text.split (novo RegExp (padrão));
   partes = partes.filtro (p => p.length> 0);

   var output = [];
   var i = 0;
   para (deixe p de partes) {
     if (! output [i]) {
       saída [i] = '';
     }
     if (saída [i] .length + p.length <MAX_CHARS) {
       saída [i] + = '' + p;
     } outro {
       i ++;
       saída [i] = p;
     }
   }
   saída [0] = saída [0] .substr (1);
   saída de retorno;
 }

 function createServer (getArgs, port) {
   var http = requer ("http");
   var url = requer ('url');

   var server = http.createServer (função (req, res) {
     var queryData = url.parse (req.url, true) .query;
     var argsCallback = getArgs;
     if (queryData && queryData.lang && LANGUAGES [queryData.lang]) {
       argsCallback = getArgsFactory (queryData.lang);
     }
     if (queryData && queryData.text) {
       res.writeHead (200, {'Content-Type': 'audio / mpeg'});
       stream (argsCallback, queryData.text) .pipe (res);
     } outro {
       console.log (req.headers);
       res.writeHead (200, {'Content-Type': 'application / json'});
       res.end (JSON.stringify ({
         código: -1,
         mensagem: `Falta texto.  Por favor, tente: $ {req.headers.host}? Text = your + text`
       }))
     }
   });

   server.listen (porta);
   console.log ("Servidor Text-to-Speech em execução" + porta);
 }

 module.exports = Text2Speech;