const puppeteer = require('puppeteer');

async function searchAccommodations(checkIn, checkOut) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const url = `https://reservations.fasthotel.me/188/214?entrada=${checkIn}&saida=${checkOut}&adultos=1#acomodacoes`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    try {
        await page.waitForSelector('.row.borda-cor[data-codigo]', { timeout: 60000 });
    } catch (error) {
        console.error('Nenhuma acomodação encontrada.', error);
        await browser.close();
        return [];
    }

    const accommodationsData = await page.evaluate(() => {
        const accommodationsBlock = document.querySelectorAll('.row.borda-cor[data-codigo]');
        const accommodations = [];

        accommodationsBlock.forEach(accommodation => {
            const name = accommodation.querySelector('.texto-expansivel h3[data-campo="titulo"]');
            const description = accommodation.querySelector('.quarto.descricao');
            const price = accommodation.querySelector('div[data-campo="tarifas"] b[data-campo="valor"]');
            const image = accommodation.querySelector('a[data-fancybox="images"]');

            if (price) {
                accommodations.push({
                    name: name ? name.textContent.trim() : null,
                    description: description ? description.textContent.trim() : null,
                    price: price ? price.textContent.trim() : null,
                    image: image ? image.href : null
                })
            }
                
        })

        return accommodations;
    });

    await browser.close(); 
    return accommodationsData;
}

module.exports = searchAccommodations;
