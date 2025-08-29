package com.project.shopapp.dto;

import lombok.Data;

@Data
public class PlaceOrderRequestDTO {
    private Long userId;
    private String address;
}
