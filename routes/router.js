const express = require('express');
const router = express.Router();
const searchAccommodations = require('../services/BrowserService.js');

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

router.post('/search', async (req, res) => {
    const { checkin, checkout } = req.body;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!checkin || !checkout) {
        return res.status(400).json({ error: 'Checkin e Checkout são obrigatórios.' });
    }

    if (!datePattern.test(checkin)) {
        return res.status(400).json({ error: 'Formato inválido para checkin. Use AAAA-MM-DD.' });
    }

    if (!datePattern.test(checkout)) {
        return res.status(400).json({ error: 'Formato inválido para checkout. Use AAAA-MM-DD.' });
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (checkinDate >= checkoutDate) {
        return res.status(400).json({ error: 'A data de Check-out deve ser posterior à data de Check-in.' });
    }
    
    try {
        const accommodations = await searchAccommodations(checkin, checkout);

        const amount = accommodations.length;

        let message;

        if (amount === 0) {
            message = `Nenhuma acomodação encontrada`;
        } else if (amount === 1) {
            message = `${amount} acomodação encontrada`;
        } else {
            message = `${amount} acomodações encontradas`;
        }

        res.status(200).json({
            message: message,
            data: accommodations
        });

    } catch (error) {
        res.status(500).end('Erro ao buscar acomodações.'); 
    }
});

module.exports = router;
