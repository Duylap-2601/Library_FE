# Office Template Library — Frontend (React + Vite + TailwindCSS)

Giao diện người dùng cho hệ thống Thư viện mẫu văn phòng (**DOCX** & **PPTX**).

---

## 1. Công nghệ sử dụng

- **React 18/19 + Vite** (TypeScript)
- **TailwindCSS v4** cho styling hiện đại và responsive
- **@tanstack/react-query** cho data fetching, server caching, retry và debounce search
- **React Router v6** cho Single Page Application (SPA) routing
- **Lucide React** icon set

---

## 2. Cấu trúc thư mục

```
Library_FE/
├── src/
│   ├── api/                  # Axios HTTP client & API endpoints (/auth, /templates, /documents)
│   ├── auth/                 # AuthProvider, ProtectedRoute, auth context
│   ├── types/                # TypeScript interfaces (Auth, Template, Document, PlaceholderDef...)
│   ├── hooks/                # React Query hooks (useTemplates, useDocuments...)
│   ├── components/
│   │   ├── ui/               # Badge, ErrorState, EmptyState, Skeleton loaders
│   │   ├── gallery/          # TemplateCard, FilterBar, SearchBox, PreviewModal
│   │   └── editor/           # PlaceholderForm, DocxPreview, SlideViewer, OnlyOfficeEditor
│   ├── pages/
│   │   ├── LoginPage.tsx         # Đăng nhập
│   │   ├── RegisterPage.tsx      # Đăng ký
│   │   ├── GalleryPage.tsx       # Kho mẫu, tìm kiếm, lọc, xem trước, tạo tài liệu
│   │   ├── DocumentEditorPage.tsx# Trình chỉnh sửa biểu mẫu DOCX & PPTX, xem slide
│   │   └── MyDocumentsPage.tsx   # Quản lý danh sách tài liệu đã tạo
│   ├── router.tsx            # Cấu hình routing
│   ├── App.tsx               # Khung ứng dụng: sidebar desktop + sheet nội dung, nav toàn màn hình trên mobile
│   ├── main.tsx              # React Root & QueryClientProvider
│   └── index.css             # Design tokens (Tailwind v4 @theme), base styles và component classes
├── vite.config.ts            # Proxy /api và /previews tới Backend (port 3000)
└── package.json
```

---

## 3. Hướng dẫn chạy

### Bước 1: Cài đặt dependencies (nếu chưa có)
```bash
npm install
```

### Bước 2: Chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

> **Lưu ý:** Vite đã được cấu hình proxy tự động:
> - Mọi request `/api/*` sẽ được forward sang `http://localhost:3000/api/*`
> - Mọi request `/previews/*` sẽ được forward sang `http://localhost:3000/previews/*`

### Bước 3: Build sản phẩm
```bash
npm run build
```
Mã nguồn build sẽ nằm tại thư mục `dist/`.

### Bước 4: Test

```bash
npm run test        # Vitest + Testing Library (7 component test)
npm run lint
npm run build
```

### Bước 5: Chạy bằng Docker

Từ thư mục `Library_BE`:

```bash
docker compose up --build
```

- UI: `http://localhost:8080`
- API: `http://localhost:3000/api/v1`

Profile mở rộng: `docker-compose.scale.yml` (queue preview), `docker-compose.editor.yml` (OnlyOffice), `docker-compose.s3.yml` (S3).

### Hành vi giao diện đáng chú ý

- Đăng nhập/đăng ký trước khi vào thư viện; phiên tự refresh khi access token hết hạn.
- Hỗ trợ DOCX, PPTX và XLSX; gallery/editor dùng chung theo `template.type`.
- Khi backend bật OnlyOffice, editor có nút “Chỉnh sửa nâng cao”; nếu không, dùng form placeholder.
- Preview queue trả 202: giao diện hiển thị “Đang render slide…” và tự poll.
- Danh sách “Tài liệu của tôi” có phân trang và chỉ hiển thị tài liệu của người dùng.
- Lỗi tạo tài liệu / lưu tài liệu hiển thị banner inline, không dùng `alert()`.
- Khi có thay đổi chưa lưu, giao diện hiển thị “Chưa lưu” và cảnh báo khi rời trang.
- Editor DOCX và PPTX dùng chung form placeholder; PPTX hiển thị slide preview bên cạnh.

---

## 4. Thư viện và giấy phép

Các thư viện chính: React 19, React Router 7, TanStack Query, Axios, TailwindCSS 4, Lucide (MIT/ISC). Danh sách đầy đủ kèm phiên bản và giấy phép nằm trong [`../Library_BE/docs/LICENSES.md`](../Library_BE/docs/LICENSES.md).

---

## 5. Khai báo sử dụng AI

Trong quá trình xây dựng phần giao diện này, AI được sử dụng để:

- Phân tích yêu cầu và đề xuất bố cục/kiến trúc component.
- Sinh khung mã, type, hook và các trạng thái loading/error/empty.
- Rà soát accessibility, responsive và viết tài liệu.

Toàn bộ mã đã được kiểm tra bằng `npm run build` và `npm run lint`, đồng thời chạy thử với backend thật. Người nộp bài chịu trách nhiệm đọc, hiểu, kiểm chứng và giải thích toàn bộ mã nguồn.
