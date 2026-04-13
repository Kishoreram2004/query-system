import { auth } from "./firebase/config";

function App() {
  console.log("Firebase Connected:", auth);

  return <h1>Firebase Setup Done 🔥</h1>;
}

export default App;