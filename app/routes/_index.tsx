import type { MetaFunction } from "@remix-run/node";
import { Provider } from "react-redux";
import { useStore } from "~/store/useStore";
import Main from "../components/main";

export const meta: MetaFunction = () => {
  return [
    { title: "Fractal" },
    { name: "description", content: "Shards you have." },
  ];
};

export default function Index() {
  const store = useStore();
  return (<Provider store={store}>
    <Main />
  </Provider>
  );
}
