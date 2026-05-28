import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
const ACCEPTED = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function isValidFile(f: File) {
  if (ACCEPTED.includes(f.type)) return true;
  return /\.(pdf|xlsx|xls)$/i.test(f.name);
}

function Index() {
  const [productType, setProductType] = useState<string>("");
  const [age, setAge] = useState<string>("20대");
  const [template, setTemplate] = useState<string>("올리브영");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!isValidFile(f)) {
      toast.error("PDF 또는 Excel 파일만 업로드 가능합니다.");
      return;
    }
    setFile(f);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
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
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger className="w-full border-2 border-primary bg-secondary/60 px-4 py-6 text-sm font-medium rounded-xl">
                <SelectValue placeholder="제품유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="세럼">세럼</SelectItem>
                <SelectItem value="토너">토너</SelectItem>
                <SelectItem value="크림">크림</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* 2. 타깃 연령층 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">2. 타깃 연령층 설정</h2>
            <div role="radiogroup" className="grid grid-cols-4 gap-3">
              {AGES.map((a) => {
                const active = age === a;
                return (
                  <button
                    key={a}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAge(a)}
                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-end p-3 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-muted hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition ${
                        active ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    {a}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 템플릿 설정 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">3. 템플릿 설정</h2>
            <div role="radiogroup" className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => {
                const active = template === t;
                return (
                  <button
                    key={t}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTemplate(t)}
                    className={`relative h-32 rounded-xl border flex flex-col items-center justify-end p-3 text-sm font-medium transition ${
                      active
                        ? "border-primary bg-primary/15"
                        : "border-border bg-muted hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition ${
                        active ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    {t}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. 업로드 */}
          <section className="md:row-span-2">
            <h2 className="text-sm font-semibold mb-3">4. 전성분 PDF/EXCEL 업로드</h2>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              className={`flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed transition cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/15"
                  : "border-primary/60 bg-primary/5 hover:bg-primary/10"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2">
                    <span className="text-sm font-medium break-all">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="파일 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">다른 파일로 교체하려면 클릭하세요</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground text-center px-4">
                    파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">PDF, Excel만 가능</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.xlsx,.xls,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </section>

          {/* 5. 강조 요소 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">5. 강조 요소 입력</h2>
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
