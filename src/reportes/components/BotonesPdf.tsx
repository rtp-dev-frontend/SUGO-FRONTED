import { Button } from "primereact/button";

export const BotonesPdf = ({ text }: { text: string }) => {
  return (
    <>
      <div className="flex align-content-center justify-content-center gap-3 mt-4">
        <div>
          <Button severity="danger" label={text} icon="pi pi-file-pdf" />
        </div>
      </div>
    </>
  );
};
