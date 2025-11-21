import { Container, Header } from "../shared/components";
import { TabView, TabPanel } from "primereact/tabview";
import { Formulario } from "./components/Formulario";
import { BotonesPdf } from "./components/BotonesPdf";
export const Index = () => {
  return (
    <>
      <Container>
        <Header />
        <TabView>
          <TabPanel header="Formulario">
            <Formulario />
          </TabPanel>
        </TabView>

      </Container>
    </>
  );
};
