export default function KeystaticLayout({ children }: LayoutProps<"/keystatic">) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
