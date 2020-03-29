import 'dotenv/config';
import pipeDriveApi from '../../services/PipeDrive';
import blingApi from '../../services/Bling';
import objectToXML from 'object-to-xml';

class SyncDeals {
    constructor() {
        this.handle();
    }

    async handle() {
        //won deals with products associated
        const deals = await this.getPipeDriveDeals();
        const XMLDeals = this.parseDealsToXML(deals);
        this.addBlingPurchaseOrder(XMLDeals);
    }

    async getPipeDriveDeals() {
        try {
            const {
                data: { data: deals },
            } = await pipeDriveApi.get('deals', {
                params: {
                    api_token: process.env.PIPEDRIVE_API_KEY,
                    status: 'won',
                },
            });

            //get deals products
            return await Promise.all(
                deals
                    .filter(deal => {
                        //check if deal has products associated
                        return deal.products_count > 0;
                    })
                    .map(async deal => {
                        deal.products = await this.getDealProducts(deal);
                        return deal;
                    })
            );
        } catch (error) {
            console.error("Couldn't reach PipeDrive API");
        }
    }

    async getDealProducts(deal) {
        try {
            const {
                data: { data: products },
            } = await pipeDriveApi.get(`deals/${deal.id}/products`, {
                params: {
                    api_token: process.env.PIPEDRIVE_API_KEY,
                },
            });

            return products;
        } catch (error) {
            console.error("Couldn't reach PipeDrive API");
            return [];
        }
    }

    parseDealsToXML(deals) {
        //got only essential data to generate xml
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

    async addBlingPurchaseOrder(XMLDeals) {
        await Promise.all(
            XMLDeals.map(async XMLDeal => {
                try {
                    await blingApi.post(`pedido/json`, null, {
                        params: {
                            apikey: process.env.BLING_API_KEY,
                            xml: XMLDeal,
                        },
                    });
                } catch (error) {
                    console.error("Couldn't reach Bling API");
                }
            })
        );
    }
}

export default new SyncDeals();
