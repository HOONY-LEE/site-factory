import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="mt-4 text-gray-500">
          사이트를 찾을 수 없습니다
        </p>
        <p className="mt-2 text-sm text-gray-400">
          아직 배포되지 않았거나 삭제된 사이트입니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
