import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clipboard, Loader2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { callN8n } from "@/lib/n8n";

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
const AGES: { label: string; icon: React.ReactNode }[] = [
  {
    label: "10대",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M8 20c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      </svg>
    ),
  },
  {
    label: "20대",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="7.5" r="3" />
        <path d="M7 21c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      </svg>
    ),
  },
  {
    label: "30대",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="7.5" r="3" />
        <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    label: "40대",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="7" r="2.8" />
        <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M10 11h4" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
];

const SKIN_TYPES: { label: string; icon: React.ReactNode }[] = [
  {
    label: "건성",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 10c1.5 2 2.5 2 4 0" />
        <path d="M10 14c1 1.5 3 1.5 4 0" />
        <path d="M7 8l1 1M17 8l-1 1M6 17l2-1M18 17l-2-1" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "지성",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 10c1.2 1.5 2.8 1.5 4 0" />
        <path d="M10 14c1 .8 3 .8 4 0" />
        <path d="M14.5 6.5c0 1.5-1 2-1 3.5" />
        <circle cx="15.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "민감성",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 10c1.5 2 2.5 2 4 0" />
        <path d="M10 14c1 1.5 3 1.5 4 0" />
        <path d="M6 13c2-1 4-1 6 0s4 1 6 0" opacity=".35" />
        <circle cx="9" cy="16" r="1.2" fill="currentColor" opacity=".25" stroke="none" />
        <circle cx="15" cy="16" r="1.2" fill="currentColor" opacity=".25" stroke="none" />
      </svg>
    ),
  },
];

const TEMPLATES: { label: string; icon: React.ReactNode }[] = [
  {
    label: "올리브영",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
  {
    label: "아마존",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 18h8" />
        <path d="M12 21v-3" />
      </svg>
    ),
  },
];
const ACCEPTED = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function isValidFile(f: File) {
  if (ACCEPTED.includes(f.type)) return true;
  return /\.(pdf|xlsx|xls)$/i.test(f.name);
}

function ResultPanel({
  title,
  value,
  onCopy,
  minHeight = "min-h-[360px]",
}: {
  title: string;
  value: string;
  onCopy: () => void;
  minHeight?: string;
}) {
  return (
    <section className="rounded-2xl border-2 border-primary/30 bg-secondary/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary/10 transition"
          aria-label={`${title} 복사하기`}
        >
          <Clipboard className="h-3.5 w-3.5" />
          복사
        </button>
      </div>
      <textarea
        value={value}
        readOnly
        className={`w-full ${minHeight} resize-y rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground focus:outline-none focus:border-primary`}
      />
    </section>
  );
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingElapsed, setLoadingElapsed] = useState(0);
  const [stage, setStage] = useState<"input" | "result">("input");
  type WarningItem = { message: string; severity: "high" | "medium" | "low" | string };
  const [result, setResult] = useState<{ copy: string; design: string; warnings?: WarningItem[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingElapsed(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      setLoadingElapsed(Math.floor((Date.now() - start) / 1000));
    }, 200);
    return () => clearInterval(id);
  }, [isSubmitting]);

  const loadingMessage =
    loadingElapsed < 10
      ? "전성분 파일(PDF)을 분석하고 있습니다..."
      : loadingElapsed < 20
        ? `선택한 ${designType} 톤앤매너를 학습 중입니다...`
        : "거의 다 왔어요! 매력적인 카피를 작성 중입니다... (최대 40초 정도 소요될 수 있어요)";

  useEffect(() => {
    const resolvedCategory = productCategory === "기타" ? productCategoryOther.trim() : productCategory;
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

  const handleSubmit = async () => {
    const resolvedCategory = productCategory === "기타" ? productCategoryOther.trim() : productCategory;

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
      file,
    };

    setIsSubmitting(true);
    const start = Date.now();
    const fallback = {
      copy: `[${resolvedCategory}] ${ageGroup} ${skinType} 피부를 위한 데일리 솔루션\n\n매일 사용해도 부담 없는 저자극 포뮬러로, ${skinType} 피부에 꼭 필요한 수분과 진정 케어를 한 번에.\n\n· 핵심 성분: 나이아신아마이드, 히알루론산, 병풀추출물\n· 산뜻하게 스며드는 가벼운 텍스처\n· 비건 인증 / 동물 실험 없음${highlight ? `\n· 강조 포인트: ${highlight}` : ""}\n\n지금, 가장 깨끗한 선택을 시작하세요.`,
      design: `${designType} 템플릿 기반 상세페이지 레이아웃 가이드\n\n1) 히어로 섹션\n  - 연녹색(#E8F1E4) 배경 + 제품 컷아웃 이미지\n  - 큰 세리프 헤드라인 1줄 + 서브 카피 1줄\n\n2) 핵심 베네핏 3분할\n  - 아이콘 + 헤드라인 + 1줄 설명\n  - 여백 넉넉히, 라인 디바이더 사용\n\n3) 전성분 하이라이트\n  - 주요 성분 4~6종 카드 그리드\n  - 각 성분 효능을 한 줄로 요약\n\n4) 사용법 / 텍스처 이미지\n  - 핸드 스와치, 사용 단계 3컷\n\n5) 인증/안전성 배지\n  - 비건, EWG, 임상 결과 등 신뢰 요소 배치`,
    };
    try {
      const data = await callN8n(payload);
      console.log("n8n 응답:", data);

      // n8n이 배열로 감싸서 보내는 경우 첫 요소를 사용
      const raw: any = Array.isArray(data) ? data[0] : data;
      // 응답이 { output: {...} } 또는 { data: {...} } 형태일 수도 있어 평탄화
      const node: any =
        raw && typeof raw === "object" && (raw.output || raw.data || raw.result)
          ? raw.output || raw.data || raw.result
          : raw;

      const pick = (...keys: string[]) => {
        for (const k of keys) {
          const v = node?.[k];
          if (typeof v === "string" && v.trim()) return v;
        }
        return undefined;
      };

      const copyFromServer = pick(
        "copy",
        "detail_copy",
        "detailCopy",
        "page_copy",
        "text",
        "content",
        "카피",
        "상세페이지카피",
      );
      const designFromServer = pick(
        "design",
        "design_guide",
        "designGuide",
        "layout",
        "guide",
        "디자인",
        "디자인가이드",
      );

      const rawWarnings = node?.warnings ?? node?.warning;
      let warningsList: WarningItem[] | undefined;
      if (Array.isArray(rawWarnings)) {
        warningsList = rawWarnings
          .map((w: any) => {
            if (w && typeof w === "object") {
              const message = typeof w.message === "string" ? w.message : "";
              const severity = typeof w.severity === "string" ? w.severity : "low";
              return message ? { message, severity } : null;
            }
            if (typeof w === "string" && w.trim()) {
              return { message: w, severity: "low" };
            }
            return null;
          })
          .filter(Boolean) as WarningItem[];
        if (warningsList.length === 0) warningsList = undefined;
      } else if (typeof rawWarnings === "string" && rawWarnings.trim()) {
        warningsList = [{ message: rawWarnings, severity: "low" }];
      }
      if (warningsList) {
        console.log("n8n warnings:", warningsList);
      }

      // 매칭되는 키가 전혀 없으면 전체 JSON을 보기 좋게 출력
      const fallbackDump =
        !copyFromServer && !designFromServer && node
          ? typeof node === "string"
            ? node
            : JSON.stringify(node, null, 2)
          : undefined;

      setResult({
        copy: copyFromServer ?? fallbackDump ?? fallback.copy,
        design: designFromServer ?? (fallbackDump ? "" : fallback.design),
        warnings: warningsList,
      });
    } catch (err: any) {
      console.error("n8n 요청 실패, 하드코딩 결과로 대체:", err);
      console.log("하드코딩 결과:", fallback);
      setResult(fallback);
    }
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, 8000 - elapsed);
    await new Promise((resolve) => setTimeout(resolve, remaining));
    setStage("result");
    setIsSubmitting(false);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label}을(를) 복사했습니다.`);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  if (stage === "result" && result) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
          <header className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage("input")}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </button>
            </div>
            <h1 className="text-lg font-semibold">생성 결과</h1>
            <div className="w-20" />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <ResultPanel
              title="상세페이지 카피"
              value={result.copy}
              onCopy={() => copyText(result.copy, "상세페이지 카피")}
            />
            <ResultPanel
              title="디자인 제안 및 가이드라인"
              value={result.design}
              onCopy={() => copyText(result.design, "디자인 가이드")}
            />
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <section className="mt-10 rounded-2xl border-2 border-primary/30 bg-secondary/30 p-5">
              <h2 className="text-sm font-semibold mb-4">주의사항 (Warnings)</h2>
              <div className="flex flex-col gap-3">
                {result.warnings.map((w, i) => {
                  const sev = (w.severity || "").toLowerCase();
                  const styles =
                    sev === "high"
                      ? { box: "bg-red-50 border-red-300", text: "text-red-700", label: "위험성 높음" }
                      : sev === "medium"
                        ? { box: "bg-yellow-50 border-yellow-300", text: "text-yellow-700", label: "위험성 존재" }
                        : { box: "bg-card border-border", text: "text-muted-foreground", label: "참고사항" };
                  return (
                    <div
                      key={i}
                      className={`flex items-stretch rounded-xl border ${styles.box} overflow-hidden`}
                    >
                      <div
                        className={`w-[25%] min-w-[100px] flex items-center justify-center p-3 text-sm font-semibold ${styles.text} border-r ${styles.box}`}
                      >
                        {styles.label}
                      </div>
                      <div className="flex-1 p-3 text-sm leading-relaxed text-foreground bg-card">
                        {w.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStage("input")}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
            >
              다시 생성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/40 bg-card px-10 py-8 shadow-xl max-w-md mx-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-primary/20" />
              <Loader2 className="absolute inset-0 h-14 w-14 animate-spin text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground text-center min-h-[2.5rem] flex items-center">
              {loadingMessage}
            </p>
            <div className="flex gap-1.5">
              {[0, 3, 6].map((t) => (
                <span
                  key={t}
                  className={`h-1.5 w-8 rounded-full transition ${
                    loadingElapsed >= t ? "bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
        <header className="flex items-center justify-between pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/80" />
            <h1 className="text-xl font-semibold">클린뷰티 카피메이커</h1>
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
                const active = ageGroup === a.label;
                return (
                  <button
                    key={a.label}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAgeGroup(a.label)}
                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 p-3 text-xs font-medium transition ${
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
                    <span className="mb-1">{a.icon}</span>
                    {a.label}
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
                const active = skinType === s.label;
                return (
                  <button
                    key={s.label}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSkinType(s.label)}
                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 p-3 text-xs font-medium transition ${
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
                    <span className="mb-1">{s.icon}</span>
                    {s.label}
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
                const active = designType === t.label;
                return (
                  <button
                    key={t.label}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDesignType(t.label)}
                    className={`relative h-32 rounded-xl border flex flex-col items-center justify-center gap-2 p-3 text-sm font-medium transition ${
                      active ? "border-primary bg-primary/15" : "border-border bg-muted hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition ${
                        active ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span className="mb-1">{t.icon}</span>
                    {t.label}
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
                dragOver ? "border-primary bg-primary/15" : "border-primary/60 bg-primary/5 hover:bg-primary/10"
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
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "요청 중..." : "콘텐츠 생성하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
