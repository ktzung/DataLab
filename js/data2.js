/* DataLab — dữ liệu bài giảng, phần 2: làm sạch và chia tập */
window.DATALAB = window.DATALAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  "use strict";

  const T = window.DATALAB;

  T.modules.push({
    id: "lam-sach-chia-tap",
    num: "02",
    title: "Làm sạch và chia tập",
    tone: "mint",
    blurb: "Bảng thật hiếm khi sạch: ô trống, dòng trùng và vài con số lạc nhịp nằm rải rác. Module này chỉ cách đo mức thiếu, nhận diện ngoại lai bằng IQR, chia 70/15/15 đúng cách và chặn rò rỉ trước khi huấn luyện.",
    lessons: ["o-thieu", "ngoai-lai", "chia-tap", "ro-ri"]
  });

  Object.assign(T.lessons, {
    /* ------------------------------------------------------------------
       Bài 1: ô thiếu
       ------------------------------------------------------------------ */
    "o-thieu": {
      id: "o-thieu",
      module: "lam-sach-chia-tap",
      title: "Ô thiếu",
      shortTitle: "Ô thiếu",
      subtitle: "Bốn phần trăm ô trống không có nghĩa là bỏ bốn phần trăm dòng. Bài này đếm thiếu theo cột, chọn giữa bỏ dòng và điền giá trị, rồi đo lại điểm chất lượng trên bảng 10.000 dòng.",
      blurb: "Trên bảng 10.000 dòng, 4% ô thiếu rải khắp 12 cột. Bạn phân biệt thiếu ngẫu nhiên với thiếu có lý do, điền median cho cột số và nhãn cho cột chữ, rồi kiểm lại còn 9.312 dòng dùng được.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["ô thiếu", "median", "MCAR", "dropna", "chất lượng"],
      metrics: [
        { key: "rows", label: "Dòng giữ", tone: "blue" },
        { key: "missing", label: "Ô thiếu", tone: "coral" },
        { key: "dup", label: "Dòng trùng", tone: "yellow" },
        { key: "score", label: "Điểm chất lượng", tone: "mint" }
      ],
      nodes: [
        { id: "raw", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Bảng thô", sub: "10.000 dòng, 12 cột" },
        { id: "hole", type: "alert", x: 340, y: 80, w: 200, h: 70, label: "Ô trống", sub: "4% ô, khoảng 4.800" },
        { id: "profile", type: "audit", x: 625, y: 80, w: 200, h: 70, label: "Kiểm kê theo cột", sub: "tuổi 18%, thu nhập 9%" },
        { id: "rule", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Chọn cách xử lý", sub: "bỏ dòng hay điền" },
        { id: "impute", type: "code", x: 340, y: 310, w: 200, h: 70, label: "Điền median", sub: "cột số, nhãn cho chữ" },
        { id: "clean", type: "grid", x: 625, y: 310, w: 200, h: 70, label: "Bảng sạch", sub: "9.312 dòng giữ lại" },
        { id: "score", type: "star", x: 340, y: 195, w: 200, h: 70, label: "Điểm chất lượng", sub: "90,4 trên 100" }
      ],
      edges: [
        { id: "raw-hole", from: "raw", to: "hole", kind: "data", label: "ô trống 4%" },
        { id: "hole-profile", from: "hole", to: "profile", kind: "data", label: "đếm theo từng cột" },
        { id: "profile-rule", from: "profile", to: "rule", kind: "control", label: "chọn ngưỡng" },
        { id: "rule-impute", from: "rule", to: "impute", kind: "control", label: "điền theo cột" },
        { id: "hole-score", from: "hole", to: "score", kind: "data", label: "trừ 6 điểm" },
        { id: "impute-clean", from: "impute", to: "clean", kind: "data", label: "9.312 dòng" },
        { id: "clean-score", from: "clean", to: "score", kind: "data", label: "90,4 trên 100" }
      ],
      learn: [
        "4% ô thiếu không có nghĩa là 4% dòng mất: hãy đo bằng <code>df.isna().mean()</code> theo từng cột.",
        "Thiếu 5 đến 40% thì <code>fillna</code> bằng median hoặc nhãn phổ biến, thiếu trên 40% thì cân nhắc bỏ cột.",
        "Tham số điền phải tính trên <strong>tập train</strong>, nếu tính trên toàn bảng là đã nhìn thấy test.",
        "Bỏ 300 dòng trùng bằng <code>drop_duplicates</code> trước khi chia để bảng còn 9.312 dòng dùng được."
      ],
      steps: [
        {
          short: "Đo trước",
          type: "concept",
          title: "Bốn phần trăm ô, không phải bốn phần trăm dòng",
          body: "Bảng nguồn có 10.000 dòng và 12 cột, nhưng 4% số ô bị trống, tức khoảng 4.800 ô nếu tính cả bảng. Con số 4% nghe nhỏ, nhưng nó không nằm gọn trong một cột: cột tuổi thiếu 18%, cột thu nhập thiếu 9%, các cột còn lại thiếu lẻ tẻ. Chạy <code>df.isna().mean()</code> sẽ thấy ngay cột nào đáng lo. Đừng vội gọi <code>dropna()</code>: bỏ mọi dòng có dù chỉ một ô trống thường mất hơn 30% dữ liệu, chứ không phải 4%. Một bảng đo đúng sẽ cho biết tỉ lệ thiếu theo từng cột, số dòng thiếu ít nhất một ô và số dòng trùng lặp. Bước đầu tiên luôn là đo, chưa phải sửa.",
          focus: ["raw", "hole", "profile"],
          edges: ["raw-hole", "hole-profile"],
          metrics: { rows: "10.000", missing: "4% ô", dup: "3% dòng", score: "chưa tính" },
          changes: [
            "Tỉ lệ thiếu được tách theo từng cột thay vì một con số chung",
            "Phát hiện 300 dòng trùng lặp nằm lẫn trong bảng"
          ],
          note: "Đo trên toàn bảng để mô tả thì được, nhưng mọi tham số dùng cho mô hình phải tính lại trên train."
        },
        {
          short: "Kiểm kê",
          type: "flow",
          title: "Đếm thiếu theo cột trước khi quyết định",
          body: "Kết quả kiểm kê chia bảng thành ba nhóm. Nhóm nhẹ gồm các cột thiếu dưới 5%, thường là mã đơn hàng hay ngày tạo. Nhóm nặng là tuổi 18% và thu nhập 9%: đây là hai biến quan trọng cho bài toán churn, không thể xóa cả cột. Nhóm thứ ba là 300 dòng trùng, chiếm 3%, phát hiện bằng <code>df.duplicated().sum()</code>. Từ bảng kiểm kê này mới chọn được cách xử lý: điền cho nhóm nặng, bỏ dòng cho nhóm nhẹ nếu số dòng mất không đáng kể, và luôn bỏ dòng trùng trước khi chia tập. Quyết định phải ghi lại kèm lý do, vì người sau sẽ hỏi vì sao cột thu nhập có thêm giá trị 0.",
          focus: ["profile", "rule", "hole"],
          edges: ["hole-profile", "profile-rule"],
          metrics: { rows: "10.000", missing: "18% cột tuổi", dup: "300 dòng", score: "chưa tính" },
          changes: [
            "Ba nhóm cột thiếu được tách theo ngưỡng 5% và 40%",
            "Dòng trùng được đếm riêng, không gộp vào ô thiếu"
          ],
          note: "Đừng điền 0 cho thu nhập: 0 là một giá trị thật, còn thiếu là chưa biết."
        },
        {
          short: "Điền",
          type: "detail",
          title: "Median cho cột số, nhãn riêng cho cột chữ",
          body: "Với cột số, median an toàn hơn mean vì không bị vài giá trị lớn kéo lệch. Cột thu nhập thiếu 9% được điền bằng median của chính cột đó, tính trên tập train sau khi chia, không tính trên toàn bảng. Với cột chữ như quận hay kênh tiếp cận, dùng nhãn phổ biến nhất hoặc thêm nhãn <code>khong_ro</code> để giữ thông tin về việc thiếu. Với cột thiếu trên 40%, cân nhắc bỏ cột thay vì điền, vì điền nhiều làm dữ liệu giả trông thật. Thêm cờ <code>is_missing</code> cho cột thiếu nặng để mô hình học được rằng việc bỏ trống cũng là tín hiệu.",
          focus: ["rule", "impute", "clean"],
          edges: ["rule-impute", "impute-clean"],
          metrics: { rows: "10.000", missing: "đã điền", dup: "300 dòng", score: "chưa tính" },
          changes: [
            "Cột số nhận median, cột chữ nhận nhãn khong_ro",
            "Cờ is_missing giữ lại dấu vết của các ô từng trống"
          ],
          note: "Median của cột thu nhập phải lấy từ train; lấy từ toàn bảng là một dạng rò rỉ nhẹ nhưng thật."
        },
        {
          short: "Cái bẫy",
          type: "pitfall",
          title: "Bỏ dòng cho sạch là mất đúng nhóm cần dự đoán",
          body: "Cái bẫy lớn nhất là bỏ dòng cho sạch. Nếu bỏ mọi dòng có ít nhất một ô trống, bảng 10.000 dòng có thể chỉ còn hơn 6.000, trong khi phòng mô phỏng ước lượng 9.312 dòng dùng được sau khi xử lý 4% ô và 3% dòng trùng. Bỏ dòng còn làm lệch phân phối: người không khai thu nhập thường thuộc nhóm thu nhập cao, nên xóa họ là xóa đúng nhóm cần dự đoán. Dòng trùng cũng vậy, 300 dòng trùng lặp làm mô hình học thuộc câu trả lời. Hãy bỏ trùng trước, điền thiếu sau, và ghi lại số dòng mất ở mỗi bước.",
          focus: ["clean", "score", "raw"],
          edges: ["impute-clean", "clean-score"],
          metrics: { rows: "9.312", missing: "4% đã xử lý", dup: "300 dòng", score: "90,4/100" },
          changes: [
            "Bỏ dòng vô tội vạ làm mất hơn 30% dữ liệu thay vì 4%",
            "300 dòng trùng vẫn còn nếu quên drop_duplicates"
          ],
          note: "Kiểm tra phân phối nhãn trước và sau khi bỏ dòng; lệch mạnh là dấu hiệu đã xóa nhầm nhóm."
        },
        {
          short: "Quy trình",
          type: "final",
          tone: "final",
          title: "Bốn bước cố định cho mọi bảng mới",
          body: "Quy trình ổn định cho mọi bảng mới gồm bốn bước. Một, đo tỉ lệ thiếu theo cột và đếm dòng trùng. Hai, chọn ngưỡng: dưới 5% thì bỏ dòng, 5 đến 40% thì điền, trên 40% thì bỏ cột. Ba, điền bằng median hoặc nhãn phổ biến, tính tham số trên train. Bốn, chấm lại điểm chất lượng: bảng mẫu đạt <code>90,4/100</code> và giữ 9.312 dòng, đủ ngưỡng 70 để huấn luyện. Kết quả này mới là đầu vào cho bài chia tập, nơi 9.312 dòng sẽ được tách thành 6.518, 1.397 và 1.397.",
          focus: "all",
          edges: "all",
          metrics: { rows: "9.312", missing: "4% đã xử lý", dup: "đã bỏ", score: "90,4/100" },
          changes: [
            "Bảng sạch còn 9.312 dòng và đạt 90,4/100",
            "Quy trình đo, chọn ngưỡng, điền, chấm điểm chạy lại được",
            "Bảng sạch sẵn sàng cho bước chia 70/15/15"
          ],
          note: "Điểm chất lượng 90,4 đến từ 100 trừ 4 × 1,5 và 3 × 1,2, đúng công thức của phòng mô phỏng."
        }
      ]
    },

    /* ------------------------------------------------------------------
       Bài 2: ngoại lai
       ------------------------------------------------------------------ */
    "ngoai-lai": {
      id: "ngoai-lai",
      module: "lam-sach-chia-tap",
      title: "Ngoại lai",
      shortTitle: "Ngoại lai",
      subtitle: "Một đơn hàng 12 triệu giữa hàng nghìn đơn vài trăm nghìn kéo trung bình lệch hẳn. Bài này dựng hàng rào IQR, đếm 112 dòng vượt ngưỡng và chọn giữa cắt, gắn cờ hay bỏ.",
      blurb: "IQR không cần giả định phân phối chuẩn: lấy Q1, Q3, nhân 1,5 rồi cắt. Trên 9.312 dòng, 112 đơn vượt 1.030.000 đồng; bạn học cách gắn cờ thay vì xóa, và vì sao z-score dễ bỏ sót.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["IQR", "z-score", "winsorize", "hàng rào", "gắn cờ"],
      metrics: [
        { key: "rows", label: "Dòng giữ", tone: "blue" },
        { key: "outlier", label: "Dòng ngoại lai", tone: "coral" },
        { key: "fence", label: "Ngưỡng trên", tone: "yellow" },
        { key: "score", label: "Điểm chất lượng", tone: "mint" }
      ],
      nodes: [
        { id: "ledger", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Sổ đơn hàng", sub: "9.312 dòng, 1 cột tiền" },
        { id: "scan", type: "audit", x: 340, y: 80, w: 200, h: 70, label: "Quét phân phối", sub: "Q1, Q3, IQR" },
        { id: "fence", type: "shield", x: 625, y: 80, w: 200, h: 70, label: "Hàng rào IQR", sub: "1.030.000 đồng" },
        { id: "flag", type: "star", x: 55, y: 310, w: 200, h: 70, label: "Gắn cờ", sub: "112 dòng, giữ lại" },
        { id: "clip", type: "code", x: 340, y: 310, w: 200, h: 70, label: "Cắt trần", sub: "winsorize tại Q3" },
        { id: "report", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Báo cáo", sub: "mean 298.000 đồng" },
        { id: "why", type: "book", x: 340, y: 195, w: 200, h: 70, label: "Vì sao không xóa", sub: "mất tín hiệu thật" }
      ],
      edges: [
        { id: "ledger-scan", from: "ledger", to: "scan", kind: "data", label: "9.312 dòng" },
        { id: "scan-fence", from: "scan", to: "fence", kind: "data", label: "IQR = 340.000" },
        { id: "fence-flag", from: "fence", to: "flag", kind: "data", label: "112 dòng vượt" },
        { id: "flag-clip", from: "flag", to: "clip", kind: "control", label: "cắt hoặc giữ" },
        { id: "clip-report", from: "clip", to: "report", kind: "data", label: "trần 1.030.000" },
        { id: "scan-why", from: "scan", to: "why", kind: "control", label: "kiểm tra lý do" },
        { id: "report-why", from: "report", to: "why", kind: "data", label: "mean 298.000" }
      ],
      learn: [
        "Hàng rào <code>IQR</code> dùng Q1, Q3 và 1,5 lần khoảng tứ phân vị, không giả định phân phối chuẩn.",
        "Trên bảng 9.312 dòng, <code>112</code> đơn vượt 1.030.000 đồng, tương đương 1,2%.",
        "Ưu tiên gắn cờ <code>is_outlier</code> và cắt trần, chỉ xóa khi đã xác nhận lỗi nhập.",
        "<code>z-score</code> dễ bỏ sót vì chính ngoại lai làm mean và độ lệch chuẩn phình ra."
      ],
      steps: [
        {
          short: "Nhìn phân phối",
          type: "concept",
          title: "Một đơn 12 triệu làm lệch cả cột",
          body: "Cột giá trị đơn hàng có median 265.000 đồng nhưng mean 312.000 đồng. Khoảng cách 47.000 đồng đến từ 112 đơn rất lớn, chiếm 1,2% số dòng, trong đó có một đơn 12.000.000 đồng. Nếu huấn luyện trên mean mà không xử lý, mô hình dự báo doanh thu sẽ cao hơn thực tế ở gần như mọi cửa hàng. Ngoại lai không tự động là lỗi: đơn bán sỉ 12 triệu có thể là giao dịch thật và rất có giá trị. Vì vậy bước đầu là mô tả phân phối bằng <code>describe()</code>, xem histogram và hỏi xem con số đó có hợp lý về nghiệp vụ không.",
          focus: ["ledger", "scan", "report"],
          edges: ["ledger-scan", "scan-fence"],
          metrics: { rows: "9.312", outlier: "112 dòng", fence: "chưa dựng", score: "90,4/100" },
          changes: [
            "Mean 312.000 đồng lộ ra khoảng cách 47.000 so với median",
            "112 đơn lớn được nhận diện thay vì bị xóa ngay"
          ],
          note: "Luôn so mean với median trước khi kết luận: lệch xa là dấu hiệu đuôi phải dài."
        },
        {
          short: "Hàng rào",
          type: "flow",
          title: "Ba số Q1, Q3, IQR dựng nên ngưỡng",
          body: "Hàng rào IQR không giả định phân phối chuẩn. Lấy Q1 = 180.000, Q3 = 520.000, suy ra IQR = 340.000. Ngưỡng trên là Q3 + 1,5 × IQR = 1.030.000 đồng; ngưỡng dưới âm nên bỏ qua. Đếm được 112 dòng vượt trần, đúng 1,2% bảng. Với phân phối lệch phải, IQR ổn định hơn z-score vì Q1 và Q3 không bị chính các ngoại lai kéo đi. Có thể dùng <code>df['tien'].quantile([0.25, 0.75])</code> để lấy hai mốc, rồi so sánh với ngưỡng trước khi quyết định cắt. Hai mốc này đủ để dựng hàng rào cho từng nhóm hàng.",
          focus: ["scan", "fence", "flag"],
          edges: ["scan-fence", "fence-flag"],
          metrics: { rows: "9.312", outlier: "112 dòng", fence: "1.030.000", score: "90,4/100" },
          changes: [
            "Ngưỡng trên được tính minh bạch từ Q1 và Q3",
            "112 dòng vượt trần được đếm chính xác thay vì đoán"
          ],
          note: "Ngưỡng dưới âm là bình thường với dữ liệu tiền; đừng cắt về 0 vì sẽ tạo thêm giá trị giả."
        },
        {
          short: "Ba lựa chọn",
          type: "detail",
          title: "Cắt trần, gắn cờ hay bỏ hẳn",
          body: "Có ba cách xử lý và chúng phục vụ ba mục đích khác nhau. Cắt trần bằng <code>clip(upper=1030000)</code> giữ đủ 9.312 dòng, mean giảm từ 312.000 xuống 298.000 đồng, phù hợp khi đưa vào mô hình tuyến tính. Gắn cờ <code>is_outlier</code> giữ nguyên giá trị gốc và cho mô hình cây tự học, đồng thời phục vụ kiểm toán. Bỏ hẳn 112 dòng chỉ nên làm khi đã xác nhận đó là lỗi nhập liệu, ví dụ gõ thêm hai số 0. Đừng thay ngoại lai bằng mean: cách đó tạo ra một cụm giá trị không tồn tại và làm mất luôn thông tin về đơn lớn.",
          focus: ["flag", "clip", "report"],
          edges: ["flag-clip", "clip-report"],
          metrics: { rows: "9.312", outlier: "112 đã gắn cờ", fence: "1.030.000", score: "90,4/100" },
          changes: [
            "Cột tiền được cắt trần, mean hạ về 298.000 đồng",
            "Cờ is_outlier giữ nguyên 112 dòng gốc để kiểm toán"
          ],
          note: "Cắt trần chỉ đổi giá trị đưa vào mô hình, không sửa bảng gốc dùng cho báo cáo."
        },
        {
          short: "z-score",
          type: "pitfall",
          title: "Chuẩn hóa bằng mean dễ bỏ sót đuôi dày",
          body: "z-score là lựa chọn quen thuộc nhưng dễ bỏ sót khi dữ liệu lệch. Công thức lấy giá trị trừ mean rồi chia độ lệch chuẩn; chính các ngoại lai làm mean và độ lệch chuẩn phình ra, nên ngưỡng 3 khó chạm tới. Trên bảng này, z-score chỉ gắn cờ khoảng 41 dòng, bỏ sót gần 70% trong 112 đơn bất thường. Với đuôi dày hoặc dữ liệu tiền tệ, IQR hoặc median absolute deviation đáng tin hơn. Cũng đừng áp cùng một ngưỡng cho mọi nhóm: đơn của đại lý bán sỉ vốn lớn hơn đơn lẻ, nên tính hàng rào theo từng nhóm.",
          focus: ["scan", "fence", "why"],
          edges: ["scan-why", "report-why"],
          metrics: { rows: "9.312", outlier: "41 do z-score", fence: "ngưỡng 3", score: "90,4/100" },
          changes: [
            "z-score chỉ bắt 41 trong 112 dòng bất thường",
            "Hàng rào được tính riêng cho nhóm bán lẻ và bán sỉ"
          ],
          note: "Nếu dùng z-score, tính mean và độ lệch chuẩn trên dữ liệu đã bỏ ngoại lai hoặc dùng MAD."
        },
        {
          short: "Chốt",
          type: "final",
          tone: "final",
          title: "Ghi lại quyết định, đừng xóa lặng lẽ",
          body: "Kết thúc bài, quyết định xử lý phải nằm trong pipeline chứ không trong một notebook cá nhân. Thêm bước gắn cờ, cắt trần và ghi log số dòng bị ảnh hưởng: 112 dòng, trần 1.030.000 đồng, mean sau xử lý 298.000 đồng. Giữ bản gốc để đối chiếu khi có khiếu nại, và tạo báo cáo phân bố trước sau cho người phụ trách nghiệp vụ. Điểm chất lượng của bảng vẫn là <code>90,4/100</code> vì ngoại lai không làm tăng tỉ lệ thiếu hay trùng. Xử lý ngoại lai là thay đổi cách nhìn, không phải xóa bằng chứng.",
          focus: "all",
          edges: "all",
          metrics: { rows: "9.312", outlier: "112 đã gắn cờ", fence: "1.030.000", score: "90,4/100" },
          changes: [
            "Ngoại lai được gắn cờ và cắt trần thay vì xóa",
            "Báo cáo phân bố trước sau được lưu cùng pipeline",
            "Bảng giữ đủ 9.312 dòng cho bước chia tập"
          ],
          note: "Ghi cả số dòng bị ảnh hưởng vào log: 112 dòng là con số phải xuất hiện khi kiểm toán lại."
        }
      ]
    },

    /* ------------------------------------------------------------------
       Bài 3: chia ba tập
       ------------------------------------------------------------------ */
    "chia-tap": {
      id: "chia-tap",
      module: "lam-sach-chia-tap",
      title: "Chia ba tập",
      shortTitle: "Chia ba tập",
      subtitle: "70/15/15 không phải nghi thức: test phải đủ dày để sai số chấp nhận được. Bài này chia 9.312 dòng thành 6.518, 1.397 và 1.397, giữ nguyên 22% churn ở cả ba tập.",
      blurb: "Chín nghìn ba trăm mười hai dòng được chia 70/15/15: 6.518 dòng train, 1.397 dòng val và 1.397 dòng test. Bạn giữ nguyên tỉ lệ nhãn 22% ở cả ba tập, đặt random_state để tái lập và chỉ chạm test một lần.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["70/15/15", "stratify", "random_state", "test", "val"],
      metrics: [
        { key: "train", label: "Train", tone: "blue" },
        { key: "val", label: "Val", tone: "mint" },
        { key: "test", label: "Test", tone: "yellow" },
        { key: "leak", label: "Rò rỉ", tone: "coral" }
      ],
      nodes: [
        { id: "pool", type: "disk", x: 55, y: 80, w: 200, h: 70, label: "Bảng sạch", sub: "9.312 dòng, 22% churn" },
        { id: "splitter", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Chia ngẫu nhiên", sub: "seed 42, stratify" },
        { id: "train", type: "bolt", x: 625, y: 80, w: 200, h: 70, label: "Train", sub: "6.518 dòng" },
        { id: "val", type: "signal", x: 55, y: 310, w: 200, h: 70, label: "Val", sub: "1.397 dòng, chọn tham số" },
        { id: "test", type: "server", x: 340, y: 310, w: 200, h: 70, label: "Test", sub: "1.397 dòng, chốt một lần" },
        { id: "strat", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Tỉ lệ nhãn", sub: "22% ở cả ba tập" },
        { id: "leak", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Chặn rò rỉ", sub: "tách trước khi biến đổi" }
      ],
      edges: [
        { id: "pool-splitter", from: "pool", to: "splitter", kind: "data", label: "9.312 dòng" },
        { id: "splitter-train", from: "splitter", to: "train", kind: "data", label: "70% = 6.518" },
        { id: "splitter-val", from: "splitter", to: "val", kind: "data", label: "15% = 1.397" },
        { id: "splitter-test", from: "splitter", to: "test", kind: "data", label: "15% = 1.397" },
        { id: "train-strat", from: "train", to: "strat", kind: "data", label: "22% churn" },
        { id: "val-strat", from: "val", to: "strat", kind: "data", label: "22% churn" },
        { id: "test-leak", from: "test", to: "leak", kind: "control", label: "1.397 dòng" }
      ],
      learn: [
        "<code>70/15/15</code> chia 9.312 dòng thành 6.518 train, 1.397 val và 1.397 test.",
        "<code>stratify=y</code> giữ tỉ lệ churn 22% ở cả ba tập, tránh test mất lớp hiếm.",
        "Đặt <code>random_state=42</code>, lưu chỉ số dòng để mọi thí nghiệm tái lập được.",
        "<code>1.397</code> dòng test cho sai số khoảng ±2 điểm; test 465 dòng thì kết quả nhảy theo may mắn."
      ],
      steps: [
        {
          short: "Ba câu hỏi",
          type: "concept",
          title: "Ba tập, ba câu hỏi khác nhau",
          body: "Ba tập trả lời ba câu hỏi khác nhau. Train dùng để học tham số, val dùng để chọn mô hình và siêu tham số, test chỉ dùng một lần để báo cáo. Với 9.312 dòng, tỉ lệ 70/15/15 cho 6.518 dòng train, 1.397 dòng val và 1.397 dòng test. Tập test 1.397 dòng đủ để sai số chuẩn của accuracy quanh 80% vào khoảng 1,1 điểm phần trăm, tức khoảng ±2 điểm với độ tin 95%. Nếu test chỉ có 465 dòng, cùng một mô hình có thể báo 84% hôm nay và 79% hôm sau chỉ vì chia khác.",
          focus: ["pool", "splitter", "train"],
          edges: ["pool-splitter", "splitter-train"],
          metrics: { train: "6.518 dòng", val: "1.397 dòng", test: "1.397 dòng", leak: "chưa kiểm" },
          changes: [
            "9.312 dòng được tách thành 6.518, 1.397 và 1.397",
            "Test 15% đủ dày cho sai số khoảng ±2 điểm"
          ],
          note: "Đừng chọn tỉ lệ theo cảm giác: test cần đủ dòng để một lần đổi nhãn không làm accuracy nhảy."
        },
        {
          short: "Stratify",
          type: "flow",
          title: "Giữ 22% churn ở cả ba tập",
          body: "Chia ngẫu nhiên thuần có thể làm tỉ lệ nhãn lệch giữa ba tập. Bảng có 22% khách churn, tương đương 2.048 dòng; stratify giữ tỉ lệ này ở cả ba tập: 1.434 trong train, 307 trong val và 307 trong test. Cách làm là <code>train_test_split(X, y, test_size=0.3, stratify=y, random_state=42)</code>, sau đó chia tiếp tập 30% thành val và test. Với bài toán nhiều lớp hoặc nhãn hiếm, stratify gần như bắt buộc, nếu không một lớp có 40 dòng có thể biến mất khỏi test và mọi chỉ số đều nhiễu. Tỉ lệ này phải khớp ở cả ba tập, không chỉ ở train.",
          focus: ["splitter", "val", "strat"],
          edges: ["splitter-val", "val-strat"],
          metrics: { train: "1.434 churn", val: "307 churn", test: "307 churn", leak: "chưa kiểm" },
          changes: [
            "Tỉ lệ churn 22% được giữ ở cả train, val và test",
            "Lớp hiếm không còn nguy cơ biến mất khỏi test"
          ],
          note: "Stratify chỉ giải quyết tỉ lệ nhãn; nó không ngăn dòng trùng hay cùng khách nằm ở hai tập."
        },
        {
          short: "Seed",
          type: "detail",
          title: "random_state biến lần chia thành sự kiện lặp lại",
          body: "random_state không phải mê tín: nó biến lần chia thành một sự kiện lặp lại được. Đặt seed 42, lưu chỉ số dòng của từng tập ra tệp, và dùng đúng chỉ số đó cho mọi thí nghiệm sau. Khi báo cáo, ghi rõ seed, tỉ lệ và số dòng để người khác tái lập. Cũng nên chia theo nhóm nếu dữ liệu có cấu trúc, ví dụ cùng một khách hàng có nhiều đơn: dùng <code>GroupShuffleSplit</code> để mọi đơn của một khách nằm gọn trong một tập. Chia lại nhiều lần đến khi test đẹp là cách tự lừa mình.",
          focus: ["splitter", "train", "pool"],
          edges: ["splitter-train", "splitter-val"],
          metrics: { train: "6.518 dòng", val: "1.397 dòng", test: "1.397 dòng", leak: "chưa kiểm" },
          changes: [
            "Seed 42 và chỉ số dòng được lưu để tái lập",
            "Đơn của cùng một khách được gom vào một tập"
          ],
          note: "Lưu chỉ số dòng, đừng chỉ lưu seed: thư viện đổi phiên bản có thể chia khác đi."
        },
        {
          short: "90/5/5",
          type: "pitfall",
          title: "Test 465 dòng quá mỏng để kết luận",
          body: "Tỉ lệ 90/5/5 nghe tiết kiệm nhưng tạo test quá mỏng. Trên 9.312 dòng, test chỉ còn 465 dòng, sai số chuẩn tăng lên khoảng 1,9 điểm phần trăm và một vài dòng đổi nhãn đủ làm accuracy nhảy 2 điểm. Phòng mô phỏng của site coi một tỉ lệ là cân bằng khi train không quá 80%, val và test mỗi tập ít nhất 10%. Vì vậy 80/10/10 là biên an toàn, 70/15/15 là lựa chọn mặc định cho bảng vài nghìn đến vài chục nghìn dòng. Đừng tăng train lên 95% chỉ để accuracy đẹp hơn.",
          focus: ["val", "test", "strat"],
          edges: ["splitter-test", "test-leak"],
          metrics: { train: "8.381 dòng", val: "466 dòng", test: "465 dòng", leak: "dễ xảy ra" },
          changes: [
            "Test co lại còn 465 dòng, sai số tăng gần gấp đôi",
            "Tỉ lệ 90/5/5 bị phòng mô phỏng đánh giá là lệch"
          ],
          note: "Engine của site chặn tỉ lệ lệch khi train trên 80% hoặc val, test dưới 10%."
        },
        {
          short: "Chốt",
          type: "final",
          tone: "final",
          title: "Chốt tỉ lệ, lưu chỉ số, đóng băng test",
          body: "Quy trình chốt gồm: chia stratified 70/15/15 với seed cố định, lưu chỉ số ba tập, đóng băng test cho đến khi mô hình và ngưỡng đã chốt. Ghi lại 6.518 / 1.397 / 1.397 dòng và tỉ lệ churn 22% ở cả ba tập. Chỉ số cuối cùng báo cáo phải đến từ lần chạm test duy nhất, kèm khoảng tin cậy. Bước tiếp theo là kiểm tra rò rỉ, vì một phép chuẩn hóa fit sai chỗ có thể khiến test 1.397 dòng không còn độc lập nữa. Lưu lại một bảng nhỏ ghi tỉ lệ, số dòng và seed để lần sau đối chiếu.",
          focus: "all",
          edges: "all",
          metrics: { train: "6.518 dòng", val: "1.397 dòng", test: "1.397 dòng", leak: "đã tách" },
          changes: [
            "Ba tập được chốt với seed và chỉ số dòng rõ ràng",
            "Test được đóng băng cho đến lần báo cáo cuối",
            "Tỉ lệ churn 22% giữ nguyên ở cả ba tập"
          ],
          note: "Một lần chạm test là một lần đánh đổi: bạn không thể vừa xem test vừa giữ nó độc lập."
        }
      ]
    },

    /* ------------------------------------------------------------------
       Bài 4: rò rỉ dữ liệu
       ------------------------------------------------------------------ */
    "ro-ri": {
      id: "ro-ri",
      module: "lam-sach-chia-tap",
      title: "Rò rỉ dữ liệu",
      shortTitle: "Rò rỉ dữ liệu",
      subtitle: "Mô hình 82% trên test có thể chỉ là 76% thật nếu phép biến đổi đã nhìn thấy test. Bài này lần theo ba đường rò rỉ quen thuộc và đặt mọi phép biến đổi bên trong pipeline.",
      blurb: "Chuẩn hóa trước khi chia, target encoding tính trên toàn bảng và cột biết trước tương lai là ba đường rò rỉ. Bạn sẽ thấy 82% tụt còn 76% khi sửa đúng, và dựng pipeline để con số không còn nói dối.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["rò rỉ", "pipeline", "target encoding", "scaler", "dòng trùng"],
      metrics: [
        { key: "leak", label: "Đường rò rỉ", tone: "coral" },
        { key: "acc", label: "Accuracy test", tone: "blue" },
        { key: "gap", label: "Chênh val-test", tone: "yellow" },
        { key: "rows", label: "Dòng test", tone: "mint" }
      ],
      nodes: [
        { id: "raw", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Bảng gốc", sub: "9.312 dòng, 22% churn" },
        { id: "scaler", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Chuẩn hóa", sub: "fit trên toàn bảng" },
        { id: "model", type: "bolt", x: 625, y: 80, w: 200, h: 70, label: "Mô hình", sub: "82% trên test" },
        { id: "pipe", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Pipeline", sub: "fit trong từng fold" },
        { id: "boundary", type: "clock", x: 340, y: 310, w: 200, h: 70, label: "Mốc thời gian", sub: "cắt theo ngày" },
        { id: "test", type: "server", x: 625, y: 310, w: 200, h: 70, label: "Test 1.397 dòng", sub: "chỉ chấm một lần" },
        { id: "audit", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Kiểm tra rò rỉ", sub: "so val với test" }
      ],
      edges: [
        { id: "raw-scaler", from: "raw", to: "scaler", kind: "data", label: "9.312 dòng" },
        { id: "scaler-model", from: "scaler", to: "model", kind: "data", label: "mean lẫn test" },
        { id: "model-audit", from: "model", to: "audit", kind: "data", label: "82% quá đẹp" },
        { id: "pipe-boundary", from: "pipe", to: "boundary", kind: "control", label: "fit trong fold" },
        { id: "boundary-test", from: "boundary", to: "test", kind: "data", label: "1.397 dòng" },
        { id: "audit-test", from: "audit", to: "test", kind: "data", label: "76% sau khi sửa" },
        { id: "raw-pipe", from: "raw", to: "pipe", kind: "data", label: "nguồn dùng chung" }
      ],
      learn: [
        "Chuẩn hóa và điền thiếu phải <code>fit</code> trên train, không fit trên toàn bảng.",
        "Target encoding dùng <code>out-of-fold</code>, nếu không mỗi dòng test mang theo nhãn của chính nó.",
        "Bỏ 300 dòng trùng bằng <code>drop_duplicates</code> và chia theo nhóm khách để bản sao không nằm ở hai tập.",
        "<code>Val</code> 76% mà test 82% là dấu hiệu rò rỉ; sửa xong test về đúng 76%."
      ],
      steps: [
        {
          short: "Triệu chứng",
          type: "concept",
          title: "Ba đường rò rỉ, một triệu chứng chung",
          body: "Rò rỉ dữ liệu là khi mô hình nhìn thấy thông tin mà lúc dự đoán thật nó không được phép biết. Ba đường quen thuộc: chuẩn hóa fit trên toàn bảng trước khi chia, target encoding tính trên cả test, và các cột ghi nhận sự việc xảy ra sau thời điểm dự đoán. Triệu chứng chung là khoảng cách giữa val và test: val 76% nhưng test 82%, chênh 6 điểm, trong khi đáng lẽ hai tập phải xấp xỉ nhau. Con số 82% rất dễ được chọn để báo cáo, nhưng nó không đến từ khả năng dự đoán mà từ việc test đã bị nhìn thấy.",
          focus: ["raw", "model", "audit"],
          edges: ["scaler-model", "model-audit"],
          metrics: { leak: "chưa rõ", acc: "82%", gap: "6 điểm", rows: "1.397" },
          changes: [
            "Khoảng cách 6 điểm giữa val và test lộ ra",
            "Con số 82% bị nghi ngờ thay vì được báo cáo ngay"
          ],
          note: "Val và test cùng cỡ mẫu mà lệch nhau quá 3 điểm là lúc phải đi tìm rò rỉ."
        },
        {
          short: "Scaler",
          type: "flow",
          title: "Chuẩn hóa fit trên toàn bảng là rò rỉ kín đáo",
          body: "Chuẩn hóa là chỗ rò rỉ kín đáo nhất. Nếu gọi <code>StandardScaler().fit(X)</code> trên toàn bộ 9.312 dòng rồi mới chia, mean và độ lệch chuẩn đã chứa thông tin của 1.397 dòng test. Mức rò rỉ nhỏ, thường chỉ 0,3 đến 0,8 điểm, nên khó phát hiện bằng mắt. Cách đúng là đặt scaler trong <code>Pipeline</code> và để nó fit lại trên từng fold train. Với imputer cũng vậy: median phải tính trên train, không tính trên toàn bảng. Quy tắc gọn: mọi thứ học từ dữ liệu đều phải fit sau khi chia. Sai ở bước này thì mọi chỉ số phía sau đều nhiễu.",
          focus: ["scaler", "raw", "pipe"],
          edges: ["raw-scaler", "raw-pipe"],
          metrics: { leak: "scaler", acc: "82%", gap: "6 điểm", rows: "1.397" },
          changes: [
            "Scaler được chuyển vào pipeline và fit trên train",
            "Median của imputer không còn tính từ dòng test"
          ],
          note: "Rò rỉ do scaler thường nhỏ, nên đừng bỏ qua chỉ vì khoảng cách val-test chỉ 0,5 điểm."
        },
        {
          short: "Encoding",
          type: "detail",
          title: "Target encoding và cột của tương lai",
          body: "Target encoding nguy hiểm hơn vì rò rỉ rất mạnh. Thay mỗi quận bằng <code>target encoding</code> của tỉ lệ churn, nếu tính trên toàn bảng thì giá trị của một dòng test đã chứa chính nhãn của nó. Với quận ít dòng, mô hình gần như đọc được đáp án. Cách đúng là tính trong từng fold, dùng out-of-fold encoding, hoặc thêm làm mịn theo số dòng. Đường rò rỉ thứ ba là cột tương lai: số lần gọi hỗ trợ trong tháng sau ngày churn là biến chỉ có sau khi khách đã rời đi. Kiểm tra bằng cách hỏi mỗi cột: giá trị này có tồn tại trước thời điểm dự đoán không.",
          focus: ["raw", "model", "boundary"],
          edges: ["scaler-model", "boundary-test"],
          metrics: { leak: "target encoding", acc: "82%", gap: "6 điểm", rows: "1.397" },
          changes: [
            "Target encoding chuyển sang out-of-fold theo từng fold",
            "Cột ghi nhận sau ngày churn bị loại khỏi danh sách biến"
          ],
          note: "Hỏi từng cột một câu duy nhất: lúc dự đoán, giá trị này đã có chưa."
        },
        {
          short: "Dòng trùng",
          type: "pitfall",
          title: "Bản sao nằm cả hai tập là học thuộc",
          body: "Dòng trùng là đường rò rỉ bị bỏ qua nhiều nhất. Bảng gốc có 300 dòng trùng, chiếm 3%; nếu chia ngẫu nhiên, một bản sao có thể vào train còn bản kia vào test, và mô hình chỉ cần học thuộc. Cùng một khách hàng có nhiều đơn cũng tạo hiệu ứng tương tự, dù các dòng không hoàn toàn giống nhau. Hãy bỏ trùng trước khi chia, và chia theo nhóm khách nếu mỗi khách xuất hiện nhiều lần. Với dữ liệu thời gian, cắt theo mốc ngày thay vì chia ngẫu nhiên để test luôn nằm sau train.",
          focus: ["raw", "test", "audit"],
          edges: ["audit-test", "raw-pipe"],
          metrics: { leak: "dòng trùng", acc: "82%", gap: "6 điểm", rows: "1.397" },
          changes: [
            "300 dòng trùng bị bỏ trước khi chia",
            "Dữ liệu thời gian được cắt theo mốc ngày thay vì chia ngẫu nhiên"
          ],
          note: "Nếu mỗi khách có nhiều dòng, chia ngẫu nhiên vẫn rò rỉ dù đã bỏ trùng hoàn toàn."
        },
        {
          short: "Sửa",
          type: "final",
          tone: "final",
          title: "Test về đúng 76%, con số trung thực",
          body: "Sau khi sửa, test 1.397 dòng trả về 76%, đúng bằng val, khoảng cách còn 0 điểm. Đó là con số trung thực, dù kém hấp dẫn hơn 82%. Quy trình chuẩn gồm: chia trước, fit mọi phép biến đổi trong pipeline, dùng out-of-fold cho encoding, bỏ trùng và chia theo nhóm, rồi đóng băng test. Ghi lại từng thay đổi và chạy lại toàn bộ để chắc kết quả không phụ thuộc một lần chia may mắn. Một mô hình 76% trung thực vẫn hơn một mô hình 82% chỉ đẹp trên giấy. Đừng giữ con số 82% chỉ vì nó đẹp trong slide.",
          focus: "all",
          edges: "all",
          metrics: { leak: "đã chặn", acc: "76%", gap: "0 điểm", rows: "1.397" },
          changes: [
            "Test giảm từ 82% về 76%, bằng đúng val",
            "Toàn bộ phép biến đổi chạy trong pipeline",
            "Quy trình được chạy lại từ đầu để xác nhận kết quả"
          ],
          note: "Chênh val-test bằng 0 là dấu hiệu tốt, nhưng vẫn phải kiểm tra cột tương lai bằng tay."
        }
      ]
    }
  });

  T.practice.push(
    {
      id: "p-o-thieu",
      module: "lam-sach-chia-tap",
      tag: "MISSING",
      tags: ["MISSING"],
      title: "Bảng thiếu 4% ô, nhóm muốn dropna()",
      scenario: "Bảng khách hàng của một chuỗi cửa hàng có 10.000 dòng và 12 cột. Cột tuổi thiếu 18%, cột thu nhập thiếu 9%, các cột còn lại thiếu lẻ tẻ, tổng cộng 4% số ô. Có thêm 300 dòng trùng, chiếm 3%. Một bạn trong nhóm đề nghị gọi dropna() để bảng sạch tuyệt đối trước khi huấn luyện mô hình churn. Bạn kiểm tra nhanh và thấy cách đó sẽ bỏ hơn 30% số dòng, trong đó phần lớn là khách không khai thu nhập, đúng nhóm mà mô hình cần phân biệt. Bạn cần chọn cách xử lý vừa giữ được dữ liệu vừa không tạo giá trị giả.",
      metrics: [
        { label: "Dòng gốc", value: "10.000" },
        { label: "Ô thiếu", value: "4%" },
        { label: "Dòng trùng", value: "300", danger: true }
      ],
      options: [
        "Gọi dropna() để bỏ mọi dòng có ít nhất một ô trống, sau đó huấn luyện trên phần còn lại.",
        "Điền median cho cột số, nhãn khong_ro cho cột chữ, thêm cờ is_missing, rồi bỏ dòng trùng trước khi chia.",
        "Điền 0 cho mọi ô trống để giữ nguyên số dòng và tránh lỗi mô hình.",
        "Xóa hẳn cột thu nhập vì đây là cột thiếu nhiều thứ hai trong bảng."
      ],
      correct: 1,
      explain: "dropna() bỏ cả dòng chỉ vì một ô trống, nên mất hơn 30% dữ liệu và làm lệch phân phối về nhóm khai đủ thông tin. Điền 0 tạo ra thu nhập bằng 0 cho người có thu nhập thật, mô hình học một quan hệ không tồn tại. Xóa cột thu nhập mất một biến mạnh và không giải quyết cột tuổi thiếu 18%. Cách đúng là điền median cho cột số, nhãn <code>khong_ro</code> cho cột chữ, thêm cờ is_missing để giữ tín hiệu thiếu, bỏ 300 dòng trùng rồi mới chia tập. Bảng mẫu của phòng mô phỏng làm đúng như vậy và còn 9.312 dòng, đạt 90,4/100."
    },
    {
      id: "p-ngoai-lai",
      module: "lam-sach-chia-tap",
      tag: "OUTLIER",
      tags: ["OUTLIER"],
      title: "112 đơn lớn và đề nghị xóa cho gọn",
      scenario: "Cột giá trị đơn hàng của một cửa hàng online có 9.312 dòng sau làm sạch. Median là 265.000 đồng, mean là 312.000 đồng, và có 112 đơn vượt 1.030.000 đồng, chiếm 1,2%. Đơn lớn nhất là 12.000.000 đồng của một khách mua sỉ, hóa đơn có đủ chứng từ. Trưởng nhóm đề nghị xóa mọi đơn trên 1.000.000 đồng để biểu đồ nhìn gọn và mean về khoảng 265.000 đồng. Bạn biết 112 đơn đó đóng góp một phần doanh thu không nhỏ và có thể là tín hiệu về nhóm khách hàng doanh nghiệp. Bạn cần chọn cách xử lý đúng cho cả báo cáo lẫn mô hình.",
      metrics: [
        { label: "Dòng sạch", value: "9.312" },
        { label: "Ngoại lai", value: "112", danger: true },
        { label: "Mean", value: "312.000" }
      ],
      options: [
        "Xóa toàn bộ 112 đơn vượt 1.030.000 đồng để mean trở về đúng.",
        "Thay 112 giá trị lớn bằng mean của cột để không mất dòng nào.",
        "Giữ nguyên, gắn cờ is_outlier, cắt trần khi đưa vào mô hình và kiểm tra nghiệp vụ các đơn lớn.",
        "Bỏ cột giá trị đơn và dùng số lượng sản phẩm thay thế."
      ],
      correct: 2,
      explain: "Xóa 112 đơn là xóa bằng chứng về một nhóm khách hàng thật, đồng thời làm mất 1,2% dữ liệu và có thể làm doanh thu báo cáo thấp hơn thực tế. Thay bằng mean tạo ra 112 giá trị giống nhau, không tồn tại trên hóa đơn nào và làm mất phân biệt giữa đơn lớn với đơn vừa. Bỏ cột giá trị đơn là bỏ biến quan trọng nhất của bài toán. Cách đúng là giữ nguyên bản gốc, gắn cờ <code>is_outlier</code> cho 112 dòng, cắt trần tại 1.030.000 đồng khi đưa vào mô hình tuyến tính, và hỏi nghiệp vụ xem các đơn sỉ có nên tách riêng."
    },
    {
      id: "p-chia-tap",
      module: "lam-sach-chia-tap",
      tag: "SPLIT",
      tags: ["SPLIT"],
      title: "Hai lần chia, hai con số accuracy",
      scenario: "Nhóm của bạn có 9.312 dòng đã làm sạch và cần chia train, val, test. Một thành viên đề xuất 90/5/5 để mô hình học được nhiều nhất: train 8.381 dòng, val 466 dòng, test 465 dòng. Lần chạy đầu cho accuracy 84% trên test, lần chia khác lại 79%, và cả nhóm bắt đầu tranh luận nên giữ lần nào. Bạn để ý tập test chỉ có 465 dòng, trong khi nhãn churn chiếm 22% và một vài lớp phụ chỉ có vài chục dòng. Bạn cần chọn cách chia vừa đủ dữ liệu học vừa cho con số đánh giá đáng tin.",
      metrics: [
        { label: "Train", value: "8.381" },
        { label: "Test", value: "465", danger: true },
        { label: "Nhãn churn", value: "22%" }
      ],
      options: [
        "Chia lại ngẫu nhiên vài lần, giữ lần nào cho test cao nhất.",
        "Tăng train lên 95% để mô hình học nhiều hơn, test 5% vẫn đủ.",
        "Dùng test để chọn siêu tham số vì test mới là dữ liệu thật.",
        "Chia stratified 70/15/15 với random_state cố định, test khoảng 1.397 dòng và chỉ chấm một lần."
      ],
      correct: 3,
      explain: "Với 465 dòng test, sai số chuẩn của accuracy quanh 80% là khoảng 1,9 điểm phần trăm, nên chênh 5 điểm giữa hai lần chia có thể chỉ là nhiễu. Giữ lần có test cao nhất là chọn kết quả theo test, biến test thành tập huấn luyện ngầm và làm con số báo cáo mất giá trị. Tăng train lên 95% chỉ làm test mỏng hơn. Dùng test để chọn siêu tham số cũng là rò rỉ. Cách đúng là chia stratified 70/15/15 với <code>random_state=42</code>: 6.518 train, 1.397 val, 1.397 test, giữ 22% churn ở cả ba tập, chọn tham số trên val và chấm test đúng một lần."
    }
  );

  T.cheatsheets.push({
    id: "cleaning",
    num: "02",
    module: "lam-sach-chia-tap",
    title: "Làm sạch và chia tập",
    intro: "Tra nhanh khi làm sạch và chia tập: bảng so sánh cách xử lý ô thiếu với ngoại lai, lệnh pandas điền thiếu và cắt trần, đoạn chia 70/15/15 có stratify, cùng checklist chống rò rỉ trước khi huấn luyện.",
    cards: [
      {
        title: "Ô thiếu và ngoại lai: chọn cách xử lý",
        wide: true,
        html: `<p>Hai vấn đề khác nhau nên cách xử lý cũng khác. Ô thiếu là thiếu thông tin, còn ngoại lai là thông tin thật nhưng cực đoan; xóa cả hai theo cùng một phản xạ là sai.</p>
<table class="cheat-table">
<thead><tr><th>Tình huống</th><th>Phát hiện</th><th>Xử lý mặc định</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><b>Ô thiếu dưới 5%</b></td><td><code>df.isna().mean()</code></td><td>Bỏ dòng nếu mất dưới 10% tổng dòng</td><td>Đếm lại sau khi bỏ</td></tr>
<tr><td><b>Ô thiếu 5 đến 40%</b></td><td>tỉ lệ thiếu theo cột</td><td>Median cho số, mode cho chữ</td><td>Tính median trên train</td></tr>
<tr><td><b>Ô thiếu trên 40%</b></td><td>so sánh giữa các cột</td><td>Bỏ cột, thêm cờ thiếu</td><td>Đừng điền quá nhiều</td></tr>
<tr><td><b>Ngoại lai đuôi phải</b></td><td>Q1, Q3, IQR</td><td>Cắt trần tại Q3 + 1,5 IQR</td><td>Giữ cờ để kiểm toán</td></tr>
<tr><td><b>Ngoại lai do nhập lỗi</b></td><td>kiểm tra 3 dòng lớn nhất</td><td>Sửa hoặc bỏ đúng dòng lỗi</td><td>Xác nhận với nghiệp vụ</td></tr>
<tr><td><b>Dòng trùng</b></td><td><code>df.duplicated().sum()</code></td><td>Bỏ trùng trước khi chia</td><td>3% là 300 dòng</td></tr>
</tbody>
</table>
<p>Bảng mẫu 10.000 dòng, thiếu 4% ô và trùng 3% dòng: sau xử lý còn 9.312 dòng, điểm chất lượng 90,4/100.</p>`
      },
      {
        title: "pandas: soi và điền ô thiếu",
        wide: true,
        html: `<p>Đo trước, sửa sau. Dòng đầu in tỉ lệ thiếu từng cột; các dòng sau điền theo kiểu dữ liệu và giữ lại dấu vết của ô trống.</p>
<pre class="formula"><code>import pandas as pd

df = pd.read_csv("khach_hang.csv")
print(df.isna().mean().round(3).sort_values(ascending=False))

num_cols = ["tuoi", "thu_nhap"]
df["thieu_thu_nhap"] = df["thu_nhap"].isna().astype("int8")
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

df["quan"] = df["quan"].fillna("khong_ro")
df = df.drop_duplicates()

print(len(df), df.duplicated().sum())</code></pre>
<p>Với bảng 10.000 dòng, thiếu 4% ô và trùng 3% dòng, kết quả còn 9.312 dòng. Cờ <code>thieu_thu_nhap</code> phải tạo trước khi điền, nếu không sẽ mất thông tin.</p>`
      },
      {
        title: "Ngoại lai theo IQR và cắt trần",
        html: `<p>Tính hàng rào trên cột tiền, sau đó vừa gắn cờ vừa cắt trần. Bản gốc vẫn giữ để báo cáo, cột cắt trần chỉ dùng cho mô hình.</p>
<pre class="formula"><code>q1, q3 = df["tien"].quantile([0.25, 0.75])
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print(q1, q3, iqr, upper)
# 180000 520000 340000 1030000

df["is_outlier"] = (df["tien"] &gt; upper).astype("int8")
df["tien_clip"] = df["tien"].clip(upper=upper)
print(df["is_outlier"].sum())   # 112</code></pre>
<p>112 dòng vượt trần, mean giảm từ 312.000 xuống 298.000 đồng. Chỉ xóa khi đã xác nhận đó là lỗi nhập liệu.</p>`
      },
      {
        title: "Chia 70/15/15 có stratify",
        wide: true,
        html: `<p>Chia hai lần: lần đầu tách 30% ra khỏi train, lần hai tách đôi phần 30% thành val và test. Cả hai lần đều truyền <code>stratify</code> để giữ tỉ lệ nhãn.</p>
<pre class="formula"><code>from sklearn.model_selection import train_test_split

X_train, X_tmp, y_train, y_tmp = train_test_split(
    X, y, test_size=0.30, stratify=y, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_tmp, y_tmp, test_size=0.50, stratify=y_tmp, random_state=42
)

print(len(X_train), len(X_val), len(X_test))
# 6518 1397 1397</code></pre>
<p>9.312 dòng, nhãn churn 22%: train 1.434, val 307, test 307 dòng churn. Test 1.397 dòng cho sai số khoảng ±2 điểm; test 465 dòng thì không.</p>`
      },
      {
        title: "Checklist chống rò rỉ",
        html: `<ul>
<li>Chia train, val, test trước mọi phép biến đổi.</li>
<li>Fit imputer, scaler, encoder bên trong <code>Pipeline</code>, chỉ trên train.</li>
<li>Target encoding dùng out-of-fold, không tính trên toàn bảng.</li>
<li>Bỏ dòng trùng trước khi chia; chia theo nhóm khách nếu một khách có nhiều dòng.</li>
<li>Loại cột chỉ có giá trị sau thời điểm dự đoán.</li>
<li>Chỉ chạm test một lần, ghi seed và chỉ số dòng của cả ba tập.</li>
</ul>
<p>Val 76% mà test 82% là chênh 6 điểm, dấu hiệu rò rỉ. Sửa xong test về 76%, khoảng cách còn 0 điểm.</p>`
      }
    ]
  });
})();
