import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import "../account-nav.css";

export type AccountSectionNavItem = {
  id: string;
  label: string;
  icon?: ReactNode;
};

type AccountSectionNavProps = {
  items: AccountSectionNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footer?: ReactNode;
  label: string;
};

export function AccountSectionNav({
  items,
  activeId,
  onSelect,
  footer,
  label,
}: AccountSectionNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const activeItem = items.find((item) => item.id === activeId) || items[0];

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav className="accountSectionNav" aria-label={label}>
      <button
        type="button"
        ref={toggleRef}
        className="accountSectionNavToggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        {activeItem?.icon}
        <span className="accountSectionNavToggleLabel">
          {activeItem?.label}
        </span>
        <ChevronDown className="accountSectionNavChevron" aria-hidden="true" />
      </button>
      <div className="accountSectionNavList" id={listId} data-open={open}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              item.id === activeId
                ? "accountSectionNavItem active"
                : "accountSectionNavItem"
            }
            aria-current={item.id === activeId ? "true" : undefined}
            onClick={() => {
              onSelect(item.id);
              setOpen(false);
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      {footer ? <div className="accountSectionNavFooter">{footer}</div> : null}
    </nav>
  );
}
