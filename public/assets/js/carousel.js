/**
 * Planes de Spa: tarjetas responsive con flip al hacer clic (sin carrusel).
 */
const PLANS_DATA = [
    {
        name: "DIAMANTE",
        focus: "Para todo tipo de raza",
        price: "$57.000 - $110.000",
        features: [
            "Masaje relajante",
            "Shampoo desmugrante e hidratante",
            "Mascarilla",
            "Corte y limado de uñas",
            "Limpieza oídos/dental",
            "Hidratación huellas",
            "Perfume, Corbatín/Accesorios",
            "Snack y Foto"
        ]
    },
    {
        name: "DIAMANTE PREMIUM",
        focus: "Experiencia de lujo (Hidratación Capilar)",
        price: "$62.000 - $125.000",
        features: [
            "Aromaterapia",
            "Shampoo según color",
            "Hidratación huellas y nariz",
            "Secado automático",
            "Perfume alta duración",
            "Pañoleta de lujo",
            "Kit snacks amigos"
        ]
    },
    {
        name: "REINA KERATINA",
        focus: "Solo manto largo",
        price: "$74.000 - $89.000",
        features: [
            "Keratina mascarilla reparadora",
            "Spray alisante",
            "Shampoo según color",
            "Hidratación completa",
            "Secado automático",
            "Pañoleta de lujo"
        ]
    }
];

export class Carousel {
    async init() {
        const container = document.querySelector('.plans-grid');
        if (!container) return;

        let templateHtml = '';
        try {
            const r = await fetch('/src/components/card-plan.html');
            if (r.ok) templateHtml = await r.text();
        } catch (_) {}
        if (!templateHtml) {
            try {
                const r = await fetch('../src/components/card-plan.html');
                if (r.ok) templateHtml = await r.text();
            } catch (_) {}
        }
        if (!templateHtml) return;

        const cardsHtml = PLANS_DATA.map(plan => {
            const featuresHtml = plan.features.map(f => `<li>${f}</li>`).join('');
            return templateHtml
                .replace(/{{name}}/g, plan.name)
                .replace('{{focus}}', plan.focus)
                .replace('{{price}}', plan.price)
                .replace('{{features}}', featuresHtml);
        }).join('');

        container.innerHTML = cardsHtml;
    }
}
