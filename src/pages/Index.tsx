
import { MainLayout } from "@/app/layout/MainLayout";
import { ContentContainer } from "@/components/ui/ContentContainer";
import { Dashboard } from "@/app/dashboard/Dashboard";

const Index = () => {
  return (
    <MainLayout>
      <ContentContainer>
        <Dashboard />
      </ContentContainer>
    </MainLayout>
  );
};

export default Index;
