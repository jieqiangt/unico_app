import "../globals.scss";

export const metadata = {
  title: "UnicoFoods ERP",
  description: "UnicoFoods Internal Platform",
};

export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
