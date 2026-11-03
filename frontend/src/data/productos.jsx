const [searchParams] = useSearchParams();

const cat = searchParams.get("cat");
const busqueda = searchParams.get("busqueda");

const {
    products,
    loading,
    error
} = useProductos(cat, busqueda);