import { Container, Header } from "../shared/components";
import { TabView, TabPanel } from "primereact/tabview";
import { FormularioRecepcion } from "./components/FormularioRecepcion";


export const Recepcion = () => {
  return (
    <Container>
      <Header />
      <TabView>
        <TabPanel header="Recepción">
          <FormularioRecepcion />
        </TabPanel>
      </TabView>
    </Container>
  );
};
