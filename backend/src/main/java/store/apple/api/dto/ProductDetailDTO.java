package store.apple.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductDetailDTO(
        String id,
        String nombre,
        List<String> imagenes,
        String descripcion,
        List<Spec> specs,
        BigDecimal precio,
        BigDecimal precioOriginal,
        String enlaceCompra,
        String categoria
) {
    public record Spec(String label, String valor) {}
}