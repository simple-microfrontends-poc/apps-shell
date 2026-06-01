type Page = "products" | "categories" | "product";
type RemoteModuleProps = {
    page: Page;
    sku?: string;
    onBack?: () => void;
};
declare function RemoteModule({ page, sku, onBack }: RemoteModuleProps): import("react/jsx-runtime").JSX.Element;
export default RemoteModule;
//# sourceMappingURL=RemoteModule.d.ts.map