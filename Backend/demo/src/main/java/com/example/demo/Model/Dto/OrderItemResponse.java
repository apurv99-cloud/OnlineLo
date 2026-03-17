package com.example.demo.Model.Dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        String productName,
        int quantity,
        BigDecimal subTotal) {

}
