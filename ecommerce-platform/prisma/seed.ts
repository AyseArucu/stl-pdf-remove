import 'dotenv/config'; // Load env vars
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function main() {
    const dataPath = path.join(process.cwd(), 'data.disabled.json');
    if (!fs.existsSync(dataPath)) {
        console.error('Data file not found:', dataPath);
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('Seeding Users...');
    for (const user of data.users) {
        // Check if user exists to avoid duplicates if re-run (though DB is fresh)
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive ?? true,
            },
        });
    }

    console.log('Seeding Categories...');
    // Create categories without parent first to avoid constraint errors
    for (const cat of data.categories) {
        await prisma.category.upsert({
            where: { id: cat.id.toString() }, // Ensure string
            update: {},
            create: {
                id: cat.id.toString(),
                name: cat.name,
                // parentId: cat.parentId // Skip parentId initially
            },
        });
    }
    // Connect parents in second pass
    for (const cat of data.categories) {
        if (cat.parentId) {
            await prisma.category.update({
                where: { id: cat.id.toString() },
                data: { parentId: cat.parentId.toString() },
            }).catch(e => console.warn(`Parent category ${cat.parentId} not found for ${cat.id}`));
        }
    }

    console.log('Seeding Products...');
    for (const prod of data.products) {
        // Determine category ID: Use subcategory if available (deeper specificity), else main category
        const mainCatId = (prod.subcategoryIds && prod.subcategoryIds.length > 0)
            ? prod.subcategoryIds[0]
            : prod.categoryId;

        // Check if category exists, fallback to provided categoryId or skip
        const catExists = data.categories.find((c: any) => c.id === mainCatId || c.id === prod.categoryId);
        const finalCatId = catExists ? (catExists.id === mainCatId ? mainCatId : prod.categoryId) : null;

        if (!finalCatId) {
            console.warn(`Category not found for product ${prod.name}, skipping`);
            continue;
        }

        const createdProduct = await prisma.product.upsert({
            where: { id: prod.id },
            update: {},
            create: {
                id: prod.id,
                name: prod.name,
                description: prod.description || "",
                price: prod.price,
                salePrice: prod.salePrice,
                stock: prod.stock,
                imageUrl: prod.imageUrl,
                color: typeof prod.color === 'string' ? prod.color : JSON.stringify(prod.color),
                freeShipping: prod.freeShipping,
                rating: prod.rating,
                isActive: prod.isActive ?? true,
                favoriteCount: prod.favoriteCount,
                categoryId: finalCatId,
            }
        });

        // Media
        if (prod.media) {
            for (const m of prod.media) {
                await prisma.productMedia.create({
                    data: {
                        productId: createdProduct.id,
                        type: m.type,
                        url: m.url,
                        thumbnail: m.thumbnail
                    }
                });
            }
        }

        // Options
        if (prod.options) {
            for (const opt of prod.options) {
                await prisma.productOption.create({
                    data: {
                        productId: createdProduct.id,
                        name: opt.name,
                        price: opt.price
                    }
                });
            }
        }

        // Features
        if (prod.features) {
            for (const feat of prod.features) {
                await prisma.productFeature.create({
                    data: {
                        productId: createdProduct.id,
                        title: feat.title,
                        description: feat.description
                    }
                });
            }
        }
    }

    console.log('Seeding Orders...');
    for (const order of data.orders) {
        // Try to find user by email
        const user = data.users.find((u: any) => u.email === order.customerEmail);

        const createdOrder = await prisma.order.create({
            data: {
                id: order.id,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                address: order.address || "",
                total: order.total,
                status: order.status,
                paymentMethod: order.paymentMethod || "CREDIT_CARD",
                paymentStatus: order.paymentStatus || "PENDING",
                date: new Date(order.date),
                userId: user ? user.id : undefined,
                items: {
                    create: order.items.map((item: any) => ({
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });
    }

    console.log('Seeding Reviews...');
    for (const review of data.reviews) {
        // Ensure product and user exist
        const prodExists = data.products.find((p: any) => p.id === review.productId);
        const userExists = data.users.find((u: any) => u.id === review.userId);

        if (prodExists && userExists) {
            await prisma.review.create({
                data: {
                    id: review.id,
                    productId: review.productId,
                    userId: review.userId,
                    userName: review.userName,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: new Date(review.createdAt)
                }
            });
        }
    }

    console.log('Seeding Contact Settings...');
    if (data.contactSettings) {
        await prisma.contactSettings.create({
            data: {
                address: data.contactSettings.address,
                mapUrl: data.contactSettings.mapUrl
            }
        });
    }

    // Create empty Collections/Discounts etc if in data (data.json had empty arrays for them)

    console.log('Seeding Completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
