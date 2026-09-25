"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
require("dotenv/config");
const index_1 = require("../backend/src/db/index");
const schema_1 = require("./schema");
const CATEGORIES = [
    { name: "Rings", slug: "rings", image: null },
    { name: "Chains", slug: "chains", image: "/products/viper-chain-01.jpg" },
    { name: "Bracelets", slug: "bracelets", image: "/products/apex-crystal-cuff.jpg" },
    { name: "Pendants", slug: "pendants", image: "/products/eclipse-spike-pendant.jpg" },
    { name: "Biker Chains", slug: "biker-chains", image: null },
    { name: "Others", slug: "others", image: "/products/magnetic-noir-studs.jpg" },
];
const COLLECTIONS = [
    { name: "Signature", slug: "signature", description: "Our core essentials — timeless pieces designed to be worn every day." },
    { name: "Industrial", slug: "industrial", description: "Bold, structured, and unapologetically raw. Inspired by the architecture of machines." },
    { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to ZAVR — fresh designs, same premium quality." },
];
// Real product catalog. Most products have one image; a few have a gallery
// (multiple angles or a color variant shown as a second photo).
const SEED_PRODUCTS = [
    {
        name: "Apex Crystal Cuff", slug: "apex-crystal-cuff",
        description: "A sculptural open cuff set with a single crystal accent. Bold structure, quiet detail.",
        price: "2490", category: "bracelets", collection: "signature",
        material: "Stainless Steel with crystal inlay", dimensions: "Inner diameter: 65mm",
        featured: true, isNew: false, stock: 15,
        images: ["/products/apex-crystal-cuff.jpg"],
    },
    {
        name: "Eclipse Spike Pendant", slug: "eclipse-spike-pendant",
        description: "A dark, angular spike pendant on a fine chain. Minimal and sharp.",
        price: "1990", category: "pendants", collection: "industrial",
        material: "Stainless Steel, matte black finish", dimensions: "Pendant: 45mm, Chain: 55cm",
        featured: true, isNew: true, stock: 18,
        images: ["/products/eclipse-spike-pendant.jpg"],
    },
    {
        name: "Eterna Black Cuff", slug: "eterna-black-cuff",
        description: "A wide matte-black cuff with a smooth, uninterrupted silhouette.",
        price: "2290", category: "bracelets", collection: "signature",
        material: "Stainless Steel, matte black finish", dimensions: "Width: 22mm",
        featured: false, isNew: false, stock: 12,
        images: ["/products/eterna-black-cuff.jpg"],
    },
    {
        name: "Magnetic Noir Studs", slug: "magnetic-noir-studs",
        description: "Understated black stud pieces with a magnetic closure. A quiet statement.",
        price: "1590", category: "Others", collection: "signature",
        material: "Stainless Steel, matte black finish", dimensions: "Diameter: 10mm",
        featured: false, isNew: true, stock: 24,
        images: ["/products/magnetic-noir-studs.jpg"],
    },
    {
        name: "NOXEN Cuff", slug: "noxen-cuff",
        description: "An industrial-edged cuff with a raw, architectural profile.",
        price: "2390", category: "bracelets", collection: "industrial",
        material: "Stainless Steel, brushed finish", dimensions: "Width: 20mm",
        featured: false, isNew: false, stock: 10,
        images: ["/products/noxen-cuff.jpg"],
    },
    {
        name: "Noir Clover Bracelet", slug: "noir-clover-bracelet",
        description: "A clover-motif chain bracelet in matte black. Delicate detail with a bold finish.",
        price: "1890", category: "bracelets", collection: "signature",
        material: "Stainless Steel, matte black finish", dimensions: "Length: 19cm",
        featured: true, isNew: false, stock: 20,
        images: [
            "/products/noir-clover-bracelet-01.jpg",
            "/products/noir-clover-bracelet-02.jpg",
            "/products/noir-clover-bracelet-03.jpg",
        ],
    },
    {
        name: "Onyx Clover Bangle", slug: "onyx-clover-bangle",
        description: "A solid clover bangle in deep onyx black. Clean lines, minimal styling.",
        price: "2190", category: "bracelets", collection: "signature",
        material: "Stainless Steel, matte black finish", dimensions: "Inner diameter: 60mm",
        featured: false, isNew: false, stock: 14,
        images: ["/products/onyx-clover-bangle.jpg"],
    },
    {
        name: "Onyx Link Bracelet", slug: "onyx-link-bracelet",
        description: "A structured link bracelet in black, built for everyday wear.",
        price: "1990", category: "bracelets", collection: "signature",
        material: "Stainless Steel, matte black finish", dimensions: "Length: 20cm",
        featured: false, isNew: true, stock: 16,
        images: ["/products/onyx-link-bracelet.jpg"],
    },
    {
        name: "Swan Signature Cuff", slug: "swan-signature-cuff",
        description: "Our signature cuff, available in a warm gold or cool silver finish. Shown here in both.",
        price: "2690", category: "bracelets", collection: "signature",
        material: "Stainless Steel, gold or silver plating", dimensions: "Width: 18mm",
        featured: true, isNew: false, stock: 18,
        images: ["/products/swan-signature-cuff-01.jpg", "/products/swan-signature-cuff-02.jpg"],
    },
    {
        name: "Viper Chain", slug: "viper-chain",
        description: "A heavy curb-link chain with serious presence. Available finish shown in black and silver.",
        price: "2890", category: "chains", collection: "industrial",
        material: "Stainless Steel, black or silver finish", dimensions: "Length: 55cm, Width: 9mm",
        featured: true, isNew: true, stock: 12,
        images: ["/products/viper-chain-01.jpg", "/products/viper-chain-02.jpg"],
    },
    {
        name: "Titan Mesh Bracelet", slug: "titan-mesh-bracelet",
        description: "A fine woven mesh bracelet in silver. Fluid movement, understated shine.",
        price: "2090", category: "bracelets", collection: "signature",
        material: "Stainless Steel, silver finish", dimensions: "Length: 19cm",
        featured: false, isNew: false, stock: 15,
        images: ["/products/titan-mesh-bracelet.jpg"],
    },
];
async function seed() {
    const existing = await index_1.db.select().from(schema_1.products).limit(1);
    if (existing.length > 0) {
        console.log("Database already seeded");
        return;
    }
    const catMap = {};
    for (const cat of CATEGORIES) {
        const [row] = await index_1.db.insert(schema_1.categories).values(cat).returning();
        catMap[cat.slug] = row.id;
    }
    const colMap = {};
    for (const col of COLLECTIONS) {
        const [row] = await index_1.db.insert(schema_1.collections).values(col).returning();
        colMap[col.slug] = row.id;
    }
    for (const p of SEED_PRODUCTS) {
        await index_1.db.insert(schema_1.products).values({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            images: p.images,
            categoryId: catMap[p.category],
            collectionId: colMap[p.collection],
            stock: p.stock,
            featured: p.featured,
            isNew: p.isNew,
            material: p.material,
            dimensions: p.dimensions,
            care: "Avoid direct contact with water, perfume, and harsh chemicals. Store in a dry place. Clean gently with a soft cloth.",
        });
    }
    console.log("Seeded successfully");
}
seed()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
