import { Container, Header } from "../shared/components";
import { TabView, TabPanel } from "primereact/tabview";
import { Formulario } from "./components/Formulario";

import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";

const items = Array.from({ length: 5 });
export const Index = () => {
  return (
    <>
      <Container>
        <Header />
        <TabView>
          <TabPanel header="Filtro de reportes PDF">
            <Formulario />
          </TabPanel>
        </TabView>
      </Container>
    </>
  );
};
