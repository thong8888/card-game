# 🃏 Game Lật Thẻ Bài

Game lật thẻ bài (Memory Card Game) được xây dựng bằng **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, và **Framer Motion**.

## 🎮 Tính năng

- **3 chế độ độ khó:** Dễ, Trung bình, Khó
- **Chế độ chơi qua 6 màn** với độ khó tăng dần
- **Đếm ngược thời gian** — hết giờ thì Game Over
- **Hệ thống điểm** — cộng điểm mỗi cặp khớp + thưởng thời gian
- **Animation lật thẻ 3D** mượt mà
- **Responsive** — hoạt động tốt trên cả mobile và desktop

## 🕹️ Cách chơi

1. **Chọn chế độ chơi** ở màn hình chính
2. **Click vào thẻ** để lật lên
3. **Lật 2 thẻ cùng lúc:**
   - Giống nhau ➜ **Cộng điểm**, thẻ giữ nguyên
   - Khác nhau ➜ **Úp lại** tự động
4. **Tìm hết cặp** trước khi hết thời gian để chiến thắng!

## 🏗️ Cấu trúc dự án

```
src/
├── app/
│   ├── page.tsx              # Trang chính — toàn bộ giao diện game
│   ├── layout.tsx            # Layout chung
│   └── globals.css           # Styles toàn cục + animation
├── components/
│   ├── game/
│   │   └── FlipCard.tsx      # Component thẻ bài (animation 3D)
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── game-store.ts         # Game state & logic (Zustand)
    └── utils.ts              # Utility functions
```

## 🧩 Chế độ chơi

### Chơi Tự Do

| Độ khó | Số thẻ | Số cặp | Thời gian | Điểm/cặp |
|--------|--------|--------|-----------|----------|
| Dễ | 12 | 6 | 60 giây | 10 |
| Trung bình | 16 | 8 | 90 giây | 15 |
| Khó | 20 | 10 | 120 giây | 20 |

### Chơi Qua Màn

| Màn | Số cặp | Thời gian | Điểm/cặp |
|-----|--------|-----------|----------|
| 1 | 4 | 30 giây | 10 |
| 2 | 6 | 50 giây | 15 |
| 3 | 8 | 70 giây | 20 |
| 4 | 10 | 90 giây | 25 |
| 5 | 12 | 110 giây | 30 |
| 6 | 15 | 140 giây | 35 |

## 🚀 Cài đặt & Chạy

```bash
# Cài đặt dependencies
bun install

# Chạy dev server
bun run dev

# Mở http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 📄 License

MIT