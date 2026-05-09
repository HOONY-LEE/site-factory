import { FooterContent } from "@/types/content";

/* Simple white footer matching Banksalad style */
export default function BrandFooter({ companyName, links, contact, copyright }: FooterContent) {
  return (
    <footer className="border-t border-gray-200 bg-white py-14">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {links.map((group, gi) => (
            <div key={gi}>
              <h3
                className="mb-4 text-[14px] font-bold text-[#272a30]"
                data-field={gi === 0 ? "footer.companyName" : undefined}
              >
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.href}
                      className="text-[14px] text-[#9fa5b0] transition-colors hover:text-[#272a30]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Company info column */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-[#272a30]">
              {companyName}
            </h3>
            <ul className="space-y-2.5">
              {contact?.email && (
                <li className="text-[14px] text-[#9fa5b0]">{contact.email}</li>
              )}
              {contact?.phone && (
                <li className="text-[14px] text-[#9fa5b0]">{contact.phone}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-12 space-y-1">
          <p className="text-[13px] text-[#9fa5b0]" data-field="footer.copyright">
            {copyright}
          </p>
          {contact?.address && (
            <p className="text-[13px] text-[#9fa5b0]" data-field="footer.description">
              {contact.address}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
