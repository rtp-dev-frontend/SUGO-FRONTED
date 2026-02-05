import { Container, Header } from "../shared/components";
import { TabView, TabPanel } from "primereact/tabview";
import { FormularioDespacho } from "./components/FormularioDespacho";

export const Despacho = () => {
  return (
    <Container>
      <Header />
      <TabView>
        <TabPanel header="Despacho">
          <FormularioDespacho />
        </TabPanel>
      </TabView>
    </Container>
  );
};
