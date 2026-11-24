/* DataLab — engine mô phỏng làm sạch, chia tập và đánh giá mô hình */
(function () {
  "use strict";

  const SEED = window.DATA_SEED;
  if (!SEED) return;

  const fmt = new Intl.NumberFormat("vi-VN");

  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function runClean(input) {
    const box = input || {};
    const rows = clampInt(box.rows, 100, 100000, 10000);
    const missing = clampInt(box.missing, 0, 40, 4);
    const duplicate = clampInt(box.duplicate, 0, 30, 3);
    const kept = Math.round(rows * (1 - missing / 100) * (1 - duplicate / 100));
    const quality = round1(Math.max(0, 100 - missing * 1.5 - duplicate * 1.2));
    const dropped = rows - kept;
    const ok = quality >= 70;
    const trace = [
      {
        step: "source",
        label: "Bảng nguồn",
        result: "ok",
        note: `${fmt.format(rows)} dòng · thiếu ${missing}% ô · trùng ${duplicate}%`
      },
      {
        step: "keep",
        label: "Giữ lại",
        result: "ok",
        note: `${fmt.format(kept)} dòng dùng được, bỏ ${fmt.format(dropped)}`
      },
      {
        step: "score",
        label: "Điểm chất lượng",
        result: ok ? "ok" : "warn",
        note: `${quality}/100 · ${ok ? "dùng được" : "cần làm sạch thêm"}`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: ok ? "ok" : "fail",
        note: ok ? "Bảng đạt ngưỡng 70 điểm" : "Dưới ngưỡng 70 điểm, chưa nên huấn luyện"
      }
    ];
    return {
      ok,
      verdict: ok ? "Đạt" : "Cần sửa",
      meta: `${fmt.format(kept)} / ${fmt.format(rows)} dòng giữ lại`,
      statusText: `${quality}/100 điểm chất lượng`,
      tags: ["Làm sạch", `thiếu ${missing}%`, `trùng ${duplicate}%`],
      trace,
      payload: {
        "tổng dòng": fmt.format(rows),
        "giữ lại": fmt.format(kept),
        "bỏ": fmt.format(dropped),
        "chất lượng": `${quality}/100`
      },
      metrics: [
        { label: "Dòng giữ", value: fmt.format(kept) },
        { label: "Dòng bỏ", value: fmt.format(dropped) },
        { label: "Chất lượng", value: `${quality}/100` },
        { label: "Kết luận", value: ok ? "đạt" : "cần sửa" }
      ],
      values: { rows, missing, duplicate, kept, dropped, quality, ok: ok ? 1 : 0 }
    };
  }

  function runSplit(input) {
    const box = input || {};
    const rows = clampInt(box.rows, 100, 50000, 1000);
    const trainPct = clampInt(box.trainPct, 50, 90, 70);
    let valPct = clampInt(box.valPct, 5, 25, 15);
    let testPct = 100 - trainPct - valPct;
    if (testPct < 5) {
      valPct = Math.max(5, 100 - trainPct - 5);
      testPct = 100 - trainPct - valPct;
    }
    const trainRows = Math.round((rows * trainPct) / 100);
    const valRows = Math.round((rows * valPct) / 100);
    const testRows = rows - trainRows - valRows;
    const balanced = trainPct <= 80 && valPct >= 10 && testPct >= 10;
    const trace = [
      {
        step: "ratio",
        label: "Tỉ lệ đặt",
        result: "ok",
        note: `${trainPct}% train · ${valPct}% val · ${testPct}% test`
      },
      {
        step: "rows",
        label: "Quy ra dòng",
        result: "ok",
        note: `${fmt.format(trainRows)} / ${fmt.format(valRows)} / ${fmt.format(testRows)} dòng`
      },
      {
        step: "leak",
        label: "Kiểm tra rò rỉ",
        result: balanced ? "ok" : "warn",
        note: balanced ? "Không có tập nào quá mỏng" : "Có tập dưới 10% hoặc train quá 80%"
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: balanced ? "ok" : "fail",
        note: balanced ? "Tỉ lệ cân bằng, dùng được" : "Tỉ lệ lệch, kết quả đánh giá sẽ thiếu tin cậy"
      }
    ];
    return {
      ok: balanced,
      verdict: balanced ? "Cân bằng" : "Lệch",
      meta: `${trainPct}/${valPct}/${testPct}`,
      statusText: `${testPct}% test · ${fmt.format(testRows)} dòng`,
      tags: ["Chia tập", `${trainPct}/${valPct}/${testPct}`],
      trace,
      payload: {
        train: `${trainPct}%`,
        val: `${valPct}%`,
        test: `${testPct}%`,
        "dòng test": fmt.format(testRows)
      },
      metrics: [
        { label: "Train", value: `${fmt.format(trainRows)} dòng` },
        { label: "Val", value: `${fmt.format(valRows)} dòng` },
        { label: "Test", value: `${fmt.format(testRows)} dòng` },
        { label: "Kết luận", value: balanced ? "cân bằng" : "lệch" }
      ],
      values: { rows, trainPct, valPct, testPct, trainRows, valRows, testRows, balanced: balanced ? 1 : 0 }
    };
  }

  function runModel(input) {
    const box = input || {};
    const accuracy = clampInt(box.accuracy, 50, 99, 82);
    const baseline = clampInt(box.baseline, 30, 99, 76);
    const testRows = clampInt(box.testRows, 100, 50000, 1000);
    const lift = round1(accuracy - baseline);
    const errors = Math.round(testRows * (1 - accuracy / 100));
    const ok = lift >= 5;
    const trace = [
      {
        step: "score",
        label: "Điểm mô hình",
        result: "ok",
        note: `${accuracy}% accuracy · baseline ${baseline}%`
      },
      {
        step: "lift",
        label: "Lift",
        result: ok ? "ok" : "warn",
        note: `${lift >= 0 ? "+" : ""}${lift} điểm so với baseline`
      },
      {
        step: "errors",
        label: "Lỗi trên test",
        result: "ok",
        note: `${fmt.format(errors)} / ${fmt.format(testRows)} dòng sai`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: ok ? "ok" : "fail",
        note: ok ? "Đủ hơn baseline để cân nhắc triển khai" : "Không hơn baseline đủ nhiều, chưa nên triển khai"
      }
    ];
    return {
      ok,
      verdict: ok ? "Đáng dùng" : "Chưa đáng",
      meta: `lift ${lift >= 0 ? "+" : ""}${lift}`,
      statusText: `lift ${lift >= 0 ? "+" : ""}${lift} · ${fmt.format(errors)} lỗi`,
      tags: ["Mô hình", `accuracy ${accuracy}%`, `baseline ${baseline}%`],
      trace,
      payload: {
        accuracy: `${accuracy}%`,
        baseline: `${baseline}%`,
        lift: `${lift >= 0 ? "+" : ""}${lift}`,
        "dòng test": fmt.format(testRows),
        lỗi: fmt.format(errors)
      },
      metrics: [
        { label: "Accuracy", value: `${accuracy}%` },
        { label: "Lift", value: `${lift >= 0 ? "+" : ""}${lift}` },
        { label: "Lỗi", value: fmt.format(errors) },
        { label: "Kết luận", value: ok ? "đáng dùng" : "chưa đáng" }
      ],
      values: { accuracy, baseline, testRows, lift, errors, ok: ok ? 1 : 0 }
    };
  }

  function run(kind, values) {
    if (kind === "clean") return runClean(values);
    if (kind === "split") return runSplit(values);
    if (kind === "model") return runModel(values);
    throw new Error("Không rõ lát cắt: " + kind);
  }

  window.DATA_ENGINE = { run, formatNumber: (n) => fmt.format(n), round1, clampInt };
})();
