interface QuickAnswerProps {
  children: React.ReactNode;
  title?: string;
}

export function QuickAnswer({ children, title = 'Quick Answer' }: QuickAnswerProps) {
  return (
    <div className="bg-primary-50 border-l-4 border-primary-500 rounded-r-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-primary-900 mb-2">{title}</h2>
      <div className="text-primary-800">{children}</div>
    </div>
  );
}