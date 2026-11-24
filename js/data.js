/* DataLab — phần 1: nền tảng dữ liệu, bốn bài mở đầu, tình huống và cheatsheet */
window.DATALAB = window.DATALAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  "use strict";
  const T = window.DATALAB;

  T.modules = T.modules || [];
  T.lessons = T.lessons || {};
  T.practice = T.practice || [];
  T.cheatsheets = T.cheatsheets || [];

  /* Một thay đổi ở bước: giữ đủ ba trường cho QA, và tự in ra chuỗi đọc được. */
  function ch(label, before, after) {
    return {
      label: label,
      before: before,
      after: after,
      toString: function () {
        return label + ": " + before + " -> " + after;
      }
    };
  }

  /* Card cheatsheet: khai báo body, bộ render của site đọc html. */
  function card(spec) {
    spec.html = spec.body;
    return spec;
  }

  /* Metrics của một bước: mảng 4 mục đúng thứ tự, đồng thời gắn giá trị theo
     khóa để dải chỉ số của site đọc được bằng step.metrics[key]. */
  function sm(defs, values) {
    const out = [];
    defs.forEach(function (d) {
      out.push({ key: d.key, label: d.label, value: values[d.key], tone: d.tone });
      out[d.key] = values[d.key];
    });
    return out;
  }

  const m1 = [
    { key: "question", label: "Câu hỏi", tone: "blue" },
    { key: "rows", label: "Số dòng", tone: "mint" },
    { key: "grain", label: "Đơn vị", tone: "yellow" },
    { key: "risk", label: "Rủi ro", tone: "coral" }
  ];

  const m2 = [
    { key: "kind", label: "Kiểu", tone: "blue" },
    { key: "scale", label: "Thang đo", tone: "mint" },
    { key: "trap", label: "Bẫy", tone: "yellow" },
    { key: "fix", label: "Cách xử lý", tone: "coral" }
  ];

  const m3 = [
    { key: "rows", label: "Số dòng", tone: "blue" },
    { key: "key", label: "Khóa", tone: "mint" },
    { key: "join", label: "Phép nối", tone: "yellow" },
    { key: "risk", label: "Rủi ro", tone: "coral" }
  ];

  const m4 = [
    { key: "missing", label: "Ô thiếu", tone: "blue" },
    { key: "dup", label: "Dòng trùng", tone: "mint" },
    { key: "score", label: "Điểm", tone: "yellow" },
    { key: "verdict", label: "Kết luận", tone: "coral" }
  ];

  T.modules.push({
    id: "nen-tang-du-lieu",
    num: "01",
    title: "Nền tảng dữ liệu",
    tone: "blue",
    blurb: "Bốn bài mở đầu đặt nền cho mọi việc làm dữ liệu: bắt đầu từ câu hỏi thay vì từ tệp, ghi đúng kiểu cho từng cột, giữ bảng có khóa để nối không nhân dòng, và đo chất lượng trước khi huấn luyện. Ví dụ lấy từ quán cà phê và lớp học.",
    lessons: ["cau-hoi-du-lieu", "kieu-du-lieu", "bang-khoa", "do-chat-luong"]
  });

  T.lessons["cau-hoi-du-lieu"] = {
    id: "cau-hoi-du-lieu",
    module: "nen-tang-du-lieu",
    title: "Dữ liệu thô và câu hỏi",
    shortTitle: "Câu hỏi dữ liệu",
    subtitle: "Từ câu hỏi đến bảng phân tích",
    blurb: "Trước khi mở tệp, hãy viết câu hỏi cần trả lời và đơn vị phân tích. Bài này đi theo chuỗi cà phê: 12.000 dòng bán hàng, 4.000 hóa đơn, 1.800 dòng thiếu giờ, để thấy dữ liệu thô trả lời sai câu hỏi đúng.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["câu hỏi", "dữ liệu thô", "đơn vị phân tích", "POS", "thiếu dữ liệu"],
    metrics: m1,
    nodes: [
      { id: "q", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Câu hỏi kinh doanh", sub: "sáng hay chiều đông hơn" },
      { id: "pos", type: "disk", x: 340, y: 80, w: 200, h: 70, label: "Máy POS", sub: "xuất CSV mỗi tối" },
      { id: "raw", type: "file", x: 625, y: 80, w: 200, h: 70, label: "Bảng thô 12.000 dòng", sub: "mỗi dòng một món" },
      { id: "dict", type: "book", x: 55, y: 310, w: 200, h: 70, label: "Từ điển cột", sub: "9 cột và đơn vị" },
      { id: "clean", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Bảng phân tích", sub: "4.000 hóa đơn" },
      { id: "answer", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Câu trả lời", sub: "khung giờ đông khách" },
      { id: "gap", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Ô giờ bị thiếu", sub: "1.800 dòng, 15%" }
    ],
    edges: [
      { id: "q-pos", from: "q", to: "pos", kind: "request", label: "yêu cầu số liệu" },
      { id: "pos-raw", from: "pos", to: "raw", kind: "data", label: "xuất CSV" },
      { id: "raw-dict", from: "raw", to: "dict", kind: "data", label: "9 cột" },
      { id: "dict-clean", from: "dict", to: "clean", kind: "control", label: "chuẩn hóa" },
      { id: "raw-clean", from: "raw", to: "clean", kind: "data", label: "12.000 dòng" },
      { id: "gap-clean", from: "gap", to: "clean", kind: "data", label: "loại ô thiếu giờ" },
      { id: "clean-answer", from: "clean", to: "answer", kind: "data", label: "tỉ lệ theo giờ" }
    ],
    learn: [
      "<strong>Câu hỏi</strong> phải viết trước khi mở tệp dữ liệu.",
      "Một bảng có thể chứa nhiều <strong>đơn vị phân tích</strong> khác nhau.",
      "Dùng <code>groupby</code> theo mã hóa đơn trước khi tính trung bình.",
      "Thiếu dữ liệu <strong>có hệ thống</strong> không sửa được bằng cách xóa dòng."
    ],
    steps: [
      {
        short: "Câu hỏi trước",
        type: "concept",
        title: "Viết câu hỏi trước khi mở tệp",
        body: "Đừng mở tệp trước rồi tìm xem dữ liệu có gì. Hãy viết câu hỏi bằng một câu, kèm mốc thời gian và phạm vi: chẳng hạn quán cà phê muốn biết trong sáu tháng gần nhất, khung 6 đến 10 giờ sáng hay 14 đến 18 giờ chiều bán được nhiều ly hơn. Câu hỏi đó quyết định bạn cần cột nào: thời điểm bán, số ly, mã hóa đơn, cửa hàng. Khi câu hỏi mơ hồ, mọi cột đều có vẻ hữu ích và bảng sẽ phình ra vô ích. Một câu hỏi tốt phải trả lời được bằng phép đếm hoặc <code>AVG</code> trên một bảng xác định, không cần hỏi lại người đặt hàng.",
        focus: ["q", "pos", "raw"],
        edges: ["q-pos", "pos-raw"],
        metrics: sm(m1, { question: "sáng hay chiều", rows: "0", grain: "chưa xác định", risk: "câu hỏi mơ hồ" }),
        changes: [
          ch("Phạm vi câu hỏi", "chưa có", "sáu tháng, ba cửa hàng"),
          ch("Cột cần lấy", "chưa rõ", "thời điểm, số ly, mã hóa đơn")
        ],
        note: "Câu hỏi càng hẹp thì bảng cần càng ít cột, và tỉ lệ thiếu càng dễ kiểm."
      },
      {
        short: "Nguồn dữ liệu",
        type: "flow",
        title: "Ba tệp POS và 15% ô giờ trống",
        body: "Ba cửa hàng xuất tệp CSV từ máy POS mỗi tối. Tệp gộp có 12.000 dòng và 9 cột: mã hóa đơn, thời điểm, mã món, tên món, số lượng, đơn giá, cửa hàng, nhân viên, ghi chú. Cột thời điểm là chỗ hay hỏng nhất: 1.800 dòng, tức 15%, chỉ có ngày mà mất giờ vì máy ở cửa hàng thứ ba dùng phần mềm cũ. Nếu bỏ qua, câu hỏi sáng hay chiều sẽ được trả lời bằng 85% dữ liệu, và phần thiếu lại rơi đúng vào một cửa hàng. Bước này chỉ kiểm tra nguồn, chưa sửa gì: ghi lại ai xuất, lúc nào, thiếu bao nhiêu, trước khi nghĩ tới làm sạch.",
        focus: ["pos", "raw", "dict"],
        edges: ["pos-raw", "raw-dict"],
        metrics: sm(m1, { question: "khung giờ bán chạy", rows: "12.000", grain: "một món", risk: "thiếu 15% giờ" }),
        changes: [
          ch("Nguồn dữ liệu", "chưa kiểm", "3 tệp POS, 12.000 dòng"),
          ch("Tỉ lệ thiếu giờ", "chưa biết", "1.800 dòng, 15%")
        ],
        note: "Ghi lại người xuất và thời điểm xuất trước khi sửa bất kỳ ô nào."
      },
      {
        short: "Đơn vị phân tích",
        type: "detail",
        title: "Một dòng là một món, không phải một hóa đơn",
        body: "12.000 dòng không phải 12.000 hóa đơn. Mỗi dòng là một món, và trung bình một hóa đơn có ba món, nên cả tệp tương ứng khoảng 4.000 hóa đơn. Câu hỏi khung giờ đông khách phải đếm theo hóa đơn hoặc theo ly, không đếm theo dòng, nếu không một hóa đơn bán bảy món sẽ nặng gấp bảy lần hóa đơn bán một món. Trước khi tính, hãy viết ra đơn vị phân tích: một dòng đại diện cho cái gì. Với bảng món, hãy dùng <code>groupby</code> theo mã hóa đơn để gộp số lượng, rồi mới tính trung bình; kết quả trung bình ba món mỗi hóa đơn chỉ đúng khi bạn gộp trước.",
        focus: ["raw", "clean", "answer"],
        edges: ["raw-clean", "clean-answer"],
        metrics: sm(m1, { question: "khung giờ bán chạy", rows: "4.000 hóa đơn", grain: "một hóa đơn", risk: "đếm trùng món" }),
        changes: [
          ch("Đơn vị phân tích", "một dòng món", "một hóa đơn"),
          ch("Số đơn vị", "12.000 dòng", "4.000 hóa đơn")
        ],
        note: "Đổi đơn vị phân tích là đổi cả mẫu số, nên phải ghi rõ trước khi tính."
      },
      {
        short: "Thiếu có hệ thống",
        type: "pitfall",
        title: "1.800 ô giờ trống không rơi ngẫu nhiên",
        body: "1.800 dòng thiếu giờ không rơi ngẫu nhiên: chúng đến từ máy POS cũ ở cửa hàng thứ ba, nơi doanh thu buổi sáng lại cao nhất. Nếu chỉ xóa các dòng đó rồi tính, bạn sẽ kết luận buổi chiều đông hơn, trong khi thực tế cửa hàng thứ ba bán rất mạnh buổi sáng. Đây là thiếu dữ liệu có hệ thống, và mọi phép bù trung bình đều sai lệch theo cùng một hướng. Cách xử lý đúng là quay lại nguồn: xin bảng giờ từ máy chủ thanh toán, hoặc ít nhất báo cáo riêng cửa hàng thứ ba. Đừng điền giờ bằng giá trị trung bình rồi coi như đã sạch.",
        focus: ["gap", "raw", "clean"],
        edges: ["gap-clean", "raw-clean"],
        metrics: sm(m1, { question: "khung giờ bán chạy", rows: "12.000", grain: "một hóa đơn", risk: "thiếu có hệ thống" }),
        changes: [
          ch("Cách xử lý thiếu", "xóa dòng", "quay lại nguồn"),
          ch("Kết luận", "buổi chiều đông", "chưa đủ dữ liệu")
        ],
        note: "Kiểm tỉ lệ thiếu theo từng nhóm rẻ hơn nhiều so với sửa lại báo cáo đã phát hành."
      },
      {
        short: "Chốt quy trình",
        type: "final",
        tone: "final",
        title: "Năm việc theo thứ tự",
        body: "Chốt lại bằng năm việc làm theo thứ tự. Một: viết câu hỏi kèm mốc thời gian và phạm vi. Hai: liệt kê nguồn, người xuất và thời điểm xuất. Ba: xác định đơn vị phân tích, ở đây là hóa đơn chứ không phải dòng món. Bốn: kiểm tra tỉ lệ thiếu theo từng nhóm, vì 1.800 dòng thiếu giờ tập trung ở một cửa hàng. Năm: ghi lại mọi quyết định vào từ điển dữ liệu để người sau đọc lại được. Khi bốn việc đầu rõ, bảng phân tích 4.000 hóa đơn mới trả lời đúng câu hỏi sáng hay chiều, và bạn biết chính xác phần nào của câu trả lời còn thiếu.",
        focus: "all",
        edges: "all",
        metrics: sm(m1, { question: "sáng hay chiều", rows: "12.000", grain: "một hóa đơn", risk: "đã ghi rõ" }),
        changes: [
          ch("Quy trình", "làm ngẫu hứng", "5 bước có ghi chép"),
          ch("Từ điển dữ liệu", "không có", "ghi đủ 9 cột")
        ],
        note: "Bốn câu hỏi kiểm tra: câu hỏi nào, đơn vị nào, thiếu ở đâu, ai đã quyết định."
      }
    ]
  };

  T.lessons["kieu-du-lieu"] = {
    id: "kieu-du-lieu",
    module: "nen-tang-du-lieu",
    title: "Kiểu dữ liệu",
    shortTitle: "Kiểu dữ liệu",
    subtitle: "Số, phân loại, thời gian và thang đo",
    blurb: "Mỗi cột cần một kiểu và một thang đo. Bài này chỉ ra vì sao điểm 8,5 lưu dạng chuỗi làm hỏng phép trung bình, mã ngành 1-5 không cộng được, và ngày dd/mm lẫn mm/dd khiến 1.200 dòng xếp sai thứ tự.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["kiểu dữ liệu", "thang đo", "phân loại", "ngày giờ", "mã hóa"],
    metrics: m2,
    nodes: [
      { id: "src", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tệp điểm CSV", sub: "1.200 dòng đăng ký" },
      { id: "num", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Cột điểm số", sub: "số thực 0 đến 10" },
      { id: "cat", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Cột ngành học", sub: "5 giá trị chữ" },
      { id: "time", type: "clock", x: 55, y: 310, w: 200, h: 70, label: "Cột ngày thi", sub: "chuỗi dd/mm/yyyy" },
      { id: "check", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Bước kiểm kiểu", sub: "so từ điển dữ liệu" },
      { id: "model", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "Mô hình dự báo", sub: "chỉ nhận số" }
    ],
    edges: [
      { id: "src-num", from: "src", to: "num", kind: "data", label: "điểm 0 đến 10" },
      { id: "src-cat", from: "src", to: "cat", kind: "data", label: "5 ngành" },
      { id: "src-time", from: "src", to: "time", kind: "data", label: "ngày dạng chuỗi" },
      { id: "num-check", from: "num", to: "check", kind: "data", label: "số thực" },
      { id: "cat-check", from: "cat", to: "check", kind: "control", label: "mã hóa 5 nhóm" },
      { id: "check-model", from: "check", to: "model", kind: "data", label: "ma trận số" }
    ],
    learn: [
      "<strong>Số</strong>, chữ, thời gian và logic là bốn kiểu cột cơ bản.",
      "Thang đo quyết định phép <code>mean</code> có nghĩa hay không.",
      "Mã ngành 1 đến 5 là <strong>thang định danh</strong>, không phải số đo.",
      "Chuẩn hóa ngày về <code>ISO 8601</code> trước khi sắp xếp."
    ],
    steps: [
      {
        short: "Bốn kiểu",
        type: "concept",
        title: "Mỗi cột một kiểu, không đoán",
        body: "Một cột chỉ hữu ích khi bạn biết kiểu của nó. Bốn kiểu hay gặp là số, chữ, thời gian và logic. Điểm thi là số thực từ 0 đến 10, ngành học là chữ có 5 giá trị, ngày thi là thời gian, còn đã tốt nghiệp là logic đúng sai. Khi đọc tệp CSV, mọi cột đều vào dưới dạng chuỗi nếu bạn không khai báo, nên <code>8,5</code> thành chữ và phép cộng điểm sẽ nối chuỗi thay vì tính. Hãy khai báo kiểu ngay khi đọc tệp và in <code>dtypes</code> để kiểm lại. Với 1.200 dòng đăng ký, một cột sai kiểu đủ làm hỏng mọi bảng tổng hợp phía sau.",
        focus: ["src", "num", "cat"],
        edges: ["src-num", "src-cat"],
        metrics: sm(m2, { kind: "4 kiểu", scale: "chưa ghi", trap: "số thành chữ", fix: "khai báo dtype" }),
        changes: [
          ch("Kiểu cột điểm", "chuỗi", "số thực 0 đến 10"),
          ch("Kiểm tra", "không có", "in dtypes sau khi đọc")
        ],
        note: "Một cột số đọc nhầm thành chữ không báo lỗi, chỉ lặng lẽ cho kết quả sai."
      },
      {
        short: "Thang đo",
        type: "flow",
        title: "Bốn thang đo quyết định phép toán",
        body: "Thang đo quyết định phép toán nào có nghĩa. Thang định danh chỉ phân biệt, ví dụ ngành công nghệ thông tin và kế toán, không có thứ tự. Thang thứ bậc có thứ tự nhưng khoảng cách không đều, ví dụ học lực A, B, C. Thang khoảng có khoảng cách đều nhưng số 0 không phải không có gì, ví dụ nhiệt độ. Thang tỉ lệ có số 0 thật, nên nói 6 triệu gấp đôi 3 triệu là đúng, ví dụ học phí. Cùng là số nhưng mã ngành 1 đến 5 thuộc thang định danh: cộng lại rồi chia trung bình cho ra 2,8 không nói lên điều gì. Ghi thang đo vào từ điển trước khi tính.",
        focus: ["num", "cat", "check"],
        edges: ["src-num", "cat-check"],
        metrics: sm(m2, { kind: "số và chữ", scale: "4 thang đo", trap: "cộng mã ngành", fix: "ghi thang đo" }),
        changes: [
          ch("Thang đo", "chưa phân loại", "định danh, thứ bậc, khoảng, tỉ lệ"),
          ch("Phép tính được phép", "mọi phép", "đếm, trung vị, trung bình tùy cột")
        ],
        note: "Trung bình cộng chỉ có nghĩa từ thang khoảng trở lên."
      },
      {
        short: "Mã hóa nhóm",
        type: "detail",
        title: "One-hot 5 cột thay vì mã 1 đến 5",
        body: "Khi đưa cột chữ vào mô hình, bạn phải chuyển thành số, nhưng cách chuyển quyết định kết quả. Gán 1 cho công nghệ thông tin, 2 cho kế toán, 3 cho luật rồi coi đó là số sẽ tạo ra thứ tự giả: mô hình tin rằng luật lớn hơn kế toán hai đơn vị. Cách an toàn là one-hot, tức tạo 5 cột nhị phân cho 5 ngành, mỗi dòng có đúng một số 1. Với 1.200 dòng, bảng mở rộng thêm 5 cột nhưng không thêm giả định sai. Nếu số nhóm quá lớn, hãy gộp nhóm hiếm trước khi one-hot, và luôn giữ một nhóm tham chiếu để tránh cộng tuyến.",
        focus: ["cat", "check", "model"],
        edges: ["cat-check", "check-model"],
        metrics: sm(m2, { kind: "chữ", scale: "định danh", trap: "mã 1 đến 5", fix: "one-hot 5 cột" }),
        changes: [
          ch("Cột ngành", "1 cột mã 1 đến 5", "5 cột nhị phân"),
          ch("Giả định của mô hình", "có thứ tự", "không thứ tự")
        ],
        note: "Mã số cho nhóm là để tiết kiệm chỗ lưu, không phải để tính toán."
      },
      {
        short: "Ngày giờ",
        type: "pitfall",
        title: "03/04 là tháng 4 hay tháng 3",
        body: "Ngày tháng là cột gây lỗi âm thầm nhiều nhất. Chuỗi <code>03/04/2025</code> là 3 tháng 4 với người Việt, nhưng là 4 tháng 3 với người Mỹ; khi trộn hai nguồn, 1.200 dòng có thể bị đảo tháng mà không báo lỗi. Sắp xếp theo chuỗi còn tệ hơn: ngày 10 sẽ đứng trước ngày 2. Hãy chuẩn hóa về dạng ISO 8601, đọc bằng <code>to_datetime</code> có tham số ngày trước, rồi kiểm miền giá trị để bắt ngày ngoài khoảng học kỳ. Ghi múi giờ cho cột có giờ, và đừng bao giờ so sánh ngày dạng chuỗi.",
        focus: ["time", "check", "model"],
        edges: ["src-time", "check-model"],
        metrics: sm(m2, { kind: "ngày giờ", scale: "khoảng thời gian", trap: "dd/mm lẫn mm/dd", fix: "ISO 8601" }),
        changes: [
          ch("Định dạng ngày", "chuỗi dd/mm/yyyy", "ngày ISO 8601"),
          ch("Sắp xếp", "theo ký tự", "theo thời gian")
        ],
        note: "Ngày ngoài khoảng học kỳ thường là dấu hiệu đảo tháng, không phải dữ liệu xấu."
      },
      {
        short: "Từ điển kiểu",
        type: "final",
        tone: "final",
        title: "Chốt từ điển dữ liệu",
        body: "Chốt lại bằng một từ điển dữ liệu ngắn cho cả 1.200 dòng. Mỗi cột ghi bốn thứ: kiểu, miền giá trị hợp lệ, đơn vị và thang đo. Ví dụ điểm thi là số thực 0 đến 10 theo thang tỉ lệ; ngành học là chữ thuộc 5 giá trị theo thang định danh; ngày thi là ngày theo ISO 8601; đã tốt nghiệp là logic. Thêm quy tắc kiểm tự động cho từng cột và chạy trước mọi lần phân tích. Khi có từ điển, người mới đọc bảng trong vài phút là hiểu, còn mô hình không còn nhận nhầm chữ thành số.",
        focus: "all",
        edges: "all",
        metrics: sm(m2, { kind: "đã khai báo", scale: "đã ghi", trap: "đã chặn", fix: "từ điển dữ liệu" }),
        changes: [
          ch("Tài liệu cột", "không có", "kiểu, miền, đơn vị, thang đo"),
          ch("Kiểm tra tự động", "chạy tay", "chạy trước mỗi lần phân tích")
        ],
        note: "Từ điển dữ liệu là thứ rẻ nhất và bị bỏ qua nhiều nhất trong một dự án."
      }
    ]
  };

  T.lessons["bang-khoa"] = {
    id: "bang-khoa",
    module: "nen-tang-du-lieu",
    title: "Bảng và khóa",
    shortTitle: "Bảng và khóa",
    subtitle: "Khóa chính, khóa ngoại và phép nối",
    blurb: "Ba bảng thư viện, ba khóa và một phép nối đúng sẽ giữ nguyên 15.000 lượt mượn. Bài này chỉ ra vì sao thiếu khóa chính sinh 240 dòng trùng, khóa ngoại treo làm mất lượt mượn, và phép nối sai làm phồng bảng.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["bảng", "khóa chính", "khóa ngoại", "phép nối", "dòng trùng"],
    metrics: m3,
    nodes: [
      { id: "readers", type: "page", x: 55, y: 80, w: 200, h: 70, label: "Bảng độc giả", sub: "1.500 sinh viên" },
      { id: "loans", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Bảng mượn", sub: "15.000 lượt" },
      { id: "books", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Bảng sách", sub: "2.000 đầu sách" },
      { id: "fk", type: "key", x: 55, y: 310, w: 200, h: 70, label: "Khóa ngoại", sub: "mã sách, mã độc giả" },
      { id: "pk", type: "key", x: 340, y: 310, w: 200, h: 70, label: "Khóa chính", sub: "không trùng, không rỗng" },
      { id: "dup", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Dòng trùng", sub: "240 dòng nhập lại" },
      { id: "join", type: "layers", x: 340, y: 195, w: 200, h: 70, label: "Nối ba bảng", sub: "một dòng một lượt" }
    ],
    edges: [
      { id: "readers-loans", from: "readers", to: "loans", kind: "data", label: "ma_doc_gia" },
      { id: "books-loans", from: "books", to: "loans", kind: "data", label: "ma_sach" },
      { id: "pk-loans", from: "pk", to: "loans", kind: "control", label: "chặn trùng" },
      { id: "fk-loans", from: "fk", to: "loans", kind: "control", label: "ràng buộc tồn tại" },
      { id: "loans-join", from: "loans", to: "join", kind: "data", label: "khóa ghép" },
      { id: "join-dup", from: "join", to: "dup", kind: "data", label: "nhân bản dòng" },
      { id: "pk-fk", from: "pk", to: "fk", kind: "control", label: "bảo đảm khớp" }
    ],
    learn: [
      "Mỗi hàng là một quan sát, mỗi cột là một <strong>thuộc tính</strong>.",
      "<strong>Khóa chính</strong> không rỗng và không trùng.",
      "<strong>Khóa ngoại</strong> giữ cho bảng không có dòng mồ côi.",
      "Nối nhiều-nhiều làm <code>15.000</code> thành 18.000 dòng."
    ],
    steps: [
      {
        short: "Bảng là gì",
        type: "concept",
        title: "Hàng, cột và một quy ước tên",
        body: "Một bảng là tập hợp các hàng cùng cấu trúc, mỗi hàng là một quan sát và mỗi cột là một thuộc tính. Bảng mượn của thư viện có 15.000 hàng, mỗi hàng là một lượt mượn, với các cột mã phiếu, mã độc giả, mã sách, ngày mượn, ngày trả. Bảng không có thứ tự hàng, nên đừng dựa vào việc hàng nào đứng trước để suy ra điều gì; muốn thứ tự thì phải sắp xếp tường minh. Cột nên là danh từ số ít, viết thường, không dấu cách: <code>ma_doc_gia</code> thay cho Mã độc giả. Một bảng tốt là bảng mà người khác đọc tên cột là hiểu nghĩa, không phải mở tệp mô tả.",
        focus: ["readers", "loans", "books"],
        edges: ["readers-loans", "books-loans"],
        metrics: sm(m3, { rows: "15.000", key: "chưa có", join: "chưa nối", risk: "không truy vết" }),
        changes: [
          ch("Cấu trúc bảng", "tệp rời", "hàng, cột, tên cột thống nhất"),
          ch("Thứ tự hàng", "tin vào vị trí", "sắp xếp tường minh")
        ],
        note: "Tên cột là hợp đồng với người đọc sau; đổi tên cột là đổi hợp đồng."
      },
      {
        short: "Khóa chính",
        type: "flow",
        title: "Mã phiếu và 240 dòng nhập lại",
        body: "Khóa chính là cột hoặc bộ cột xác định duy nhất một hàng, không được rỗng và không được trùng. Bảng mượn dùng mã phiếu làm khóa chính; mỗi phiếu là một lần mượn, nên 15.000 phiếu là 15.000 hàng. Khi nhập lại từ hai máy, 240 dòng bị lặp và bảng thành 15.240 hàng, làm mọi phép đếm tăng khoảng 1,6%. Nếu không có mã phiếu, hãy dùng khóa ghép gồm mã độc giả, mã sách và ngày mượn, nhưng khóa ghép chỉ đúng khi một người không mượn cùng một cuốn hai lần trong ngày. Hãy kiểm bằng <code>duplicated</code> trước khi dùng.",
        focus: ["pk", "loans", "dup"],
        edges: ["pk-loans", "loans-join"],
        metrics: sm(m3, { rows: "15.240", key: "mã phiếu", join: "chưa nối", risk: "240 dòng trùng" }),
        changes: [
          ch("Số hàng", "15.240", "15.000 sau khi bỏ trùng"),
          ch("Khóa", "chưa khai báo", "mã phiếu duy nhất")
        ],
        note: "Khóa ghép đúng hay sai phụ thuộc quy tắc nghiệp vụ, không phụ thuộc dữ liệu."
      },
      {
        short: "Khóa ngoại",
        type: "detail",
        title: "12 lượt mượn trỏ vào khoảng không",
        body: "Khóa ngoại là cột trỏ tới khóa chính của bảng khác, và nó giữ cho dữ liệu không mồ côi. Trong bảng mượn, mã sách phải tồn tại trong bảng sách; mã độc giả phải tồn tại trong bảng độc giả. Nếu thư viện xóa một đầu sách đã thanh lý, 12 lượt mượn cũ sẽ trỏ vào khoảng không, và báo cáo theo tên sách sẽ mất đúng 12 dòng đó. Cách đúng là đánh dấu đã thanh lý thay vì xóa cứng, hoặc chặn xóa khi còn lượt mượn. Khóa ngoại không chỉ là quy ước vẽ sơ đồ: nó là ràng buộc mà cơ sở dữ liệu kiểm tra mỗi lần ghi.",
        focus: ["fk", "pk", "books"],
        edges: ["pk-fk", "fk-loans"],
        metrics: sm(m3, { rows: "15.000", key: "mã phiếu + FK", join: "nhiều-một", risk: "12 lượt treo" }),
        changes: [
          ch("Xóa sách", "xóa cứng", "đánh dấu thanh lý"),
          ch("Báo cáo theo sách", "mất 12 dòng", "giữ đủ lượt mượn")
        ],
        note: "Mồ côi dữ liệu thường lộ ra muộn, khi một báo cáo thiếu đúng vài dòng."
      },
      {
        short: "Nối phồng bảng",
        type: "pitfall",
        title: "Nối nhiều-nhiều làm 18.000 dòng",
        body: "Phép nối sai làm bảng phồng lên mà không báo lỗi. Nối bảng mượn với bảng sách theo mã sách là quan hệ nhiều-một, nên số hàng giữ nguyên 15.000. Nhưng nếu nối tiếp với bảng tác giả, nơi một cuốn sách có hai tác giả, mỗi lượt mượn sách đó sẽ thành hai dòng và tổng tăng lên 18.000. Đếm số lượt trên bảng đã nối sẽ ra 18.000, sai 20%. Hãy kiểm số hàng trước và sau mỗi phép nối, dùng <code>merge</code> với kiểm tra khóa duy nhất, và tính chỉ số trên bảng gốc rồi mới nối nhãn. Quy tắc nhớ: nối để lấy thêm cột, không để đếm lại.",
        focus: ["join", "loans", "dup"],
        edges: ["loans-join", "join-dup"],
        metrics: sm(m3, { rows: "18.000", key: "mã phiếu", join: "nhiều-nhiều", risk: "phồng 20%" }),
        changes: [
          ch("Số hàng sau nối", "15.000", "18.000"),
          ch("Cách đếm", "đếm trên bảng nối", "đếm trên bảng gốc")
        ],
        note: "Số hàng tăng sau phép nối là dấu hiệu quan hệ nhiều-nhiều, không phải dữ liệu mới."
      },
      {
        short: "Chốt lược đồ",
        type: "final",
        tone: "final",
        title: "Bốn dòng chốt lược đồ",
        body: "Chốt lược đồ cho thư viện trong bốn dòng. Một: mỗi bảng có khóa chính không rỗng, không trùng; bảng mượn dùng mã phiếu. Hai: mọi cột tham chiếu đều là khóa ngoại có ràng buộc, xóa mềm thay vì xóa cứng. Ba: kiểm số hàng sau mỗi phép nối, 15.000 phải giữ nguyên khi nối nhiều-một. Bốn: ghi rõ quan hệ một-nhiều hay nhiều-nhiều trong từ điển dữ liệu. Với 1.500 độc giả, 2.000 đầu sách và 15.000 lượt mượn, ba bảng này đủ trả lời câu hỏi sách nào được mượn nhiều nhất mà không nhân đôi dòng nào.",
        focus: "all",
        edges: "all",
        metrics: sm(m3, { rows: "15.000", key: "đủ 3 khóa", join: "kiểm số hàng", risk: "đã chặn" }),
        changes: [
          ch("Lược đồ", "ba bảng rời", "khóa và ràng buộc ghi rõ"),
          ch("Kiểm tra nối", "không có", "so số hàng trước và sau")
        ],
        note: "Ba bảng, ba khóa, một phép nối: đủ để trả lời phần lớn câu hỏi của thư viện."
      }
    ]
  };

  T.lessons["do-chat-luong"] = {
    id: "do-chat-luong",
    module: "nen-tang-du-lieu",
    title: "Đo chất lượng dữ liệu",
    shortTitle: "Chất lượng dữ liệu",
    subtitle: "Năm trục và một điểm số",
    blurb: "Chất lượng dữ liệu phải đo được, không chỉ cảm nhận. Bài này dùng bảng 10.000 dòng thiếu 4% ô và trùng 3% để ra 9.312 dòng dùng được, 90,4 điểm, rồi chỉ ra vì sao điểm cao vẫn có thể che một lỗ hổng.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["chất lượng", "ô thiếu", "dòng trùng", "điểm số", "ngưỡng"],
    metrics: m4,
    nodes: [
      { id: "raw", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Bảng thô", sub: "10.000 dòng, 12 cột" },
      { id: "miss", type: "alert", x: 340, y: 80, w: 200, h: 70, label: "Ô thiếu", sub: "4% số ô" },
      { id: "dup", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Dòng trùng", sub: "300 dòng lặp" },
      { id: "score", type: "audit", x: 55, y: 310, w: 200, h: 70, label: "Điểm chất lượng", sub: "90,4 trên 100" },
      { id: "kept", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Dòng giữ lại", sub: "9.312 dòng" },
      { id: "gate", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Ngưỡng 70", sub: "dưới thì dừng" },
      { id: "doc", type: "book", x: 340, y: 195, w: 200, h: 70, label: "Hồ sơ cột", sub: "kiểu, miền, đơn vị" }
    ],
    edges: [
      { id: "raw-miss", from: "raw", to: "miss", kind: "data", label: "4% ô trống" },
      { id: "raw-dup", from: "raw", to: "dup", kind: "data", label: "300 dòng lặp" },
      { id: "miss-score", from: "miss", to: "score", kind: "data", label: "trừ 6 điểm" },
      { id: "dup-score", from: "dup", to: "score", kind: "data", label: "trừ 3,6 điểm" },
      { id: "score-kept", from: "score", to: "kept", kind: "data", label: "9.312 dòng" },
      { id: "kept-gate", from: "kept", to: "gate", kind: "control", label: "so ngưỡng 70" },
      { id: "doc-miss", from: "doc", to: "miss", kind: "control", label: "luật đầy đủ" }
    ],
    learn: [
      "<strong>Năm trục</strong>: đầy đủ, duy nhất, hợp lệ, nhất quán, kịp thời.",
      "Mỗi 1% ô thiếu trừ <strong>1,5 điểm</strong>.",
      "<strong>9.312 dòng</strong> giữ lại trên 10.000 dòng ban đầu.",
      "Điểm cao vẫn có thể che <code>thiếu có hệ thống</code>."
    ],
    steps: [
      {
        short: "Năm trục",
        type: "concept",
        title: "Chất lượng gồm năm trục độc lập",
        body: "Chất lượng dữ liệu thường được đo trên năm trục: đầy đủ, duy nhất, hợp lệ, nhất quán và kịp thời. Bảng đơn hàng 10.000 dòng, 12 cột tương đương 120.000 ô; nếu 4% ô trống thì có 4.800 ô thiếu. Trục duy nhất hỏi có dòng nào lặp, ở đây là 300 dòng. Trục hợp lệ hỏi giá trị có nằm trong miền cho phép, ví dụ số lượng không âm. Trục nhất quán hỏi hai cột có mâu thuẫn, ví dụ ngày trả trước ngày mượn. Trục kịp thời hỏi dữ liệu có đủ mới cho quyết định. Năm trục này độc lập: bảng có thể đầy đủ mà vẫn sai định dạng.",
        focus: ["raw", "miss", "dup"],
        edges: ["raw-miss", "raw-dup"],
        metrics: sm(m4, { missing: "chưa đo", dup: "chưa đo", score: "chưa có", verdict: "chưa rõ" }),
        changes: [
          ch("Cách đánh giá", "cảm nhận", "năm trục đo được"),
          ch("Quy mô kiểm tra", "vài dòng đầu", "120.000 ô, 12 cột")
        ],
        note: "Năm trục độc lập nên một bảng đầy đủ vẫn có thể sai định dạng."
      },
      {
        short: "Công thức điểm",
        type: "flow",
        title: "90,4 điểm và 9.312 dòng",
        body: "Điểm chất lượng gọn nhất là trừ điểm theo tỉ lệ lỗi. Với bảng 10.000 dòng, thiếu 4% ô và trùng 3% dòng, mỗi 1% ô thiếu trừ 1,5 điểm và mỗi 1% dòng trùng trừ 1,2 điểm, nên điểm là 100 trừ 6 trừ 3,6, còn 90,4. Số dòng dùng được tính bằng 10.000 nhân 0,96 nhân 0,97, ra 9.312. Hai con số trả lời hai câu khác nhau: điểm nói mức sạch, số dòng nói còn bao nhiêu để huấn luyện. Công thức này là quy ước của khóa học, không phải chuẩn công nghiệp; điều quan trọng là dùng một công thức và ghi rõ ngưỡng.",
        focus: ["miss", "dup", "score"],
        edges: ["miss-score", "dup-score"],
        metrics: sm(m4, { missing: "4%", dup: "3%", score: "90,4/100", verdict: "đạt ngưỡng" }),
        changes: [
          ch("Điểm chất lượng", "chưa có", "90,4 trên 100"),
          ch("Dòng dùng được", "10.000", "9.312")
        ],
        note: "Điểm và số dòng giữ lại là hai thước đo khác nhau, đừng thay thế nhau."
      },
      {
        short: "688 dòng mất",
        type: "detail",
        title: "Quy 688 dòng bị bỏ ra thiệt hại",
        body: "Con số 9.312 dễ bị đọc lướt, nên hãy quy ra thiệt hại: 688 dòng bị bỏ, tức gần 7% dữ liệu. Trong 688 dòng đó có 300 dòng trùng và phần còn lại là dòng dính ô thiếu. Nếu mỗi dòng là một đơn hàng trị giá 450.000 đồng, phần bị bỏ tương đương khoảng 310 triệu đồng doanh thu không được tính. Với bảng 120.000 ô, 4.800 ô thiếu nghĩa là gần 5% ô không dùng được cho thống kê theo cột. Những con số này giúp chọn cách xử lý: bỏ dòng, điền khuyết hay quay lại nguồn. Đừng chỉ nhìn điểm 90,4 rồi kết luận bảng đã sạch.",
        focus: ["score", "kept", "gate"],
        edges: ["score-kept", "kept-gate"],
        metrics: sm(m4, { missing: "4.800 ô", dup: "300 dòng", score: "90,4/100", verdict: "bỏ 688 dòng" }),
        changes: [
          ch("Dòng bị bỏ", "chưa tính", "688 dòng"),
          ch("Thiệt hại ước tính", "chưa thấy", "khoảng 310 triệu đồng")
        ],
        note: "Quy dòng bị bỏ ra tiền hoặc ra khách giúp quyết định làm sạch hay bỏ."
      },
      {
        short: "Điểm che lỗi",
        type: "pitfall",
        title: "Điểm 90,4 vẫn có thể vô dụng",
        body: "Điểm tổng có thể che một lỗi nghiêm trọng. Giả sử 4.800 ô thiếu tập trung ở cột mã bưu chính của một tỉnh, và 300 dòng trùng sinh ra vì tên khách được nhập cả có dấu lẫn không dấu: Nguyễn Văn An và Nguyen Van An thành hai khách. Điểm vẫn 90,4, nhưng báo cáo theo tỉnh sẽ thiếu hẳn một vùng và số khách bị đếm sai. Vì vậy hãy đo chất lượng theo từng cột và từng nhóm, không chỉ toàn bảng. Một bảng 90,4 điểm vẫn có thể không dùng được cho đúng câu hỏi bạn cần trả lời.",
        focus: ["miss", "dup", "kept"],
        edges: ["raw-miss", "raw-dup", "score-kept"],
        metrics: sm(m4, { missing: "4% lệch", dup: "3% ẩn", score: "90,4/100", verdict: "đừng tin ngay" }),
        changes: [
          ch("Cách đo", "một điểm toàn bảng", "thêm tỉ lệ theo cột và nhóm"),
          ch("Phát hiện", "không thấy", "thiếu tập trung một tỉnh")
        ],
        note: "Một điểm tổng chỉ đúng khi lỗi rải đều; lỗi tập trung thì phải đo theo nhóm."
      },
      {
        short: "Chốt quy trình",
        type: "final",
        tone: "final",
        title: "Năm bước đo chất lượng",
        body: "Chốt quy trình đo trong năm bước. Một: đếm ô thiếu theo từng cột, quy ra phần trăm trên 120.000 ô. Hai: đếm dòng trùng theo khóa, ở đây là 300 dòng. Ba: tính điểm bằng công thức đã ghi, ra 90,4. Bốn: tính số dòng giữ lại, 9.312, và so với ngưỡng 70 điểm. Năm: ghi lại tỉ lệ theo nhóm để phát hiện thiếu có hệ thống. Khi điểm dưới 70, dừng lại và làm sạch trước khi huấn luyện; khi điểm đạt, vẫn phải đọc bảng theo cột trước khi tin vào kết luận.",
        focus: "all",
        edges: "all",
        metrics: sm(m4, { missing: "4% theo cột", dup: "3% theo khóa", score: "90,4/100", verdict: "đạt, có log" }),
        changes: [
          ch("Quy trình đo", "làm một lần", "5 bước, chạy lại được"),
          ch("Nhật ký", "không có", "điểm và ngưỡng được lưu")
        ],
        note: "Chạy lại phép đo sau mỗi lần sửa dữ liệu, nếu không điểm cũ chỉ là kỷ niệm."
      }
    ]
  };

  T.practice.push({
    id: "p-rows",
    module: "nen-tang-du-lieu",
    tags: ["ROWS", "đơn vị phân tích"],
    tag: "ROWS",
    title: "Đếm món hay đếm hóa đơn",
    scenario: "Chuỗi ba quán cà phê xuất bảng bán hàng từ máy POS: 48.000 dòng, mỗi dòng là một món, thuộc 16.000 hóa đơn trong sáu tháng. Nhóm phân tích cần biết trung bình một hóa đơn có bao nhiêu món và khung giờ nào bán chạy nhất. Một thực tập sinh nối bảng bán hàng với bảng khuyến mãi theo mã hóa đơn, thấy số dòng tăng lên 51.200, rồi báo cáo trung bình 3,2 món mỗi hóa đơn. Quản lý thấy con số này cao hơn cảm nhận thường ngày và yêu cầu kiểm tra lại trước khi đưa vào báo cáo quý.",
    metrics: [
      { label: "Dòng bán hàng", value: "48.000" },
      { label: "Hóa đơn", value: "16.000" },
      { label: "Sau khi nối", value: "51.200", danger: true }
    ],
    options: [
      "Dùng luôn 3,2 món vì 51.200 dòng là mẫu lớn, sai số không đáng kể",
      "Kiểm tra đơn vị phân tích và bỏ dòng nhân bản trước khi tính lại",
      "Đổi sang báo cáo doanh thu thay vì số món để tránh tranh cãi",
      "Lọc bỏ các hóa đơn có khuyến mãi rồi giữ nguyên kết luận 3,2 món"
    ],
    correct: 1,
    explain: "Đơn vị phân tích ở đây là hóa đơn, không phải dòng món. Một hóa đơn khớp hai chương trình khuyến mãi sẽ sinh hai dòng sau khi nối, nên 51.200 trừ 48.000 còn 3.200 dòng nhân bản. Tính trên bảng gốc, 48.000 chia 16.000 đúng bằng 3,0 món mỗi hóa đơn, không phải 3,2. Mẫu lớn không sửa được lỗi đếm trùng, vì sai số hệ thống tăng theo quy mô. Đổi sang doanh thu vẫn dính lỗi nhân dòng. Lọc bỏ hóa đơn khuyến mãi thì mất 3.200 dòng hợp lệ và làm lệch mùa. Hãy kiểm số hàng trước và sau mỗi phép nối."
  });

  T.practice.push({
    id: "p-types",
    module: "nen-tang-du-lieu",
    tags: ["TYPES", "ngày giờ"],
    tag: "TYPES",
    title: "Cột ngày nhập hai định dạng",
    scenario: "Phòng khám tư có 2.400 lượt khám trong quý, xuất từ hai chi nhánh. Cột ngày tái khám được nhập tay: chi nhánh Hà Nội ghi 03/04/2026 theo ngày trước, chi nhánh Đà Nẵng ghi 04/03/2026 theo tháng trước, cả hai đều là chuỗi. Khi dựng lịch nhắc tái khám, hệ thống sắp xếp theo chuỗi và thấy 96 bệnh nhân rơi vào tháng 3 thay vì tháng 4. Đội kỹ thuật phải sửa trước buổi họp với bác sĩ trưởng khoa, dữ liệu gốc vẫn giữ nguyên và không được phép nhập lại từ đầu.",
    metrics: [
      { label: "Lượt khám", value: "2.400" },
      { label: "Bản ghi lệch", value: "96", danger: true },
      { label: "Kiểu đang lưu", value: "chuỗi" }
    ],
    options: [
      "Ép cột về số nguyên rồi sắp xếp tăng dần",
      "Chuẩn hóa về ISO 8601, đọc riêng từng chi nhánh với tham số ngày trước, rồi kiểm miền ngày",
      "Xóa cột ngày tái khám và nhắc theo ngày khám gần nhất",
      "Sắp xếp theo chuỗi nhưng đảo thứ tự để tháng 4 lên trước"
    ],
    correct: 1,
    explain: "Cột ngày đang là chuỗi nên phép so sánh chạy theo ký tự, không theo thời gian. Ép về số nguyên biến <code>03/04/2026</code> thành một con số vô nghĩa. Xóa cột thì mất đúng thông tin cần cho lịch nhắc, còn đảo thứ tự chỉ đổi chỗ sai. Cách đúng là đọc riêng từng chi nhánh với tham số ngày trước phù hợp, chuyển về ISO 8601, rồi kiểm miền để bắt các ngày ngoài quý. Nhờ vậy 96 bản ghi được đưa về đúng tháng 4 và lịch nhắc không còn lệch. Sau đó mới lưu kiểu ngày trong cơ sở dữ liệu để lần sau không lặp lại."
  });

  T.practice.push({
    id: "p-quality",
    module: "nen-tang-du-lieu",
    tags: ["QUALITY", "ô thiếu", "dòng trùng"],
    tag: "QUALITY",
    title: "Bảng 65,8 điểm có nên huấn luyện",
    scenario: "Một cửa hàng vật liệu xây dựng gộp 10.000 dòng bán hàng từ hai phần mềm cũ. Kiểm tra nhanh cho thấy 18% ô bị trống, chủ yếu ở cột mã khách và số điện thoại, và 6% dòng bị trùng vì tên khách nhập lẫn có dấu với không dấu. Theo công thức của khóa học, bảng được 65,8 điểm, dưới ngưỡng 70. Quản lý muốn huấn luyện mô hình dự báo doanh thu ngay trong tuần vì đã trả phí cho một khóa học trực tuyến, và cho rằng 82% ô còn lại là quá đủ để mô hình học.",
    metrics: [
      { label: "Dòng", value: "10.000" },
      { label: "Ô thiếu", value: "18%", danger: true },
      { label: "Điểm", value: "65,8/100", danger: true }
    ],
    options: [
      "Huấn luyện ngay vì 82% ô có dữ liệu là tỉ lệ tốt",
      "Điền mọi ô trống bằng 0 rồi huấn luyện, vì số 0 là giá trị an toàn",
      "Làm sạch theo từng cột, gộp bản ghi trùng theo khóa khách, đo lại điểm rồi mới huấn luyện",
      "Xóa toàn bộ cột mã khách và số điện thoại để điểm vượt 70"
    ],
    correct: 2,
    explain: "65,8 điểm đến từ 18% ô thiếu trừ 27 điểm và 6% dòng trùng trừ 7,2 điểm, nên bảng đang dưới ngưỡng 70. Tỉ lệ 82% ô có dữ liệu không nói ô thiếu nằm ở đâu: mã khách thiếu thì không gộp được giao dịch về một người, và mô hình sẽ học trên những khách bị tách đôi. Điền 0 tạo ra khách hàng ma và làm lệch doanh thu. Xóa hai cột thì điểm tăng nhưng mất đúng trường dùng để nối. Cách đúng là gộp trùng theo khóa, xử lý thiếu theo từng cột, đo lại điểm, rồi mới huấn luyện khi đã đạt ngưỡng."
  });

  T.cheatsheets.push({
    id: "foundation",
    num: "01",
    module: "nen-tang-du-lieu",
    title: "Nền tảng dữ liệu",
    intro: "Bốn bảng tra dùng khi mở tệp dữ liệu mới: năm trục chất lượng, kiểu dữ liệu và thang đo, lệnh pandas kiểm tra nhanh, công thức điểm và checklist trước khi huấn luyện. Chép vào tài liệu dự án để cả nhóm dùng chung.",
    cards: [
      card({
        title: "Năm trục chất lượng",
        wide: true,
        body: "<table class=\"cheat-table\"><thead><tr><th>Trục</th><th>Câu hỏi</th><th>Cách đo</th></tr></thead><tbody><tr><td>Đầy đủ</td><td>Cột nào trống nhiều?</td><td class=\"mono\">isna().mean()</td></tr><tr><td>Duy nhất</td><td>Có dòng lặp theo khóa?</td><td class=\"mono\">duplicated()</td></tr><tr><td>Hợp lệ</td><td>Giá trị nằm trong miền?</td><td class=\"mono\">between(0, 10)</td></tr><tr><td>Nhất quán</td><td>Hai cột có mâu thuẫn?</td><td class=\"mono\">ngay_tra &gt;= ngay_muon</td></tr><tr><td>Kịp thời</td><td>Dữ liệu mới đến đâu?</td><td class=\"mono\">max(ngay)</td></tr></tbody></table>"
      }),
      card({
        title: "Lệnh pandas kiểm tra nhanh",
        wide: true,
        body: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>import pandas as pd\n\ndf = pd.read_csv(\"ban_hang.csv\",\n    dtype={\"ma_don\": \"string\"})\nprint(df.shape)        # (10000, 12)\nprint(df.dtypes)       # kiểu từng cột\nprint(df.isna().mean())  # tỉ lệ thiếu\n\ntrung = df.duplicated(subset=[\"ma_don\"]).sum()\nprint(trung)           # 300 dòng trùng\n\ndf[\"ngay\"] = pd.to_datetime(df[\"ngay\"],\n    dayfirst=True, errors=\"coerce\")</code></pre></div><p>Đọc xong in ngay <code>shape</code>, <code>dtypes</code> và tỉ lệ thiếu trước khi viết biểu đồ đầu tiên.</p>"
      }),
      card({
        title: "Kiểu dữ liệu và thang đo",
        body: "<table class=\"cheat-table\"><thead><tr><th>Cột</th><th>Kiểu</th><th>Thang đo</th><th>Phép hợp lệ</th></tr></thead><tbody><tr><td class=\"mono\">diem_thi</td><td>số thực</td><td>tỉ lệ</td><td>trung bình, độ lệch</td></tr><tr><td class=\"mono\">nganh_hoc</td><td>chữ</td><td>định danh</td><td>đếm, one-hot</td></tr><tr><td class=\"mono\">hoc_luc</td><td>chữ có thứ tự</td><td>thứ bậc</td><td>trung vị</td></tr><tr><td class=\"mono\">nhiet_do</td><td>số thực</td><td>khoảng</td><td>hiệu, không tỉ số</td></tr><tr><td class=\"mono\">hoc_phi</td><td>số nguyên</td><td>tỉ lệ</td><td>tổng, tỉ số</td></tr></tbody></table>"
      }),
      card({
        title: "Checklist trước khi phân tích",
        body: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Viết câu hỏi và đơn vị phân tích trước khi mở tệp.</li><li>Khai báo kiểu cho từng cột ngay lúc đọc.</li><li>Đếm ô thiếu theo cột, không chỉ toàn bảng.</li><li>Kiểm dòng trùng theo khóa nghiệp vụ.</li><li>Ghi số hàng trước và sau mỗi phép nối.</li><li>Lưu điểm chất lượng và ngưỡng vào nhật ký.</li><li>Giữ bản gốc chỉ đọc, mọi sửa đổi đều ghi lại.</li></ul>"
      }),
      card({
        title: "Công thức điểm và ngưỡng",
        wide: true,
        body: "<table class=\"cheat-table\"><thead><tr><th>Thành phần</th><th>Công thức</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Điểm chất lượng</td><td class=\"mono\">100 - 1,5 x %ô thiếu - 1,2 x %dòng trùng</td><td class=\"mono\">90,4</td></tr><tr><td>Dòng giữ lại</td><td class=\"mono\">tổng x (1 - %thiếu) x (1 - %trùng)</td><td class=\"mono\">9.312</td></tr><tr><td>Ngưỡng dùng</td><td class=\"mono\">điểm &gt;= 70</td><td>đạt</td></tr><tr><td>Thiếu hệ thống</td><td>so tỉ lệ thiếu theo từng nhóm</td><td class=\"mono\">1.800 dòng</td></tr></tbody></table>"
      })
    ]
  });
})();
