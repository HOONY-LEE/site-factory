import { FooterContent } from "@/types/content";

/* ── Apple 스타일 멀티컬럼 푸터 ── */
export default function ProductFooter({
  companyName,
  links,
  contact,
  copyright,
}: FooterContent) {
  return (
    <footer className="bg-[#f5f5f7]">
      {/* 법적 고지 상단 영역 */}
      <div className="mx-auto max-w-[980px] border-b border-[#d2d2d7] px-4 py-4 sm:px-6">
        <div className="text-[11px] leading-relaxed text-[#6e6e73]">
          <p>
            * 표시된 가격은 부가세가 포함된 가격이며, 제품 사양은 예고 없이 변경될 수 있습니다.
          </p>
        </div>
      </div>

      {/* 브레드크럼 */}
      <div className="mx-auto max-w-[980px] px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
          <span className="font-semibold" data-field="footer.companyName">{companyName}</span>
          <span>{">"}</span>
          <span>제품</span>
        </div>
      </div>

      {/* 링크 그리드 */}
      <div className="mx-auto max-w-[980px] px-4 pb-4 pt-6 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-[#d2d2d7] pb-6 sm:grid-cols-3 lg:grid-cols-5">
          {links.map((group, i) => (
            <div key={i}>
              <h4 className="mb-2 text-xs font-semibold text-[#1d1d1f]">
                {group.title}
              </h4>
              <ul className="space-y-1.5">
                {group.items.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-xs text-[#424245] transition-colors hover:text-[#1d1d1f] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contact && (
            <div>
              <h4 className="mb-2 text-xs font-semibold text-[#1d1d1f]">
                연락처
              </h4>
              <ul className="space-y-1.5 text-xs text-[#424245]">
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone}`} className="text-[#2997ff] hover:underline">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && <li>{contact.email}</li>}
                {contact.address && <li>{contact.address}</li>}
              </ul>
            </div>
          )}
        </div>

        {/* 하단 법적 정보 */}
        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#6e6e73]" data-field="footer.copyright">{copyright}</p>
          <div className="flex flex-wrap gap-3 text-[11px] text-[#424245]">
            <a href="#" className="hover:text-[#1d1d1f] hover:underline">개인정보 처리방침</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:text-[#1d1d1f] hover:underline">웹 사이트 이용 약관</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:text-[#1d1d1f] hover:underline">법적 고지</a>
            <span className="text-[#d2d2d7]">|</span>
            <a href="#" className="hover:text-[#1d1d1f] hover:underline">사이트 맵</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
