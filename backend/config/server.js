var port;

port = process.env.FN_PORT || process.env.PORT || 8080;

module.exports = {
    port: port 
}