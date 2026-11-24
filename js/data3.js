/* DataLab — phần 3: mô hình và đánh giá */
window.DATALAB = window.DATALAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  "use strict";

  const T = window.DATALAB;
  T.modules = T.modules || [];
  T.lessons = T.lessons || {};
  T.practice = T.practice || [];
  T.cheatsheets = T.cheatsheets || [];

  T.modules.push({
    id: "mo-hinh-danh-gia",
    num: "03",
    title: "Mô hình và đánh giá",
    tone: "yellow",
    blurb: "Bốn bài cuối ghép thành một vòng đánh giá: dựng baseline trước khi huấn luyện, chọn chỉ số khớp với cái giá của từng loại lỗi, đọc khoảng cách train và validation để bắt overfit, rồi biến các số đó thành quyết định triển khai có ngưỡng rõ ràng.",
    lessons: ["baseline", "chi-so", "overfit", "ra-quyet-dinh"]
  });

  T.lessons["baseline"] = {
    id: "baseline",
    module: "mo-hinh-danh-gia",
    title: "Baseline trước",
    shortTitle: "Baseline",
    subtitle: "Đo mốc đơn giản trước khi khen mô hình",
    blurb: "Trước khi khen một mô hình, hãy đo mốc đơn giản nhất: đoán theo lớp phổ biến. Trên tập test 1.000 dòng, baseline đạt 76%, tức 760 dòng đúng. Mô hình 82% chỉ hơn 60 dòng, tương đương lift +6 điểm.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["baseline", "lift", "accuracy", "tập test", "ngưỡng"],
    metrics: [
      { key: "moc", label: "Mốc", tone: "blue" },
      { key: "acc", label: "Accuracy", tone: "mint" },
      { key: "lift", label: "Lift", tone: "yellow" },
      { key: "loi", label: "Lỗi test", tone: "coral" }
    ],
    nodes: [
      { id: "test", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tập test 1.000 dòng", sub: "nhãn đã biết" },
      { id: "base", type: "check", x: 340, y: 80, w: 200, h: 70, label: "Baseline đa số", sub: "đoán lớp phổ biến" },
      { id: "rule", type: "book", x: 625, y: 80, w: 200, h: 70, label: "Quy tắc 76%", sub: "đúng 760 dòng" },
      { id: "model", type: "bolt", x: 55, y: 310, w: 200, h: 70, label: "Mô hình 82%", sub: "đúng 820 dòng" },
      { id: "lift", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Lift +6 điểm", sub: "82 trừ 76" },
      { id: "gate", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Ngưỡng 5 điểm", sub: "dưới thì dừng" }
    ],
    edges: [
      { id: "test-base", from: "test", to: "base", kind: "request", label: "chấm mốc" },
      { id: "test-model", from: "test", to: "model", kind: "data", label: "cùng tập test" },
      { id: "base-rule", from: "base", to: "rule", kind: "data", label: "đoán đa số" },
      { id: "model-lift", from: "model", to: "lift", kind: "response", label: "82%" },
      { id: "rule-lift", from: "rule", to: "lift", kind: "data", label: "76%" },
      { id: "lift-gate", from: "lift", to: "gate", kind: "control", label: "so ngưỡng" }
    ],
    learn: [
      "Mỗi báo cáo cần một <code>baseline</code> làm mốc tối thiểu, không phải đối thủ để đánh bại bằng mọi giá.",
      "<code>Lift</code> bằng accuracy mô hình trừ accuracy baseline, đo trên cùng tập test.",
      "Với <strong>1.000 dòng test</strong>, 82% là 820 dòng đúng và 180 dòng sai.",
      "<code>Lift</code> dưới 5 điểm thì nên quay lại dữ liệu thay vì tinh chỉnh tham số."
    ],
    steps: [
      {
        short: "Vì sao cần mốc",
        type: "concept",
        title: "Mốc phải có trước khi khen",
        body: "Trước khi huấn luyện, hãy trả lời một câu đơn giản: nếu không dùng mô hình, ta đạt bao nhiêu? Với bài toán phân loại lệch, đoán theo lớp phổ biến thường đã đúng 76%. Trên tập test 1.000 dòng, baseline này đúng 760 dòng và sai 240 dòng. Mô hình đạt <code>82%</code> tức 820 dòng đúng, chỉ hơn baseline 60 dòng, tương đương lift +6 điểm. Con số 60 dòng đó mới là thứ đáng bàn, không phải 82% đứng một mình. Nếu bỏ bước này, một mô hình 82% có thể bị khen quá mức, hoặc một mô hình 68% bị giữ lại vì tưởng là tệ.",
        focus: ["test", "base", "model", "lift"],
        edges: ["test-base", "test-model", "model-lift", "rule-lift"],
        metrics: { moc: "chưa có", acc: "82%", lift: "+6", loi: "180" },
        changes: [
          "Báo cáo có thêm cột baseline đặt cạnh accuracy.",
          "Mọi so sánh chuyển sang đơn vị lift thay vì phần trăm tuyệt đối."
        ],
        note: "Không có baseline thì không có cơ sở nói mô hình tốt hay tệ."
      },
      {
        short: "Dựng baseline",
        type: "flow",
        title: "Dựng baseline trong ba dòng",
        body: 'Sau khi chia tập, dựng baseline bằng chính thư viện sẽ dùng cho mô hình thật. Với scikit-learn, <code>DummyClassifier(strategy="most_frequent")</code> học lớp phổ biến rồi dự đoán y hệt cho mọi dòng. Huấn luyện trên 3.000 dòng train, chấm trên 1.000 dòng test, ta được 76% accuracy, tức 760 dòng đúng. Con số này phải được ghi vào báo cáo trước khi thử logistic regression hay cây quyết định. Cách làm tương tự với bài toán hồi quy: baseline là dự đoán trung bình hoặc trung vị. Một baseline tốt phải tái lập được bằng vài dòng mã, không cần điều chỉnh tham số.',
        focus: ["base", "test", "rule"],
        edges: ["test-base", "base-rule"],
        metrics: { moc: "đa số 76%", acc: "82%", lift: "+6", loi: "180" },
        changes: [
          "Baseline tái lập được bằng DummyClassifier trong ba dòng.",
          "Baseline và mô hình dùng chung tập test 1.000 dòng."
        ],
        note: "Baseline phải chấm trên đúng tập test của mô hình."
      },
      {
        short: "Ba kiểu mốc",
        type: "detail",
        title: "Ba kiểu baseline",
        body: "Không phải bài toán nào cũng dùng lớp đa số. Kiểu thứ nhất là đoán hằng số: lớp phổ biến hoặc trung bình, phù hợp để biết sàn hiệu năng. Kiểu thứ hai là ngẫu nhiên theo tỉ lệ lớp, dùng khi cần kiểm tra mô hình có thật sự học được gì ngoài phân phối. Kiểu thứ ba là luật đơn giản do chuyên gia đặt, ví dụ hễ chỉ số đường huyết vượt ngưỡng thì dự đoán dương. Trên bộ dữ liệu bệnh viện, luật một biến có thể đạt 74%, sát baseline đa số 76%. Khi mô hình 82% chỉ hơn luật đơn giản 8 điểm, câu hỏi đúng là nó học thêm được tín hiệu nào, chứ không phải accuracy đã đủ cao chưa.",
        focus: ["base", "rule", "model"],
        edges: ["base-rule", "test-model"],
        metrics: { moc: "76%", acc: "82%", lift: "+6", loi: "180" },
        changes: [
          "Có ba mức mốc: hằng số, ngẫu nhiên, luật chuyên gia.",
          "Câu hỏi đổi từ accuracy sang phần tín hiệu học thêm."
        ],
        note: "Luật chuyên gia là baseline mạnh nhất và hay bị bỏ qua."
      },
      {
        short: "So sai tập",
        type: "pitfall",
        title: "So baseline sai tập",
        body: "Lỗi thường gặp là tính baseline trên tập train rồi so với mô hình chấm trên test. Train có 3.000 dòng với tỉ lệ lớp khác test, nên baseline trên train có thể là 80%, trong khi trên test chỉ 76%. Kết quả là lift bị báo thấp giả tạo, và một mô hình 82% trông như chỉ hơn 2 điểm. Một lỗi khác là chọn ngưỡng phân loại sau khi đã xem test, rồi báo cáo con số đẹp nhất. Cả hai đều làm mất ý nghĩa của phép so sánh. Nguyên tắc đơn giản: baseline và mô hình phải chấm trên cùng một tập test, cùng nhãn, cùng cách xử lý dòng thiếu.",
        focus: ["base", "test", "gate"],
        edges: ["test-base", "lift-gate"],
        metrics: { moc: "76%", acc: "68%", lift: "-8", loi: "320" },
        changes: [
          "Baseline được tính lại trên chính tập test.",
          "Ngưỡng phân loại chốt trước khi xem kết quả test."
        ],
        note: "Cùng tập, cùng nhãn, cùng cách xử lý thiếu: chỉ khác mô hình."
      },
      {
        short: "Chốt mốc",
        type: "final",
        title: "Chốt mốc baseline",
        tone: "final",
        body: "Chốt lại quy trình: một baseline, một tập test, một cách chấm. Dựng baseline đa số hoặc luật đơn giản trước khi huấn luyện, ghi accuracy 76% và 240 dòng sai vào báo cáo. Sau đó chấm mô hình trên đúng 1.000 dòng test, ghi 82%, 180 dòng sai và lift +6 điểm. Chỉ khi lift từ 5 điểm trở lên mới đáng bỏ công triển khai; dưới ngưỡng đó, hãy quay lại dữ liệu và đặc trưng thay vì tinh chỉnh tham số. Giữ baseline trong pipeline để mỗi lần huấn luyện lại đều có mốc so sánh. Kiểm thử tự động nên chặn mô hình mới nếu lift âm hoặc thấp hơn 5 điểm.",
        focus: "all",
        edges: "all",
        metrics: { moc: "76%", acc: "82%", lift: "+6", loi: "180" },
        changes: [
          "Pipeline giữ baseline làm mốc cho mọi lần huấn luyện.",
          "Kiểm thử tự động chặn mô hình có lift dưới 5 điểm."
        ],
        note: "Lift dưới 5 điểm là tín hiệu quay lại dữ liệu, không phải tăng tham số."
      }
    ]
  };

  T.lessons["chi-so"] = {
    id: "chi-so",
    module: "mo-hinh-danh-gia",
    title: "Chỉ số đánh giá",
    shortTitle: "Chỉ số",
    subtitle: "Accuracy, precision, recall và F1",
    blurb: "Accuracy 91% nghe tốt cho đến khi biết chỉ có 200 ca dương thật. Bài này tách ma trận nhầm lẫn thành bốn ô, tính precision, recall và F1, rồi chỉ ra khi nào một chỉ số đẹp lại che mất 50 ca bỏ sót.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["accuracy", "precision", "recall", "F1", "ma trận nhầm lẫn"],
    metrics: [
      { key: "acc", label: "Accuracy", tone: "mint" },
      { key: "prec", label: "Precision", tone: "blue" },
      { key: "rec", label: "Recall", tone: "yellow" },
      { key: "f1", label: "F1", tone: "coral" }
    ],
    nodes: [
      { id: "test", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tập test 1.000 dòng", sub: "91% đúng" },
      { id: "cm", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Ma trận nhầm lẫn", sub: "bốn ô đếm" },
      { id: "acc", type: "star", x: 625, y: 80, w: 200, h: 70, label: "Accuracy 91%", sub: "910 trên 1.000" },
      { id: "prec", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Precision 79%", sub: "150 trên 190" },
      { id: "rec", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Recall 75%", sub: "150 trên 200" },
      { id: "f1", type: "layers", x: 625, y: 310, w: 200, h: 70, label: "F1 77%", sub: "trung bình điều hòa" },
      { id: "cost", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Chi phí bỏ sót", sub: "ca nặng, tốn kém" }
    ],
    edges: [
      { id: "test-cm", from: "test", to: "cm", kind: "data", label: "đếm bốn ô" },
      { id: "cm-acc", from: "cm", to: "acc", kind: "response", label: "910 đúng" },
      { id: "cm-prec", from: "cm", to: "prec", kind: "data", label: "TP, FP" },
      { id: "cm-rec", from: "cm", to: "rec", kind: "data", label: "TP, FN" },
      { id: "prec-f1", from: "prec", to: "f1", kind: "data", label: "hài hòa" },
      { id: "rec-f1", from: "rec", to: "f1", kind: "data", label: "hài hòa" },
      { id: "cm-cost", from: "cm", to: "cost", kind: "request", label: "FN đắt hơn" }
    ],
    learn: [
      "<code>Ma trận nhầm lẫn</code> bốn ô là gốc của mọi chỉ số phân loại.",
      "<strong>Accuracy 91%</strong> trên 1.000 dòng tương ứng 90 dòng sai.",
      "<code>Precision</code> 79% và <code>recall</code> 75% nói hai điều khác nhau về cùng mô hình.",
      "Chọn chỉ số chính theo <strong>chi phí thật</strong> của từng loại lỗi."
    ],
    steps: [
      {
        short: "Bốn ô",
        type: "concept",
        title: "Bốn ô trước, phần trăm sau",
        body: "Với 1.000 hồ sơ và 200 ca dương thật, mô hình báo 190 ca dương, trong đó 150 đúng. Bốn ô của ma trận nhầm lẫn là: 150 dương đúng, 40 dương giả, 50 âm bị bỏ sót, 760 âm đúng. Accuracy bằng tổng hai ô đúng chia 1.000, tức 910/1.000 = 91%, khớp với con số 90 dòng sai. <code>Precision</code> là 150/190 = 79%: trong số ca mô hình báo dương, gần một phần năm báo nhầm. <code>Recall</code> là 150/200 = 75%: còn 50 ca thật bị bỏ. Chỉ nhìn 91% sẽ không thấy hai con số 79% và 75% đang kéo nhau.",
        focus: ["test", "cm", "acc", "prec", "rec"],
        edges: ["test-cm", "cm-acc", "cm-prec", "cm-rec"],
        metrics: { acc: "91%", prec: "79%", rec: "75%", f1: "77%" },
        changes: [
          "Bốn ô 150, 40, 50, 760 được ghi vào báo cáo.",
          "Accuracy 91% được đọc kèm precision và recall."
        ],
        note: "Bốn ô gốc luôn đáng in hơn một dòng phần trăm."
      },
      {
        short: "Công thức",
        type: "flow",
        title: "Tính từng chỉ số",
        body: "Bắt đầu bằng ma trận nhầm lẫn thay vì accuracy. Từ bốn ô 150, 40, 50, 760, ta tính lần lượt: accuracy (150+760)/1.000 = 91%; precision 150/(150+40) = 79%; recall 150/(150+50) = 75%; F1 là trung bình điều hòa của 79% và 75%, khoảng 77%. Mỗi chỉ số trả lời một câu khác nhau: accuracy hỏi mô hình đúng bao nhiêu trên toàn bộ, precision hỏi khi báo dương thì đúng bao nhiêu, recall hỏi bắt được bao nhiêu ca thật. <code>F1</code> chỉ nên dùng khi cần một số duy nhất để so các phiên bản. Trong báo cáo, hãy in cả bốn ô gốc để người đọc tự kiểm lại.",
        focus: ["cm", "acc", "prec", "rec", "f1"],
        edges: ["cm-acc", "cm-prec", "cm-rec", "prec-f1", "rec-f1"],
        metrics: { acc: "91%", prec: "79%", rec: "75%", f1: "77%" },
        changes: [
          "Mỗi chỉ số có công thức và mẫu số riêng.",
          "F1 77% xuất hiện khi cần so hai phiên bản."
        ],
        note: "F1 là trung bình điều hòa, nên thấp hơn trung bình cộng của precision và recall."
      },
      {
        short: "Chọn theo lỗi",
        type: "detail",
        title: "Chọn theo cái giá của lỗi",
        body: "Sàng lọc bệnh viện không đối xứng: bỏ sót một ca nặng đắt hơn nhiều so với gọi nhầm một người đi xét nghiệm lại. Vì vậy <code>recall</code> là chỉ số chính, precision là chỉ số phụ, và ngưỡng quyết định nên hạ xuống để bắt thêm ca. Với bài toán lọc thư rác, cái giá đảo ngược: chặn nhầm thư công việc tệ hơn để một thư rác lọt, nên precision lên trước. Với bài toán cân bằng như phân loại ảnh, accuracy và F1 đủ dùng. Bảng trong cheatsheet tóm tắt cách chọn này. Nguyên tắc chung là chọn chỉ số theo chi phí thật của từng loại lỗi, không theo chỉ số có con số đẹp nhất.",
        focus: ["prec", "rec", "cost"],
        edges: ["cm-prec", "cm-rec", "cm-cost"],
        metrics: { acc: "91%", prec: "79%", rec: "75%", f1: "77%" },
        changes: [
          "Recall thành chỉ số chính cho sàng lọc bệnh.",
          "Precision thành chỉ số chính cho lọc thư rác."
        ],
        note: "Cái giá của lỗi quyết định chỉ số chính, không phải sở thích."
      },
      {
        short: "Bẫy accuracy",
        type: "pitfall",
        title: "Accuracy đẹp khi lớp lệch",
        body: "Nếu chỉ 20% hồ sơ là dương thật, một mô hình đoán tất cả là âm đã đạt accuracy 80%, tức 800/1.000, mà recall bằng 0 và bỏ sót toàn bộ 200 ca bệnh. Đây là cái bẫy lớn nhất của accuracy trên dữ liệu lệch. Một lỗi khác là tính precision và recall trên tập train rồi báo cáo như test. Lỗi thứ ba là đổi ngưỡng sau khi xem kết quả test để có F1 đẹp, khiến con số không còn tái lập. Cách chặn: luôn in ma trận nhầm lẫn, so với baseline đa số, và chốt ngưỡng trên validation trước khi chạm test.",
        focus: ["acc", "cm", "cost"],
        edges: ["cm-acc", "cm-cost"],
        metrics: { acc: "80%", prec: "0%", rec: "0%", f1: "0%" },
        changes: [
          "Thêm baseline đoán toàn âm để lộ accuracy 80% vô nghĩa.",
          "Ma trận nhầm lẫn bắt buộc có trong báo cáo."
        ],
        note: "Accuracy 80% của mô hình đoán toàn âm là con số vô nghĩa với bệnh nhân."
      },
      {
        short: "Chốt chỉ số",
        type: "final",
        title: "Chốt bộ chỉ số",
        tone: "final",
        body: "Chốt bộ chỉ số cho báo cáo: ma trận nhầm lẫn bốn ô, accuracy 91%, precision 79%, recall 75%, F1 77%, tất cả trên cùng 1.000 dòng test. Ghi kèm baseline 80% của việc đoán tất cả là âm để thấy accuracy 91% không đủ kết luận. Nếu recall là chỉ số chính, hãy nêu rõ ngưỡng và số ca bắt thêm khi hạ ngưỡng. Đặt tên chỉ số theo bài toán trong bảng chọn, đừng báo cáo cả chục con số không ai đọc. Kiểm thử tự động nên tính lại bốn ô từ dữ liệu test và so với báo cáo, để một lần đổi nhãn cũng bị phát hiện.",
        focus: "all",
        edges: "all",
        metrics: { acc: "91%", prec: "79%", rec: "75%", f1: "77%" },
        changes: [
          "Bộ chỉ số chốt gồm bốn ô, accuracy, precision, recall, F1.",
          "Ngưỡng quyết định ghi kèm số ca bắt thêm."
        ],
        note: "Một bộ chỉ số tốt gồm bốn ô, hai tỉ lệ và một ngưỡng."
      }
    ]
  };

  T.lessons["overfit"] = {
    id: "overfit",
    module: "mo-hinh-danh-gia",
    title: "Overfit và underfit",
    shortTitle: "Overfit",
    subtitle: "Đọc khoảng cách giữa train và validation",
    blurb: "Overfit không phải lỗi của thuật toán mà là dấu hiệu mô hình học thuộc tập train. Bài này so điểm train 99% với validation 74%, đo khoảng cách 25 điểm, rồi hạ độ phức tạp để về mức 84% và 82%.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["overfit", "underfit", "validation", "regularization", "learning curve"],
    metrics: [
      { key: "train", label: "Train", tone: "blue" },
      { key: "val", label: "Validation", tone: "mint" },
      { key: "gap", label: "Khoảng cách", tone: "coral" },
      { key: "fix", label: "Cách sửa", tone: "yellow" }
    ],
    nodes: [
      { id: "train", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tập train 3.000", sub: "dùng để học" },
      { id: "model", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Độ phức tạp", sub: "bậc 1 đến 9" },
      { id: "fit", type: "check", x: 625, y: 80, w: 200, h: 70, label: "Điểm train", sub: "99% khi bậc 9" },
      { id: "val", type: "signal", x: 55, y: 310, w: 200, h: 70, label: "Điểm validation", sub: "74% khi bậc 9" },
      { id: "gap", type: "alert", x: 340, y: 310, w: 200, h: 70, label: "Khoảng cách 25", sub: "overfit rõ" },
      { id: "fix", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Chọn bậc 3", sub: "train 84, val 82" }
    ],
    edges: [
      { id: "train-model", from: "train", to: "model", kind: "data", label: "học tham số" },
      { id: "model-fit", from: "model", to: "fit", kind: "response", label: "khớp train" },
      { id: "model-val", from: "model", to: "val", kind: "response", label: "chấm val" },
      { id: "fit-gap", from: "fit", to: "gap", kind: "data", label: "99%" },
      { id: "val-gap", from: "val", to: "gap", kind: "data", label: "74%" },
      { id: "gap-fix", from: "gap", to: "fix", kind: "control", label: "hạ bậc" }
    ],
    learn: [
      "<code>Overfit</code> là khoảng cách lớn giữa điểm train và validation.",
      "<code>Underfit</code> là cả hai điểm đều thấp, mô hình quá đơn giản.",
      "Khoảng cách <strong>25 điểm</strong> là dấu hiệu rõ của overfit ở bậc 9.",
      "Mục tiêu là <strong>khoảng cách nhỏ</strong>, không phải điểm train cao nhất."
    ],
    steps: [
      {
        short: "Hai kiểu sai",
        type: "concept",
        title: "Học thuộc hay học được",
        body: "Overfit xảy ra khi mô hình học cả nhiễu trong tập train. Với 5.000 dòng, chia 3.000 train, 1.000 validation và 1.000 test, một đa thức bậc 9 đạt 99% trên train nhưng chỉ 74% trên validation. Khoảng cách 25 điểm là dấu hiệu rõ: mô hình nhớ từng dòng thay vì học quy luật. Đổi lại, đa thức bậc 1 chỉ đạt 71% train và 69% validation, khoảng cách 2 điểm nhưng cả hai đều thấp, tức underfit. Mục tiêu không phải điểm train cao nhất mà là khoảng cách nhỏ với điểm validation chấp nhận được. Đường cong validation hình chữ U cho thấy điểm ngọt nằm ở giữa.",
        focus: ["train", "model", "fit", "val"],
        edges: ["train-model", "model-fit", "model-val"],
        metrics: { train: "99%", val: "74%", gap: "25 điểm", fix: "giảm bậc" },
        changes: [
          "Điểm train 99% không còn được coi là thành tích.",
          "Khoảng cách 25 điểm trở thành cảnh báo."
        ],
        note: "Khoảng cách train và validation quan trọng hơn điểm tuyệt đối."
      },
      {
        short: "Quét độ phức tạp",
        type: "flow",
        title: "Đường cong train và val",
        body: "Chia tập trước khi thử bất kỳ bậc nào: 3.000 dòng train, 1.000 validation để chọn bậc, 1.000 test chỉ chạm một lần. Huấn luyện lần lượt bậc 1, 3, 5, 7, 9 và ghi hai điểm. Bậc 1 cho 71% và 69%, bậc 3 cho 84% và 82%, bậc 9 cho 99% và 74%. Đọc bảng này theo cột validation: điểm tăng đến bậc 3 rồi giảm, dù điểm train vẫn tăng. Chọn bậc 3 vì validation cao nhất và khoảng cách chỉ 2 điểm. Chỉ sau khi chốt mới chấm test, được 82%, khớp với validation. Nếu chọn bậc 9 vì train 99%, test sẽ rơi về khoảng 74%.",
        focus: ["train", "val", "fit", "gap"],
        edges: ["model-val", "fit-gap", "val-gap"],
        metrics: { train: "71%", val: "69%", gap: "2 điểm", fix: "tăng bậc" },
        changes: [
          "Ba tập 3.000, 1.000, 1.000 dòng được cố định.",
          "Bậc 3 được chọn theo validation."
        ],
        note: "Chọn bậc trên validation, xác nhận một lần trên test."
      },
      {
        short: "Hạ phức tạp",
        type: "detail",
        title: "Hạ độ phức tạp",
        body: "Ba cách hạ overfit, dùng cùng lúc thì càng tốt. Thứ nhất là giảm độ phức tạp: từ bậc 9 xuống bậc 3, số tham số giảm từ 10 xuống 4. Thứ hai là thêm regularization, ví dụ ridge với alpha 1,0, kéo hệ số lớn về gần 0. Thứ ba là dừng sớm theo validation khi điểm không tăng sau 5 vòng. Với bài này, bậc 3 cho train 84%, validation 82%, khoảng cách 2 điểm, và test 82%. So với baseline 76%, lift là +6 điểm, đủ ngưỡng triển khai. Đừng chọn mô hình theo train; hãy chọn theo validation rồi xác nhận bằng test.",
        focus: ["model", "fit", "val", "fix"],
        edges: ["model-fit", "model-val", "gap-fix"],
        metrics: { train: "84%", val: "82%", gap: "2 điểm", fix: "bậc 3" },
        changes: [
          "Số tham số giảm từ 10 xuống 4.",
          "Train 84%, validation 82%, test 82%."
        ],
        note: "Giảm độ phức tạp thường rẻ hơn thu thêm dữ liệu."
      },
      {
        short: "Rò rỉ val",
        type: "pitfall",
        title: "Rò rỉ làm val đẹp ảo",
        body: "Rò rỉ dữ liệu làm validation đẹp giả tạo. Một nhóm chuẩn hóa toàn bộ 5.000 dòng trước khi chia tập, nên thông tin trung bình của test lẫn vào train. Kết quả là validation nhảy lên 90% trong khi test chỉ 74%, và khoảng cách 16 điểm bị hiểu sai là overfit. Lỗi khác là để cùng một khách hàng xuất hiện ở cả train và validation, hoặc dùng nhãn tương lai để dự đoán quá khứ. Cách chặn: chia tập trước, khớp bộ chuẩn hóa chỉ trên train, kiểm tra trùng khóa giữa các tập. Khi validation cao hơn test quá 5 điểm, hãy nghi rò rỉ trước khi nghi mô hình.",
        focus: ["train", "val", "gap"],
        edges: ["train-model", "model-val", "val-gap"],
        metrics: { train: "84%", val: "90%", gap: "rò rỉ", fix: "chia lại" },
        changes: [
          "Bộ chuẩn hóa chỉ khớp trên train.",
          "Kiểm tra trùng khóa giữa các tập trước khi huấn luyện."
        ],
        note: "Validation cao hơn test nhiều thường là rò rỉ, không phải may mắn."
      },
      {
        short: "Chốt quy trình",
        type: "final",
        title: "Chốt quy trình chống overfit",
        tone: "final",
        body: "Chốt quy trình: chia 3.000 train, 1.000 validation, 1.000 test trước khi làm gì khác; khớp mọi phép biến đổi chỉ trên train; quét độ phức tạp và chọn theo validation. Với bài này, bậc 3 cho train 84%, validation 82%, test 82%, khoảng cách 2 điểm. Ghi cả ba con số vào báo cáo, đừng chỉ ghi test. Đặt cảnh báo nếu khoảng cách train và validation vượt 5 điểm trong lần huấn luyện sau. Khi có thêm dữ liệu, ưu tiên thêm dòng thay vì tăng bậc, vì dữ liệu nhiều làm overfit khó xảy ra hơn. Kiểm thử tự động nên chặn mô hình có khoảng cách quá lớn.",
        focus: "all",
        edges: "all",
        metrics: { train: "84%", val: "82%", gap: "2 điểm", fix: "theo dõi" },
        changes: [
          "Mọi lần huấn luyện ghi đủ ba điểm.",
          "Cảnh báo tự động khi khoảng cách vượt 5 điểm."
        ],
        note: "Ghi cả ba điểm train, validation, test vào cùng một bảng."
      }
    ]
  };

  T.lessons["ra-quyet-dinh"] = {
    id: "ra-quyet-dinh",
    module: "mo-hinh-danh-gia",
    title: "Ra quyết định",
    shortTitle: "Quyết định",
    subtitle: "Từ lift và chi phí lỗi đến ngưỡng triển khai",
    blurb: "Lift +6 điểm là điều kiện cần, chưa đủ. Bài cuối đặt cạnh nhau số dòng đúng, 180 lỗi còn lại, chi phí xử lý mỗi lỗi và ngưỡng 5 điểm của phòng mô phỏng, rồi chốt một quyết định triển khai có giám sát.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["lift", "chi phí lỗi", "ngưỡng", "triển khai", "giám sát"],
    metrics: [
      { key: "lift", label: "Lift", tone: "yellow" },
      { key: "loi", label: "Lỗi test", tone: "coral" },
      { key: "chi", label: "Chi phí", tone: "blue" },
      { key: "quyet", label: "Quyết định", tone: "mint" }
    ],
    nodes: [
      { id: "test", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tập test 1.000 dòng", sub: "nhãn đã biết" },
      { id: "model", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Mô hình 82%", sub: "820 dòng đúng" },
      { id: "lift", type: "signal", x: 625, y: 80, w: 200, h: 70, label: "Lift +6 điểm", sub: "vượt ngưỡng 5" },
      { id: "err", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "180 lỗi", sub: "18% dòng sai" },
      { id: "gate", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Ngưỡng 5 điểm", sub: "dưới thì dừng" },
      { id: "ship", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Triển khai", sub: "có giám sát" },
      { id: "watch", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Giám sát 4 tuần", sub: "theo dõi drift" }
    ],
    edges: [
      { id: "test-model", from: "test", to: "model", kind: "data", label: "chấm điểm" },
      { id: "model-lift", from: "model", to: "lift", kind: "response", label: "+6 điểm" },
      { id: "model-err", from: "model", to: "err", kind: "data", label: "đếm lỗi" },
      { id: "lift-gate", from: "lift", to: "gate", kind: "control", label: "so ngưỡng" },
      { id: "err-gate", from: "err", to: "gate", kind: "request", label: "chi phí lỗi" },
      { id: "gate-ship", from: "gate", to: "ship", kind: "control", label: "đạt thì chạy" },
      { id: "ship-watch", from: "ship", to: "watch", kind: "control", label: "theo dõi" }
    ],
    learn: [
      "Quyết định triển khai dựa trên <code>lift</code>, chi phí lỗi và ngưỡng tắt.",
      "<strong>Lift +6 điểm</strong> tương đương 60 dòng đúng thêm mỗi 1.000 dòng.",
      "<strong>180 lỗi</strong> cần quy ra tiền hoặc giờ xử lý trước khi ký duyệt.",
      "Chạy song song và <strong>theo dõi theo nhóm</strong> trước khi thay hẳn."
    ],
    steps: [
      {
        short: "Ba câu hỏi",
        type: "concept",
        title: "Ba câu hỏi trước khi chạy",
        body: "Một mô hình 82% trên 1.000 dòng test chỉ đáng triển khai khi trả lời được ba câu. Thứ nhất, nó hơn baseline bao nhiêu: 82% so với 76% là lift +6 điểm, vượt ngưỡng 5 của phòng mô phỏng. Thứ hai, 180 dòng sai rơi vào đâu và mỗi lỗi tốn bao nhiêu công xử lý. Thứ ba, khi nào cần tắt mô hình nếu chất lượng tụt. Không có câu trả lời cho cả ba, con số 82% chỉ là một điểm số đẹp trên slide. Quyết định triển khai là một quyết định vận hành, không phải một cuộc thi accuracy.",
        focus: ["test", "model", "lift", "err"],
        edges: ["test-model", "model-lift", "model-err"],
        metrics: { lift: "+6", loi: "180", chi: "chưa tính", quyet: "chờ" },
        changes: [
          "Ba câu hỏi được đưa vào tài liệu quyết định.",
          "Lift +6 điểm được ghi kèm 180 lỗi."
        ],
        note: "Ba câu hỏi này nên nằm trong tài liệu quyết định, không chỉ trong đầu."
      },
      {
        short: "Quy ra tiền",
        type: "flow",
        title: "Quy lift ra tiền",
        body: "Lift lấy trực tiếp từ hai lần chấm trên cùng tập test: 82% trừ 76% bằng +6 điểm, tức 60 dòng đúng thêm. Nếu mỗi lỗi tốn 20.000 đồng xử lý lại, 180 lỗi của mô hình tốn 3,6 triệu, còn 240 lỗi của baseline tốn 4,8 triệu; chênh 1,2 triệu mỗi 1.000 hồ sơ. Nhân với 50 lô mỗi tháng, khoản tiết kiệm thành 60 triệu. Đó là lý do phải quy lift ra tiền hoặc thời gian, chứ không dừng ở điểm phần trăm. Nếu chi phí xử lý lỗi thấp hơn chi phí vận hành mô hình, lift +6 vẫn có thể không đáng.",
        focus: ["model", "lift", "err"],
        edges: ["model-lift", "model-err", "err-gate"],
        metrics: { lift: "+6", loi: "180", chi: "3,6 triệu", quyet: "chờ" },
        changes: [
          "Lỗi được quy ra tiền: 3,6 triệu so với 4,8 triệu.",
          "Khoản tiết kiệm 1,2 triệu mỗi 1.000 hồ sơ."
        ],
        note: "Lift chỉ có nghĩa khi quy được ra tiền hoặc giờ công."
      },
      {
        short: "Ngưỡng",
        type: "detail",
        title: "Ngưỡng và điều kiện",
        body: "Phòng mô phỏng dùng ngưỡng lift 5 điểm vì dưới mức đó, dao động giữa các lần chia tập dễ nuốt mất khác biệt. Trên 1.000 dòng test, chênh lệch 2 điểm chỉ là 20 dòng, quá nhỏ để kết luận. Với lift +6, khoảng 60 dòng, ta có thêm căn cứ nhưng vẫn nên xem khoảng tin cậy. Điều kiện đi kèm: dữ liệu đầu vào phải giống lúc huấn luyện, nhãn phải được kiểm định, và phải có bản sao baseline để so mỗi tuần. Nếu thiếu một điều kiện, hãy chạy song song mô hình và quy tắc cũ trong một tháng trước khi thay hẳn.",
        focus: ["lift", "gate", "ship"],
        edges: ["lift-gate", "gate-ship"],
        metrics: { lift: "+6", loi: "180", chi: "1,2 triệu", quyet: "đáng chạy" },
        changes: [
          "Ngưỡng lift 5 điểm và ngưỡng tắt được chốt trước.",
          "Có bản sao baseline để so mỗi tuần."
        ],
        note: "Ngưỡng phải chốt trước khi xem kết quả, nếu không chỉ là hợp thức hóa."
      },
      {
        short: "Lỗi nặng",
        type: "pitfall",
        title: "Lift trung bình che lỗi nặng",
        body: "Lift +6 là con số trung bình trên toàn tập, nên nó che được chỗ tệ nhất. Giả sử 180 lỗi tập trung vào nhóm khách hàng lớn: chỉ 5% hồ sơ nhưng chiếm 30% lỗi, mỗi lỗi tốn gấp mười lần bình thường. Khi đó khoản tiết kiệm 1,2 triệu biến thành lỗ ròng. Một lỗi khác là chấm trên 200 dòng test rồi kết luận; 4 dòng sai đã làm accuracy nhảy 2 điểm. Cách chặn: báo cáo lift theo từng nhóm, giữ tập test đủ lớn, và đặt điều kiện tắt mô hình nếu tỉ lệ lỗi nhóm lớn vượt ngưỡng.",
        focus: ["err", "gate", "watch"],
        edges: ["model-err", "err-gate", "ship-watch"],
        metrics: { lift: "+6", loi: "180", chi: "cao ở nhóm lớn", quyet: "hoãn" },
        changes: [
          "Báo cáo lift theo nhóm khách hàng.",
          "Điều kiện tắt máy dựa trên tỉ lệ lỗi nhóm lớn."
        ],
        note: "Một con số trung bình đẹp có thể che một nhóm lỗi rất đắt."
      },
      {
        short: "Chốt",
        type: "final",
        title: "Chốt quyết định",
        tone: "final",
        body: "Chốt quy trình ra quyết định. Một: chấm mô hình và baseline trên cùng 1.000 dòng test, ghi 82%, 76%, lift +6 điểm, 180 lỗi. Hai: quy đổi lỗi ra chi phí, so với chi phí vận hành; ở đây tiết kiệm 1,2 triệu mỗi lô. Ba: kiểm tra lift theo nhóm, đặc biệt nhóm chiếm nhiều lỗi. Bốn: đặt ngưỡng tắt máy, ví dụ accuracy dưới 78% trong hai tuần liên tiếp. Năm: chạy song song một tháng, giữ baseline trong pipeline. Sáu: ghi lại quyết định kèm số liệu để lần sau không phải tranh luận lại từ đầu.",
        focus: "all",
        edges: "all",
        metrics: { lift: "+6", loi: "180", chi: "1,2 triệu", quyet: "chạy có giám sát" },
        changes: [
          "Quyết định chạy có giám sát được ghi kèm số liệu.",
          "Lịch kiểm tra bốn tuần và ngưỡng tắt rõ ràng."
        ],
        note: "Quyết định tốt là quyết định ghi kèm điều kiện dừng."
      }
    ]
  };

  T.practice.push(
    {
      id: "model-lift-rule",
      module: "mo-hinh-danh-gia",
      tag: "MODEL",
      tags: ["lift", "baseline", "triển khai"],
      title: "Mô hình 82% có nên thay quy tắc cũ?",
      scenario: "Một cửa hàng trực tuyến đang xếp hạng đơn hàng có rủi ro giao chậm bằng một quy tắc do trưởng nhóm vận hành viết: hễ khoảng cách trên 300 km và ngày giao dự kiến rơi vào cuối tuần thì gắn cờ. Quy tắc này đạt 76% độ chính xác trên 1.000 đơn kiểm tra. Nhóm dữ liệu huấn luyện một mô hình gradient boosting đạt 82% trên đúng tập đó, tức 180 đơn dự đoán sai thay vì 240. Sếp hỏi có nên bỏ quy tắc cũ ngay tuần này không. Bạn cần chọn cách trả lời đúng nhất dựa trên lift và rủi ro vận hành.",
      metrics: [
        { label: "Mô hình", value: "82%" },
        { label: "Baseline", value: "76%" },
        { label: "Lỗi còn lại", value: "180 đơn", danger: true }
      ],
      options: [
        "Bỏ quy tắc cũ ngay vì 82% cao hơn 76%, không cần kiểm tra thêm.",
        "Giữ quy tắc cũ vì mô hình chỉ hơn 6 điểm, chênh lệch quá nhỏ để làm gì.",
        "Coi lift +6 điểm là đủ để thử, nhưng chạy song song một tháng, theo dõi lỗi theo nhóm rồi mới thay hẳn.",
        "Huấn luyện lại mô hình trên toàn bộ 1.000 đơn kiểm tra để đạt accuracy cao hơn rồi mới quyết định."
      ],
      correct: 2,
      explain: "Lift +6 điểm vượt ngưỡng 5 của phòng mô phỏng, nên mô hình đáng được thử, nhưng 180 lỗi vẫn là 180 đơn hàng thật. Cách đúng là chạy song song: giữ quy tắc cũ làm mốc, gắn cờ song song một tháng, so lỗi theo nhóm rồi mới thay hẳn. Bỏ ngay là bỏ qua rủi ro vận hành, vì lift trung bình có thể che nhóm lỗi nặng. Giữ quy tắc cũ là bỏ qua 60 đơn đúng thêm mỗi lô 1.000 đơn, tương đương 1,2 triệu đồng nếu mỗi lỗi tốn 20.000 đồng. Huấn luyện trên tập kiểm tra là rò rỉ dữ liệu, khiến 82% không còn giá trị."
    },
    {
      id: "metric-sang-loc",
      module: "mo-hinh-danh-gia",
      tag: "METRIC",
      tags: ["recall", "precision", "F1"],
      title: "Chỉ số nào để báo cáo?",
      scenario: "Một bệnh viện thử mô hình sàng lọc 1.000 hồ sơ, trong đó 200 ca thật sự cần theo dõi. Mô hình báo 190 ca dương, đúng 150 ca, bỏ sót 50 ca và báo nhầm 40 ca. Accuracy đạt 91%, tức 90 hồ sơ sai. Ban giám đốc chỉ muốn nhìn một con số trên báo cáo tuần và đề nghị dùng accuracy vì nó gần 100%. Bác sĩ trưởng khoa phản đối, cho rằng bỏ sót ca nặng là lỗi không chấp nhận được. Bạn được giao chọn bộ chỉ số và cách trình bày để vừa đúng bản chất vừa dễ hiểu.",
      metrics: [
        { label: "Ca dương thật", value: "200" },
        { label: "Bỏ sót", value: "50 ca", danger: true },
        { label: "Accuracy", value: "91%" }
      ],
      options: [
        "Chỉ báo accuracy 91% vì đó là chỉ số chuẩn và dễ hiểu nhất.",
        "Chỉ báo recall 75% vì bỏ sót ca bệnh là lỗi duy nhất đáng quan tâm.",
        "Báo accuracy kèm precision 79%, recall 75%, F1 77% và ma trận nhầm lẫn, lấy recall làm chỉ số chính.",
        "Báo F1 77% thay cho mọi chỉ số khác để báo cáo gọn một dòng."
      ],
      correct: 2,
      explain: "Accuracy 91% không sai, nhưng nó gộp 50 ca bỏ sót và 40 ca báo nhầm vào một con số. Với sàng lọc bệnh, bỏ sót đắt hơn nhiều, nên <code>recall</code> 75% phải là chỉ số chính; precision 79% cho biết bao nhiêu ca báo dương là thật; F1 77% tóm tắt hai chỉ số khi cần so phiên bản. Chỉ báo accuracy là che mất 50 ca nặng. Chỉ báo recall là bỏ qua 40 ca báo nhầm làm tăng tải xét nghiệm. Báo mỗi F1 là mất ngữ cảnh vì F1 không nói lỗi rơi vào phía nào. Kèm ma trận nhầm lẫn để kiểm lại bốn ô 150, 40, 50, 760."
    }
  );

  const evaluationCards = [
    {
      title: "Chọn chỉ số theo bài toán",
      wide: true,
      body: "<table class=\"cheat-table\"><thead><tr><th>Bài toán</th><th>Chỉ số chính</th><th>Chỉ số phụ</th><th>Cảnh báo</th></tr></thead><tbody><tr><td>Sàng lọc bệnh, gian lận</td><td class=\"mono\">recall</td><td>precision, F1</td><td>Bỏ sót đắt hơn báo nhầm</td></tr><tr><td>Lọc thư rác, chặn thẻ</td><td class=\"mono\">precision</td><td>recall, F1</td><td>Chặn nhầm làm mất khách</td></tr><tr><td>Phân loại cân bằng</td><td class=\"mono\">accuracy</td><td>F1, ma trận nhầm lẫn</td><td>Chỉ dùng khi lớp cân bằng</td></tr><tr><td>Dự báo số lượng</td><td class=\"mono\">MAE</td><td>RMSE, MAPE</td><td>RMSE phạt nặng ngoại lai</td></tr><tr><td>Xếp hạng, gợi ý</td><td class=\"mono\">precision@k</td><td>recall@k</td><td>Đo trên tập test riêng</td></tr></tbody></table>"
    },
    {
      title: "Bốn ô của ma trận nhầm lẫn",
      body: "<table class=\"cheat-table\"><thead><tr><th>Ô</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead><tbody><tr><td class=\"mono\">TP</td><td>dương, báo dương</td><td class=\"mono\">150</td></tr><tr><td class=\"mono\">FP</td><td>âm, báo dương</td><td class=\"mono\">40</td></tr><tr><td class=\"mono\">FN</td><td>dương, báo âm</td><td class=\"mono\">50</td></tr><tr><td class=\"mono\">TN</td><td>âm, báo âm</td><td class=\"mono\">760</td></tr></tbody></table><p>precision = TP/(TP+FP) = 79%; recall = TP/(TP+FN) = 75%; accuracy = (TP+TN)/tổng = 91%.</p>"
    },
    {
      title: "Dựng baseline ba dòng",
      body: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>from sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import accuracy_score\n\nbase = DummyClassifier(strategy=\"most_frequent\")\nbase.fit(X_train, y_train)\npred = base.predict(X_test)\nprint(accuracy_score(y_test, pred))\n# 0.76 tren 1.000 dong test</code></pre></div><p>Ghi baseline vào báo cáo trước khi huấn luyện mô hình thật.</p>"
    },
    {
      title: "Chấm mô hình và đọc lift",
      wide: true,
      body: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report, confusion_matrix\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=1000, random_state=42, stratify=y\n)\nmodel.fit(X_train, y_train)\npred = model.predict(X_test)\n\ncm = confusion_matrix(y_test, pred)\nprint(pd.DataFrame(cm, index=[\"am\", \"duong\"], columns=[\"am\", \"duong\"]))\nprint(classification_report(y_test, pred, digits=2))\nprint(\"accuracy:\", round((pred == y_test).mean(), 3))\nprint(\"loi:\", int((pred != y_test).sum()))\n# 0.91 va 90 loi tren 1.000 dong</code></pre></div><p>Lift = accuracy mô hình trừ accuracy baseline, tính trên cùng tập test.</p>"
    },
    {
      title: "Checklist trước khi triển khai",
      body: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Chốt tập test riêng, không dùng để chọn tham số.</li><li>Có baseline đa số hoặc luật đơn giản trên cùng tập test.</li><li>Báo cáo đủ bốn ô ma trận nhầm lẫn, không chỉ accuracy.</li><li>Kiểm tra lift theo từng nhóm quan trọng, không chỉ trung bình.</li><li>Đặt ngưỡng tắt mô hình và lịch giám sát sau triển khai.</li><li>Lưu phiên bản dữ liệu, mô hình và hạt ngẫu nhiên để tái lập.</li></ul>"
    }
  ];

  T.cheatsheets.push({
    id: "evaluation",
    num: "03",
    module: "mo-hinh-danh-gia",
    title: "Đánh giá mô hình",
    intro: "Bảng tra cho bước đánh giá: chọn chỉ số theo bài toán, đọc ma trận nhầm lẫn, dựng baseline bằng scikit-learn, chấm mô hình trên test bằng pandas và checklist trước khi triển khai. Chép các lệnh vào notebook để kết quả tái lập được.",
    cards: evaluationCards.map((card) => ({
      title: card.title,
      wide: !!card.wide,
      body: card.body,
      html: card.body
    }))
  });
})();
