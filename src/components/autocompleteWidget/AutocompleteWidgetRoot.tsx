import { WidgetConfigProvider } from "../../context/WidgetConfigProvider";
import { useWidgetConfig } from "../../context/WidgetConfigContext";
import AutocompleteWidget from "./AutocompleteWidget";

interface Props {
  clientId: string;
}

const WidgetLoader = () => {
  const config = useWidgetConfig();

  return <AutocompleteWidget config={config} />;
};

const AutocompleteWidgetRoot = ({ clientId }: Props) => {
  return (
    <WidgetConfigProvider clientId={clientId}>
      <WidgetLoader />
    </WidgetConfigProvider>
  );
};

export default AutocompleteWidgetRoot;
