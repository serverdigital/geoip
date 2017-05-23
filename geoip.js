/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cmd=require('node-cmd');
var geoIpData = "GeoIP Country Edition: CL, Chile\nGeoIP City Edition, Rev 1: CL, 12, Region Metropolitana, Santiago, N/A, -33.462502, -70.668198, 0, 0\nGeoIP ASNum Edition: AS11340 Red Universitaria Nacional\n";

//var cmdLine = function(command, params, callback) {
//    cmd.get(
//            command + ' ' + params,
//            function(err,data,stderr) {
//                callback(data);
//            }
//    );  
//};
//
//cmdLine('echo','ip',function(command, params) {
//    console.log(command, params);
//});

/**
 * Función readCmdLine que permite la lectura del resultado
 * de la ejecución de un  comando en shell del sistema operativo
 * @param {string} command
 * @param {string} params
 * @param {function} callback
 * @returns {undefined}
 */
function readCmdLine(command, params,callback) { 
    cmd.get(
        command + ' ' + params,
        function(err,data,stderr) {                          
            console.log('the command "' + command + '" with param "'+ params + '" results:\n\n',data);
            if(command == 'geoiplookup')                
                return callback(clearGeoIpData(data));           
            else
                return callback(genericResponse(data));
        }
    );
}

function setDataResponse ( param, response ) {
    dataResponse = param;
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write( dataResponse + '\n');
    response.end();
}

function setDataNull ( param, response) {
    dataResponse = param;
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.write( dataResponse + '\n');
    response.end();
}



function setCabecera(dataResult, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(dataResult + '\n');
    //res.end();      
}

function readGeoIpData(dataRequest, res, readCmdLine) {
    //var chunk = dataRequest.split('/');
    //var cmdLineResult = null;   
    //setCabecera(dataRequest, res);
}

function clearGeoIpData(paramData) {
    paramArray = new Array();
    paramData = paramData.split(/\n/);
    paramData.forEach( function(value) {      
        if(value !== '')
            paramArray.push(value); 
        //console.log(value);
    });
    paramData = paramArray.toString();
    paramData = { "dataResponse" :  paramArray };
    var jsonData = JSON.stringify(paramData);    
    return jsonData;
}

function genericResponse(paramData) {
    paramData = { "dataResponse": paramData };
    var jsonData = JSON.stringify(paramData);
    return jsonData;
}

exports.readCmdLine = readCmdLine;
exports.readGeoIpData = readGeoIpData;
exports.setCabecera = setCabecera;
exports.setDataNull = setDataNull;
exports.setDataResponse = setDataResponse;
exports.clearGeoIpData = clearGeoIpData;