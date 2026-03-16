package com.example.demo.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Model.Product;
import com.example.demo.Repository.ProductRepo;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public List<Product> getAllProducts() {
        return productRepo.findAll();

    }

    public Product getProductById(int id) {
        return productRepo.findById(id).get();

    }

    public Product addOrUpdateProduct(Product product, MultipartFile imageFile) throws IOException {
        // throw new UnsupportedOperationException("Not supported yet.");
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());

        return productRepo.save(product);
    }

    public void deleteProduct(int id) {
        productRepo.deleteById(id);

    }

    public List<Product> searchProducts(String keyword) {
      return productRepo.searchProducts(keyword);
    }

    // public Product updateProduct(Product product, MultipartFile imageFile) throws
    // IOException {
    // // TODO Auto-generated method stub
    // product.setImageName(imageFile.getOriginalFilename());
    // product.setImageType(imageFile.getContentType());
    // product.setImageData(imageFile.getBytes());

    // return productRepo.save(product);
    // }

}
