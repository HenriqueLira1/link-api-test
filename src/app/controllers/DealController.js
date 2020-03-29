import Deal from '../schemas/Deal';

class DealController {
    async index(req, res) {
        const deals = await Deal.find({});

        return res.json(deals);
    }
}

export default new DealController();
