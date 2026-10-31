package store.apple.api.controller;

import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.apple.api.dto.ProductDTO;
import store.apple.api.dto.ProductDetailDTO;
import store.apple.api.service.ProductService;

import java.util.List;

/****
 *  ProductController ¿Qué es y qué necesita?
 *  Es un Controlador; necesita:
 *  1. Inicializar el productService
 *  2. en su constructor, el productService
 *  3. GetMapping(/search) que llame al searchProducts del service y devolver su response ResponseEntity.ok(response)
 *
 * **/
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchProducts(@RequestParam String query) {
        String response = productService.searchProducts(query);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/category")
    public ResponseEntity<String> searchCategory(@RequestParam String query) {
        String response = productService.searchCategory(query);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/category/products")
    public ResponseEntity<List<ProductDTO>> searchProductsByCategory(@RequestParam String query, @RequestParam String categoryId) {
        return ResponseEntity.ok(productService.searchProductsByCategory(query, categoryId)
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

}

