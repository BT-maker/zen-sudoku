# 🧩 Zen Sudoku

Modern, minimalist ve kullanıcı dostu bir Sudoku oyunu. React, TypeScript ve Vite ile geliştirilmiştir.

## ✨ Özellikler

### 🎮 Oyun Özellikleri
- **Üç Zorluk Seviyesi**: Kolay, Orta ve Zor
- **Not Alma Sistemi**: Hücrelere küçük notlar ekleyerek olası sayıları işaretleyin
- **Otomatik Not**: Tüm boş hücreler için geçerli adayları otomatik olarak doldurur
- **Akıllı İpucu**: Mantıksal bir sonraki hamleyi öneren akıllı yardım sistemi
- **Klasik İpucu**: Seçili hücreye doğru sayıyı gösterir (3 ipucu hakkı)
- **Geri Alma**: Son hamleyi geri al (20 hamle geçmişi)
- **Otomatik Kayıt**: Oyun otomatik olarak kaydedilir, kaldığınız yerden devam edebilirsiniz
- **Zamanlayıcı**: Oyun süresini takip eder
- **Hata Takibi**: Maksimum 3 hata hakkı

### 📊 İstatistikler
- Oynanan oyun sayısı
- Kazanılan/kaybedilen oyunlar
- Mevcut ve maksimum seri
- Her zorluk seviyesi için en iyi süreler

### 🎨 Kullanıcı Arayüzü
- Modern ve temiz tasarım
- Animasyonlu arka plan
- Mobil uyumlu (responsive)
- Dokunmatik ekran optimizasyonu
- Görsel geri bildirimler (confetti animasyonları)
- Seçili hücre ve ilişkili hücreler için vurgulama

### 🔊 Ses ve Müzik
- Ayarlanabilir ses efektleri
- Arka plan müziği (açık/kapalı)
- Farklı ses efektleri (tıklama, doğru, hata, kazanma vb.)

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın veya indirin**
   ```bash
   git clone <repository-url>
   cd zen-sudoku
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

4. **Tarayıcınızda açın**
   ```
   http://localhost:3000
   ```

## 📦 Build ve Deploy

### Production Build
```bash
npm run build
```

Build edilen dosyalar `dist` klasörüne oluşturulur.

### Preview
```bash
npm run preview
```

## 🛠️ Teknolojiler

- **React 19.2.3** - UI framework
- **TypeScript 5.8.2** - Tip güvenliği
- **Vite 6.2.0** - Build tool ve dev server
- **Tailwind CSS** - Stil framework (CDN)
- **Lucide React** - İkon kütüphanesi
- **Canvas Confetti** - Başarı animasyonları

## 📁 Proje Yapısı

```
zen-sudoku/
├── components/          # React bileşenleri
│   ├── Controls.tsx     # Oyun kontrolleri (sayılar, araçlar)
│   ├── Header.tsx       # Üst başlık (zamanlayıcı, hatalar)
│   ├── SettingsModal.tsx # Ayarlar modalı
│   ├── SmartHintModal.tsx # Akıllı ipucu modalı
│   ├── Statistics.tsx  # İstatistikler görünümü
│   └── SudokuCell.tsx  # Tek bir Sudoku hücresi
├── utils/              # Yardımcı fonksiyonlar
│   ├── audio.ts        # Ses yönetimi
│   ├── storage.ts      # LocalStorage işlemleri
│   └── sudoku.ts       # Sudoku algoritmaları
├── App.tsx             # Ana uygulama bileşeni
├── types.ts            # TypeScript tip tanımları
├── index.tsx           # Giriş noktası
├── index.html          # HTML şablonu
├── vite.config.ts      # Vite yapılandırması
└── package.json        # Proje bağımlılıkları
```

## 🎯 Kullanım

### Oyunu Başlatma
1. Ana menüden bir zorluk seviyesi seçin (Kolay, Orta, Zor)
2. Veya kaydedilmiş bir oyuna devam edin

### Oyun Kontrolleri
- **Sayılar (1-9)**: Hücreye sayı girmek için
- **Not Modu**: Küçük notlar eklemek için aç/kapa
- **Sil**: Seçili hücreyi temizle
- **Geri Al**: Son hamleyi geri al
- **Otomatik Not**: Tüm geçerli adayları otomatik doldur
- **İpucu**: Seçili hücreye doğru sayıyı göster (3 hakkınız var)
- **Yardım**: Akıllı ipucu sistemi (mantıksal sonraki hamle)

### Ayarlar
- Ses efektlerini aç/kapa
- Arka plan müziğini aç/kapa
- İstatistikleri görüntüle

## 🧩 Sudoku Kuralları

1. Her satırda 1-9 arası sayılar sadece bir kez bulunmalı
2. Her sütunda 1-9 arası sayılar sadece bir kez bulunmalı
3. Her 3x3 karede 1-9 arası sayılar sadece bir kez bulunmalı
4. Başlangıçta verilen sayılar değiştirilemez

## 📝 Notlar

- Oyun otomatik olarak tarayıcınızın LocalStorage'ına kaydedilir
- İstatistikler ve ayarlar da LocalStorage'da saklanır
- Maksimum 3 hata yapabilirsiniz, 4. hatada oyun biter
- Her oyunda 3 ipucu hakkınız vardır

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. İlgili bileşen veya utility dosyasını düzenleyin
2. TypeScript tiplerini `types.ts` dosyasında güncelleyin
3. Gerekirse yeni bileşenler ekleyin

### Stil Değişiklikleri
- Tailwind CSS sınıfları kullanılıyor
- Özel animasyonlar `index.html` içindeki `<style>` etiketinde tanımlı
- Renk teması: Turkuaz/Yeşil gradyan

## 📄 Lisans

Bu proje özel bir projedir.

## 👨‍💻 Geliştirici

Zen Sudoku - Modern Sudoku deneyimi için tasarlandı.

---

**Keyifli oyunlar! 🎮**
# zen-sudoku
