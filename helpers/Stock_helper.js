const Historial = require("../modelos/historial.model");
const Stock = require("../modelos/stock.model");



async function reducirStock(ProductoId, cantidad, ItemVentaId) {
    try {
        const stocks = await Stock.findAll({
            where: {
                ProductoId
            }
        });

        let sustraccion = cantidad;
        stocks.forEach(async (stock) => {
            if (sustraccion === 0) return;
            if (stock.cantidad > 0) {
                if (stock.cantidad > sustraccion) {
                    // Si hay mas productos en stock de los necesarios
                    const [historial, created] = await Historial.findOrCreate({
                        where: {
                            ItemVentaId,
                            StockId: stock.id
                        },
                        defaults: {
                            cantidad,
                            ItemVentaId,
                            StockId: stock.id
                        }
                    });
                    const nuevoValor = stock.cantidad - sustraccion;
                    if (!created) {
                        console.log('historial', historial);
                        historial.cantidad = cantidad + sustraccion
                        await historial.save();
                        stock.cantidad = nuevoValor;
                        await stock.save();
                        sustraccion = 0;
                    } else {
                        stock.cantidad = nuevoValor;
                        stock.save();
                    }
                } else {
                    // Si hay menos productos en este stock de los que necesito
                    const [historial, created] = await Historial.findOrCreate({
                        where: {
                            ItemVentaId,
                            StockId: stock.id
                        },
                        defaults: {
                            cantidad: stock.cantidad,
                            ItemVentaId,
                            StockId: stock.id
                        }
                    })
                    if (!created) {
                        historial.cantidad = stock.cantidad;
                        await historial.save();
                        sustraccion -= stock.cantidad;
                    }

                    stock.cantidad = 0;
                    await stock.save();
                }
            }
        });
    } catch (error) {
        console.log('Stock_helper linea 64', error);
    }

}

async function revertirStock(ItemsVenta) {
    try {
        ItemsVenta.forEach(item => { // Por cada ItemVenta busca los historiales asociados
            Historial.findAll({ where: { ItemVentaId: item.id } })
                .then(historiales => {
                    historiales.forEach(historial => { //Por cada uno de los historiales encontrados busca el stock y lo actualiza
                        Stock.findByPk(historial.StockId)
                            .then(stock => {
                                stock.update({
                                    cantidad: stock.cantidad + historial.cantidad
                                })
                                    .then(exito => historial.destroy({ force: true }))
                                    .catch(err => console.log(err));
                            });
                    })
                }).catch(err => console.log(err));
        });
    } catch (error) {
        console.log('Stock_helper linea 77', error);
    }
}


module.exports = { reducirStock, revertirStock };