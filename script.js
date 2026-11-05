/* ============================================================
   Student Results Dashboard — Task 2 (OOP + map / filter / reduce)
   إعداد: سامية وحيد شعبان  |  الرقم الجامعي: 2302572
   التشغيل:  node script.js   أو افتح index.html ثم F12
   ============================================================ */

// ---------- 1) كلاس الطالب ----------
class Student {
  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }

  // متوسط الدرجات باستخدام reduce
  computeAverage() {
    const subjectsCount = this.grades.length;
    if (!subjectsCount) return 0;
    const sum = this.grades.reduce((acc, mark) => acc + mark, 0);
    return sum / subjectsCount;
  }

  // التقدير بالحروف
  assignLetter(avg) {
    let letter;
    if (avg >= 90) letter = "A";
    else if (avg >= 80) letter = "B";
    else if (avg >= 70) letter = "C";
    else if (avg >= 60) letter = "D";
    else if (avg >= 50) letter = "E";
    else letter = "F";
    return letter;
  }

  // النتيجة النهائية: المتوسط والحضور معًا
  finalStatus() {
    const passesMarks = this.computeAverage() >= 50;
    const passesAttendance = this.attendance >= 75;
    return passesMarks && passesAttendance ? "ناجح" : "يحتاج مراجعة";
  }
}

// ---------- 2) المصفوفة الرئيسية ----------
const studentsList = [
  new Student(2001, "نور الهدى", [96, 91, 89], 94),
  new Student(2002, "ياسمين عادل", [43, 48, 41], 85),  // متعثرة
  new Student(2003, "رنا خالد", [46, 40, 49], 78),     // متعثرة
  new Student(2004, "هبة سمير", [66, 72, 61], 69),     // حضور ضعيف
];

// ---------- 3) لجنة الرأفة ----------
const MERCY_BONUS = 5;

const mercyCommittee = (list, bonus = MERCY_BONUS) => {
  const strugglers = list.filter((s) => {
    const a = s.computeAverage();
    return a >= 40 && a <= 49;
  });

  const boosted = strugglers.map((s) => ({
    id: s.id,
    name: s.name,
    before: s.computeAverage(),
    after: s.computeAverage() + bonus,
  }));

  const sumAfter = boosted.reduce((acc, s) => acc + s.after, 0);

  // درع الحماية: لا قسمة على صفر
  const mercyAverage = boosted.length > 0 ? sumAfter / boosted.length : 0;

  return { strugglers, boosted, sumAfter, mercyAverage };
};

// ---------- 4) المخرجات ----------
function printStudentReports(list) {
  console.log("┌──────── تقرير نتائج الطلاب ────────┐");
  list.forEach((s) => {
    const avg = s.computeAverage();
    console.log(
      `الاسم: ${s.name} | المتوسط: ${avg.toFixed(2)} | التقدير: ${s.assignLetter(avg)} | النتيجة: ${s.finalStatus()}`
    );
  });
}

function main() {
  printStudentReports(studentsList);
  const { boosted, mercyAverage } = mercyCommittee(studentsList);
  console.log("\n--- الطلاب المتعثرون بعد الرأفة ---");
  console.log(boosted);
  console.log("\n--- متوسط المتعثرين بعد التعديل ---");
  console.log(mercyAverage.toFixed(2));
}

main();
