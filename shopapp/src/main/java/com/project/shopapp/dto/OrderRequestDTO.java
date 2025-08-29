package com.project.shopapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderRequestDTO {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("address")
    private String address;
}
