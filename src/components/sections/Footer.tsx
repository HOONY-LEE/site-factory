import Container from "@/components/ui/Container";
import { FooterContent } from "@/types/content";

export default function Footer({ companyName, description, links, contact, copyright }: FooterContent) {
  return (
    <footer className="border-t border-gray-100 bg-gray-900 py-16 text-gray-300">
      <Container>
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="text-xl font-bold text-white" data-field="footer.companyName">{companyName}</div>
            {description && <p className="mt-4 text-sm" data-field="footer.description">{description}</p>}
            {contact && (
              <div className="mt-6 space-y-2 text-sm">
                {contact.email && <div>{contact.email}</div>}
                {contact.phone && <div>{contact.phone}</div>}
                {contact.address && <div>{contact.address}</div>}
              </div>
            )}
          </div>

          {links.map((group, gi) => (
            <div key={gi}>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm" data-field="footer.copyright">
          {copyright}
        </div>
      </Container>
    </footer>
  );
}
