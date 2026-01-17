package com.acme.cars.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carro")
@Data@AllArgsConstructor@NoArgsConstructor@Builder
public class Carro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Modelo é obrigatório")
    @Size(min = 2, max = 100, message = "Modelo deve ter entre 2 e 100 caracteres")
    private String modelo;
    
    @Min(value = 1886, message = "Ano deve ser maior ou igual a 1886")
    @Max(value = 2030, message = "Ano não pode ser maior que 2030")
    private int ano;
    
    @NotBlank(message = "Cor é obrigatória")
    private String cor;
    
    @Min(value = 1, message = "Cavalos de potência deve ser maior que 0")
    @Max(value = 2000, message = "Cavalos de potência não pode ser maior que 2000")
    private int cavalosDePotencia;
    
    @NotBlank(message = "Fabricante é obrigatório")
    private String fabricante;
    
    @NotBlank(message = "País é obrigatório")
    private String pais;

}
