# Site Factory — 웹사이트 빌더

## 프로젝트 개요
콘텐츠(JSON)만 넣으면 웹사이트를 찍어내는 빌더.
아임웹/Wix 같은 SaaS가 아니라, **템플릿 + 콘텐츠 = 정적 사이트** 구조.

- **GitHub**: https://github.com/HOONY-LEE/site-factory
- **프로덕션**: https://websitetemplate-beta.vercel.app
- **Vercel 프로젝트명**: `websitetemplate` (Blob Store 연동됨)

---

## 기술 스택

| 영역 | 스택 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 스타일 | Tailwind CSS 4 |
| 언어 | TypeScript |
| 패키지 매니저 | pnpm |
| 배포 스토리지 | Vercel Blob Storage (프로덕션) / 파일시스템 `data/sites/` (로컬) |
| ZIP 생성 | JSZip |
| 클라이언트 저장 | localStorage (에디터 상태) |

---

## 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx                        # 팩토리 대시보드 (템플릿 갤러리 + 프로젝트 목록)
│   ├── layout.tsx                      # 루트 레이아웃
│   ├── globals.css                     # 글로벌 스타일 (Tailwind)
│   ├── editor/[templateId]/page.tsx    # 콘텐츠 에디터 (폼 + 라이브 프리뷰 split view)
│   ├── preview/
│   │   ├── page.tsx                    # 프리뷰 렌더러 (iframe용, postMessage 수신)
│   │   └── [templateId]/page.tsx       # 템플릿별 정적 프리뷰
│   ├── s/[slug]/
│   │   ├── page.tsx                    # 배포된 사이트 뷰 (서버 컴포넌트)
│   │   └── not-found.tsx              # 사이트 404 페이지
│   └── api/sites/
│       ├── deploy/route.ts            # POST: 사이트 배포 (Blob/FS 저장)
│       ├── undeploy/route.ts          # POST: 배포 해제
│       ├── status/route.ts            # GET: 배포 상태 조회
│       └── export/route.ts            # POST: ZIP 내보내기
├── components/
│   ├── ui/                            # 기본 UI (Button, Container, Carousel)
│   └── sections/                      # 재사용 섹션 컴포넌트
│       ├── Header.tsx, Hero.tsx, About.tsx, Services.tsx,
│       │   Features.tsx, Testimonials.tsx, Cta.tsx, Footer.tsx     # Corporate/Startup 공용
│       ├── StartupHero.tsx                                         # Startup 전용
│       ├── Brand*.tsx (8개)                                        # Brand 전용 (뱅크샐러드 스타일)
│       └── Product*.tsx (8개)                                      # Product 전용
├── templates/
│   ├── corporate.tsx                  # 기업 홈페이지 템플릿
│   ├── startup.tsx                    # 스타트업 랜딩 템플릿
│   ├── brand.tsx                      # 브랜드 소개 템플릿 (뱅크샐러드 참고)
│   └── product.tsx                    # 제품 소개 템플릿
├── lib/
│   ├── templates.ts                   # 템플릿 레지스트리 (4개 템플릿 메타데이터)
│   ├── sites.ts                       # 클라이언트 사이트 CRUD (localStorage)
│   ├── sites-server.ts                # 서버 사이트 CRUD (Blob or FS 자동 선택)
│   └── html-export.ts                 # 정적 HTML 문자열 생성기 (ZIP 내보내기용)
├── types/
│   └── content.ts                     # SiteContent 타입 정의
└── content/                           # 기본 콘텐츠 JSON (각 템플릿별 예시 데이터)
    ├── example-corp.json
    ├── startup-default.json
    ├── brand-default.json
    └── product-default.json
```

---

## 핵심 개념

### 사이트 팩토리 플로우
1. 대시보드(`/`)에서 템플릿 선택 → 프로젝트 이름 입력 모달
2. 에디터(`/editor/[templateId]?name=...`)에서 콘텐츠 입력 + 실시간 프리뷰
3. 저장 → localStorage에 사이트 목록 추가
4. 배포 → 서버 API로 Vercel Blob에 저장 → `/s/[slug]`로 접근 가능
5. ZIP 내보내기 → 정적 HTML + Tailwind CDN 포함한 독립 사이트 다운로드

### 데이터 저장 (이중 구조)
- **클라이언트 (에디터)**: `localStorage` — 사이트 편집 상태, 프로젝트 목록 관리
- **서버 (배포)**: Vercel Blob Storage(프로덕션) 또는 `data/sites/*.json`(로컬)
- 자동 선택: `const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;`

### 프리뷰 통신
- 에디터 → iframe(`/preview`)으로 `postMessage`를 통해 콘텐츠 전달
- `data-section`, `data-field` 속성으로 에디터↔프리뷰 양방향 연동
- 프리뷰 클릭 → 해당 에디터 필드 포커스 / 에디터 포커스 → 프리뷰 하이라이트

### 배포 시스템
- **배포**: `POST /api/sites/deploy` → `sites-server.ts`의 `deploySite()` 호출
- **배포 해제**: `POST /api/sites/undeploy` → `undeploySite()` 호출
- **상태 조회**: `GET /api/sites/status` → 모든 배포 사이트 slug 맵 반환
- **사이트 뷰**: `/s/[slug]` → 서버 컴포넌트, `getDeployedSite(slug)`로 데이터 로드 후 렌더링

### ZIP 내보내기
- `html-export.ts`의 `generateStaticHtml()` — React SSR 대신 HTML 문자열 템플릿 사용
  (Next.js API route에서 `react-dom/server` import 불가하여 우회)
- JSZip으로 `index.html` + `content.json` 패키징
- Tailwind CDN 포함한 독립 사이트

### 주요 타입
```typescript
// lib/sites.ts
interface SavedSite {
  id: string; name: string; slug: string; templateId: string;
  content: SiteContent; createdAt: string; updatedAt: string;
  deployed?: boolean; deployedAt?: string; deployedUrl?: string; customDomain?: string;
}

// lib/sites-server.ts
interface DeployedSite {
  slug: string; name: string; templateId: string;
  content: SiteContent; deployedAt: string; customDomain?: string;
}
```

### 슬러그 생성 규칙
- `toSlug()`: ASCII 영문+숫자만 허용 (`[a-z0-9]`), 한글 제거
- 빈 결과 시 `"site-" + Date.now().toString(36)` 폴백

---

## 작업 현황

| # | 작업 | 상태 |
|---|------|------|
| 1 | 프로젝트 초기 셋업 (Next.js + Tailwind + GitHub) | ✅ 완료 |
| 2 | 콘텐츠 타입 정의 (TypeScript) | ✅ 완료 |
| 3 | UI 기본 컴포넌트 (Button, Container, Carousel) | ✅ 완료 |
| 4 | 섹션 컴포넌트 (Hero, Features, About, Services, CTA, Footer) | ✅ 완료 |
| 5 | 기업 홈페이지 템플릿 (Corporate) | ✅ 완료 |
| 6 | 스타트업 랜딩 템플릿 (Startup) | ✅ 완료 |
| 7 | 브랜드 소개 템플릿 (Brand) — 뱅크샐러드 스타일 | ✅ 완료 |
| 8 | 제품 소개 템플릿 (Product) | ✅ 완료 |
| 9 | 예시 콘텐츠 JSON (4개 템플릿) | ✅ 완료 |
| 10 | 팩토리 대시보드 (템플릿 갤러리 + 프로젝트 관리) | ✅ 완료 |
| 11 | 콘텐츠 에디터 + 라이브 프리뷰 (split view) | ✅ 완료 |
| 12 | 에디터↔프리뷰 양방향 필드 연동 (data-section/data-field) | ✅ 완료 |
| 13 | 사이트 저장/관리 (CRUD, localStorage) | ✅ 완료 |
| 14 | 서버 배포 시스템 (API + Vercel Blob Storage) | ✅ 완료 |
| 15 | 커스텀 도메인 입력 UI + DNS CNAME 안내 | ✅ 완료 |
| 16 | ZIP 코드 내보내기 (정적 HTML + Tailwind CDN) | ✅ 완료 |
| 17 | 프로젝트 이름 ↔ 사이트 제목 분리 | ✅ 완료 |
| 18 | 프로젝트 생성 시 이름 입력 모달 | ✅ 완료 |
| 19 | Vercel 프로덕션 배포 (Blob Store 연동) | ✅ 완료 |

---

## 앞으로 해야 할 일 (TODO)

### 🔴 높은 우선순위

| # | 작업 | 설명 |
|---|------|------|
| T1 | **반응형 디자인** | 에디터, 대시보드의 모바일 최적화. 현재 데스크탑 위주. 템플릿 자체는 일부 반응형 적용됨 |
| T2 | **다크모드 지원** | Tailwind의 `dark:` 유틸리티 활용. 대시보드 + 에디터 + 각 템플릿 |
| T3 | **데이터베이스 연동** | localStorage → Supabase/PlanetScale 등으로 전환. 현재 편집 데이터는 브라우저에만 존재하므로 기기간 동기화 불가 |
| T4 | **사용자 인증** | 로그인/회원가입. 프로젝트를 사용자 계정에 연결. 현재 누구나 배포 가능 |

### 🟡 중간 우선순위

| # | 작업 | 설명 |
|---|------|------|
| T5 | **추가 템플릿** | 포트폴리오, 이력서, 쇼핑몰, 블로그 등. 새 템플릿 추가 시 `templates/` + `components/sections/` + `content/` + `lib/templates.ts` 레지스트리 등록 + `html-export.ts`에 HTML 생성기 추가 필요 |
| T6 | **이미지 업로드 to 클라우드** | 현재 이미지는 base64 DataURL로 localStorage에 저장. Vercel Blob이나 S3로 이미지 호스팅 전환 필요 |
| T7 | **에디터 UX 개선** | 드래그앤드롭 섹션 순서 변경, 섹션 표시/숨기기 토글, 섹션 추가/삭제 |
| T8 | **SEO 메타태그** | 배포 사이트에 OG 태그, 파비콘, 구조화 데이터 등 추가 |
| T9 | **커스텀 도메인 실제 연결** | 현재 UI만 존재. Vercel Domains API 연동하여 실제 도메인 매핑 구현 |
| T10 | **템플릿 프리뷰 썸네일** | 현재 목업(색상 블록) 사용. 실제 스크린샷 또는 미리보기 이미지로 교체 |

### 🟢 낮은 우선순위

| # | 작업 | 설명 |
|---|------|------|
| T11 | **다국어(i18n)** | 템플릿/에디터 다국어 지원 |
| T12 | **버전 관리** | 콘텐츠 변경 히스토리, 롤백 기능 |
| T13 | **협업 기능** | 여러 사용자가 같은 프로젝트 편집 |
| T14 | **애널리틱스** | 배포 사이트 방문자 통계 |
| T15 | **폰트 커스터마이징** | 사용자가 폰트를 선택할 수 있게 |
| T16 | **색상 테마 커스터마이징** | 템플릿 색상 팔레트를 에디터에서 변경 |

---

## 개발 명령어

```bash
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
```

---

## 새 템플릿 추가하는 법

1. `src/content/my-template-default.json` — 기본 콘텐츠 JSON 작성
2. `src/components/sections/MyTemplate*.tsx` — 필요한 섹션 컴포넌트 생성
3. `src/templates/my-template.tsx` — 템플릿 컴포넌트 (섹션 조합)
4. `src/lib/templates.ts` — `templates` 배열에 메타데이터 등록 (id, name, category, preview 등)
5. `src/app/s/[slug]/page.tsx` — `templateComponents`에 import + 등록
6. `src/app/preview/page.tsx` — `templateComponents`에 import + 등록
7. `src/lib/html-export.ts` — ZIP 내보내기용 HTML 생성기 추가 (`generateStaticHtml` 함수의 switch에 분기 추가)

---

## 알려진 이슈 & 주의사항

- **localStorage 한계**: 에디터 데이터가 브라우저에만 저장됨. 시크릿 모드/다른 기기에서 접근 불가
- **이미지 base64**: 큰 이미지를 올리면 localStorage 용량 초과 가능 (5MB 제한 적용 중)
- **Next.js API route에서 react-dom/server 사용 불가**: ZIP 내보내기는 HTML 문자열 템플릿으로 우회
- **한글 slug 불가**: URL에 한글 포함 시 인코딩 문제 발생하여 ASCII만 허용
- **Vercel Blob 토큰**: 프로덕션 배포 시 `BLOB_READ_WRITE_TOKEN` 환경변수 필요 (Vercel 대시보드에서 Blob Store 연결)

---

## 환경 변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Storage 접근 토큰 | 프로덕션만 (없으면 파일시스템 사용) |

---

## 디자인 참고

- **Brand 템플릿**: [뱅크샐러드 About](https://corp.banksalad.com/about/) 참고
  - 디자인 토큰: `#06a96c`(그린), `#272a30`(제목), `#9fa5b0`(본문), Pretendard 폰트
