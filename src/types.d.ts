declare module "products/App" {
  import type React from "react";
  const App: React.ComponentType;
  export default App;
}

declare module "categories/App" {
  import type React from "react";
  const App: React.ComponentType;
  export default App;
}

declare module "productPage/App" {
  import type React from "react";
  export interface ProductPageProps {
    id?: number;
    onBack?: () => void;
  }
  const App: React.ComponentType<ProductPageProps>;
  export default App;
}
