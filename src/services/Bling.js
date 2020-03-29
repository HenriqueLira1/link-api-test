import axios from 'axios';
import 'dotenv/config';

const blingApi = axios.create({
    baseURL: 'https://bling.com.br/Api/v2/',
});

export default blingApi;

export async function createPurchaseOrder(deals) {
    await Promise.all(
        deals.map(async deal => {
            try {
                await blingApi.post(`pedido/json`, null, {
                    params: {
                        apikey: process.env.BLING_API_KEY,
                        xml: deal,
                    },
                });
            } catch (error) {
                console.error("Couldn't reach Bling API");
            }
        })
    );
}
