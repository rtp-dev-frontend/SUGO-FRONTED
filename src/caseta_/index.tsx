import { Container, Header } from "../shared/components";
import { TabView, TabPanel } from "primereact/tabview";
import { FormularioCaseta } from "./components/FormularioCaseta";

export const Caseta_ = () => {
  return (
    <>
      <Container>
        <Header />
        <TabView>
          <TabPanel header="PV">
            <FormularioCaseta />
          </TabPanel>
        </TabView>
      </Container>
    </>
  );
};
