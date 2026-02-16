
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data.json');

const data = {
    users: [
        {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN'
        },
        {
            id: '2',
            name: 'Müşteri User',
            email: 'musteri@example.com',
            role: 'CUSTOMER'
        }
    ],
    categories: [
        { id: 'cat1', name: 'Elektronik' },
        { id: 'cat2', name: 'Giyim' }
    ],
    products: [
        {
            id: 'prod1',
            name: 'Laptop',
            description: 'Hızlı bir bilgisayar',
            price: 15000,
            stock: 5,
            categoryId: 'cat1',
            imageUrl: 'https://placehold.co/600x400'
        },
        {
            id: 'prod2',
            name: 'Tişört',
            description: 'Kırmızı pamuklu tişört',
            price: 200,
            stock: 100,
            categoryId: 'cat2',
            imageUrl: 'https://placehold.co/600x400'
        }
    ],
    orders: [
        {
            id: 'ord1',
            customerName: 'Ahmet Yılmaz',
            customerEmail: 'ahmet@example.com',
            items: [
                { productId: 'prod1', productName: 'Laptop', quantity: 1, price: 15000 }
            ],
            total: 15000,
            status: 'Hazırlanıyor',
            date: new Date().toISOString()
        },
        {
            id: 'ord2',
            customerName: 'Ayşe Demir',
            customerEmail: 'ayse@example.com',
            items: [
                { productId: 'prod2', productName: 'Tişört', quantity: 2, price: 200 }
            ],
            total: 400,
            status: 'Kargolandı',
            date: new Date(Date.now() - 86400000).toISOString()
        }
    ]
};

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
console.log('Veritabanı başarıyla dolduruldu!');
