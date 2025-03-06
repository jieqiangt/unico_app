import MainLayout from "@/components/main/mainLayout";

export const metadata = {
  title: "UnicoFoods ERP",
  description: "UnicoFoods Internal Platform",
};

export default async function NormalUsersLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
