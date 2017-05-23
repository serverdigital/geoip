/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cmdmain=require('node-cmd');


const http = require('http');
var url = require('url');
var data = require('./geoip');
var command = 'echo';

const hostname = '0.0.0.0';
const port = 3000;

/*
 * Funcion anonima que ejecuta un comando en la shell
 * del sistema Operativo
 * @param string command
 * @param string params
 * @param function callback
 * @returns {undefined}
 */
var cmdLine = function(command, params, callback) {
    cmdmain.get(
            command + ' ' + params,
            function(err,data,stderr) {                    
                callback(data);                    
            }
    );
};

const server = http.createServer((req, res) => {
    
    
//    var geoIpData = "GeoIP Country Edition: CL, Chile\nGeoIP City Edition, Rev 1: CL, 12, Region Metropolitana, Santiago, N/A, -33.462502, -70.668198, 0, 0\nGeoIP ASNum Edition: AS11340 Red Universitaria Nacional\n";
//
//    geoIpData = geoIpData.replace(/\n/g,'');
//    
//    console.log(geoIpData.split(','));
    
    function requestReko (req,res) {
        var dataRequest = url.parse(req.url).pathname;    
        var ipv4 = null;
        var ipv6 = null;
        var datos = null;
        var dataResponse = null;      

        if(dataRequest != '/favicon.ico') {        
            console.log('#################');
            console.log(dataRequest);   //Solicitud realizada por el cliente
            console.log('#################');

            function setResponse (param) {                
                dataResponse = param;                
                console.log("callback setResponse(param);", param);                
                data.setDataResponse(dataResponse, res);
                return;
                //console.log("callback setResponse(dataResponse = param);", dataResponse);
            };
                        
            /*
             * Proceso de analisis del path recibido          
             */
            var chunk = dataRequest.split('/');

            chunk.forEach ( function(value)  {
                //console.log(value);            
                ipv4 = value.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
                ipv6 = value.match(/[0-9a-f]{2,4}\:[0-9a-f]{2,4}\:[0-9a-f]{2,4}\:[0-9a-f]{2,4}\:[0-9a-f]{2,4}\:[0-9a-f]{2,4}/);
                if( ipv4 != null) {
                    //console.log('Expresion Regular Match',ipv4[0]);
                    /*
                     * Llamada a variable que contine la funcion de callback que devuelve la
                     * informacion generada por la llamada a cmd.get(comando,callback)
                     */                                
                    return data.readCmdLine(command,ipv4[0],setResponse);                 
                    console.log('Este codigo nunca se ejecutara');

                }

                if( ipv6 != null) {
                    return data.readCmdLine('echo',ipv6[0],setResponse);
                    console.log('Este codigo nunca se ejecutara');
                }

                return false;
                console.log('Este codigo nunca se ejecutara');
            });
            
            if (ipv4 == null && ipv6 == null) {
                    dataResponse = { "dataResponse" : dataResponse };
                    data.setDataResponse(JSON.stringify(dataResponse), res);
            }
        }
    }
    
    requestReko(req,res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});