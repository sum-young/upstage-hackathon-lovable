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
import { Input } from "@/components/ui/input";
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

const PRODUCT_CATEGORIES = ["세럼", "토너", "크림", "기타"];
const AGES = ["10대 후반", "20대", "30대", "40대"];
const SKIN_TYPES = ["건성", "지성", "민감성"];
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
  const [productCategory, setProductCategory] = useState<string>("");
  const [productCategoryOther, setProductCategoryOther] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("30대");
  const [skinType, setSkinType] = useState<string>("건성");
  const [designType, setDesignType] = useState<string>("올리브영");
  const [highlight, setHighlight] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const resolvedCategory =
      productCategory === "기타" ? productCategoryOther.trim() : productCategory;
    const state = {
      product_category: resolvedCategory || undefined,
      skin_type: skinType,
      age_group: ageGroup,
      design_type: designType,
      highlight: highlight.trim() || undefined,
      file: file ? { name: file.name, size: file.size, type: file.type } : null,
    };
    console.log("현재 상태:", state);
  }, [productCategory, productCategoryOther, skinType, ageGroup, designType, highlight, file]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!isValidFile(f)) {
      toast.error("PDF 또는 Excel 파일만 업로드 가능합니다.");
      return;
    }
    setFile(f);
  };

  const handleSubmit = () => {
    const resolvedCategory =
      productCategory === "기타" ? productCategoryOther.trim() : productCategory;

    if (!resolvedCategory) {
      toast.error("제품 유형을 선택해주세요.");
      return;
    }
    if (!file) {
      toast.error("전성분 PDF 또는 Excel 파일을 업로드해주세요.");
      return;
    }

    const payload = {
      product_category: resolvedCategory,
      skin_type: skinType,
      age_group: ageGroup,
      design_type: designType,
      highlight: highlight.trim() || undefined,
    };

    // TODO: n8n webhook 연동 (file은 multipart 로 함께 전송)
    console.log("submit payload", payload, "file:", file);
    toast.success("콘텐츠 생성 요청을 보냈습니다.");
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
            <Select value={productCategory} onValueChange={setProductCategory}>
              <SelectTrigger className="w-full border-2 border-primary bg-secondary/60 px-4 py-6 text-sm font-medium rounded-xl">
                <SelectValue placeholder="제품유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productCategory === "기타" && (
              <Input
                value={productCategoryOther}
                onChange={(e) => setProductCategoryOther(e.target.value)}
                placeholder="제품 유형을 직접 입력해주세요"
                className="mt-3 rounded-xl border-border bg-muted px-4 py-3 text-sm h-auto focus-visible:border-primary focus-visible:bg-card"
              />
            )}
          </section>

          {/* 2. 타깃 연령층 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">2. 타깃 연령층 설정</h2>
            <div role="radiogroup" className="grid grid-cols-4 gap-3">
              {AGES.map((a) => {
                const active = ageGroup === a;
                return (
                  <button
                    key={a}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAgeGroup(a)}
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

          {/* 3. 피부 타입 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">3. 피부 타입</h2>
            <div role="radiogroup" className="grid grid-cols-3 gap-3">
              {SKIN_TYPES.map((s) => {
                const active = skinType === s;
                return (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSkinType(s)}
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
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. 템플릿 설정 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">4. 템플릿 설정</h2>
            <div role="radiogroup" className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => {
                const active = designType === t;
                return (
                  <button
                    key={t}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDesignType(t)}
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

          {/* 5. 업로드 */}
          <section className="md:row-span-2">
            <h2 className="text-sm font-semibold mb-3">5. 전성분 PDF/EXCEL 업로드</h2>
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

          {/* 6. 강조 요소 */}
          <section>
            <h2 className="text-sm font-semibold mb-3">6. 강조 요소 입력</h2>
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="예: 저자극, 비건, 무향"
              className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-card transition"
            />
          </section>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
          >
            콘텐츠 생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
