# E-commerce Platform Demo

Modern bir E-ticaret platformu demosu. Next.js 14, TypeScript ve Vanilla CSS ile geliştirilmiştir.

## Özellikler

- **Müşteri Paneli:**
  - Ürünleri Listeleme ve Kategori Filtreleme
  - Sepete Ekleme / Çıkarma
  - Üyelik Sistemi (Kayıt Ol / Giriş Yap)
  - Sipariş Verme (Checkout)
  
- **Yönetici Paneli (`/admin`):**
  - Ürün Yönetimi (Ekle/Düzenle/Sil)
  - Kategori Yönetimi
  - Sipariş Takibi ve Durum Güncelleme

## Kurulum ve Çalıştırma

Bu projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Gerekli Yazılımlar:** Bilgisayarınızda [Node.js](https://nodejs.org/) (Sürüm 18 veya üzeri) yüklü olmalıdır.

2.  **Bağımlılıkları Yükleyin:**
    Terminali proje klasöründe açın ve şu komutu çalıştırın:
    ```bash
    npm install
    ```

3.  **Projeyi Başlatın (Geliştirme Modu):**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine gidin.

4.  **Projeyi Derleyin ve Başlatın (Prodüksiyon Modu - Önerilen):**
    Daha hızlı ve optimize çalışması için:
    ```bash
    npm run build
    npm start
    ```

## Yönetici Girişi

Yönetici paneline erişmek için `http://localhost:3000/admin` adresine gidin.

- **Email:** `admin@example.com`
- **Şifre:** `123123`

## Veritabanı

Proje, verileri saklamak için basit bir **JSON veritabanı** (`data.json`) kullanır. Bu sayede harici bir veritabanı kurulumuna ihtiyaç duymaz. Tüm ürünler, kategoriler, siparişler ve kullanıcılar bu dosyada tutulur.

## Proje Yapısı

- `src/app`: Sayfalar ve rotalar (App Router).
- `src/components`: Tekrar kullanılabilir bileşenler (Header, Cart, vb.).
- `src/lib/db.ts`: JSON veritabanı bağlantısı.
- `src/app/actions.ts`: Sunucu taraflı işlemler (Server Actions).

---
*Geliştirici: Antigravity*
