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

        <Accordion activeIndex={0}>
          <AccordionTab header="HORARIO 1">
            <DataTable value={items} className="p-datatable-striped">
              <Column
                field="RUTA"
                header="RUTA"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="name"
                header="HORARIO 1"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="category"
                header="HORARIO 2"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="quantity"
                header="HORARIO 3"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
            </DataTable>
          </AccordionTab>
          <AccordionTab header="HORARIO 2">
            <DataTable value={items} className="p-datatable-striped">
              <Column
                field="RUTA"
                header="RUTA"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="name"
                header="HORARIO 1"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="category"
                header="HORARIO 2"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="quantity"
                header="HORARIO 3"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
            </DataTable>
          </AccordionTab>
          <AccordionTab header="HORARIO 3">
            <DataTable value={items} className="p-datatable-striped">
              <Column
                field="RUTA"
                header="RUTA"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="name"
                header="HORARIO 1"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="category"
                header="HORARIO 2"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
              <Column
                field="quantity"
                header="HORARIO 3"
                style={{ width: "25%" }}
                body={<Skeleton />}
              />
            </DataTable>
          </AccordionTab>
        </Accordion>
      </Container>
    </>
  );
};
