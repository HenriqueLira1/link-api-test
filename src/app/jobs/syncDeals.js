import 'dotenv/config';
import pipeDriveApi from '../../services/PipeDrive';

class SyncDeals {
    constructor() {
        this.handle();
    }

    async handle() {
        const pipeDriveDeals = await this.getPipeDriveDeals();
        console.log(pipeDriveDeals);

        // pipeDriveDeals.map(deal => {
        //     console.log(typeof deal.products_count);
        //     console.log(deal.products_count > 0);
        // });
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
            return deals.filter(deal => {
                //check if deal has products associated
                if (deal.products_count > 0) {
                }
            });
        } catch (error) {
            console.error("Couldn't reach PipeDrive API");
        }
    }
}

export default new SyncDeals();
