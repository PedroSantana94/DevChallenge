const fs = require('fs');
const csv = require('fast-csv');
const validator = require('validator');

let dados = [];

function getDados(objeto){
    var header = objeto[Object.keys(objeto)[0]];
    var objs = [];
        
    for (let index = 1; index < objeto.length; index++) {    
    var obj = {};
    header.forEach((v, i) => {
        obj[v] = objeto[index][i];
    });
        objs.push(obj);
    }
    return objs;
}

function retornaNumero (phone){
    var telefone = phone.replace('(', '');
    var telefone = telefone.replace(')', '');
    var telefone = telefone.replace(' ', '');
    var telefone = '55' + telefone;

    if (telefone.length >= 12 && telefone.length <= 13){
        return telefone;
    } else {
        return 0;
    }
}


fs.createReadStream('input.csv')
    .pipe(csv())
    .on('data', function(linhas){
        dados.push(linhas);
    })
    .on('end', function(){
        var objetoCompleto = getDados(dados);

        for (var key in objetoCompleto) {
            var keyJson = objetoCompleto[key];       
        }
            var nomes = Object.keys(keyJson);
            
        var arrayOut = [];

        for (let index = 0; index < objetoCompleto.length; index++) {
        
            var objOut = {};
            var objAux = {};
            var aux = [];
            objOut['fullname'] = objetoCompleto[index][nomes[0]]; 
            objOut['eid'] = objetoCompleto[index][nomes[1]];
            objOut['classes'] = objetoCompleto[index][nomes[2]].split(',');
            
            objOut['addresses'] = [];

            aux['emailPai'] = nomes[3].split(' ');

            //console.log(objetoCompleto[index][nomes[3]].split('/')[0]);

            objetoCompleto[index][nomes[3]] = objetoCompleto[index][nomes[3]].split('/')[0];

            if (objetoCompleto[index][nomes[3]] != '' && validator.isEmail(objetoCompleto[index][nomes[3]]) == true){
            objAux['addressesEmailPai'] = [{"type": aux['emailPai'][0], "tag": [aux['emailPai'][1].replace(',',''), aux['emailPai'][2]], "address": objetoCompleto[index][nomes[3]]}];
            objOut['addresses'].push(objAux['addressesEmailPai']);
            }

            aux['phonePai'] = nomes[4].split(' ');
            if (objetoCompleto[index][nomes[4]] != '' && retornaNumero(objetoCompleto[index][nomes[4]]) != 0){
            objAux['addressesPhonePai'] = [{ "type": aux['phonePai'][0], "tag": [aux['phonePai'][1]], "address": retornaNumero(objetoCompleto[index][nomes[4]])}];
            objOut['addresses'].push(objAux['addressesPhonePai']);
            }
            
            aux['phoneMae'] = nomes[5].split(' ');
            if (objetoCompleto[index][nomes[5]] != '' && retornaNumero(objetoCompleto[index][nomes[5]]) != 0){
            objAux['addressesPhoneMae'] = [{"type": aux['phoneMae'][0], "tag": [aux['phoneMae'][1].replace(',',''), aux['phoneMae'][2]], "address": retornaNumero(objetoCompleto[index][nomes[5]])}];
            objOut['addresses'].push(objAux['addressesPhoneMae']);
            }

            aux['emailMae'] = nomes[6].split(' ');
            if (objetoCompleto[index][nomes[6]] != '' && validator.isEmail(objetoCompleto[index][nomes[6]]) == true){
            objAux['addressesEmailMae'] = [{ "type": aux['emailMae'][0], "tag": [aux['emailMae'][1]], "address": objetoCompleto[index][nomes[6]]}];
            objOut['addresses'].push(objAux['addressesEmailMae']);
            }

            aux['emailAluno'] = nomes[7].split(' ');
            if (objetoCompleto[index][nomes[7]] != '' && validator.isEmail(objetoCompleto[index][nomes[7]]) == true){
            objAux['addressesEmailAluno'] = [{ "type": aux['emailAluno'][0], "tag": [aux['emailAluno'][1]], "address": objetoCompleto[index][nomes[7]]}];
            objOut['addresses'].push(objAux['addressesEmailAluno']);
            }

            aux['phoneAluno'] = nomes[8].split(' ');
            if (objetoCompleto[index][nomes[8]] != '' && retornaNumero(objetoCompleto[index][nomes[8]]) != 0){
            objAux['addressesPhoneAluno'] = [{ "type": aux['phoneAluno'][0], "tag": [aux['phoneAluno'][1]], "address": retornaNumero(objetoCompleto[index][nomes[8]])}];
            objOut['addresses'].push(objAux['addressesPhoneAluno']);
            }

            objOut['invisible'] = (objetoCompleto[index][nomes[9]] == 0 || objetoCompleto[index][nomes[9]] == '') ? false : true;

            objOut['see_all'] = (objetoCompleto[index][nomes[10]] == 'no' || objetoCompleto[index][nomes[10]] == '') ? false : true;
         
            arrayOut.push(objOut);
        }
        
        var conteudoJson = JSON.stringify(arrayOut, null, 4);
        fs.writeFile("output.json", conteudoJson, 'utf-8', function(err){
            if(err){
                console.log('Ocorreu um erro!', err);
            }
            console.log("Arquivo criado com sucesso!");
        });
    });
