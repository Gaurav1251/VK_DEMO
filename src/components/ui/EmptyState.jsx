export default function EmptyState({ icon: Icon, title, text, action, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'px-4 py-10' : 'px-6 py-16'}`}>
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-base font-bold">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
