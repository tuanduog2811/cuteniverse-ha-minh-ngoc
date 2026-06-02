# 💗 LOVE Hà Minh Ngọc — Cuteniverse

Thiên hà tình yêu cá nhân hóa, chạy hoàn toàn trên trình duyệt.

## 🗂 Cấu trúc file

```
cuteniverse/
├── index.html          ← File chính, chứa cấu hình
├── assets/
│   ├── galaxy.js       ← Hiệu ứng Three.js (thiên hà, tinh cầu, trái tim)
│   ├── style.css       ← Giao diện
│   └── music.mp3       ← Nhạc nền (Đi Cùng Anh)
```

## ✏️ Cách thêm ảnh

Mở `index.html`, tìm phần `images: [...]` và thêm link ảnh public:

```js
images: [
  "https://i.imgur.com/abc123.jpg",
  "https://i.imgur.com/def456.jpg",
],
```

### Cách lấy link ảnh public miễn phí:
- **Imgur**: Tải lên tại imgur.com → chuột phải ảnh → "Copy image address"
- **GitHub**: Upload ảnh vào repo → vào file → nhấn "Raw" → copy URL
- **Google Drive**: Chia sẻ ảnh công khai → dùng `https://drive.google.com/uc?id=FILE_ID`
- **Cloudinary**: Đăng ký miễn phí tại cloudinary.com

## ✏️ Cách đổi tin nhắn bí mật

Trong `index.html`, tìm `address:` và sửa:

```js
address: "Tin nhắn của bạn ở đây 💗",
```

## 🚀 Deploy lên GitHub Pages

1. Tạo repo mới trên GitHub (ví dụ: `love-ha-minh-ngoc`)
2. Upload tất cả file vào repo
3. Vào Settings → Pages → chọn branch `main` → Save
4. Truy cập: `https://username.github.io/love-ha-minh-ngoc`

## 🎮 Cách dùng

- **Click/chạm vào tinh cầu** ở giữa → mở quà bí mật với ảnh và tin nhắn
- **Kéo chuột** để xoay thiên hà
- **Scroll** để zoom
- Nút **âm thanh** góc trên phải để bật/tắt nhạc
