import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "클린 뷰티 콘텐츠 생성기" },
      { name: "description", content: "클린 뷰티 제품 콘텐츠를 손쉽게 생성하세요." },
    ],
  }),
  component: Index,
});

const AGES = ["10대 후반", "20대", "30대", "40대"];
const TEMPLATES = ["올리브영", "아마존"];

function Index() {
  const [age, setAge] = useState("20대");
  const [template, setTemplate] = useState("올리브영");

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/80" />
            <h1 className="text-xl font-semibold">서비스명</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">사용자 이름</span>
            <div className="h-9 w-9 rounded-full bg-accent" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* 1. 제품 유형 선택 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">1. 제품 유형 선택</h2>
            <button className="w-full flex items-center justify-between rounded-xl border-2 border-primary bg-secondary/60 px-4 py-3 text-sm font-medium hover:bg-secondary transition">
              제품유형 선택 (드롭다운)
              <ChevronDown className="h-4 w-4 text-primary" />
            </button>
            <p className="mt-2 text-xs text-muted-foreground">드롭다운 종류: 세럼, 토너, 크림 등</p>
          </section>

          {/* 2. 타깃 연령층 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">2. 타깃 연령층 설정</h2>
            <div className="grid grid-cols-4 gap-3">
              {AGES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-end p-3 text-xs font-medium transition ${
                    age === a
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-muted hover:bg-secondary"
                  }`}
                >
                  <span className="self-end h-2 w-2 rounded-full bg-primary/60 -mt-0 ml-auto mb-auto" />
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* 3. 템플릿 설정 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">3. 템플릿 설정</h2>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`h-32 rounded-xl border flex flex-col items-center justify-end p-3 text-sm font-medium transition ${
                    template === t
                      ? "border-primary bg-primary/15"
                      : "border-border bg-muted hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* 5. 업로드 */}
          <section className="md:row-span-2">
            <h2 className="text-sm font-semibold mb-3">5. 전성분 PDF/EXCEL 업로드</h2>
            <label className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-primary/60 bg-primary/5 hover:bg-primary/10 transition cursor-pointer">
              <Upload className="h-8 w-8 text-primary mb-3" />
              <p className="text-sm text-muted-foreground text-center px-4">
                파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요
              </p>
              <input type="file" className="hidden" accept=".pdf,.xlsx,.xls" />
            </label>
          </section>

          {/* 4. 강조 요소 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">4. 강조 요소 입력</h2>
            <input
              type="text"
              placeholder="예: 저자극, 비건, 무향"
              className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-card transition"
            />
          </section>
        </div>

        <div className="flex justify-end mt-10">
          <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm">
            콘텐츠 생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
