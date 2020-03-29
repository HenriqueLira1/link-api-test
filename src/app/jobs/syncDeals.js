import 'dotenv/config';
import Mongoose from 'mongoose';
import objectToXML from 'object-to-xml';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import '../../database';
import { getDeals } from '../../services/PipeDrive';
import DealSchema from '../schemas/Deal';
import { createPurchaseOrder } from '../../services/Bling';

class SyncDeals {
    constructor() {
        this.handle();
    }

    async handle() {
        // get won deals with products associated
        const deals = await getDeals();
        const XMLDeals = this.parseDealsToXML(deals);
        await createPurchaseOrder(XMLDeals);
        await this.persistDeals(deals);
    }

    parseDealsToXML(deals) {
        // got only essential data to generate xml
        return deals.map(deal => {
            return objectToXML({
                raiz: {
                    pedido: {
                        cliente: {
                            nome: deal.person_name,
                        },
                        itens: deal.products.map(product => {
                            return {
                                item: {
                                    codigo: product.product_id,
                                    descricao: product.name,
                                    qtde: product.quantity,
                                    vlr_unit: product.item_price,
                                },
                            };
                        }),
                    },
                },
            });
        });
    }

    async persistDeals(deals) {
        await Promise.all(
            deals.map(async deal => {
                const wonTime = parseISO(deal.won_time);

                // search for existing deals collection
                const dealsCollection = await DealSchema.findOne({
                    date: {
                        $gte: startOfDay(wonTime),
                        $lt: endOfDay(wonTime),
                    },
                });

                // if there are matching deals collection, attach deal
                if (dealsCollection) {
                    // check if deal has already been saved
                    const isDealSaved = dealsCollection.deals.find(
                        currentDeal => currentDeal.id === deal.id
                    );

                    if (!isDealSaved) {
                        await dealsCollection.updateOne({
                            deals: [...dealsCollection.deals, deal],
                            total_value:
                                Number(deal.value) +
                                dealsCollection.total_value,
                        });
                    }
                } else {
                    // if there are no matching deals collection, create a new one
                    DealSchema.create({
                        date: wonTime,
                        deals: [deal],
                        total_value: Number(deal.value),
                    });
                }
            })
        );
        Mongoose.connection.close();
    }
}

export default new SyncDeals();
