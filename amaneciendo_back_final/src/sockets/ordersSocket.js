module.exports = (io) => {

    const namespace = io.of('/orders/delivery');

    namespace.on('connection', (socket) => {
        console.log('UN CLIENTE SE CONECTO A SOCKET IO -> /orders/delivery');

        socket.on('position', (data) => {
            console.log('CLIENTE EMITIO: ', data);
            namespace.emit(`position/${data.id_estanco}`, { id_estanco: data.id_estanco, lat: data.latitud, lng: data.longitud })
        });

        socket.on('disconnect', (data) => {
            console.log('UN CLIENTE SE DESCONECTO DE SOCKET IO');
        })
    })

}