import axios from 'axios';
import 'dotenv/config';

const pipeDriveApi = axios.create({
    baseURL: 'https://api.pipedrive.com/v1/',
});

export default pipeDriveApi;

export async function getDealProducts(deal) {
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

export async function getDeals() {
    try {
        const {
            data: { data: deals },
        } = await pipeDriveApi.get('deals', {
            params: {
                api_token: process.env.PIPEDRIVE_API_KEY,
                status: 'won',
            },
        });

        // get products
        return await Promise.all(
            deals
                .filter(deal => {
                    // check if deal has products associated
                    return deal.products_count > 0;
                })
                .map(async deal => {
                    deal.products = await getDealProducts(deal);
                    return deal;
                })
        );
    } catch (error) {
        console.error("Couldn't reach PipeDrive API");
        return [];
    }
}
