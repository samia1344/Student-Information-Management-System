/* طبقة العرض — تعتمد على script.js */
const $ = (id) => document.getElementById(id);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const GRADE_COLOR = { A: "#2fd1a4", B: "#2fd1a4", C: "#6c8cff", D: "#6c8cff", E: "#ffb02e", F: "#ff5d8f" };

function drawDonut(counts) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  let offset = 0;
  const C = 2 * Math.PI * 45;
  $("donut").innerHTML = Object.entries(counts).map(([g, n]) => {
    const len = (n / total) * C;
    const seg = `<circle cx="60" cy="60" r="45" fill="none" stroke="${GRADE_COLOR[g]}" stroke-width="16" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}"/>`;
    offset += len;
    return seg;
  }).join("");
  $("legend").innerHTML = Object.entries(counts).map(([g, n]) => `<span><i class="dot" style="background:${GRADE_COLOR[g]}"></i>${g}: ${n}</span>`).join("");
}

function render() {
  const rows = studentsList.map((s) => {
    const avg = s.computeAverage();
    return { s, avg, letter: s.assignLetter(avg), status: s.finalStatus() };
  });
  const passed = rows.filter((r) => r.status === "ناجح").length;
  const mean = rows.reduce((a, r) => a + r.avg, 0) / (rows.length || 1);
  const m = mercyCommittee(studentsList, Number($("bonus").value));

  $("kpis").innerHTML = [
    [rows.length, "عدد الطلاب", "#6c8cff"], [passed, "ناجحون", "#2fd1a4"],
    [mean.toFixed(1), "متوسط الدفعة", "#ffb02e"], [m.strugglers.length, "تحت الرأفة", "#ff5d8f"],
  ].map(([v, l, k]) => `<div class="kpi" style="--k:${k}"><b>${v}</b><span>${l}</span></div>`).join("");

  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  rows.forEach((r) => counts[r.letter]++);
  drawDonut(Object.fromEntries(Object.entries(counts).filter(([, n]) => n > 0)));

  $("rows").innerHTML = rows.map(({ s, avg, letter, status }) => `
    <tr><td data-l="الطالبة"><div class="who"><span class="ava" style="--k:${GRADE_COLOR[letter]}">${esc([...s.name][0])}</span><span>${esc(s.name)}<br><small>${esc(s.id)}</small></span></div></td>
    <td data-l="الدرجات">${s.grades.map(esc).join(" · ")}</td><td data-l="الحضور">${esc(s.attendance)}%</td><td data-l="المتوسط"><b>${avg.toFixed(2)}</b></td>
    <td data-l="التقدير"><span class="chip" style="--k:${GRADE_COLOR[letter]}">${letter}</span></td>
    <td data-l="النتيجة"><span class="chip soft" style="--k:${status === "ناجح" ? "#14a37f" : "#e0346b"}">${status}</span></td></tr>`).join("");

  $("mbars").innerHTML = m.boosted.length
    ? m.boosted.map((b) => `<div class="mb"><div class="t"><span>${esc(b.name)}</span><span>${b.before.toFixed(2)} ← ${b.after.toFixed(2)}</span></div>
        <div class="track"><i class="a" style="width:${Math.min(b.after, 100)}%"></i><i class="b" style="width:${Math.min(b.before, 100)}%"></i></div></div>`).join("")
    : `<p class="sub">لا يوجد متعثرون الآن، والمتوسط 0 بفضل درع الحماية.</p>`;
  $("mavg").textContent = m.mercyAverage.toFixed(2);
  $("bonusOut").textContent = $("bonus").value;
}

function showConsole() {
  const out = $("out"), orig = console.log.bind(console);
  out.textContent = "";
  console.log = (...a) => { orig(...a); out.textContent += a.map((x) => (typeof x === "object" ? JSON.stringify(x, null, 2) : x)).join(" ") + "\n"; };
  main();
  console.log = orig;
}

$("bonus").addEventListener("input", render);
$("add").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  studentsList.push(new Student(f.get("id"), f.get("name").trim(), [+f.get("a"), +f.get("b"), +f.get("c")], +f.get("att")));
  e.target.reset();
  render(); showConsole();
});
render(); showConsole();
