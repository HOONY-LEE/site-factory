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
├── app/
│   ├── page.tsx                    # 팩토리 대시보드
│   ├── editor/[templateId]/        # 콘텐츠 에디터 (폼 + 라이브 프리뷰)
│   ├── preview/                    # 프리뷰 렌더러 (iframe용, postMessage 수신)
│   └── s/[slug]/                   # 게시된 사이트 뷰
├── components/
│   ├── sections/                   # 재사용 섹션 (Hero, Features, CTA 등)
│   └── ui/                         # 기본 UI 컴포넌트 (Button, Container)
├── content/                        # 기본 콘텐츠 JSON
│   ├── example-corp.json           # 기업 홈페이지 예시
│   └── startup-default.json        # 스타트업 랜딩 예시
├── lib/
│   ├── templates.ts                # 템플릿 레지스트리
│   └── sites.ts                    # 사이트 CRUD (localStorage)
├── templates/
│   ├── corporate.tsx               # 기업 홈페이지 템플릿
│   └── startup.tsx                 # 스타트업 랜딩 템플릿
└── types/
    └── content.ts                  # 콘텐츠 타입 정의
```

---

## 핵심 개념

### 사이트 팩토리 플로우
1. 대시보드(`/`)에서 템플릿 선택
2. 에디터(`/editor/[templateId]`)에서 콘텐츠 입력 + 실시간 프리뷰
3. 저장 → 사이트 목록에 추가
4. 게시된 사이트(`/s/[slug]`)로 접근 가능

### 데이터 저장
- 사이트 콘텐츠는 브라우저 `localStorage`에 저장 (MVP)
- 각 사이트: id, name, slug, templateId, content(SiteContent), 생성/수정일

### 프리뷰 통신
- 에디터 → iframe(`/preview`)으로 `postMessage`를 통해 콘텐츠 전달
- 콘텐츠 변경 시 실시간 렌더링 갱신

---

## 작업 현황

| # | 작업 | 상태 |
|---|------|------|
| 1 | 프로젝트 초기 셋업 (Next.js + Tailwind + GitHub) | ✅ 완료 |
| 2 | 콘텐츠 타입 정의 (TypeScript) | ✅ 완료 |
| 3 | UI 기본 컴포넌트 (Button, Container) | ✅ 완료 |
| 4 | 섹션 컴포넌트 (Hero, Features, About, Services, CTA, Footer) | ✅ 완료 |
| 5 | 회사 홈페이지 템플릿 (Corporate) | ✅ 완료 |
| 6 | 스타트업 랜딩 템플릿 (Startup) | ✅ 완료 |
| 7 | 예시 콘텐츠 JSON 작성 | ✅ 완료 |
| 8 | 팩토리 대시보드 (템플릿 갤러리 + 내 사이트 목록) | ✅ 완료 |
| 9 | 콘텐츠 에디터 + 라이브 프리뷰 (split view) | ✅ 완료 |
| 10 | 사이트 저장/관리 (CRUD) | ✅ 완료 |
| 11 | 반응형 + 다크모드 | ⬜ 대기 |
| 12 | 추가 템플릿 (포트폴리오, 쇼핑몰 등) | ⬜ 대기 |
| 13 | 데이터베이스 연동 (localStorage → DB) | ⬜ 대기 |
| 14 | 정적 사이트 내보내기 (HTML/CSS 다운로드) | ⬜ 대기 |

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
