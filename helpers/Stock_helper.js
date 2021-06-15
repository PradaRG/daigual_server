const Historial = require("../modelos/historial.model");
const Stock = require("../modelos/stock.model");



async function reducirStock(ProductoId, cantidad, ItemVentaId) {
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
                if (!created) {
                    console.log('historial', historial);
                    historial.cantidad = cantidad + sustraccion
                    await historial.save();
                    const nuevoValor = stock.cantidad - sustraccion;
                    stock.cantidad = nuevoValor;
                    await stock.save();
                    sustraccion = 0;
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
}

async function revertirStock() {

}


module.exports = { reducirStock, revertirStock };