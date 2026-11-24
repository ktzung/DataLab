/* DataLab — dữ liệu mô phỏng làm sạch, chia tập và đánh giá mô hình */
window.DATA_SEED = {
  lab: {
    heading: "Ba lát cắt của dữ liệu",
    intro: "Đo chất lượng một bảng dữ liệu sau khi xử lý, kiểm tra tỉ lệ chia tập và bắt mô hình kém hơn baseline. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "clean",
        label: "Làm sạch",
        title: "Chất lượng bảng",
        badge: "giữ %",
        runLabel: "Đo chất lượng",
        hint: "Mỗi 1% thiếu trừ 1,5 điểm, mỗi 1% trùng trừ 1,2 điểm. Dòng giữ lại = tổng dòng × (1 − thiếu) × (1 − trùng). Từ 70 điểm mới dùng được.",
        fields: [
          { id: "rows", label: "Tổng số dòng", type: "number", min: 100, max: 100000, step: 100, value: 10000 },
          { id: "missing", label: "Ô thiếu (%)", type: "number", min: 0, max: 40, step: 1, value: 4 },
          { id: "duplicate", label: "Dòng trùng (%)", type: "number", min: 0, max: 30, step: 1, value: 3 }
        ]
      },
      {
        id: "split",
        label: "Chia tập",
        title: "Train / val / test",
        badge: "70/15/15",
        runLabel: "Kiểm tra tỉ lệ",
        hint: "Tập test lấy phần còn lại. Chỉ cân bằng khi train không quá 80%, val và test mỗi tập ít nhất 10% — đủ để đánh giá mà không rò rỉ.",
        fields: [
          { id: "rows", label: "Tổng số dòng", type: "number", min: 100, max: 50000, step: 100, value: 1000 },
          { id: "trainPct", label: "Train (%)", type: "number", min: 50, max: 90, step: 5, value: 70 },
          { id: "valPct", label: "Val (%)", type: "number", min: 5, max: 25, step: 5, value: 15 }
        ]
      },
      {
        id: "model",
        label: "Mô hình",
        title: "Lift so với baseline",
        badge: "lift",
        runLabel: "Đánh giá mô hình",
        hint: "Lift = accuracy − baseline. Từ 5 điểm trở lên mới đáng triển khai; số lỗi = số dòng test × (1 − accuracy).",
        fields: [
          { id: "accuracy", label: "Accuracy (%)", type: "number", min: 50, max: 99, step: 1, value: 82 },
          { id: "baseline", label: "Baseline (%)", type: "number", min: 30, max: 99, step: 1, value: 76 },
          { id: "testRows", label: "Dòng test", type: "number", min: 100, max: 50000, step: 100, value: 1000 }
        ]
      }
    ],
    defaults: {
      clean: { rows: 10000, missing: 4, duplicate: 3 },
      split: { rows: 1000, trainPct: 70, valPct: 15 },
      model: { accuracy: 82, baseline: 76, testRows: 1000 }
    },
    presets: {
      clean: [
        { id: "dl-clean-ok", label: "Bảng sạch 4%/3%", dataset: { rows: 10000, missing: 4, duplicate: 3 } },
        { id: "dl-clean-mid", label: "Thiếu 18%", dataset: { rows: 10000, missing: 18, duplicate: 6 } },
        { id: "dl-clean-bad", label: "Bảng bẩn 24%/10%", dataset: { rows: 5000, missing: 24, duplicate: 10 } }
      ],
      split: [
        { id: "dl-split-70", label: "70 / 15 / 15", dataset: { rows: 1000, trainPct: 70, valPct: 15 } },
        { id: "dl-split-80", label: "80 / 10 / 10", dataset: { rows: 1000, trainPct: 80, valPct: 10 } },
        { id: "dl-split-skew", label: "90 / 5 / 5", dataset: { rows: 1000, trainPct: 90, valPct: 5 } }
      ],
      model: [
        { id: "dl-model-lift", label: "Lift 6 điểm", dataset: { accuracy: 82, baseline: 76, testRows: 1000 } },
        { id: "dl-model-flat", label: "Ngang baseline", dataset: { accuracy: 76, baseline: 76, testRows: 1000 } },
        { id: "dl-model-strong", label: "Lift 9, test 5000", dataset: { accuracy: 88, baseline: 79, testRows: 5000 } }
      ]
    },
    examples: [
      { id: "ex-clean", kind: "clean", label: "Bảng thiếu 18% còn dùng được?", dataset: { rows: 10000, missing: 18, duplicate: 6 } },
      { id: "ex-split", kind: "split", label: "Chia 90/5/5 có ổn?", dataset: { rows: 1000, trainPct: 90, valPct: 5 } },
      { id: "ex-model", kind: "model", label: "Mô hình ngang baseline", dataset: { accuracy: 76, baseline: 76, testRows: 1000 } }
    ],
    missions: [
      {
        id: "m-clean-kept",
        kind: "clean",
        title: "Bảng sạch giữ bao nhiêu dòng?",
        prompt: "Bảng 10.000 dòng, thiếu 4% ô và trùng 3% dòng. Ghi lại số dòng còn dùng được sau khi bỏ ô thiếu và dòng trùng.",
        metric: "kept",
        expect: 9312,
        hint: "10.000 × 0,96 × 0,97 = 9.312 dòng.",
        dataset: { rows: 10000, missing: 4, duplicate: 3 }
      },
      {
        id: "m-clean-score",
        kind: "clean",
        title: "Bảng bẩn còn mấy điểm?",
        prompt: "Bảng 5.000 dòng, thiếu 24% ô và trùng 10% dòng. Cho engine báo điểm chất lượng trên thang 100.",
        metric: "quality",
        expect: 52,
        hint: "100 − 24 × 1,5 − 10 × 1,2 = 100 − 36 − 12 = 52 điểm.",
        dataset: { rows: 5000, missing: 24, duplicate: 10 }
      },
      {
        id: "m-split-balanced",
        kind: "split",
        title: "Tỉ lệ cân bằng",
        prompt: "Chia 1.000 dòng theo 70% train và 15% val, phần còn lại là test. Engine phải kết luận cân bằng.",
        metric: "balanced",
        expect: 1,
        hint: "70 / 15 / 15: train không quá 80, val và test đều từ 10% trở lên.",
        dataset: { rows: 1000, trainPct: 70, valPct: 15 }
      },
      {
        id: "m-split-testrows",
        kind: "split",
        title: "Test 20% của 5.000 dòng",
        prompt: "Chia 5.000 dòng với train 60% và val 20%. Ghi lại số dòng test.",
        metric: "testRows",
        expect: 1000,
        hint: "Test = 100 − 60 − 20 = 20%; 20% của 5.000 là 1.000 dòng.",
        dataset: { rows: 5000, trainPct: 60, valPct: 20 }
      },
      {
        id: "m-model-lift",
        kind: "model",
        title: "Hơn baseline bao nhiêu?",
        prompt: "Mô hình đạt 82% accuracy, baseline 76% trên 1.000 dòng test. Ghi lại lift theo điểm phần trăm.",
        metric: "lift",
        expect: 6,
        hint: "82 − 76 = 6 điểm lift, vượt ngưỡng 5.",
        dataset: { accuracy: 82, baseline: 76, testRows: 1000 }
      },
      {
        id: "m-model-errors",
        kind: "model",
        title: "Đếm lỗi trên test",
        prompt: "Mô hình đạt 91% accuracy trên 1.000 dòng test. Ghi lại số dòng dự đoán sai.",
        metric: "errors",
        expect: 90,
        hint: "Sai 9% của 1.000 dòng là 90 dòng.",
        dataset: { accuracy: 91, baseline: 76, testRows: 1000 }
      }
    ]
  }
};

window.DATA_SEED.home = {
  "title": "DataLab — Dữ liệu, nhìn thấy từng bước",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một bảng bẩn.<br><span class=\"hl\">Thấy</span> cả quy trình.",
  "sub": "Đi từ thu thập, làm sạch, chia tập đến huấn luyện và đánh giá mô hình. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng đo chất lượng dữ liệu, kiểm tra tỉ lệ chia và bắt mô hình kém hơn baseline ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Chất lượng dữ liệu, tỉ lệ chia và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một đường ống dữ liệu",
  "modesSub": "Không chỉ đọc định nghĩa. Bạn xem dữ liệu đi qua từng bước, tự chấm một bảng cụ thể và sửa hiểu nhầm ngay.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng bảng, phép biến đổi và mô hình hiện ra theo bước, kèm một đường ống cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: ô thiếu, dòng trùng, rò rỉ dữ liệu và mô hình ngang baseline.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Đo chất lượng bảng, kiểm tra tỉ lệ train/val/test và đánh giá lift, kèm 6 nhiệm vụ chấm điểm.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng kiểm dữ liệu, công thức chia tập, lệnh pandas và checklist chống rò rỉ — tra nhanh khi làm bài.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ dữ liệu thô đến mô hình có thể tin: mỗi module trả lời một câu hỏi lớn của khai phá dữ liệu.",
  "faq": [
    {
      "q": "Đây có phải công cụ làm sạch dữ liệu thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: ước lượng dòng giữ lại, điểm chất lượng, tỉ lệ chia và lift. Đủ để thấy vì sao một bảng chưa dùng được — không thay thế pandas, dbt hay một pipeline thật."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: 10.000 dòng, 4% ô thiếu, 3% dòng trùng. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được, không phụ thuộc dữ liệu ngẫu nhiên."
    },
    {
      "q": "Có cần biết lập trình trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ và ví dụ; mã pandas xuất hiện ở cheatsheet để tra khi cần. Người đã biết Python sẽ đi nhanh hơn ở phần mô hình."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "D",
  "brand": "DataLab",
  "hero": {
    "bar": "data://pipeline",
    "title": "làm sạch · chia tập · huấn luyện · đánh giá",
    "aria": "Dữ liệu đi qua làm sạch, chia tập, huấn luyện và đánh giá",
    "states": [
      {
        "label": "Raw"
      },
      {
        "label": "Clean"
      },
      {
        "label": "Split"
      },
      {
        "label": "Train"
      }
    ],
    "final": "OK",
    "queueSmall": "Kết quả",
    "queueChip": "Sạch",
    "queueVerdict": "0 dòng lỗi",
    "frames": [
      {
        "small": "Dòng giữ lại",
        "b": "93%",
        "cls": "hit"
      },
      {
        "small": "Rò rỉ dữ liệu",
        "b": "chặn",
        "cls": "miss"
      },
      {
        "small": "Lớp mô hình",
        "b": "3"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một bảng dữ liệu.<br>Ba câu hỏi.",
    "p": "Đo chất lượng sau khi bỏ ô thiếu và dòng trùng, kiểm tra tỉ lệ train/val/test và đánh giá mô hình có hơn baseline đủ để triển khai. Sáu nhiệm vụ chấm điểm ngay trên kết quả, kèm gợi ý sửa từng cấu hình yếu.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "file",
        "label": "Nguồn",
        "sub": "CSV/API",
        "hot": true
      },
      {
        "icon": "grid",
        "label": "Làm sạch",
        "sub": "thiếu/trùng"
      },
      {
        "icon": "check",
        "label": "Chia tập",
        "sub": "70/15/15"
      },
      {
        "icon": "bolt",
        "label": "Train",
        "sub": "mô hình",
        "hot": true
      },
      {
        "icon": "star",
        "label": "Val",
        "sub": "chọn tham số"
      },
      {
        "icon": "server",
        "label": "Test",
        "sub": "đánh giá"
      },
      {
        "icon": "signal",
        "label": "Lift",
        "sub": "+6 điểm"
      }
    ]
  }
};
window.DATALAB.home = window.DATA_SEED.home;
