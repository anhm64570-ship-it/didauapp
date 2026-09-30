# Đi Đâu? — bản live Google Maps + PWA

Bản này là web app cài được lên màn hình điện thoại (PWA), không chỉ là mockup tĩnh.

## 1. Những gì đã có

- Đăng nhập/đăng ký demo
- Chọn thành phố
- Google Maps thật trên màn Khám phá
- Google Places Text Search theo thành phố
- Ảnh, rating, số lượt đánh giá, địa chỉ, giờ mở cửa
- Review do Google Places API trả về
- Màn chi tiết địa điểm kiểu Google Maps
- Gợi ý 1 địa điểm cho mỗi phân khúc: 0–100k, 100–200k, 200–400k, 400k+
- Tạo kèo → link mời → chọn tiêu chí → shortlist → vote → chốt
- PWA: Add to Home Screen / Install app

## 2. Bật Google Maps thật

Trong Google Cloud:

1. Bật Billing.
2. Bật `Maps JavaScript API`.
3. Bật `Places API (New)`.
4. Tạo API key.
5. Application restriction = Websites / HTTP referrers.
6. Thêm domain Vercel, ví dụ:
   - `https://didau-app.vercel.app/*`
7. API restrictions: chỉ cho Maps JavaScript API + Places API (New).
8. Mở app → Cá nhân → Google Maps API → dán key → Lưu & kiểm tra.

Có thể điền thẳng vào `config.js` thay vì nhập trong app.

## 3. Phân khúc giá hoạt động thế nào

App ưu tiên `priceRange` của Google nếu được trả về và currency là VND.
Nếu chỉ có `priceLevel`, app quy đổi UX:

- FREE / INEXPENSIVE → 0–100k
- MODERATE → 100–200k
- EXPENSIVE → 200–400k
- VERY_EXPENSIVE → 400k+

Đây là phân nhóm UX để so sánh, không phải báo giá chính thức. Màn chi tiết vẫn hiển thị dữ liệu Google trả về.

## 4. Đánh giá

Google Places trả overall rating, userRatingCount và một số review. API không cung cấp đầy đủ histogram 1–5 sao giống app Google Maps, nên bản này không giả số liệu histogram. Màn chi tiết hiển thị:

- rating tổng
- tổng lượt đánh giá
- review nổi bật được API trả về
- link mở Google Maps để xem toàn bộ

## 5. Cập nhật GitHub/Vercel

Xóa/ghi đè các file cũ bằng toàn bộ file trong folder này. Commit lên branch `main`.
Vercel đang kết nối repo sẽ tự redeploy.

## 6. App thật nhiều người vote realtime

Bản này đã là PWA cài được trên điện thoại và Google Maps live. Tuy nhiên dữ liệu nhóm/vote vẫn nằm local trên máy. Muốn nhiều máy cùng thấy thành viên và vote realtime cần Supabase/Firebase.
