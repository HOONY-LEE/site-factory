# Site Factory — 웹사이트 빌더

## 프로젝트 개요
콘텐츠(JSON)만 넣으면 웹사이트를 찍어내는 빌더.
아임웹/Wix 같은 SaaS가 아니라, **템플릿 + 콘텐츠 = 정적 사이트** 구조.

GitHub: https://github.com/HOONY-LEE/site-factory

---

## 기술 스택

| 영역 | 스택 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 스타일 | Tailwind CSS 4 |
| 언어 | TypeScript |
| 패키지 매니저 | pnpm |

---

## 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── sections/           # 재사용 섹션 (Hero, Features, CTA 등)
│   └── ui/                 # 기본 UI 컴포넌트 (Button 등)
├── content/                # 사이트별 콘텐츠 JSON
│   └── example-corp.json   # 예시: 회사 홈페이지 콘텐츠
├── templates/              # 템플릿 레이아웃 정의
│   └── corporate.tsx       # 회사 홈페이지 템플릿
└── types/                  # 콘텐츠 타입 정의
    └── content.ts
```

---

## 핵심 개념

### 콘텐츠 JSON → 웹사이트
1. `src/content/` 에 JSON 파일 작성 (회사명, 슬로건, 서비스 목록 등)
2. 템플릿이 JSON을 읽어서 페이지 렌더링
3. 새 사이트 = 새 JSON 파일 하나

### 템플릿
- 각 템플릿은 섹션 조합으로 구성
- 섹션: Hero, Features, About, Services, Testimonials, CTA, Footer 등

---

## 작업 현황

| # | 작업 | 상태 |
|---|------|------|
| 1 | 프로젝트 초기 셋업 (Next.js + Tailwind + GitHub) | ✅ 완료 |
| 2 | 콘텐츠 타입 정의 (TypeScript) | 🔄 진행중 |
| 3 | UI 기본 컴포넌트 (Button, Container) | 🔄 진행중 |
| 4 | 섹션 컴포넌트 (Hero, Features, About, Services, CTA, Footer) | ⬜ 대기 |
| 5 | 회사 홈페이지 템플릿 (Corporate) | ⬜ 대기 |
| 6 | 예시 콘텐츠 JSON 작성 | ⬜ 대기 |
| 7 | 메인 페이지에서 템플릿 렌더링 | ⬜ 대기 |
| 8 | 반응형 + 다크모드 | ⬜ 대기 |
| 9 | 추가 템플릿 (포트폴리오, 랜딩페이지 등) | ⬜ 대기 |
| 10 | 관리자 UI (콘텐츠 편집기) | ⬜ 대기 |

---

## 개발 명령어

```bash
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
```

---

## 새 사이트 만드는 법

1. `src/content/my-company.json` 작성 (example-corp.json 복사해서 수정)
2. 필요시 `src/app/my-company/page.tsx` 라우트 추가
3. `pnpm build` → 배포
