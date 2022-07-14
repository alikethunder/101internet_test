const Tariff = require('../models/tariff-model')

upsertTariffs = (req, res) => {

    const [prices, internets, tvs, hdtvs] = [[], [], [], []];
    const tariffPromises = [];

    let tariffs = req.body.map((tariff, i, a) => {

        prices.push(Number(tariff.displayPrice || 0));
        internets.push(Number(tariff.internet?.speed_in) || 0);
        tvs.push(Number(tariff.tv?.channels || 0));
        hdtvs.push(Number(tariff.tv?.channels_hd || 0));

        return {
            providerId: tariff.provider.id,
            tariffId: tariff.id,
            name: tariff.name,
            price: {
                value: tariff.displayPrice,
                color: ''
            },
            internet: {
                value: tariff.internet?.speed_in || 0,
                color: ''
            },
            tv_channels: {
                value: tariff.tv?.channels || 0,
                color: ''
            },
            tv_channels_hd: {
                value: tariff.tv?.channels_hd || 0,
                color: ''
            },
            fields: Number(Boolean(tariff.displayPrice))
                + Number(Boolean(tariff.internet?.speed_in || false))
                + Number(Boolean(tariff.tv?.channels || false))
                + Number(Boolean(tariff.tv?.channels_hd || false))
        }
    });

    const bestPrice = Math.min(...prices);
    const bestInternet = Math.max(...internets);
    const bestTv = Math.max(...tvs);
    const bestTvHd = Math.max(...hdtvs);
    
    const moreThanOnePrice = tariffs.filter(tariff => tariff.price.value == bestPrice).length > 1;
    const moreThanOneInternet = tariffs.filter(tariff => tariff.internet.value == bestInternet).length > 1;
    const moreThanOneTv = tariffs.filter(tariff => tariff.tv_channels.value == bestTv).length > 1;
    const moreThanOneTvHd = tariffs.filter(tariff => tariff.tv_channels_hd.value == bestTvHd).length > 1;


    const promises = tariffs.map(tariff => {
        tariff.price.color = (tariff.price.value == bestPrice) ? (moreThanOnePrice ? 'blue' : 'green') : '';
        tariff.internet.color = tariff.internet.value == bestInternet ? (moreThanOneInternet ? 'blue' : 'green') : '';
        tariff.tv_channels.color = tariff.tv_channels.value == bestTv ? (moreThanOneTv ? 'blue' : 'green') : '';
        tariff.tv_channels_hd.color = tariff.tv_channels_hd.value == bestTvHd ? (moreThanOneTvHd ? 'blue' : 'green') : '';


        let t = new Tariff(tariff);

        if (!t) {
            return res.status(400).json({ success: false, error: err })
        }

        return t.save();

    });
    Promise.all(promises)
        .then(() => {
            return res.status(201).json({
                success: true,
                data: {}
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Movie not created!',
            })
        });
}

getTariffs = async (req, res) => {
    
    const providerId = Number(req.params.providerId);

    await Tariff.find({providerId}, (err, tariffs)=>{
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!tariffs) {
            return res
                .status(404)
                .json({ success: false, error: `tariffs not found` })
        }

        return res.status(200).json({ success: true, data: tariffs })
    })
    .catch(err => console.log(err))
}

module.exports = {
    upsertTariffs,
    getTariffs
}