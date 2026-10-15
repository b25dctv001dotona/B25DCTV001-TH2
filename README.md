# Lá Sách — Thư viện lớp

Website tiếng Việt gồm hai phần theo đề bài, dùng Vite, Flexbox và thẻ HTML semantic. Có 12 sách thuộc 3 thể loại, giao diện 3 cột trên máy tính, 2 cột trên màn hình vừa và 1 cột trên điện thoại.

Dự án được đặt tại `D:\BookLib`. Cache Vite nằm trong `.cache/vite` của dự án; `.npmrc` đặt cache npm tại `D:/BookLib/.cache/npm`, tránh sử dụng ổ C cho cache dependency. Nếu chuyển dự án sang đường dẫn khác, cập nhật đường dẫn cache trong `.npmrc`.

## Chạy dự án

Yêu cầu Node.js 22.18+ hoặc 24+.

```sh
npm install
npm run dev
```

- `/`: Phần A — TypeScript (nâng cấp từ JavaScript thuần).
- `/react.html`: Phần B — React.
- `npm test`: kiểm tra tìm kiếm, lọc kết hợp và giới hạn dữ liệu form.
- `npm run build`: tạo cả hai trang trong `dist/`.
- `npm run preview`: xem bản đã build.

## Phần A

`src/vanilla.ts` quản lý trạng thái và sự kiện; `src/cards.ts` tạo thẻ sách bằng `createElement` và `textContent`; `src/utils.ts` tách xử lý lọc, kiểm tra form và localStorage. Danh sách tải từ `public/books.json` bằng `fetch` và `async/await`, có trạng thái đang tải, lỗi và nút thử lại. Các chuỗi HTML chỉ chứa giao diện tĩnh; dữ liệu sách luôn được đưa vào DOM bằng textContent.

Tìm theo tên ngay khi gõ, bỏ qua dấu tiếng Việt; thể loại được tạo bằng Set. Có thể kết hợp tìm kiếm, thể loại và góc yêu thích. Nút yêu thích và xóa dùng event delegation ở lưới sách. Xóa có hộp thoại xác nhận. Số yêu thích trên header cập nhật ngay và được lưu vào localStorage.

Form kiểm tra tên tối thiểu 3 ký tự sau khi bỏ khoảng trắng đầu/cuối, tác giả bắt buộc, thể loại hợp lệ, năm nguyên từ 1900 đến năm hiện tại. Lỗi hiển thị dưới ô khi nhập và khi gửi; focus ô lỗi đầu tiên. Sách hợp lệ được đưa lên đầu, bộ lọc được đặt lại để nhìn thấy sách vừa thêm.

## Phần B

Dữ liệu khai báo riêng trong `src/data.js`, không gọi API. `src/react.jsx` có các component Header, Section (nhận children), GenreFilter, BookList, BookCard và Footer; bổ sung AddBookForm. App giữ state sách, Set yêu thích và bộ lọc, truyền dữ liệu và callback qua props. Các danh sách có key ổn định là mã sách. Lọc thể loại bằng các nút bấm. Bản React cũng hỗ trợ tìm kiếm, thêm, xóa và lưu yêu thích.

## So sánh

| JavaScript thuần | React |
| --- | --- |
| Chủ động tạo, cập nhật DOM và gắn sự kiện | Khai báo JSX, React cập nhật giao diện theo state |
| Module và event delegation tổ chức hành vi | Component, props và children tổ chức giao diện |
| Dữ liệu fetch từ books.json | Dữ liệu nhập từ module JavaScript |
| Render lại lưới bằng DOM API | State trong App truyền xuống các component |

Hai bản dùng chung CSS và các hàm lọc/validation; yêu thích dùng hai khóa localStorage riêng. Danh sách sách được lưu vào localStorage dùng chung cho cả hai phiên bản; sách thêm/xóa vẫn được giữ sau khi tải lại trang. Các ID yêu thích không còn trong dữ liệu được dọn khi tải Phần A. Xóa sách cũng xóa ID yêu thích tương ứng. Có xử lý trường hợp localStorage bị chặn.

Bìa sách là minh họa CSS, không phải bìa xuất bản chính thức. Font có fallback hệ thống nếu không tải được Google Fonts.

## Kiểm tra sau khi chuyển sang ổ D (15/10/2026)

- npm test: 2/2 bài kiểm tra đạt.
- npm run build: cả hai trang build thành công.
- Vite --force: tạo cache mới tại D:/BookLib/.cache/vite, không có lỗi thiếu dung lượng.
- Trình duyệt: React hiển thị 12 sách, lọc Khoa học kết hợp tìm vu tru còn 1 sách; JavaScript thuần tải JSON và hiển thị 12 sách; không có lỗi console trong lượt kiểm tra.


## Yêu cầu nâng cao

Phần A đã chuyển sang TypeScript: vanilla.ts, cards.ts, layout.ts, utils.ts, books.ts, theme.ts, types.ts. Chạy npm run typecheck để kiểm tra strict; npm run build tự kiểm tra kiểu trước khi build. Các test Node cần Node.js 22.18+ hoặc 24+ vì import trực tiếp module TypeScript.

Sáng/tối có trên cả hai phiên bản, mặc định theo hệ điều hành, lưu lựa chọn trong localStorage dùng chung.

### Dữ liệu sách

Theo yêu cầu cập nhật, bỏ tích hợp MockAPI. Phần A tải books.json bằng fetch + async/await; thêm và xóa được lưu vào localStorage. Xóa vẫn yêu cầu xác nhận. Phần B tiếp tục dùng dữ liệu JavaScript riêng. Không cần endpoint hoặc biến môi trường API.

## Lưu sách trên trình duyệt

Hai trang dùng chung khóa la-sach-books-v1. Khi chưa có dữ liệu đã lưu, Phần A tải books.json và Phần B dùng module dữ liệu ban đầu. Sau thao tác thêm/xóa thành công, danh sách được lưu trước khi cập nhật giao diện. Danh sách rỗng cũng được giữ, không tự tạo lại sách đã xóa. Các tab cùng địa chỉ được đồng bộ qua sự kiện storage.

Nếu trình duyệt chặn lưu trữ hoặc hết hạn mức, trang báo lỗi và giữ sách/form để thử lại. JSON lưu bị lỗi sẽ quay về dữ liệu ban đầu. Dữ liệu thuộc cùng trình duyệt và origin: dùng nhất quán http://localhost:5173 (127.0.0.1 hoặc cổng khác có vùng lưu riêng). Xóa dữ liệu website của trình duyệt sẽ xóa sách đã lưu.
